"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { getTaskProject } from "@/context/Projects";
import { useProjects } from "@/context/ProjectContext";

const EMPTY_TASK = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  date: "",
};

function toInputDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TaskDialog({ task, initialStatus, initialProject, onClose, onSave }) {
  const { projects } = useProjects();
  const [values, setValues] = useState(() => ({
    ...EMPTY_TASK,
    status: initialStatus || "todo",
    project: projects.some((project) => project.name === initialProject)
      ? initialProject
      : projects[0]?.name || "",
    ...(task
      ? {
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          status: task.status || "todo",
          date: toInputDate(task.date),
          project: projects.some((project) => project.name === getTaskProject(task))
            ? getTaskProject(task)
            : projects[0]?.name || "",
        }
      : {}),
  }));
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const change = (event) => {
    setError("");
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const title = values.title.trim();
    if (!title) {
      setError("Give your task a title before saving.");
      return;
    }
    if (title.length > 100) {
      setError("Keep the title under 100 characters.");
      return;
    }
    onSave({ ...values, title, description: values.description.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgb(18_22_30_/_48%)] p-[18px] backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="max-h-[min(90vh,760px)] w-full max-w-[500px] animate-[modal-in_160ms_ease-out] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-[0_24px_70px_rgb(0_0_0_/_24%)] max-[640px]:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="m-0 mb-[5px] font-display text-[19px] leading-[1.3] font-bold" id="task-dialog-title">{task ? "Edit task" : "Create a task"}</h2>
            <p className="m-0 text-[11px] text-muted">{task ? "Make changes to your task details." : "A small step brings you closer to the big picture."}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mb-[15px] flex flex-col gap-[7px]">
            <label className="text-[11px] font-semibold" htmlFor="task-title">Task name <span aria-hidden="true">*</span></label>
            <input
              className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink"
              id="task-title"
              name="title"
              value={values.title}
              onChange={change}
              maxLength={100}
              placeholder="e.g. Plan the product launch"
              autoFocus
            />
          </div>
          <div className="mb-[15px] flex flex-col gap-[7px]">
            <label className="text-[11px] font-semibold" htmlFor="task-description">Description</label>
            <textarea
              className="min-h-[90px] w-full resize-y rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink"
              id="task-description"
              name="description"
              value={values.description}
              onChange={change}
              maxLength={500}
              placeholder="Add a few details to help you get started..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1 max-[640px]:gap-0">
            <div className="mb-[15px] flex flex-col gap-[7px]">
              <label className="text-[11px] font-semibold" htmlFor="task-project">Project</label>
              <select className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="task-project" name="project" value={values.project} onChange={change}>
                {projects.map((project) => (
                  <option key={project.name} value={project.name}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-[15px] flex flex-col gap-[7px]">
              <label className="text-[11px] font-semibold" htmlFor="task-priority">Priority</label>
              <select className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="task-priority" name="priority" value={values.priority} onChange={change}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-[15px] flex flex-col gap-[7px]">
              <label className="text-[11px] font-semibold" htmlFor="task-status">Status</label>
              <select className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="task-status" name="status" value={values.status} onChange={change}>
                <option value="todo">To do</option>
                <option value="inprogress">In progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>
          <div className="mb-[15px] flex flex-col gap-[7px]">
            <label className="text-[11px] font-semibold" htmlFor="task-date">Due date</label>
            <input className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="task-date" name="date" type="date" value={values.date} onChange={change} />
          </div>

          {error && <p className="-mt-[7px] mb-3 text-[11px] text-red" role="alert">{error}</p>}

          <div className="mt-[22px] flex justify-end gap-[9px]">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">{task ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
