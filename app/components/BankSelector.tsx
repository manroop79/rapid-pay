"use client";

import * as React from "react";
import { Landmark, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
Command,
CommandEmpty,
CommandGroup,
CommandItem,
CommandList,
} from "@/components/ui/command";

export type Bank = {
name: string;
redirectUrl: string;
code?: string;
};

type BankPickerProps = {
banks: Bank[];
value?: string; // bank name
onChange: (bankName: string) => void;
className?: string;
placeholder?: string;
label?: string;
};

export default function BankPicker({
banks,
value,
onChange,
className,
placeholder = "Choose a bank",
label = "Select bank",
}: BankPickerProps) {
const [open, setOpen] = React.useState(false);
const selected = banks.find((b) => b.name === value);

return (
<Popover open={open} onOpenChange={setOpen}>
<PopoverTrigger asChild>
<Button
type="button"
role="combobox"
aria-expanded={open}
className={cn(
"w-full justify-between border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900 cursor-pointer",
"text-left",
className
)}
variant="outline"
>
<span className="flex items-center gap-2 truncate">
<BankIcon />
<span className={cn("truncate", selected ? "text-white" : "text-zinc-400")}>
{selected?.name ?? placeholder}
</span>
</span>
<ChevronDown className="h-4 w-4 text-zinc-400" />
</Button>
</PopoverTrigger>

<PopoverContent
align="start"
sideOffset={8}
className="p-0 border-zinc-800 bg-zinc-950"
style={{ width: "var(--radix-popover-trigger-width)" }}
>
<div className="px-4 py-3 border-b border-zinc-800 text-sm text-zinc-300">
{label}
</div>

{/* No search input — just a clean list */}
<Command className="rounded-none border-0">
<CommandList className="max-h-64">
<CommandEmpty className="py-6 text-zinc-400">No bank found.</CommandEmpty>
<CommandGroup>
{banks.map((b) => (
<CommandItem
key={b.name}
value={b.name}
onSelect={() => {
onChange(b.name);
setOpen(false);
}}
className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
>
<span className="flex items-center gap-2">
<BankIcon />
<span>{b.name}</span>
</span>
<Check
className={cn(
"h-4 w-4 text-emerald-400",
value === b.name ? "opacity-100" : "opacity-0"
)}
/>
</CommandItem>
))}
</CommandGroup>
</CommandList>
</Command>
</PopoverContent>
</Popover>
);
}

function BankIcon() {
return (
<span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
<Landmark className="h-3.5 w-3.5" />
</span>
);
}