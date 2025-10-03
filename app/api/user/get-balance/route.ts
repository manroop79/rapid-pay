import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const balance = await prisma.balance.findUnique({ where: { userId: user.id } });
    if (!balance) {
        return NextResponse.json({ message: "Balance not found" }, { status: 404 });
    }

    return NextResponse.json({
        unlockedBalance: balance.amount,
        lockedBalance: balance.locked,
    });
}