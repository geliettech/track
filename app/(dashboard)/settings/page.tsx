"use client";

import { useState } from "react";
import {
  FiCheck,
  FiDatabase,
  FiMoon,
  FiRefreshCw,
  FiSettings,
  FiSun,
  FiUser,
  FiTrash2,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SettingsPage() {
  const { theme, setLight, setDark } = useTheme();
  const { notify } = useDashboardShell();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleResetData = () => {
    try {
      localStorage.removeItem("tasks");
      localStorage.removeItem("projects");
      localStorage.removeItem("activity");
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
          Manage your personal profile, appearance themes, and workspace storage.
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
                Workspace Owner
              </span>
            </div>
            <p className="text-xs text-muted">jordan.davis@track.app</p>
            <p className="text-[11px] text-faint">Role: Lead Product Architect</p>
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
                Restore the default sample tasks and projects in your browser.
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
          description="This will clear your customized tasks, projects, and activity feed in this browser, and restore the initial sample dataset."
          confirmLabel="Reset Everything"
          onCancel={() => setConfirmResetOpen(false)}
          onConfirm={handleResetData}
        />
      )}
    </div>
  );
}
