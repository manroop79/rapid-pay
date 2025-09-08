"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BankPicker, { Bank } from "./BankSelector";

interface AddMoneyCardProps {
  onMoneyAdded: (amount: number) => void;
  onTransactionAdded: () => void;
}

const BANKS: Bank[] = [
{ name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
{ name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" },
];

export default function AddMoneyCard({ onMoneyAdded, onTransactionAdded }: AddMoneyCardProps) {
const [amount, setAmount] = useState("");
const [bank, setBank] = useState<string>("");
const [isPending, startTransition] = useTransition();
const { toast } = useToast();

const handleTransfer = (e: React.FormEvent) => {
e.preventDefault();

const value = parseFloat(amount);
if (isNaN(value) || value <= 0) {
return toast({ description: "Enter a valid amount.", variant: "destructive" });
}
if (!bank) {
return toast({ description: "Please select a bank.", variant: "destructive" });
}

startTransition(async () => {
try {
const res = await fetch("/api/user/add-money", {
method: "POST",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify({ amount: value }),
});
const data = await res.json();

if (!res.ok) {
toast({
title: "Failed",
description: data.message ?? "Could not add money.",
variant: "destructive",
});
return;
}

onMoneyAdded(value);
setAmount("");

const log = await fetch("/api/user/create-transactions", {
method: "POST",
headers: { "Content-Type": "application/json" },
credentials: "include",
body: JSON.stringify({ amount: value, provider: bank }),
});

if (log.ok) {
onTransactionAdded();
toast({ title: "Success", description: "Money added and transaction recorded." });
const redirect = BANKS.find((b) => b.name === bank)?.redirectUrl ?? "/";
setTimeout(() => (window.location.href = redirect), 900);
} else {
toast({ description: "Added balance, but failed to record transaction.", variant: "destructive" });
}
} catch {
toast({ description: "Network error. Please try again.", variant: "destructive" });
}
});
};

return (
<Card className="glass border-zinc-800">
<CardHeader>
<CardTitle className="text-emerald-300">Add Money</CardTitle>
</CardHeader>
<CardContent>
<form onSubmit={handleTransfer} className="space-y-4">
<div>
<label htmlFor="amount" className="text-sm text-zinc-300">Amount</label>
<Input
id="amount"
type="number"
inputMode="numeric"
value={amount}
onChange={(e) => setAmount(e.target.value)}
placeholder="₹ e.g. 5000"
className="mt-1"
required
/>
</div>

<div>
<label className="text-sm text-zinc-300">Select Bank</label>
<BankPicker
banks={BANKS}
value={bank}
onChange={setBank}
className="mt-1"
placeholder="Choose a bank"
/>
</div>

<Button type="submit" className="w-full hover:bg-emerald-800" disabled={isPending} variant="brand" glow>
{isPending ? "Processing..." : "Add Money"}
</Button>

</form>
</CardContent>
</Card>
);
}