"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Home, Send, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavItems({ className }: { className?: string }) {
const pathname = usePathname();
const items = [
{ href: "/home", label: "Home", icon: Home },
{ href: "/balance", label: "Balance", icon: Wallet },
{ href: "/p2ptransfers", label: "P2P Transfers", icon: Send },
{ href: "/transactions", label: "Transactions", icon: ReceiptText },
];

return (
<nav className={cn("space-y-1", className)}>
{items.map(({ href, label, icon: Icon }) => {
const active = pathname === href;
return (
<Link
key={href}
href={href}
className={cn(
"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
active
? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
: "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
)}
>
<Icon className="h-5 w-5" />
<span>{label}</span>
</Link>
);
})}
</nav>
);
}