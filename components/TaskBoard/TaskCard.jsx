"use client";

import { useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";

const statusLabels = {
  todo: "To do",
  inprogress: "In progress",
  done: "Completed",
};

function formatDueDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  }
  return value;
}

function isOverdue(value, status) {
  if (!value || status === "done" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return value < new Date().toISOString().slice(0, 10);
}

export default function TaskCard({ task, onEdit, onNotify }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const priority = task.priority || "medium";
  const dateLabel = formatDueDate(task.date);

  const moveTask = (status) => {
    updateTaskStatus(task.id, status);
    setMenuOpen(false);
    onNotify(`Moved to ${statusLabels[status].toLowerCase()}`);
  };

  const removeTask = () => {
    deleteTask(task.id);
    setMenuOpen(false);
    onNotify("Task deleted");
  };

  const cycleStatus = () => {
    const next = task.status === "todo" ? "inprogress" : task.status === "inprogress" ? "done" : "todo";
    moveTask(next);
  };

  return (
    <article className="task-card">
      <div className="task-title-row">
        <h5>{task.title}</h5>
        <div className="task-menu-wrap">
          <button
            type="button"
            className="task-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Actions for ${task.title}`}
            aria-expanded={menuOpen}
          >
            <FiMoreHorizontal size={17} />
          </button>
          {menuOpen && (
            <div className="task-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { onEdit(task); setMenuOpen(false); }}>
                <FiEdit2 size={13} /> Edit task
              </button>
              {Object.entries(statusLabels)
                .filter(([status]) => status !== task.status)
                .map(([status, label]) => (
                  <button key={status} type="button" role="menuitem" onClick={() => moveTask(status)}>
                    <FiCheck size={13} /> Move to {label.toLowerCase()}
                  </button>
                ))}
              <button type="button" role="menuitem" className="menu-danger" onClick={removeTask}>
                <FiTrash2 size={13} /> Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-footer">
        <span className={`priority-badge ${priority}`}>
          <span aria-hidden="true">●</span> {priority} priority
        </span>
        <button
          type="button"
          className="quiet-button"
          onClick={cycleStatus}
          aria-label={`Move ${task.title} to ${statusLabels[task.status === "todo" ? "inprogress" : task.status === "inprogress" ? "done" : "todo"]}`}
          title="Move task to next status"
        >
          <FiCheck size={13} />
          <span>{task.status === "done" ? "Reopen" : "Move"}</span>
        </button>
      </div>

      {dateLabel && (
        <div className={`task-meta${isOverdue(task.date, task.status) ? " is-overdue" : ""}`}>
          <FiCalendar size={13} aria-hidden="true" />
          <span>{dateLabel}</span>
          {isOverdue(task.date, task.status) && <span>Overdue</span>}
          {task.description && <span className="task-project">{task.project || ""}</span>}
        </div>
      )}
    </article>
  );
}
