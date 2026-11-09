"use client";

import { useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiFolder,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import type { TaskAction } from "@/context/types";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function formatExactDate(dateString: string): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function ActivityPage() {
  const { activity } = useTasks();
  const [filterAction, setFilterAction] = useState<TaskAction | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivity = useMemo(() => {
    return activity.filter((item) => {
      if (filterAction !== "all" && item.action !== filterAction) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (item.title || "").toLowerCase().includes(q);
        const matchProj = (item.project || "").toLowerCase().includes(q);
        if (!matchTitle && !matchProj) return false;
      }
      return true;
    });
  }, [activity, filterAction, searchQuery]);

  const totalActions = activity.length;
  const completedCount = activity.filter((a) => a.action === "completed").length;
  const createdCount = activity.filter((a) => a.action === "created").length;

  const getActionBadge = (action: TaskAction) => {
    switch (action) {
      case "completed":
        return {
          bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
          label: "Completed",
          icon: FiCheckCircle,
        };
      case "created":
        return {
          bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
          label: "Created",
          icon: FiPlus,
        };
      case "deleted":
        return {
          bg: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
          label: "Deleted",
          icon: FiAlertCircle,
        };
      case "reopened":
        return {
          bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
          label: "Reopened",
          icon: FiRefreshCw,
        };
      case "moved":
      case "updated":
      default:
        return {
          bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
          label: "Updated",
          icon: FiClock,
        };
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
            <FiActivity size={18} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Workspace Activity
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted">
          A continuous audit log of task creations, status updates, and milestones.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <p className="text-xs font-medium text-muted">Total Activity Logged</p>
          <p className="font-display text-2xl font-bold text-ink mt-0.5">{totalActions}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <p className="text-xs font-medium text-muted">Tasks Completed</p>
          <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {completedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <p className="text-xs font-medium text-muted">Tasks Created</p>
          <p className="font-display text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {createdCount}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <FiFilter size={13} className="text-faint" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value as TaskAction | "all")}
              className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink focus:border-accent focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Events</option>
              <option value="created">Created</option>
              <option value="completed">Completed</option>
              <option value="moved">Moved</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>

        <div className="relative flex-1 max-w-xs">
          <FiSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity..."
            className="h-8 w-full rounded-xl border border-line bg-surface-muted py-1 pl-8 pr-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:bg-surface focus:outline-hidden"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
        {filteredActivity.length > 0 ? (
          <div className="space-y-4 divide-y divide-line/60">
            {filteredActivity.map((event) => {
              const badge = getActionBadge(event.action);
              const Icon = badge.icon;

              return (
                <div
                  key={event.id}
                  className="pt-4 first:pt-0 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-xl ${badge.bg}`}
                    >
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted">
                        <span className="capitalize font-medium">{event.action}</span>
                        {event.project && (
                          <span className="flex items-center gap-1">
                            · <FiFolder size={11} className="text-faint" /> {event.project}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-medium text-ink">
                      {formatRelativeTime(event.createdAt)}
                    </p>
                    <p className="text-[10px] text-faint">
                      {formatExactDate(event.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FiActivity size={24} className="mx-auto text-faint mb-2" />
            <p className="text-xs font-medium text-muted">No activity events match your criteria.</p>
            <p className="text-[11px] text-faint mt-1">Changes made to tasks will be tracked here in real time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
