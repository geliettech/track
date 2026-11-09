"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheckCircle,
  FiMoon,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import Header from "@/components/Header";
import Overview from "@/components/Overview";
import ProjectWorkspace from "@/components/ProjectWorkspace";
import SideBar from "@/components/SideBar";
import TaskDialog from "@/components/TaskDialog";
import WorkspacePages from "@/components/WorkspacePages";
import { useTasks } from "@/context/TaskContext";
import { useProjects } from "@/context/ProjectContext";
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

function SettingsPanel({ onNavigate }) {
  const { theme, setLight, setDark } = useTheme();
  return (
    <section className="settings-page" aria-label="Settings">
      <div className="settings-panel">
        <div className="settings-section-heading">
          <span className="settings-section-icon"><FiUser size={17} /></span>
          <div>
            <p className="eyebrow">Your account</p>
            <h3>Profile settings</h3>
            <p>Your profile is used across Track and your workspace.</p>
          </div>
        </div>
        <div className="settings-profile">
          <span className="avatar" aria-hidden="true">JD</span>
          <span><strong>Jordan Davis</strong><small>Workspace owner</small></span>
        </div>
      </div>

      <div className="settings-panel">
        <div className="settings-section-heading">
          <span className="settings-section-icon"><FiSun size={17} /></span>
          <div>
            <p className="eyebrow">Preferences</p>
            <h3>Appearance</h3>
            <p>Choose the theme that feels right for your workspace.</p>
          </div>
        </div>
        <div className="theme-options" role="group" aria-label="Color theme">
          <button type="button" className={`secondary-button${theme === "light" ? " selected" : ""}`} onClick={setLight}>
            <FiSun size={16} /> Light
          </button>
          <button type="button" className={`secondary-button${theme === "dark" ? " selected" : ""}`} onClick={setDark}>
            <FiMoon size={16} /> Dark
          </button>
        </div>
        <p className="settings-note">Your preferences are saved in this browser.</p>
      </div>

      <button type="button" className="settings-panel settings-workspace-link" onClick={() => onNavigate("workspace")}>
        <span className="settings-section-icon"><FiBriefcase size={17} /></span>
        <span className="settings-workspace-copy">
          <small className="eyebrow">Workspace</small>
          <strong>Manage workspace</strong>
          <span>View workspace details, members, and projects.</span>
        </span>
        <FiArrowUpRight className="settings-workspace-arrow" size={17} />
      </button>
    </section>
  );
}

export default function Dashboard() {
  const { tasks, activity, isLoaded, storageError: taskStorageError, createTask, updateTask } = useTasks();
  const { projects: workspaceProjects, storageError: projectStorageError } = useProjects();
  const storageErrors = [taskStorageError, projectStorageError].filter(Boolean);
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
        {storageErrors.map((message) => <div className="storage-error" role="alert" key={message}>{message}</div>)}
        <Header
          tasks={tasks}
          onAddTask={() => setDialog({ task: null, status: "todo", project: selectedProject || undefined })}
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => {
            setSidebarCollapsed(false);
            setMobileOpen(true);
          }}
          onNavigate={(section) => setActiveSection(section)}
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
            <SettingsPanel onNavigate={setActiveSection} />
          ) : activeSection === "overview" ? (
            <Overview
              tasks={tasks}
              activity={activity}
              projects={workspaceProjects}
              isLoaded={isLoaded}
              search={search}
              onSearchChange={setSearch}
              onEditTask={(task) => setDialog({ task })}
              onUpdateTaskStatus={(id, status) => updateTask(id, { status })}
              onAddTask={() => setDialog({ task: null, status: "todo" })}
              onOpenProjects={(projectName) => {
                setSelectedProject(projectName || null);
                setActiveSection("projects");
              }}
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
              activity={activity}
              onNotify={notify}
              onEditTask={(task) => setDialog({ task })}
              onAddTask={() => setDialog({ task: null, status: "todo" })}
            />
          ) : (
            <SettingsPanel onNavigate={setActiveSection} />
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
