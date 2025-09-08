import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
"inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 disabled:pointer-events-none disabled:opacity-50",
{
variants: {
variant: {
default: "bg-emerald-500 text-black hover:bg-emerald-400 shadow-md",
brand:
"bg-gradient-to-br from-emerald-500 to-teal-400 text-black hover:from-emerald-400 hover:to-teal-300",
soft:
"bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/15",
outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-200",
ghost: "hover:bg-zinc-800 text-zinc-200",
link: "text-emerald-300 underline-offset-4 hover:underline",
},
size: {
default: "h-10 px-4 py-2",
sm: "h-9 px-3",
lg: "h-12 px-6 text-base",
icon: "h-10 w-10",
},
glow: {
true:
"shadow-[0_0_0_1px_rgba(52,211,153,.25),0_0_24px_rgba(52,211,153,.15)]",
},
},
defaultVariants: { variant: "default", size: "default" },
}
)

export interface ButtonProps
extends React.ButtonHTMLAttributes<HTMLButtonElement>,
VariantProps<typeof buttonVariants> {
asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
({ className, variant, size, glow, asChild = false, ...props }, ref) => {
const Comp = asChild ? Slot : "button"
return (
<Comp
className={cn(buttonVariants({ variant, size, glow }), className)}
ref={ref}
{...props}
/>
)
}
)
Button.displayName = "Button"

export { Button, buttonVariants }