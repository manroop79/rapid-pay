import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma";

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return {
            message: "User not logged in",
        };
    }

    const token = Math.random().toString(); // Generate a random token
    const userId = session.user.id;

    try {
        const numericAmount = Math.trunc(Number(amount));
        if (!Number.isInteger(numericAmount) || numericAmount <= 0 || !provider?.trim()) {
            return {
                message: "Error creating on ramp transaction",
            };
        }
        await prisma.onRampTransaction.create({
            data: {
                userId: Number(userId),
                amount: numericAmount,
                status: "Processing",
                startTime: new Date(),
                provider: provider.trim(),
                token,
            },
        });

        return {
            message: "On ramp transaction added",
        };
    } catch (error) {
        console.error(error);

        return {
            message: "Error creating on ramp transaction",
        };
    }
}