"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiMoon,
  FiSun,
  FiX,
} from "react-icons/fi";
import Header from "@/components/Header";
import Overview from "@/components/Overview";
import ProjectWorkspace from "@/components/ProjectWorkspace";
import SideBar from "@/components/SideBar";
import TaskDialog from "@/components/TaskDialog";
import WorkspacePages from "@/components/WorkspacePages";
import { useTasks } from "@/context/TaskContext";
import { useTheme } from "@/context/ThemeContext";

const sectionTitles = {
  overview: "Overview",
  projects: "Projects",
  messages: "Messages",
  users: "Users",
  activity: "Activity",
  calendar: "Calendar",
  notifications: "Notifications",
  workspace: "Workspace",
  settings: "Settings",
};

function SettingsPanel() {
  const { theme, setLight, setDark } = useTheme();
  return (
    <section className="settings-panel">
      <div>
        <p className="eyebrow">Preferences</p>
        <h3>Make Track yours</h3>
        <p>Choose the appearance that feels right for your workspace.</p>
      </div>
      <div className="theme-options" role="group" aria-label="Color theme">
        <button type="button" className={`secondary-button${theme === "light" ? " selected" : ""}`} onClick={setLight}>
          <FiSun size={16} /> Light
        </button>
        <button type="button" className={`secondary-button${theme === "dark" ? " selected" : ""}`} onClick={setDark}>
          <FiMoon size={16} /> Dark
        </button>
      </div>
      <p className="settings-note">Your tasks and preferences are saved in this browser.</p>
    </section>
  );
}

export default function Dashboard() {
  const { tasks, createTask, updateTask } = useTasks();
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

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

  return (
    <div className={`app-shell${sidebarCollapsed ? "" : " sidebar-expanded"}`}>
      <SideBar
        activeSection={activeSection}
        onNavigate={(section) => {
          setActiveSection(section);
          if (section === "projects") setSelectedProject(null);
        }}
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
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="main-area">
        <Header
          onAddTask={() => setDialog({ task: null, status: "todo", project: selectedProject || undefined })}
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => {
            setSidebarCollapsed(false);
            setMobileOpen(true);
          }}
        />

        <div className="dashboard-content">
          {!["projects", "messages", "users", "activity", "calendar", "notifications", "workspace"].includes(activeSection) && <div className="page-heading">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h2>{sectionTitles[activeSection]}</h2>
              <p>A clear view of what you&apos;re working on and what&apos;s next.</p>
            </div>
          </div>}

          {activeSection === "settings" ? (
            <SettingsPanel />
          ) : activeSection === "overview" ? (
            <Overview
              tasks={tasks}
              search={search}
              onSearchChange={setSearch}
              onEditTask={(task) => setDialog({ task })}
            />
          ) : activeSection === "projects" ? (
            <ProjectWorkspace
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              search={search}
              onSearchChange={setSearch}
              onAddTask={(details) => setDialog({ task: null, ...details })}
              onEditTask={(task) => setDialog({ task })}
              onNotify={notify}
            />
          ) : activeSection === "messages" ||
            activeSection === "users" ||
            activeSection === "activity" ||
            activeSection === "calendar" ||
            activeSection === "notifications" ||
            activeSection === "workspace" ? (
            <WorkspacePages
              section={activeSection}
              tasks={tasks}
              onNotify={notify}
              onEditTask={(task) => setDialog({ task })}
              onAddTask={() => setDialog({ task: null, status: "todo" })}
            />
          ) : (
            <SettingsPanel />
          )}
        </div>
      </main>

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
          <div className="toast"><FiCheckCircle size={16} />{toast}<button type="button" className="toast-close" aria-label="Dismiss notification" onClick={() => setToast("")}><FiX size={14} /></button></div>
        </div>
      )}
    </div>
  );
}
