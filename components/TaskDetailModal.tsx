"use client";

import { useEffect } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiFolder,
  FiTag,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { getProjectByName } from "@/context/Projects";
import type { Task, TaskStatus } from "@/context/types";

type TaskDetailModalProps = {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  inprogress: "In progress",
  done: "Completed",
};

export default function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!task) return null;

  const project = getProjectByName(task.project);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                task.status === "done"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : task.status === "inprogress"
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {statusLabels[task.status]}
            </span>
            <span
              className={`rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                task.priority === "high"
                  ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  : task.priority === "low"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg text-faint hover:bg-surface-hover hover:text-ink transition-colors"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <h2 id="task-detail-title" className="font-display text-lg font-bold text-ink">
            {task.title}
          </h2>

          <div className="rounded-xl bg-surface-muted/60 border border-line p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5">
                <FiFolder size={14} /> Project
              </span>
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {task.project || "Personal"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5">
                <FiCalendar size={14} /> Due Date
              </span>
              <span className="font-semibold text-ink">
                {task.date || "Not scheduled"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted flex items-center gap-1.5">
                <FiClock size={14} /> Status Control
              </span>
              <div className="flex gap-1.5">
                {(["todo", "inprogress", "done"] as TaskStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onStatusChange(task.id, st)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                      task.status === st
                        ? "bg-accent text-white"
                        : "bg-surface text-muted hover:text-ink border border-line"
                    }`}
                  >
                    {statusLabels[st]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-ink mb-1">Description</h4>
            <div className="rounded-xl border border-line bg-surface p-3 min-h-[80px]">
              <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">
                {task.description || "No description provided for this task."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-line">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-2 rounded-xl transition-colors"
          >
            <FiTrash2 size={14} /> Delete
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-line bg-surface px-4 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="cursor-pointer inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-semibold text-white hover:bg-accent-hover transition-colors shadow-xs"
            >
              <FiEdit2 size={13} /> Edit Task
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
