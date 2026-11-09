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
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function isOverdue(value, status) {
  if (!value || status === "done") return false;
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(dueDate.getTime()) && dueDate < today;
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
    <article className="rounded-[10px] border border-line bg-surface p-[14px] shadow-[0_3px_12px_rgb(34_45_68_/_3%)] transition-[border-color,transform,box-shadow] duration-[160ms] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_30%,var(--line))] hover:shadow-dashboard">
      <div className="flex items-start justify-between gap-2">
        <h5 className="m-0 break-words font-display text-[12px] leading-[1.45] font-semibold">{task.title}</h5>
        <div className="relative">
          <button
            type="button"
            className="-mt-1 -mr-1.5 grid size-[26px] shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-faint hover:bg-surface-hover hover:text-ink"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Actions for ${task.title}`}
            aria-expanded={menuOpen}
          >
            <FiMoreHorizontal size={17} />
          </button>
          {menuOpen && (
            <div className="absolute top-[30px] right-0 z-[15] w-[150px] rounded-[9px] border border-line bg-surface p-[5px] shadow-[0_12px_30px_rgb(0_0_0_/_12%)]" role="menu">
              <button type="button" role="menuitem" className="flex min-h-[33px] w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left text-[11px] text-muted hover:bg-surface-hover hover:text-ink" onClick={() => { onEdit(task); setMenuOpen(false); }}>
                <FiEdit2 size={13} /> Edit task
              </button>
              {Object.entries(statusLabels)
                .filter(([status]) => status !== task.status)
                .map(([status, label]) => (
                  <button key={status} type="button" role="menuitem" className="flex min-h-[33px] w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left text-[11px] text-muted hover:bg-surface-hover hover:text-ink" onClick={() => moveTask(status)}>
                    <FiCheck size={13} /> Move to {label.toLowerCase()}
                  </button>
                ))}
              <button type="button" role="menuitem" className="flex min-h-[33px] w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2 text-left text-[11px] text-red hover:bg-surface-hover hover:text-ink" onClick={removeTask}>
                <FiTrash2 size={13} /> Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && <p className="my-[7px] mb-[13px] line-clamp-2 overflow-hidden text-[11px] leading-[1.6] text-muted">{task.description}</p>}

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-[5px] rounded-[5px] px-[7px] py-1 text-[9px] font-semibold capitalize ${priority === "high" ? "bg-red-soft text-red" : priority === "low" ? "bg-green-soft text-green" : "bg-amber-soft text-amber"}`}>
          <span aria-hidden="true">●</span> {priority} priority
        </span>
        <button
          type="button"
          className="inline-flex min-h-[34px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-transparent bg-transparent px-[10px] text-[12px] font-semibold text-muted transition-colors hover:bg-surface-hover hover:text-ink"
          onClick={cycleStatus}
          aria-label={`Move ${task.title} to ${statusLabels[task.status === "todo" ? "inprogress" : task.status === "inprogress" ? "done" : "todo"]}`}
          title="Move task to next status"
        >
          <FiCheck size={13} />
          <span>{task.status === "done" ? "Reopen" : "Move"}</span>
        </button>
      </div>

      {(dateLabel || task.project) && (
        <div className={`mt-[11px] flex min-h-[29px] items-center justify-start gap-[7px] border-t border-line pt-[10px] text-[10px] ${isOverdue(task.date, task.status) ? "text-red" : "text-muted"}`}>
          {dateLabel && <><FiCalendar size={13} aria-hidden="true" /><span>{dateLabel}</span></>}
          {isOverdue(task.date, task.status) && <span>Overdue</span>}
          {task.project && <span className="ml-auto max-w-[104px] overflow-hidden text-ellipsis whitespace-nowrap text-faint">{task.project}</span>}
        </div>
      )}
    </article>
  );
}
