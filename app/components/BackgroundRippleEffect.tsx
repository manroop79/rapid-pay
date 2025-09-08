"use client";
import React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

interface BackgroundRippleEffectDemoProps {
  children: React.ReactNode
}

export function BackgroundRippleEffectDemo({ children }: BackgroundRippleEffectDemoProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}