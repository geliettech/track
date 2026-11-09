"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiFolder, FiX } from "react-icons/fi";
import type { FormEvent } from "react";
import type { Project } from "@/context/types";

type ProjectDialogProps = {
  project?: Project | null;
  onClose: () => void;
  onSave: (values: { name: string; description: string; deadline?: string; color?: string }) => void;
};

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
];

export default function ProjectDialog({ project, onClose, onSave }: ProjectDialogProps) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [deadline, setDeadline] = useState(project?.deadline || "");
  const [color, setColor] = useState(project?.color || PRESET_COLORS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please provide a project name.");
      return;
    }
    if (trimmedName.length > 50) {
      setError("Project name cannot exceed 50 characters.");
      return;
    }
    onSave({
      name: trimmedName,
      description: description.trim(),
      deadline: deadline || undefined,
      color,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
      >
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <h2 id="project-dialog-title" className="font-display text-lg font-bold text-ink">
              {project ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {project ? "Update project workspace details." : "Organize tasks and track progress together."}
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

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="project-name">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              required
              maxLength={50}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Mobile App Redesign"
              className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="project-desc">
              Description
            </label>
            <textarea
              id="project-desc"
              maxLength={180}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are the goals and objectives of this project?"
              className="w-full min-h-[80px] rounded-xl border border-line bg-surface p-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="project-deadline">
              Deadline
            </label>
            <input
              id="project-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden transition-colors cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-7 rounded-full transition-transform cursor-pointer ${
                    color === c ? "scale-115 ring-2 ring-accent ring-offset-2 ring-offset-surface" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
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
              onClick={onClose}
              className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-line bg-surface px-4 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl bg-accent px-4 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors"
            >
              {project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
