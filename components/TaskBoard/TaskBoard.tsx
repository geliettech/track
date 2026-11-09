"use client";

import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiFilter,
  FiFolder,
  FiPlus,
  FiSearch,
  FiSliders,
  FiTrendingUp,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import { useProjects } from "@/context/ProjectContext";
import TaskCard from "./TaskCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import type { Task, TaskPriority, TaskStatus } from "@/context/types";
import type { ChangeEvent } from "react";

const columns: {
  id: TaskStatus;
  title: string;
  tone: "todo" | "progress" | "done";
  description: string;
}[] = [
  {
    id: "todo",
    title: "To Do",
    tone: "todo",
    description: "Tasks queued up and ready to start",
  },
  {
    id: "inprogress",
    title: "In Progress",
    tone: "progress",
    description: "Work actively being executed",
  },
  {
    id: "done",
    title: "Completed",
    tone: "done",
    description: "Finished and delivered items",
  },
];

type TaskBoardProps = {
  search?: string;
  initialProject?: string | null;
  onAddTask: (status?: TaskStatus, project?: string) => void;
  onEditTask: (task: Task) => void;
  onNotify: (message: string) => void;
};

export default function TaskBoard({
  search = "",
  initialProject = null,
  onAddTask,
  onEditTask,
  onNotify,
}: TaskBoardProps) {
  const { tasks, isLoaded, updateTaskStatus } = useTasks();
  const { projects } = useProjects();
  const { requestDeleteTask } = useDashboardShell();

  const [localSearch, setLocalSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [selectedProject, setSelectedProject] = useState<string | "all">(
    initialProject || "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "priority" | "title">("date");
  const [inspectingTask, setInspectingTask] = useState<Task | null>(null);

  const effectiveSearch = (search || localSearch).trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Project filter
      if (selectedProject !== "all" && (task.project || "") !== selectedProject) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== "all" && (task.priority || "medium") !== priorityFilter) {
        return false;
      }
      // Text search
      if (effectiveSearch) {
        const matchTitle = (task.title || "").toLowerCase().includes(effectiveSearch);
        const matchDesc = (task.description || "").toLowerCase().includes(effectiveSearch);
        const matchProject = (task.project || "").toLowerCase().includes(effectiveSearch);
        if (!matchTitle && !matchDesc && !matchProject) return false;
      }
      return true;
    });
  }, [tasks, selectedProject, priorityFilter, effectiveSearch]);

  const priorityOrder: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const getSortedTasks = (columnTasks: Task[]) => {
    return [...columnTasks].sort((a, b) => {
      if (sortBy === "priority") {
        return (
          (priorityOrder[b.priority || "medium"] || 2) -
          (priorityOrder[a.priority || "medium"] || 2)
        );
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      // By date default
      const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });
  };

  return (
    <section aria-label="Kanban task board" className="space-y-5">
      {/* Filters & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <FiFilter size={13} className="text-faint" />
            <select
              className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink focus:border-accent focus:outline-hidden cursor-pointer"
              value={priorityFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setPriorityFilter(e.target.value as TaskPriority | "all")
              }
              aria-label="Filter tasks by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <FiFolder size={13} className="text-faint" />
            <select
              className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink focus:border-accent focus:outline-hidden cursor-pointer"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              aria-label="Filter tasks by project"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <FiSliders size={13} className="text-faint" />
            <select
              className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink focus:border-accent focus:outline-hidden cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "priority" | "title")}
              aria-label="Sort tasks"
            >
              <option value="date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted">
          <span>
            Showing <strong className="text-ink font-semibold">{filteredTasks.length}</strong> of{" "}
            {tasks.length} tasks
          </span>
          <button
            type="button"
            onClick={() =>
              onAddTask(
                "todo",
                selectedProject !== "all" ? selectedProject : undefined
              )
            }
            className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-xl bg-accent px-3 text-xs font-semibold text-white hover:bg-accent-hover transition-colors shadow-xs"
          >
            <FiPlus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {columns.map((column) => {
          const columnTasks = getSortedTasks(
            filteredTasks.filter((task) => task.status === column.id)
          );

          return (
            <div
              key={column.id}
              className="flex flex-col rounded-2xl border border-line bg-surface-muted/50 p-4 min-h-[500px]"
              aria-label={`${column.title} column`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-line/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${
                      column.tone === "progress"
                        ? "bg-amber-500 ring-4 ring-amber-500/20"
                        : column.tone === "done"
                        ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                        : "bg-indigo-500 ring-4 ring-indigo-500/20"
                    }`}
                  />
                  <h3 className="font-display text-xs font-bold text-ink">
                    {column.title}
                  </h3>
                  <span className="grid size-5 place-items-center rounded-full bg-surface text-[10px] font-bold text-muted border border-line/60">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  className="grid size-7 place-items-center rounded-lg text-faint hover:bg-surface-hover hover:text-ink transition-colors"
                  onClick={() =>
                    onAddTask(
                      column.id,
                      selectedProject !== "all" ? selectedProject : undefined
                    )
                  }
                  aria-label={`Add task to ${column.title}`}
                  title={`Add task to ${column.title}`}
                >
                  <FiPlus size={16} />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {!isLoaded ? (
                  [0, 1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-28 rounded-2xl bg-surface animate-pulse border border-line/60"
                    />
                  ))
                ) : columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onView={setInspectingTask}
                      onNotify={onNotify}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line/80 py-12 px-4 text-center">
                    <p className="text-xs font-medium text-muted">No {column.title.toLowerCase()} tasks</p>
                    <p className="text-[11px] text-faint mt-1 mb-3">{column.description}</p>
                    <button
                      type="button"
                      onClick={() =>
                        onAddTask(
                          column.id,
                          selectedProject !== "all" ? selectedProject : undefined
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      <FiPlus size={13} /> Add first task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {inspectingTask && (
        <TaskDetailModal
          task={inspectingTask}
          onClose={() => setInspectingTask(null)}
          onEdit={(t) => {
            setInspectingTask(null);
            onEditTask(t);
          }}
          onDelete={(t) => {
            setInspectingTask(null);
            requestDeleteTask(t);
          }}
          onStatusChange={(id, newStatus) => {
            updateTaskStatus(id, newStatus);
            setInspectingTask((prev) => (prev ? { ...prev, status: newStatus } : null));
            onNotify(`Status updated to ${newStatus}`);
          }}
        />
      )}
    </section>
  );
}
