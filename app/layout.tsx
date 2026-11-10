import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import AppProviders from "@/context/AppProviders";

export const metadata: Metadata = {
  title: "Track - Your work, in focus",
  description:
    "A thoughtful workspace for planning, tracking, and finishing your tasks.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-page text-ink font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}