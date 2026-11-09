"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TaskDialog from "@/components/TaskDialog";
import { routeById } from "@/config/route";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";
import type { Task, TaskStatus, TaskInput, TaskUpdate } from "@/context/types";
import type { DashboardRouteId } from "@/config/route";
import ConfirmDialog from "@/components/ConfirmDialog";

type TaskDialogDetails = {
  task?: Task;
  status?: TaskStatus;
  project?: string;
};

type DashboardShellContextValue = {
  search: string;
  setSearch: (value: string) => void;
  selectedProject: string | null;
  setSelectedProject: (name: string | null) => void;
  openTaskDialog: (details?: TaskDialogDetails) => void;
  navigate: (section: DashboardRouteId, options?: { preserveProject?: boolean }) => void;
  notify: (message: string) => void;
  requestDeleteTask: (task: Task) => void;
};

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null);

export function useDashboardShell() {
  const context = useContext(DashboardShellContext);
  if (!context) throw new Error("useDashboardShell must be used within DashboardShell.");
  return context;
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { tasks, storageError: taskStorageError, createTask, updateTask, deleteTask } = useTasks();
  const { storageError: projectStorageError } = useProjects();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [dialog, setDialog] = useState<TaskDialogDetails | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const storageErrors = [taskStorageError, projectStorageError].filter(Boolean);

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const navigate = useCallback((section: DashboardRouteId, options: { preserveProject?: boolean } = {}) => {
    const route = routeById[section];
    if (!route) return;
    if (section === "projects" && !options.preserveProject) setSelectedProject(null);
    router.push(route.href);
  }, [router]);

  const openTaskDialog = useCallback((details: TaskDialogDetails = {}) => {
    setDialog({
      task: details.task,
      status: details.status || "todo",
      project: details.project || selectedProject || undefined,
    });
  }, [selectedProject]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const saveTask = (values: TaskInput) => {
    if (dialog?.task) {
      updateTask(dialog.task.id, values);
      notify("Changes saved");
    } else {
      createTask(values);
      notify("Task created");
    }
    setDialog(null);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id);
    notify(`Deleted “${taskToDelete.title}”`);
    setTaskToDelete(null);
  };

  const contextValue = useMemo(() => ({
    search,
    setSearch,
    selectedProject,
    setSelectedProject,
    openTaskDialog,
    navigate,
    notify,
    requestDeleteTask: setTaskToDelete,
  }), [search, selectedProject, openTaskDialog, navigate, notify]);

  return (
    <DashboardShellContext.Provider value={contextValue}>
      <div className={`app-shell min-h-screen bg-[var(--page)]${sidebarCollapsed ? "" : " sidebar-expanded"}`}>
        <Sidebar
          pathname={pathname}
          collapsed={sidebarCollapsed}
          ariaExpanded={!sidebarCollapsed}
          onToggle={() => {
            setSidebarCollapsed((value) => !value);
            if (!sidebarCollapsed && mobileOpen) setMobileOpen(false);
          }}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        {mobileOpen && (
          <button
            type="button"
            className="sidebar-overlay fixed inset-0 z-10 bg-slate-950/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <main className="main-area min-w-0">
          {storageErrors.map((message) => <div className="storage-error" role="alert" key={message}>{message}</div>)}
          <Header
            tasks={tasks}
            onAddTask={() => openTaskDialog()}
            search={search}
            onSearchChange={setSearch}
            onMenuClick={() => {
              setSidebarCollapsed(false);
              setMobileOpen(true);
            }}
            onNavigate={navigate}
          />
          <div className="dashboard-content">{children}</div>
        </main>
      </div>

      {dialog && (
        <TaskDialog
          task={dialog.task}
          initialStatus={dialog.status}
          initialProject={dialog.project}
          onClose={() => setDialog(null)}
          onSave={saveTask}
        />
      )}
      {taskToDelete && (
        <ConfirmDialog
          title={`Delete “${taskToDelete.title}”?`}
          description="This task will be permanently removed from this browser."
          confirmLabel="Delete task"
          onCancel={() => setTaskToDelete(null)}
          onConfirm={confirmDeleteTask}
        />
      )}
      {toast && (
        <div className="toast-region" role="status" aria-live="polite">
          <div className="toast">
            {toast}
            <button type="button" className="toast-close" aria-label="Dismiss notification" onClick={() => setToast("")}>×</button>
          </div>
        </div>
      )}
    </DashboardShellContext.Provider>
  );
}
