"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
<SheetPrimitive.Overlay
ref={ref}
className={cn(
"fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
className
)}
{...props}
/>
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: "top" | "bottom" | "left" | "right" }
>(({ side = "right", className, children, ...props }, ref) => (
<SheetPortal>
<SheetOverlay />
<SheetPrimitive.Content
ref={ref}
// Important: remove the need for a description when you don't provide one
aria-describedby={undefined}
className={cn(
"fixed z-[101] gap-4 bg-zinc-900 text-zinc-100 shadow-lg border border-zinc-800",
"data-[state=open]:animate-in data-[state=closed]:animate-out",
side === "right" && "inset-y-0 right-0 w-80 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
side === "left" && "inset-y-0 left-0 w-80 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
side === "top" && "inset-x-0 top-0 h-1/3 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
side === "bottom" && "inset-x-0 bottom-0 h-1/3 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
className
)}
{...props}
>
{children}
</SheetPrimitive.Content>
</SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("px-4 py-3 border-b border-zinc-800", className)} {...props} />
)
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
<div className={cn("px-4 py-3 border-t border-zinc-800", className)} {...props} />
)

const SheetTitle = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
<SheetPrimitive.Title ref={ref} className={cn("text-sm font-medium", className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
React.ElementRef<typeof SheetPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
<SheetPrimitive.Description ref={ref} className={cn("text-xs text-zinc-400", className)} {...props} />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
Sheet,
SheetTrigger,
SheetClose,
SheetContent,
SheetHeader,
SheetFooter,
SheetTitle,
SheetDescription,
}