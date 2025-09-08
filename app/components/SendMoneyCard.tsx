"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function SendMoneyCard() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSendMoney = () => {
        const value = parseFloat(amount);
        if (!name || isNaN(value) || value <= 0) {
            toast({ description: "Enter recipient name and a valid amount.", variant: "destructive" });
        return;
    }

    startTransition(async () => {
        try {
            const res = await fetch("/api/p2p/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, amount: value }),
    });

            if (res.ok) {
                setName(""); setAmount("");
                toast({ title: "Transfer successful", description: `Sent ₹${value.toLocaleString("en-IN")} to ${name}.` });
            } else {
                toast({ description: "Transfer failed, please try again.", variant: "destructive" });
            }
        } catch {
            toast({ description: "Network error. Try again.", variant: "destructive" });
        }
    });
    };

return (
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
<Card className="glass border-zinc-800">
<CardHeader>
<CardTitle className="text-emerald-300">Send Money</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div>
<label className="text-sm text-zinc-300">Recipient Name</label>
<Input placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} className="mt-1" />
</div>
<div>
<label className="text-sm text-zinc-300">Amount</label>
<Input type="number" inputMode="numeric" placeholder="₹ e.g. 1500" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1" />
</div>
<Button onClick={handleSendMoney} className="w-full" disabled={isPending}>
{isPending ? "Sending..." : "Send"}
</Button>
</CardContent>
</Card>
</motion.div>
);
}