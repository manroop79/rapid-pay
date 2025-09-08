"use client";

import { NavItems } from "./NavItems";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-72 border-r border-zinc-800 relative rounded-xl overflow-hidden">
      <div className="absolute top-0 right-0 h-full w-[1px] overflow-hidden">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent animate-light-flow" />
      </div>
      <div className="p-6">
        <NavItems />
      </div>
    </aside>
  );
}