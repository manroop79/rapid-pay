import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const transactions = await prisma.onRampTransaction.findMany({
            where: {
                user: {
                    email: session.user.email,
                },
            },
            orderBy: {
                startTime: 'desc',
            },
            take: 5, // Get the 5 most recent transactions
        });

        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}