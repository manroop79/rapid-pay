"use client"
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Poppins } from "next/font/google"
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({ subsets: ["latin"], weight:["300","400","500","600","700"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SessionProvider>
      {/* Allows us to manage user session throughout the application and ensures that session information is accessible in any component. */}
        <html lang="en">
        <body className={poppins.className}>
          {/* <TopBar /> */}
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}