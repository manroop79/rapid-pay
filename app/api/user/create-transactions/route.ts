import { createOnRampTransaction } from '@/app/lib/actions/onramp';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const rawAmount = body?.amount;
    const provider: string | undefined = typeof body?.provider === 'string' ? body.provider.trim() : undefined;

    const numericAmount = Math.trunc(Number(rawAmount));
    const isValidAmount = Number.isInteger(numericAmount) && numericAmount > 0;
    const isValidProvider = Boolean(provider && provider.length > 0);

    if (!isValidAmount || !isValidProvider) {
        return NextResponse.json({ message: 'Amount (positive integer) and provider are required' }, { status: 400 });
    }

    const result = await createOnRampTransaction(numericAmount, provider!);

    if (result.message === "On ramp transaction added") {
        return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json(result, { status: 500 });
}