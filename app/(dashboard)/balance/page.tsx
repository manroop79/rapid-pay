"use client";

import { useEffect, useState } from "react";
import AddMoneyCard from "@/app/components/AddMoneyCard";
import BalanceCard from "@/app/components/BalanceCard";
import OnRampTransactionCard from "@/app/components/OnRampTransactionCard";
import { BalanceSkeleton } from "@/app/components/Loaders";
import { motion } from "framer-motion";
import { OnRampTransaction } from "@prisma/client";


export default function BalancePage() {
const [unlockedBalance, setUnlockedBalance] = useState<number | null>(null);
const [lockedBalance, setLockedBalance] = useState<number | null>(null);
const [transactions, setTransactions] = useState<OnRampTransaction[]>([]);

useEffect(() => {
(async () => {
try {
const res = await fetch("/api/user/get-balance", { credentials: "include" });
const data = await res.json();
if (res.ok) {
setUnlockedBalance(data.unlockedBalance ?? 0);
setLockedBalance(data.lockedBalance ?? 0);
} else console.error(data.message || "Failed to fetch balance");
} catch (e) {
console.error("Error fetching balance", e);
}
})();
}, []);

const fetchTransactions = async () => {
try {
const res = await fetch("/api/user/get-transactions", { credentials: "include" });
const data = await res.json();
if (res.ok) setTransactions(data.transactions ?? []);
else console.error(data.message || "Failed to fetch transactions");
} catch (e) {
console.error("Error fetching transactions", e);
}
};

useEffect(() => { fetchTransactions(); }, []);

const handleMoneyAdded = (amt: number) => setUnlockedBalance(prev => (prev ?? 0) + amt);

return (
<div className="space-y-10">
<section className="text-center space-y-3">
<h1 className="text-4xl md:text-5xl font-light tracking-tight">
Your{" "}
<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
Balance
</span>
</h1>
<p className="text-sm md:text-base text-zinc-400">
Check your account balance, add money, and view recent transactions.
</p>
</section>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
<AddMoneyCard onMoneyAdded={handleMoneyAdded} onTransactionAdded={fetchTransactions} />
</motion.div>

<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
{unlockedBalance === null || lockedBalance === null ? (
<BalanceSkeleton />
) : (
<BalanceCard unlockedBalance={unlockedBalance} lockedBalance={lockedBalance} />
)}
</motion.div>
</div>

<motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
{(() => {
    type TxOut = { amount: string; provider: string; status: string; token: string; startTime: string };
    const txs: TxOut[] = transactions.map((t) => {
        const start = (t as unknown as { startTime: string | Date }).startTime;
        const startIso = typeof start === "string" ? start : start instanceof Date ? start.toISOString() : new Date(Number(start)).toISOString();
        return {
            amount: String(t.amount),
            provider: (t as unknown as { provider: string }).provider,
            status: (t as unknown as { status: string }).status,
            token: (t as unknown as { token: string }).token,
            startTime: startIso,
        };
    });
    return <OnRampTransactionCard transactions={txs} />;
})()}
</motion.section>
</div>
);
}