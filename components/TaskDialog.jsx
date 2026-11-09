"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { getTaskProject, PROJECTS } from "@/context/Projects";
import { useProjects } from "@/context/ProjectContext";

const EMPTY_TASK = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  date: "",
  project: PROJECTS[0].name,
};

function toInputDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

export default function TaskDialog({ task, initialStatus, initialProject, onClose, onSave }) {
  const { projects } = useProjects();
  const [values, setValues] = useState(() => ({
    ...EMPTY_TASK,
    status: initialStatus || "todo",
    project: initialProject || PROJECTS[0].name,
    ...(task
      ? {
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          status: task.status || "todo",
          date: toInputDate(task.date),
          project: getTaskProject(task),
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
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
      >
        <div className="modal-heading">
          <div>
            <h2 id="task-dialog-title">{task ? "Edit task" : "Create a task"}</h2>
            <p>{task ? "Make changes to your task details." : "A small step brings you closer to the big picture."}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="form-field">
            <label htmlFor="task-title">Task name <span aria-hidden="true">*</span></label>
            <input
              id="task-title"
              name="title"
              value={values.title}
              onChange={change}
              maxLength={100}
              placeholder="e.g. Plan the product launch"
              autoFocus
            />
          </div>
          <div className="form-field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              value={values.description}
              onChange={change}
              maxLength={500}
              placeholder="Add a few details to help you get started..."
            />
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="task-project">Project</label>
              <select id="task-project" name="project" value={values.project} onChange={change}>
                {projects.map((project) => (
                  <option key={project.name} value={project.name}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" name="priority" value={values.priority} onChange={change}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" name="status" value={values.status} onChange={change}>
                <option value="todo">To do</option>
                <option value="inprogress">In progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="task-date">Due date</label>
            <input id="task-date" name="date" type="date" value={values.date} onChange={change} />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">{task ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
