"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TaskDialog from "@/components/TaskDialog";
import { routeById } from "@/config/route";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";

const DashboardShellContext = createContext(null);

export function useDashboardShell() {
  const context = useContext(DashboardShellContext);
  if (!context) throw new Error("useDashboardShell must be used within DashboardShell.");
  return context;
}

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { tasks, storageError: taskStorageError, createTask, updateTask } = useTasks();
  const { storageError: projectStorageError } = useProjects();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const storageErrors = [taskStorageError, projectStorageError].filter(Boolean);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const navigate = useCallback((section, options = {}) => {
    const route = routeById[section];
    if (!route) return;
    if (section === "projects" && !options.preserveProject) setSelectedProject(null);
    router.push(route.href);
  }, [router]);

  const openTaskDialog = useCallback((details = {}) => {
    setDialog({
      task: details.task || null,
      status: details.status || "todo",
      project: details.project || selectedProject || undefined,
    });
  }, [selectedProject]);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const saveTask = (values) => {
    if (dialog.task) {
      updateTask(dialog.task.id, values);
      notify("Changes saved");
    } else {
      createTask(values);
      notify("Task created");
    }
    setDialog(null);
  };

  const contextValue = useMemo(() => ({
    search,
    setSearch,
    selectedProject,
    setSelectedProject,
    openTaskDialog,
    navigate,
    notify,
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
