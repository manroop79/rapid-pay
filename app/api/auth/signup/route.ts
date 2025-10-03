import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const { email, password, name } =  await req.json();

    if (!email || !password) {
        return new Response(JSON.stringify({ message: "Email and password are required" }), {
            status: 400,
        });
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            Balance: {
                create: {
                    amount: 100,
                }
            }
        },
    });

    return NextResponse.json(user, { status: 200 })
}