"use client";

import { useState } from "react";
import {
  FiCheck,
  FiCreditCard,
  FiDatabase,
  FiMoon,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiSun,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import { useWorkspace } from "@/context/WorkspaceContext";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SettingsPage() {
  const { theme, setLight, setDark } = useTheme();
  const { notify } = useDashboardShell();
  const { activeWorkspace, openUpgradeModal, workspaces, switchWorkspace } = useWorkspace();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleResetData = () => {
    try {
      localStorage.removeItem("tasks");
      localStorage.removeItem("projects");
      localStorage.removeItem("activity");
      localStorage.removeItem("track_workspaces");
      localStorage.removeItem("track_active_workspace");
      notify("Workspace data reset to defaults. Refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      notify("Failed to clear local storage.");
    } finally {
      setConfirmResetOpen(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
            <FiSettings size={18} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Settings & Preferences
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted">
          Manage your personal profile, workspace subscription, appearance, and local storage.
        </p>
      </div>

      {/* Account Profile Card */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-line">
          <span className="grid size-9 place-items-center rounded-xl bg-surface-muted text-ink">
            <FiUser size={18} />
          </span>
          <div>
            <h2 className="font-display text-sm font-bold text-ink">Profile Details</h2>
            <p className="text-xs text-muted">Your active account identity</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-lg font-bold text-white shadow-xs">
            JD
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-ink">Jordan Davis</h3>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                {activeWorkspace.role}
              </span>
            </div>
            <p className="text-xs text-muted">jordan.davis@track.app</p>
            <p className="text-[11px] text-faint">
              Active Workspace: <strong className="text-ink">{activeWorkspace.name}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Workspace Plan & Billing */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent">
              <FiCreditCard size={18} />
            </span>
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Workspace & Billing</h2>
              <p className="text-xs text-muted">Manage your subscription and tier limits</p>
            </div>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
              activeWorkspace.tier === "business"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : activeWorkspace.tier === "pro"
                ? "bg-accent/15 text-accent"
                : "bg-surface-muted text-muted border border-line"
            }`}
          >
            {activeWorkspace.tier} Plan
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-line bg-surface-muted/30">
            <div>
              <h3 className="text-xs font-bold text-ink">
                {activeWorkspace.tier === "free"
                  ? "Free Starter Plan"
                  : activeWorkspace.tier === "pro"
                  ? "Pro Team Plan ($12/user/mo)"
                  : "Business Enterprise Plan ($29/user/mo)"}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {activeWorkspace.tier === "free"
                  ? "Task management is free forever. Upgrade for team chat, collaboration, and business capabilities."
                  : "All team collaboration, chat, and unlimited project capabilities are unlocked."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openUpgradeModal("Settings billing")}
              className="cursor-pointer inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-bold text-white shadow-xs hover:bg-accent-hover transition-colors shrink-0"
            >
              <FiZap size={14} />
              <span>{activeWorkspace.tier === "free" ? "Upgrade Plan" : "Change Plan"}</span>
            </button>
          </div>

          {/* Quick Workspace Switcher inside Settings */}
          <div>
            <p className="text-xs font-semibold text-ink mb-2">Switch Workspace</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    switchWorkspace(ws.id);
                    notify(`Switched to “${ws.name}”`);
                  }}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                    ws.id === activeWorkspace.id
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-line bg-surface hover:bg-surface-hover"
                  }`}
                >
                  <div className="truncate">
                    <p className="text-xs font-bold text-ink truncate">{ws.name}</p>
                    <p className="text-[10px] text-muted capitalize">{ws.tier} Tier</p>
                  </div>
                  {ws.id === activeWorkspace.id && <FiCheck size={14} className="text-accent shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appearance & Themes */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-line">
          <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <FiSun size={18} />
          </span>
          <div>
            <h2 className="font-display text-sm font-bold text-ink">Appearance & Theme</h2>
            <p className="text-xs text-muted">Choose your preferred visual mode</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Option */}
          <button
            type="button"
            onClick={setLight}
            className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
              theme === "light"
                ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                : "border-line bg-surface hover:bg-surface-hover"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiSun size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-ink">Light Mode</span>
              </div>
              {theme === "light" && <FiCheck size={16} className="text-accent" />}
            </div>
            <p className="text-xs text-muted">
              Clean, bright surfaces designed for well-lit environments.
            </p>
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={setDark}
            className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${
              theme === "dark"
                ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                : "border-line bg-surface hover:bg-surface-hover"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiMoon size={16} className="text-indigo-400" />
                <span className="text-xs font-bold text-ink">Dark Mode</span>
              </div>
              {theme === "dark" && <FiCheck size={16} className="text-accent" />}
            </div>
            <p className="text-xs text-muted">
              High-contrast, low-glare dark surfaces easy on the eyes.
            </p>
          </button>
        </div>
      </section>

      {/* Storage & Data Management */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-5 border-b border-line">
          <span className="grid size-9 place-items-center rounded-xl bg-surface-muted text-ink">
            <FiDatabase size={18} />
          </span>
          <div>
            <h2 className="font-display text-sm font-bold text-ink">Local Storage & Workspace Data</h2>
            <p className="text-xs text-muted">Manage persistent browser state</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-line/70 bg-surface-muted/40">
            <div>
              <p className="text-xs font-bold text-ink">Reset Demo Data</p>
              <p className="text-xs text-muted">
                Restore the default sample tasks, projects, and workspaces in this browser.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
            >
              <FiRefreshCw size={13} /> Reset Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      {confirmResetOpen && (
        <ConfirmDialog
          title="Reset workspace to default data?"
          description="This will clear your customized tasks, projects, workspaces, and activity feed in this browser, and restore the initial sample dataset."
          confirmLabel="Reset Everything"
          onCancel={() => setConfirmResetOpen(false)}
          onConfirm={handleResetData}
        />
      )}
    </div>
  );
}
