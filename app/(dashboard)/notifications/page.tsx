"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFolder,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import { getProjectByName } from "@/context/Projects";

export default function NotificationsPage() {
  const { tasks, updateTaskStatus } = useTasks();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notifications = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "done" && t.date)
      .map((t) => {
        const d = /^\d{4}-\d{2}-\d{2}$/.test(t.date)
          ? new Date(`${t.date}T12:00:00`)
          : new Date(t.date);
        const isOverdue = !Number.isNaN(d.getTime()) && d < today;
        return {
          task: t,
          date: d,
          isOverdue,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tasks]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
            <FiBell size={18} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Notifications & Deadlines
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted">
          All active task reminders, scheduled deadlines, and workspace alerts.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <h2 className="font-display text-sm font-bold text-ink">Active Reminders</h2>
          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
            {notifications.length} pending
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map(({ task, date, isOverdue }) => {
              const project = getProjectByName(task.project);
              const formattedDate = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
              }).format(date);

              return (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-line/70 bg-surface-muted/30 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-xl ${
                        isOverdue
                          ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          : "bg-accent-soft text-accent"
                      }`}
                    >
                      <FiClock size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-ink">{task.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                        <span
                          className={`font-semibold ${
                            isOverdue ? "text-red-600 dark:text-red-400" : "text-muted"
                          }`}
                        >
                          {isOverdue ? "Overdue: " : "Due: "}
                          {formattedDate}
                        </span>
                        <span className="text-muted">·</span>
                        <span className="flex items-center gap-1 text-muted">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {task.project}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      href={`/projects?name=${encodeURIComponent(task.project)}`}
                      className="cursor-pointer inline-flex h-8 items-center gap-1 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-muted hover:text-ink hover:bg-surface-hover transition-colors"
                    >
                      <FiFolder size={12} /> View Project
                    </Link>
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, "done")}
                      className="cursor-pointer inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <FiCheckCircle size={13} /> Complete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <FiCheckCircle size={28} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-semibold text-ink">You are all caught up!</p>
              <p className="text-[11px] text-muted mt-1">
                There are no overdue or pending task reminders at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
