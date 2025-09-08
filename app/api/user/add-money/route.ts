import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            console.log("Unauthorized access attempt");
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const transferAmount = Math.trunc(Number(body?.amount));
        if (!Number.isInteger(transferAmount) || transferAmount <= 0) {
            return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
        }

        // Get the user based on their email (retrieved from session)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const balance = await prisma.balance.findUnique({ where: { userId: user.id } });
        if (!balance) {
            return NextResponse.json({ message: "Balance record not found" }, { status: 404 });
        }

        // Update the user's balance
        const updatedBalance = await prisma.balance.update({
            where: { id: balance.id },
            data: {
                amount: {
                    increment: transferAmount,
                },
            },
        });

        return NextResponse.json({
            message: "Money added successfully",
            updatedBalance: updatedBalance.amount,
        });
    } catch (error) {
        console.error("Error adding money:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}