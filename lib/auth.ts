import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@gmail.com", required: true },
                password: { label: "Password", type: "password", placeholder: "password", required: true },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    console.error("Missing email or password");
                    throw new Error("Missing email or password");
                }
                console.log("Email: ", credentials.email);
                console.log("Password: ", credentials.password);

                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                });

                if (!existingUser) {
                    console.error("No user found with this email");
                    throw new Error("No user found with this email");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
                if (isPasswordValid) {
                    console.log("Password is valid");
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name || "",
                        email: existingUser.email || "",
                    };
                } else {
                    console.error("Invalid password");
                }

                return null;
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ user, token }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin"
    },
};