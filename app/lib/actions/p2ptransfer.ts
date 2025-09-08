"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type P2PResult =
| { ok: true; message: string }
| { ok: false; status: number; message: string };

export async function p2pTransfer(toName: string, rawAmount: number): Promise<P2PResult> {
const session = await getServerSession(authOptions);

// Make sure your NextAuth session includes user.id
// (see note at the bottom for session callback snippet)
const fromId = Number(session?.user?.id);
if (!fromId) return { ok: false, status: 401, message: "Not authenticated" };

const name = (toName ?? "").trim();
const amount = Number(rawAmount);

if (!name || !Number.isFinite(amount) || amount <= 0) {
return { ok: false, status: 400, message: "Recipient name and a positive amount are required" };
}

// Find recipient by exact name (case-insensitive). Fail if ambiguous.
const matches = await prisma.user.findMany({
where: { name: { equals: name, mode: "insensitive" } },
select: { id: true, name: true },
take: 2,
});
if (matches.length === 0) return { ok: false, status: 404, message: `No user found with name "${name}"` };
if (matches.length > 1) return { ok: false, status: 409, message: `Multiple users named "${name}". Use a unique handle.` };

const toId = Number(matches[0].id);
if (toId === fromId) return { ok: false, status: 400, message: "You can’t transfer to yourself" };

try {
const result = await prisma.$transaction(async (tx) => {
// Ensure both balance rows exist
await tx.balance.upsert({
where: { userId: fromId },
update: {},
create: { userId: fromId, amount: 0, locked: 0 },
});
await tx.balance.upsert({
where: { userId: toId },
update: {},
create: { userId: toId, amount: 0, locked: 0 },
});

// Row-level lock to avoid races (Postgres)
await tx.$queryRaw`SELECT 1 FROM "Balance" WHERE "userId" = ${fromId} FOR UPDATE`;
await tx.$queryRaw`SELECT 1 FROM "Balance" WHERE "userId" = ${toId} FOR UPDATE`;

const fromBal = await tx.balance.findUnique({ where: { userId: fromId }, select: { amount: true } });
if (!fromBal) throw new Error("Sender balance not found");
if (fromBal.amount < amount) {
return { ok: false as const, status: 422, message: "Insufficient balance" };
}

// Move money
await tx.balance.update({
where: { userId: fromId },
data: { amount: { decrement: amount } },
});
await tx.balance.update({
where: { userId: toId },
data: { amount: { increment: amount } },
});

// Record transfer
await tx.p2PTransfer.create({
data: { fromUserId: fromId, toUserId: toId, amount, timestamp: new Date() },
});

return { ok: true as const, message: `Sent ₹${amount.toLocaleString("en-IN")} to ${matches[0].name}` };
}, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

return result;
} catch (e) {
console.error("p2pTransfer error:", e);
// Prisma throws on conflicts—surface a friendly message
return { ok: false, status: 500, message: "Server error while transferring" };
}
}