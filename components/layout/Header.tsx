"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiActivity,
  FiBell,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSettings,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { getTaskProject } from "@/context/Projects";
import type { Task } from "@/context/types";
import type { DashboardRouteId } from "@/config/route";

function getReminderDate(value?: string): Date | null {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatReminderDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

type HeaderProps = {
  tasks?: Task[];
  onAddTask: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  onNavigate: (section: DashboardRouteId) => void;
};

export default function Header({
  tasks = [],
  onAddTask,
  search,
  onSearchChange,
  onMenuClick,
  onNavigate,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders = tasks
    .filter((task) => task.status !== "done" && task.date)
    .map((task) => ({ task, date: getReminderDate(task.date) }))
    .filter((entry): entry is { task: Task; date: Date } => entry.date !== null)
    .sort((left, right) => left.date.getTime() - right.date.getTime());

  const overdueCount = reminders.filter((r) => r.date < today).length;
  const reminderCount = reminders.length;

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] items-center justify-between border-b border-line bg-surface/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Greeting & Date on Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-ink hover:bg-surface-hover md:hidden transition-colors"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <FiMenu size={18} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-sm sm:text-base font-bold text-ink">
              {greeting}, Jordan
            </h1>
            <span className="hidden sm:inline-block text-xs text-accent">✦</span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted">
            {formattedDate} · <span className="text-ink font-medium">Let&apos;s make today count</span>
          </p>
        </div>
      </div>

      {/* Global Actions on Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <FiSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="h-9 w-full rounded-xl border border-line bg-surface-muted py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-all"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            className="relative grid size-9 place-items-center rounded-xl border border-line bg-surface text-muted hover:bg-surface-hover hover:text-ink transition-colors"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <FiBell size={16} />
            {reminderCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-xs">
                {reminderCount > 9 ? "9+" : reminderCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-line bg-surface p-4 shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <h3 className="font-display text-xs font-bold text-ink">Notifications</h3>
                  <p className="text-[10px] text-muted">
                    {reminderCount ? `${reminderCount} pending task deadline${reminderCount === 1 ? "" : "s"}` : "All tasks are on track"}
                  </p>
                </div>
                {overdueCount > 0 && (
                  <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                    {overdueCount} overdue
                  </span>
                )}
              </div>

              {reminderCount > 0 ? (
                <div className="mt-2.5 max-h-64 overflow-y-auto space-y-1.5 divide-y divide-line/40">
                  {reminders.slice(0, 5).map(({ task, date: d }) => {
                    const isTaskOverdue = d < today;
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);
                          onNavigate("tasks");
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-surface-hover transition-colors flex items-start gap-2.5"
                      >
                        <span
                          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md ${
                            isTaskOverdue
                              ? "bg-red-50 text-red-500 dark:bg-red-950/40"
                              : "bg-accent-soft text-accent"
                          }`}
                        >
                          <FiClock size={12} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-ink">{task.title}</p>
                          <p className="text-[10px] text-muted mt-0.5">
                            <span className={isTaskOverdue ? "text-red-500 font-semibold" : ""}>
                              {isTaskOverdue ? "Overdue: " : "Due: "}
                              {formatReminderDate(d)}
                            </span>{" "}
                            · {getTaskProject(task)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <FiCheckCircle size={24} className="mx-auto text-green-500 mb-2 opacity-80" />
                  <p className="text-xs font-medium text-ink">No pending reminders</p>
                  <p className="text-[11px] text-muted mt-1">You are completely up to date.</p>
                </div>
              )}

              <div className="mt-3 pt-2.5 border-t border-line text-center">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    onNavigate("tasks");
                  }}
                  className="text-[11px] font-semibold text-accent hover:underline"
                >
                  View all in Tasks →
                </button>
              </div>
            </div>
          )}
        </div>

     

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-2 hover:bg-surface-hover transition-colors"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="User menu"
            aria-expanded={profileOpen}
          >
            <span className="grid size-6 place-items-center rounded-full bg-accent text-[11px] font-bold text-white">
              JD
            </span>
            <span className="hidden lg:inline text-xs font-semibold text-ink">Jordan Davis</span>
            <FiChevronDown size={13} className="text-muted" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-line bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-line mb-1">
                <p className="text-xs font-bold text-ink">Jordan Davis</p>
                <p className="text-[10px] text-muted">Workspace Owner</p>
              </div>

              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-muted hover:text-ink hover:bg-surface-hover rounded-lg transition-colors"
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate("settings");
                }}
              >
                <FiSettings size={14} /> Account Settings
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-muted hover:text-ink hover:bg-surface-hover rounded-lg transition-colors"
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate("activity");
                }}
              >
                <FiActivity size={14} /> Workspace Activity
              </button>

              <div className="my-1 border-t border-line" />

              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                onClick={() => {
                  setProfileOpen(false);
                  window.location.href = "/sign-out";
                }}
              >
                <FiLogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
