import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProjectProvider } from "@/context/ProjectContext";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import UpgradeModal from "@/components/billing/UpgradeModal";

export const metadata: Metadata = {
  title: "Track — Your work, in focus",
  description: "A thoughtful workspace for planning, tracking, and finishing your tasks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-page text-ink font-sans antialiased">
        <ThemeProvider>
          <WorkspaceProvider>
            <ProjectProvider>
              <TaskProvider>
                {children}
                <UpgradeModal />
              </TaskProvider>
            </ProjectProvider>
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
