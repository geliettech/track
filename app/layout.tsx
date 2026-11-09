import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProjectProvider } from "@/context/ProjectContext";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Track — Your work, in focus",
  description: "A thoughtful workspace for planning, tracking, and finishing your tasks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-page text-ink font-sans antialiased">
        <ThemeProvider>
          <ProjectProvider>
            <TaskProvider>{children}</TaskProvider>
          </ProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
