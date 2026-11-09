"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiEye,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import { getProjectByName } from "@/context/Projects";
import type { Task, TaskPriority, TaskStatus } from "@/context/types";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  inprogress: "In progress",
  done: "Completed",
};

function formatDueDate(value?: string): string | null {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function isOverdue(value?: string, status?: TaskStatus): boolean {
  if (!value || status === "done") return false;
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(dueDate.getTime()) && dueDate < today;
}

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onView?: (task: Task) => void;
  onNotify: (message: string) => void;
};

export default function TaskCard({ task, onEdit, onView, onNotify }: TaskCardProps) {
  const { updateTaskStatus } = useTasks();
  const { requestDeleteTask } = useDashboardShell();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const priority: TaskPriority = task.priority || "medium";
  const dateLabel = formatDueDate(task.date);
  const overdue = isOverdue(task.date, task.status);
  const projectInfo = getProjectByName(task.project);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const moveTask = (status: TaskStatus) => {
    updateTaskStatus(task.id, status);
    setMenuOpen(false);
    onNotify(`Moved to ${statusLabels[status].toLowerCase()}`);
  };

  const removeTask = () => {
    requestDeleteTask(task);
    setMenuOpen(false);
  };

  const cycleStatus = () => {
    const next: TaskStatus =
      task.status === "todo"
        ? "inprogress"
        : task.status === "inprogress"
        ? "done"
        : "todo";
    moveTask(next);
  };

  return (
    <article className="group relative rounded-2xl border border-line bg-surface p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
      {/* Top Header: Title and Action Menu */}
      <div className="flex items-start justify-between gap-2.5">
        <button
          type="button"
          onClick={() => (onView ? onView(task) : onEdit(task))}
          className="cursor-pointer text-left font-display text-xs font-semibold leading-snug text-ink hover:text-accent transition-colors flex-1"
        >
          {task.title}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-faint hover:bg-surface-hover hover:text-ink transition-colors"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Actions for ${task.title}`}
            aria-expanded={menuOpen}
          >
            <FiMoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-line bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95"
              role="menu"
            >
              {onView && (
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-muted hover:bg-surface-hover hover:text-ink transition-colors"
                  onClick={() => {
                    onView(task);
                    setMenuOpen(false);
                  }}
                >
                  <FiEye size={13} /> View details
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-muted hover:bg-surface-hover hover:text-ink transition-colors"
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
              >
                <FiEdit2 size={13} /> Edit task
              </button>

              <div className="my-1 border-t border-line/60" />

              {(Object.keys(statusLabels) as TaskStatus[])
                .filter((st) => st !== task.status)
                .map((st) => (
                  <button
                    key={st}
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-muted hover:bg-surface-hover hover:text-ink transition-colors"
                    onClick={() => moveTask(st)}
                  >
                    <FiCheck size={13} /> Move to {statusLabels[st].toLowerCase()}
                  </button>
                ))}

              <div className="my-1 border-t border-line/60" />

              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors"
                onClick={removeTask}
              >
                <FiTrash2 size={13} /> Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">
          {task.description}
        </p>
      )}

      {/* Priority Badge & Quick Cycle Action */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-bold capitalize ${
            priority === "high"
              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
              : priority === "low"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              priority === "high"
                ? "bg-red-500"
                : priority === "low"
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          />
          {priority}
        </span>

        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-line/60 bg-surface-muted/60 px-2 py-1 text-[11px] font-medium text-muted hover:border-accent/40 hover:bg-surface-hover hover:text-ink transition-colors"
          onClick={cycleStatus}
          title="Move to next status"
        >
          <FiCheck size={11} className={task.status === "done" ? "text-emerald-500" : ""} />
          <span>{task.status === "done" ? "Reopen" : "Advance"}</span>
        </button>
      </div>

      {/* Due date and Project Footer */}
      {(dateLabel || task.project) && (
        <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-[10px]">
          {dateLabel ? (
            <div
              className={`flex items-center gap-1 font-medium ${
                overdue ? "text-red-600 dark:text-red-400 font-semibold" : "text-muted"
              }`}
            >
              <FiCalendar size={12} aria-hidden="true" />
              <span>{dateLabel}</span>
              {overdue && <span className="rounded bg-red-500/10 px-1 text-[9px]">Late</span>}
            </div>
          ) : (
            <span className="text-faint">No due date</span>
          )}

          {task.project && (
            <div className="flex items-center gap-1.5 truncate max-w-[120px]">
              <span
                className="size-1.5 rounded-full shrink-0"
                style={{ backgroundColor: projectInfo.color }}
              />
              <span className="truncate text-faint group-hover:text-muted transition-colors">
                {task.project}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
