import { NextResponse } from "next/server";
import { p2pTransfer } from "@/app/lib/actions/p2ptransfer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
try {
const { name, amount } = await req.json();
const result = await p2pTransfer(name, Number(amount));

if (result.ok) {
return NextResponse.json({ message: result.message }, { status: 200 });
}
return NextResponse.json({ message: result.message }, { status: result.status || 400 });
} catch {
return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
}
}