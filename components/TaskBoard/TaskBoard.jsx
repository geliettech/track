"use client";

import { useState } from "react";
import { FiPlus, FiSliders } from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import TaskCard from "./TaskCard";

const columns = [
  { id: "todo", title: "To do", tone: "" },
  { id: "inprogress", title: "In progress", tone: "progress" },
  { id: "done", title: "Completed", tone: "done" },
];

export default function TaskBoard({
  search,
  activeSection,
  onAddTask,
  onEditTask,
  onNotify,
}) {
  const { tasks, isLoaded } = useTasks();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const shownColumns =
    activeSection === "completed" ? columns.filter((column) => column.id === "done") : columns;
  const normalizedSearch = search.trim().toLowerCase();
  const matchingTasks = tasks.filter((task) => {
    const matchesSection = activeSection !== "completed" || task.status === "done";
    const matchesText =
      !normalizedSearch ||
      `${task.title || ""} ${task.description || ""} ${task.project || ""}`
        .toLowerCase()
        .includes(normalizedSearch);
    const matchesPriority =
      priorityFilter === "all" || (task.priority || "medium") === priorityFilter;
    return matchesSection && matchesText && matchesPriority;
  });

  return (
    <section aria-label="Task board">
      <div className="mb-[14px] flex items-center justify-between">
        <div>
          <h3 className="m-0 font-display text-[15px] leading-[1.4] font-bold">{activeSection === "completed" ? "Completed tasks" : activeSection === "projects" ? "All projects" : "Your tasks"}</h3>
          <span className="text-[11px] text-muted">{matchingTasks.length} {matchingTasks.length === 1 ? "task" : "tasks"} shown</span>
        </div>
      </div>

      <div className="mb-[11px] flex min-h-[47px] items-center justify-between max-[640px]:items-start max-[640px]:gap-[10px]">
        <div className="flex items-center justify-start gap-2">
          <button type="button" className="inline-flex min-h-[34px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-transparent bg-transparent px-[10px] text-[12px] font-semibold text-muted hover:bg-surface-hover hover:text-ink" aria-label="Board view">
            <FiSliders size={14} /> Board view
          </button>
        </div>
        <div className="flex items-center justify-end gap-2">
          <select
            className="h-[34px] cursor-pointer appearance-none rounded-lg border border-line bg-surface bg-[linear-gradient(45deg,transparent_50%,var(--muted)_50%),linear-gradient(135deg,var(--muted)_50%,transparent_50%)] bg-[length:4px_4px,4px_4px] bg-[position:calc(100%-12px)_14px,calc(100%-8px)_14px] bg-no-repeat py-0 pr-7 pl-[10px] text-[11px] text-muted"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
        </div>
      </div>

      <div className="grid items-start gap-[17px] [grid-template-columns:repeat(3,minmax(245px,1fr))] max-[850px]:[grid-template-columns:repeat(3,minmax(235px,1fr))] max-[850px]:overflow-x-auto max-[850px]:pb-[10px] max-[640px]:grid-cols-1 max-[640px]:overflow-visible">
        {shownColumns.map((column) => {
          const columnTasks = matchingTasks.filter((task) => task.status === column.id);
          return (
            <section className="min-h-[240px] rounded-xl border border-line bg-[color-mix(in_srgb,var(--surface-muted)_72%,transparent)] p-[13px] max-[640px]:min-h-[180px]" key={column.id} aria-label={`${column.title} tasks`}>
              <div className="mb-[10px] flex min-h-[34px] items-center justify-start gap-2">
                <span className={`size-[7px] rounded-full ${column.tone === "progress" ? "bg-[#5991d1]" : column.tone === "done" ? "bg-green" : "bg-amber"}`} aria-hidden="true" />
                <h4 className="m-0 text-[12px] font-bold">{column.title}</h4>
                <span className="grid h-5 min-w-[21px] place-items-center rounded-md bg-surface-hover px-[6px] text-[10px] font-semibold text-muted">{columnTasks.length}</span>
                <button
                  type="button"
                  className="ml-auto grid size-[26px] shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-faint hover:bg-surface-hover hover:text-ink"
                  onClick={() => onAddTask(column.id)}
                  aria-label={`Add task to ${column.title}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-[10px]">
                {!isLoaded
                  ? [0, 1, 2].map((item) => <div key={item} className="min-h-[106px] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-[9px] bg-[linear-gradient(90deg,var(--surface-hover)_25%,var(--line)_50%,var(--surface-hover)_75%)] bg-[length:200%_100%]" aria-hidden="true" />)
                  : columnTasks.length
                    ? columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={onEditTask}
                          onNotify={onNotify}
                        />
                      ))
                    : (
                        <div className="flex min-h-[143px] flex-col items-center justify-center gap-2 rounded-[9px] border border-dashed border-line p-[15px] text-center text-faint">
                          <span className="text-[10px]">{normalizedSearch || priorityFilter !== "all" ? "No tasks match these filters." : "Nothing on your plate here."}</span>
                          {!normalizedSearch && priorityFilter === "all" && (
                            <button className="cursor-pointer border-0 bg-transparent px-[6px] py-1 text-[10px] font-semibold text-accent" type="button" onClick={() => onAddTask(column.id)}>Add a task</button>
                          )}
                        </div>
                      )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
