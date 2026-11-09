"use client";

import WorkspacePages from "@/components/WorkspacePages";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import { useTasks } from "@/context/TaskContext";

export default function WorkspaceRoutePage({ section }) {
  const { tasks, activity } = useTasks();
  const { openTaskDialog, notify } = useDashboardShell();

  return (
    <WorkspacePages
      section={section}
      tasks={tasks}
      activity={activity}
      onNotify={notify}
      onEditTask={(task) => openTaskDialog({ task })}
      onAddTask={() => openTaskDialog()}
    />
  );
}
