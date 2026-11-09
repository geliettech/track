"use client";

import ProjectWorkspace from "@/components/ProjectWorkspace";
import { useDashboardShell } from "@/components/layout/DashboardShell";

export default function ProjectsPage() {
  const {
    selectedProject,
    setSelectedProject,
    search,
    setSearch,
    openTaskDialog,
    notify,
  } = useDashboardShell();

  return (
    <ProjectWorkspace
      selectedProject={selectedProject}
      onSelectProject={setSelectedProject}
      search={search}
      onSearchChange={setSearch}
      onAddTask={openTaskDialog}
      onEditTask={(task) => openTaskDialog({ task })}
      onNotify={notify}
    />
  );
}
