"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiActivity,
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiList,
  FiPlus,
  FiTrendingUp,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import { useProjects } from "@/context/ProjectContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import { getProjectByName } from "@/context/Projects";
import type { Task, TaskAction } from "@/context/types";

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDueDate(value?: string): string {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    : "No due date";
}

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

export default function OverviewPage() {
  const { tasks, activity, isLoaded, updateTaskStatus } = useTasks();
  const { projects } = useProjects();
  const { openTaskDialog, setSelectedProject, navigate } = useDashboardShell();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Computed metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "inprogress").length;
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;

  const overdueTasks = tasks.filter((t) => {
    if (t.status === "done" || !t.date) return false;
    const d = parseDate(t.date);
    return d !== null && d < today;
  });

  const highPriorityTasks = tasks.filter(
    (t) => t.status !== "done" && t.priority === "high"
  ).length;

  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Upcoming deadlines (next 5 uncompleted tasks sorted by due date)
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "done" && t.date)
      .map((t) => ({ task: t, parsedDate: parseDate(t.date) }))
      .filter((item): item is { task: Task; parsedDate: Date } => item.parsedDate !== null)
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
      .slice(0, 5);
  }, [tasks]);

  // Project progress summaries
  const projectSummaries = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => (t.project || "") === p.name);
      const pCompleted = pTasks.filter((t) => t.status === "done").length;
      const progress = pTasks.length ? Math.round((pCompleted / pTasks.length) * 100) : 0;
      return {
        project: p,
        total: pTasks.length,
        completed: pCompleted,
        pending: pTasks.length - pCompleted,
        progress,
      };
    });
  }, [projects, tasks]);

  // Weekly Workload Schedule (Monday - Sunday)
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const tasksByWeekday = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    tasks.forEach((t) => {
      const d = parseDate(t.date);
      if (d) {
        const dayIdx = (d.getDay() + 6) % 7; // Convert Sun(0) to index 6, Mon(1) to 0
        counts[dayIdx] += 1;
      }
    });
    return counts;
  }, [tasks]);

  const maxWeekdayCount = Math.max(...tasksByWeekday, 1);

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
      case "moved":
      case "updated":
      default:
        return {
          bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
          label: "Updated",
          icon: FiClock,
        };
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-line bg-gradient-to-r from-accent/10 via-surface to-surface p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent mb-2">
            <span>Workspace Overview</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            Focus on what matters most.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            You have <strong className="text-ink font-semibold">{pendingTasks + inProgressTasks} active tasks</strong>{" "}
            across {projects.length} ongoing projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => openTaskDialog()}
            className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors"
          >
            <FiPlus size={15} /> New Task
          </button>
          <Link
            href="/projects"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
          >
            <FiFolder size={15} /> All Projects
          </Link>
          <Link
            href="/tasks"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
          >
            <FiList size={15} /> Tasks Board
          </Link>
        </div>
      </div>

      {/* 6 Reusable Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Tasks */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Total Tasks</span>
            <span className="grid size-7 place-items-center rounded-lg bg-surface-muted text-ink">
              <FiList size={14} />
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{totalTasks}</p>
          <p className="mt-1 text-[11px] text-muted">Across all projects</p>
        </div>

        {/* To Do */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Pending</span>
            <span className="grid size-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <FiClock size={14} />
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {pendingTasks}
          </p>
          <p className="mt-1 text-[11px] text-muted">Awaiting start</p>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">In Progress</span>
            <span className="grid size-7 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <FiTrendingUp size={14} />
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inProgressTasks}
          </p>
          <p className="mt-1 text-[11px] text-muted">Under active work</p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Completed</span>
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <FiCheckCircle size={14} />
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedTasks}
          </p>
          <p className="mt-1 text-[11px] text-muted">Nicely finished</p>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Overdue</span>
            <span className="grid size-7 place-items-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <FiAlertCircle size={14} />
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-red-600 dark:text-red-400">
            {overdueTasks.length}
          </p>
          <p className="mt-1 text-[11px] text-muted">Needs attention</p>
        </div>

        {/* High Priority */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">High Priority</span>
            <span className="grid size-7 place-items-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <FiClock size={14} />
            </span>
          </div>
          <p className="font-display text-2xl font-bold text-rose-600 dark:text-rose-400">
            {highPriorityTasks}
          </p>
          <p className="mt-1 text-[11px] text-muted">Critical items</p>
        </div>
      </div>

      {/* Middle Section: Task Schedule Chart + Completion Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Task Schedule Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">
                Weekly Task Schedule
              </h2>
              <p className="text-xs text-muted">
                Task distribution across days based on scheduled deadlines
              </p>
            </div>
            <Link
              href="/calendar"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              Full Calendar <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-6 flex items-end justify-between gap-3 h-44 pt-4 px-2">
            {weekdays.map((day, idx) => {
              const count = tasksByWeekday[idx];
              const heightPct = Math.round((count / maxWeekdayCount) * 100);

              return (
                <div key={day} className="flex flex-1 flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-muted group-hover:text-ink transition-colors">
                    {count}
                  </span>
                  <div className="w-full max-w-[42px] h-28 rounded-xl bg-surface-muted flex items-end p-1 overflow-hidden">
                    <div
                      className="w-full rounded-lg bg-accent/80 group-hover:bg-accent transition-all duration-300"
                      style={{ height: `${Math.max(heightPct, 6)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-faint group-hover:text-ink transition-colors">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Completion Statistics Card */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-display text-sm font-bold text-ink">
              Workspace Health
            </h2>
            <p className="text-xs text-muted">Overall task completion progress</p>

            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="size-36 -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-surface-muted"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-accent"
                    fill="transparent"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * completionRate) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-3xl font-extrabold text-ink">
                    {completionRate}%
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-line space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" /> Completed
              </span>
              <span className="font-semibold text-ink">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" /> In Progress
              </span>
              <span className="font-semibold text-ink">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-indigo-500" /> Pending
              </span>
              <span className="font-semibold text-ink">{pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Upcoming Deadlines & Project Summaries & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upcoming Deadlines (1 col) */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-line">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Upcoming Deadlines</h2>
              <p className="text-xs text-muted">Prioritized by target finish date</p>
            </div>
            <Link
              href="/tasks"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5"
            >
              View all <FiArrowUpRight size={13} />
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map(({ task, parsedDate }) => {
                const isOverdue = parsedDate < today;
                const project = getProjectByName(task.project);

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-line/60 bg-surface-muted/40 hover:bg-surface-hover transition-colors gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-muted">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {task.project}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isOverdue ? "text-red-600 dark:text-red-400" : "text-muted"
                          }`}
                        >
                          {isOverdue ? "Overdue " : "Due "}
                          {formatDueDate(task.date)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, "done")}
                      className="cursor-pointer grid size-7 place-items-center rounded-lg border border-line bg-surface text-muted hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Mark as complete"
                      aria-label={`Mark ${task.title} as complete`}
                    >
                      <FiCheck size={13} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-xs text-muted">No upcoming deadlines.</p>
            )}
          </div>
        </div>

        {/* Project Progress Overview (1 col) */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-line">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Project Overview</h2>
              <p className="text-xs text-muted">Active project trajectories</p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5"
            >
              All projects <FiArrowUpRight size={13} />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {projectSummaries.slice(0, 4).map(({ project, total, completed, progress }) => (
              <Link
                key={project.name}
                href={`/projects?name=${encodeURIComponent(project.name)}`}
                className="block p-3 rounded-xl border border-line/60 bg-surface-muted/40 hover:bg-surface-hover hover:border-accent/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-xs font-bold text-ink">{project.name}</span>
                  </div>
                  <span className="text-xs font-bold text-ink">{progress}%</span>
                </div>

                <div className="mt-2.5 h-1.5 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                  <span>{total} tasks total</span>
                  <span>{completed} completed</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (1 col) */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-line">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Recent Activity</h2>
              <p className="text-xs text-muted">Live workspace audit trail</p>
            </div>
            <Link
              href="/activity"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5"
            >
              All activity <FiArrowUpRight size={13} />
            </Link>
          </div>

          <div className="mt-4 space-y-2.5">
            {activity.length > 0 ? (
              activity.slice(0, 5).map((item) => {
                const badge = getActionBadge(item.action);
                const Icon = badge.icon;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-hover transition-colors"
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-lg ${badge.bg}`}
                    >
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink truncate">{item.title}</p>
                      <p className="text-[10px] text-muted mt-0.5">
                        <span className="capitalize font-medium">{item.action}</span>
                        {item.project ? ` in ${item.project}` : ""}{" "}
                        · {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-muted">
                <FiActivity size={20} className="mx-auto mb-2 text-faint" />
                No recorded activity yet. Tasks modified will show here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
