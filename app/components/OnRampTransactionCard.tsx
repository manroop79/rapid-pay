
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
amount: string;
provider: string;
status: string;
token: string;
startTime: string;
}

interface Props {
transactions: Transaction[];
}

export default function OnRampTransactionCard({ transactions }: Props) {
const fmt = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

return (
<Card className="glass border-zinc-800">
<CardHeader>
<CardTitle className="text-emerald-300 text-center">Recent Transactions</CardTitle>
</CardHeader>
<CardContent>
{transactions.length === 0 ? (
<Empty />
) : (
<ScrollArea className="h-[360px]">
<ul className="space-y-3 pr-2">
{transactions.map((t, i) => (
<li key={i} className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4">
<div className="flex items-start justify-between gap-4">
<div>
<div className="text-sm text-zinc-400">Amount</div>
<div className="text-lg font-semibold text-emerald-300">₹ {Number(t.amount).toLocaleString("en-IN")}</div>
</div>
<Badge variant="outline" className="border-emerald-500/40 text-emerald-300">
{t.provider}
</Badge>
</div>
<div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
<span><strong>Token:</strong> {mask(t.token)}</span>
<span className="mx-1">•</span>
<span><strong>Date:</strong> {fmt(t.startTime)}</span>
<span className="mx-1">•</span>
<span>
<strong>Status:</strong>{" "}
<Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{t.status ?? "success"}</Badge>
</span>
</div>
</li>
))}
</ul>
</ScrollArea>
)}
</CardContent>
</Card>
);
}

function mask(s: string) {
if (!s) return "—";
return s.length <= 8 ? s : `${s.slice(0, 4)}…${s.slice(-4)}`;
}

function Empty() {
return (
<div className="grid place-items-center h-40 text-zinc-400">
No recent transactions
</div>
);
}