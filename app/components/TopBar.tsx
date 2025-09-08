"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Menu, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; // Ensure SheetTitle is imported
import { NavItems } from "./NavItems";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { data: session, status } = useSession();

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-zinc-800 glass")}>
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu + brand */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              {/* Add SheetTitle for accessibility */}
              <SheetTitle>Menu</SheetTitle>
              <div className="p-4 border-b border-zinc-800">
                <Brand />
              </div>
              <NavItems className="p-4" />
            </SheetContent>
          </Sheet>
          <Brand className="hidden md:flex" />
        </div>

        {/* Right side: full name + auth button */}
        <div className="flex items-center gap-3 mr-2">
          {status === "authenticated" ? (
            <>
              <span className="text-sm md:text-base text-zinc-300">
                Hi, <span className="font-semibold text-white">{session?.user?.name}</span>
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="ghost"
                size="sm"
                className="flex items-center px-4 py-2 gap-2 text-emerald-300 hover:bg-emerald-500/10 transition-all duration-150"
              >
                <LogOut className="h-4 w-4" />
                <span className="whitespace-nowrap">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => signIn()}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function Brand({ className }: { className?: string }) {
  return (
    <Link href="/home" className={cn("flex items-center gap-2 group", className)}>
      <span className="text-xl font-extrabold tracking-tight ml-4 text-emerald-300">
        Rapid Pay
      </span>
    </Link>
  );
}