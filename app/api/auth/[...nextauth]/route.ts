import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const handler = NextAuth(authOptions);

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);

export const runtime = "nodejs";

// async function signUpUser(req: Request) {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//         return new Response(JSON.stringify({ message: "Email and password are required" }), {
//             status: 400,
//             headers: {
//                 "Content-Type" : 'application/json'
//             },
//         });
//     }

//     const existingUser = await prisma.user.findUnique({
//         where: {
//             email
//         },
//     });

//     if (existingUser) {
//         return new Response(JSON.stringify({ message: "User already exists" }), {
//             status: 400,
//             headers: {
//                 "Content-Type" : 'application/json'
//             },
//         });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.user.create({
//         data: {
//             email,
//             password: hashedPassword,
//         },
//     });

//     return new Response(JSON.stringify({ message: "User created successfully", user: newUser }), {
//         status: 200,
//         headers: {
//             "Content-Type" : "application/json"
//         },
//     });
// }

// export async function GET(req: Request) {
//     return handler(req);
// }

// export async function POST(req: Request) {
//     // Check if the request is for sign-up or sign-in
//     const url = new URL(req.url);

//     if (url.pathname === '/api/auth/signup') {
//         return signUpUser(req); // Handle sign up
//     }

//     return handler(req); // Handle sign in via NextAuth
// }