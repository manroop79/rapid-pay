
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
Wallet,
Send,
ReceiptText,
IndianRupee,
ShieldCheck,
LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
const { data: session, status } = useSession();
const first = (session?.user?.name ?? "there").split(" ")[0];

const [unlocked, setUnlocked] = useState<number | null>(null);
const [locked, setLocked] = useState<number | null>(null);
const [txCount, setTxCount] = useState<number>(0);

useEffect(() => {
(async () => {
try {
const b = await fetch("/api/user/get-balance", { credentials: "include" });
const bd = await b.json();
if (b.ok) {
setUnlocked(bd.unlockedBalance ?? 0);
setLocked(bd.lockedBalance ?? 0);
}
} catch {}
try {
const t = await fetch("/api/user/get-transactions", { credentials: "include" });
const td = await t.json();
if (t.ok) setTxCount(Array.isArray(td.transactions) ? td.transactions.length : 0);
} catch {}
})();
}, []);

const currency = (n: number | null) =>
n === null
? "—"
: n.toLocaleString("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 0,
});

return (
<div className="space-y-10">
{/* HERO: black background + simple boxes */}
<section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
<div className="absolute inset-0 bg-boxes opacity-60" />
<div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
<motion.h1
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
className="text-4xl md:text-5xl font-extrabold tracking-tight"
>
Welcome, <span className="text-emerald-400">{first}</span>
</motion.h1>

<motion.p
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.05 }}
className="mt-3 text-zinc-300 md:text-zinc-400 max-w-2xl mx-auto"
>
Manage money with speed, security, and clarity — add funds, send to
friends, and track every rupee.
</motion.p>

<motion.div
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}
className="mt-8 flex flex-wrap items-center justify-center gap-3"
>
{status === "authenticated" ? (
<>
          <Button 
                variant="ghost"
                size="lg"
                className="flex items-center px-4 py-2 gap-2 text-white hover:bg-emerald-500/10 transition-all duration-150"
            >
            <Link href="/balance">
            <div className="flex items-center gap-2">
                <Wallet size={20} />
                Go to Balance
            </div>
            </Link>
          </Button>

          <Button 
                variant="ghost"
                size="lg"
                className="flex items-center px-4 py-2 gap-2 text-white hover:bg-emerald-500/10 transition-all duration-150"
            >
            <Link href="/p2ptransfers">
            <div className="flex items-center gap-2">
                <Send size={20} />
                Send Money
            </div>
            </Link>
          </Button>
</>
) : (
<Button
asChild
variant="brand"
size="lg"
glow
aria-label="Get started"
className="gap-2"
>
<Link href="/auth/signin">
<LogIn className="h-5 w-5" />
Get started
</Link>
</Button>
)}
</motion.div>

{/* Snapshot */}
<div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
<StatTile
icon={<IndianRupee className="h-4 w-4" />}
label="Available"
value={currency(unlocked)}
/>
<StatTile
icon={<Wallet className="h-4 w-4" />}
label="Locked"
value={currency(locked)}
/>
<StatTile
icon={<ReceiptText className="h-4 w-4" />}
label="Transactions"
value={txCount.toString()}
/>
</div>
</div>
</section>

{/* QUICK ACTIONS */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
<QuickAction
icon={<Wallet className="h-5 w-5" />}
title="Add Money"
desc="Top up your wallet in seconds."
href="/balance"
/>
<QuickAction
icon={<Send className="h-5 w-5" />}
title="P2P Transfers"
desc="Instantly send to contacts."
href="/p2ptransfers"
/>
<QuickAction
icon={<ReceiptText className="h-5 w-5" />}
title="Transactions"
desc="Your history, neatly organized."
href="/transactions"
/>
</section>

{/* FEATURES */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
<Feature
title="Instant transfers"
body="Low-latency transfers with clear confirmations."
/>
<Feature
title="Real-time balance"
body="Always see what's available vs. locked."
/>
<Feature
title="Universal search"
body="Find any transaction by amount, token, or provider."
/>
</section>

{/* SECURITY CTA */}
<section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
<div className="flex items-center gap-4">
<div className="rounded-full p-3 border border-emerald-500/30 bg-emerald-500/10">
<ShieldCheck className="h-6 w-6 text-emerald-300" />
</div>
<div>
<h3 className="text-lg font-semibold">Your security matters</h3>
<p className="text-sm text-zinc-400">
Best-practice encryption and privacy-first design.
</p>
</div>
</div>
<Button asChild variant="outline" className="sm:self-end">
<Link href="/transactions">Review activity</Link>
</Button>
</section>
</div>
);
}

/* ---- small components ---- */

function StatTile({
icon,
label,
value,
}: {
icon: React.ReactNode;
label: string;
value: string;
}) {
return (
<div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left">
<div className="flex items-center justify-between">
<span className="text-xs uppercase tracking-wide text-zinc-400">
{label}
</span>
<div className="rounded-md border border-emerald-500/25 bg-emerald-500/10 p-2 text-emerald-300">
{icon}
</div>
</div>
<div className="mt-2 text-xl font-semibold text-emerald-300">
{value}
</div>
</div>
);
}

function QuickAction({
icon,
title,
desc,
href,
className,
}: {
icon: React.ReactNode;
title: string;
desc: string;
href: string;
className?: string;
}) {
return (
<Link href={href} className="group">
<Card
className={cn(
"border border-zinc-800 bg-zinc-900/40 transition hover:border-emerald-500/40 hover:shadow-[0_0_24px_rgba(16,185,129,.10)]",
className
)}
>
<CardContent className="p-5">
<div className="flex items-center justify-between">
<h3 className="text-base font-semibold">{title}</h3>
<div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-300">
{icon}
</div>
</div>
<p className="mt-2 text-sm text-zinc-400">{desc}</p>
</CardContent>
</Card>
</Link>
);
}

function Feature({ title, body }: { title: string; body: string }) {
return (
<Card className="border border-zinc-800 bg-zinc-900/40">
<CardContent className="p-5">
<h4 className="font-semibold">{title}</h4>
<p className="mt-2 text-sm text-zinc-400">{body}</p>
</CardContent>
</Card>
);
}