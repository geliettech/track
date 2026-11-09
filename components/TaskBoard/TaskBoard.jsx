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
      <div className="board-heading">
        <div>
          <h3>{activeSection === "completed" ? "Completed tasks" : activeSection === "projects" ? "All projects" : "Your tasks"}</h3>
          <span>{matchingTasks.length} {matchingTasks.length === 1 ? "task" : "tasks"} shown</span>
        </div>
      </div>

      <div className="board-toolbar">
        <div className="toolbar-left">
          <button type="button" className="quiet-button" aria-label="Board view">
            <FiSliders size={14} /> Board view
          </button>
        </div>
        <div className="toolbar-right">
          <select
            className="filter-select"
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

      <div className={`kanban-board${activeSection === "completed" ? " is-filtered" : ""}`}>
        {shownColumns.map((column) => {
          const columnTasks = matchingTasks.filter((task) => task.status === column.id);
          return (
            <section className="kanban-column" key={column.id} aria-label={`${column.title} tasks`}>
              <div className="column-title">
                <span className={`column-indicator ${column.tone}`} aria-hidden="true" />
                <h4>{column.title}</h4>
                <span className="column-count">{columnTasks.length}</span>
                <button
                  type="button"
                  className="task-menu-button column-add"
                  onClick={() => onAddTask(column.id)}
                  aria-label={`Add task to ${column.title}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>

              <div className="task-list">
                {!isLoaded
                  ? [0, 1, 2].map((item) => <div key={item} className="skeleton" aria-hidden="true" />)
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
                        <div className="empty-column">
                          <span>{normalizedSearch || priorityFilter !== "all" ? "No tasks match these filters." : "Nothing on your plate here."}</span>
                          {!normalizedSearch && priorityFilter === "all" && (
                            <button type="button" onClick={() => onAddTask(column.id)}>Add a task</button>
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
