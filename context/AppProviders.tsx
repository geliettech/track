"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/context/ThemeContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { TaskProvider } from "@/context/TaskContext";

import UpgradeModal from "@/components/billing/UpgradeModal";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
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
  );
}