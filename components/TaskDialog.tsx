"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiFlag, FiFolder, FiX } from "react-icons/fi";
import { getTaskProject } from "@/context/Projects";
import { useProjects } from "@/context/ProjectContext";
import type { ChangeEvent, FormEvent } from "react";
import type { Task, TaskInput, TaskPriority, TaskStatus } from "@/context/types";

type TaskDialogValues = TaskInput;

const EMPTY_TASK: TaskDialogValues = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  date: "",
  project: "",
};

function toInputDate(value?: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type TaskDialogProps = {
  task?: Task;
  initialStatus?: TaskStatus;
  initialProject?: string;
  onClose: () => void;
  onSave: (values: TaskInput) => void;
};

export default function TaskDialog({
  task,
  initialStatus,
  initialProject,
  onClose,
  onSave,
}: TaskDialogProps) {
  const { projects } = useProjects();
  const [values, setValues] = useState<TaskDialogValues>(() => ({
    ...EMPTY_TASK,
    status: initialStatus || "todo",
    project:
      initialProject && projects.some((p) => p.name === initialProject)
        ? initialProject
        : projects[0]?.name || "ShiftX",
    ...(task
      ? {
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          status: task.status || "todo",
          date: toInputDate(task.date),
          project: projects.some((p) => p.name === getTaskProject(task))
            ? getTaskProject(task)
            : projects[0]?.name || "ShiftX",
        }
      : {}),
  }));
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const change = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setError("");
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = values.title.trim();
    if (!title) {
      setError("Please give your task a title before saving.");
      return;
    }
    if (title.length > 100) {
      setError("Please keep the title under 100 characters.");
      return;
    }
    onSave({ ...values, title, description: values.description.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
      >
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <h2
              className="font-display text-lg font-bold text-ink"
              id="task-dialog-title"
            >
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {task
                ? "Update task details, deadline, and priority."
                : "Add a task to organize and track progress."}
            </p>
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

        <form onSubmit={submit} noValidate className="mt-5 space-y-4">
          <div>
            <label
              className="block text-xs font-semibold text-ink mb-1.5"
              htmlFor="task-title"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors"
              id="task-title"
              name="title"
              value={values.title}
              onChange={change}
              maxLength={100}
              placeholder="e.g. Design mobile onboarding flow"
              autoFocus
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-ink mb-1.5"
              htmlFor="task-description"
            >
              Description
            </label>
            <textarea
              className="w-full min-h-[88px] rounded-xl border border-line bg-surface p-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors resize-y"
              id="task-description"
              name="description"
              value={values.description}
              onChange={change}
              maxLength={500}
              placeholder="Add key deliverables, acceptance criteria, or links..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                className="block text-xs font-semibold text-ink mb-1.5"
                htmlFor="task-project"
              >
                Project
              </label>
              <select
                className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors cursor-pointer"
                id="task-project"
                name="project"
                value={values.project}
                onChange={change}
              >
                {projects.map((project) => (
                  <option key={project.name} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-ink mb-1.5"
                htmlFor="task-priority"
              >
                Priority
              </label>
              <select
                className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors cursor-pointer"
                id="task-priority"
                name="priority"
                value={values.priority}
                onChange={change}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                className="block text-xs font-semibold text-ink mb-1.5"
                htmlFor="task-status"
              >
                Status
              </label>
              <select
                className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors cursor-pointer"
                id="task-status"
                name="status"
                value={values.status}
                onChange={change}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-semibold text-ink mb-1.5"
                htmlFor="task-date"
              >
                Due Date
              </label>
              <input
                className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors cursor-pointer"
                id="task-date"
                name="date"
                type="date"
                value={values.date}
                onChange={change}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-line">
            <button
              type="button"
              className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-line bg-surface px-4 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl bg-accent px-4 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
