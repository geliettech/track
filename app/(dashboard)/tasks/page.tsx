"use client";

import { useDashboardShell } from "@/components/layout/DashboardShell";
import TaskBoard from "@/components/TaskBoard/TaskBoard";
import { FiCheckSquare, FiPlus } from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";

export default function MyTasksPage() {
  const { search, openTaskDialog, notify } = useDashboardShell();
  const { tasks } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "inprogress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
              <FiCheckSquare size={18} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              My Tasks
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted">
            Manage, prioritize, and track your tasks across all projects in one unified board.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openTaskDialog()}
          className="cursor-pointer inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors self-start sm:self-auto"
        >
          <FiPlus size={16} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Quick Status Stats Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-muted">Total Tasks</p>
          <p className="text-xl font-bold font-display text-ink mt-0.5">{total}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-muted">To Do</p>
          <p className="text-xl font-bold font-display text-indigo-600 dark:text-indigo-400 mt-0.5">
            {todo}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-muted">In Progress</p>
          <p className="text-xl font-bold font-display text-amber-600 dark:text-amber-400 mt-0.5">
            {inProgress}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-muted">Completed</p>
          <p className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-0.5">
            {completed}
          </p>
        </div>
      </div>

      {/* Main Kanban Board */}
      <TaskBoard
        search={search}
        onAddTask={(status, project) => openTaskDialog({ status, project })}
        onEditTask={(task) => openTaskDialog({ task })}
        onNotify={notify}
      />
    </div>
  );
}
