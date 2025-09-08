"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type P2PTx = {
id: string;
amount: number;
timestamp: string; // ISO
fromUserId: number;
toUserId: number;
fromName?: string;
toName?: string;
};

export default function P2PTransfersList({ transactions }: { transactions: P2PTx[] }) {
const fmt = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const money = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;

return (
<Card className="glass border-zinc-800">
<CardHeader>
<CardTitle className="text-emerald-300">Recent P2P Transfers</CardTitle>
</CardHeader>
<CardContent>
{transactions.length === 0 ? (
<div className="grid place-items-center h-40 text-zinc-400">No recent P2P transfers</div>
) : (
<ScrollArea className="h-[420px]">
<ul className="space-y-3 pr-2">
{transactions.map((t) => {
const directionOut = true; // if API can tell, compute with current user id; else style neutrally
return (
<li key={t.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
{directionOut ? (
<ArrowUpRight className="h-4 w-4 text-emerald-300" />
) : (
<ArrowDownRight className="h-4 w-4 text-emerald-300" />
)}
<div className="font-semibold text-emerald-300">{money(t.amount)}</div>
</div>
<Badge variant="outline" className="border-emerald-500/40 text-emerald-300">
{fmt(t.timestamp)}
</Badge>
</div>
<div className="mt-2 text-sm text-zinc-400">
<span className="mr-2">From:</span>
<span className="text-zinc-200">{t.fromName ?? `User #${t.fromUserId}`}</span>
<span className="mx-2">•</span>
<span className="mr-2">To:</span>
<span className="text-zinc-200">{t.toName ?? `User #${t.toUserId}`}</span>
</div>
</li>
);
})}
</ul>
</ScrollArea>
)}
</CardContent>
</Card>
);
}