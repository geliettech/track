"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiFolder,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import ProjectDialog from "@/components/projects/ProjectDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import TaskBoard from "@/components/TaskBoard/TaskBoard";
import type { Project } from "@/context/types";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name");

  const { projects, createProject, updateProject, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const { openTaskDialog, notify } = useDashboardShell();

  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(initialName);
  const [projectSearch, setProjectSearch] = useState("");
  const [dialogProject, setDialogProject] = useState<Project | null | "new">(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [activeMenuProject, setActiveMenuProject] = useState<string | null>(null);

  // Compute metrics per project
  const projectSummaries = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => (t.project || "") === p.name);
      const pCompleted = pTasks.filter((t) => t.status === "done").length;
      const pInProgress = pTasks.filter((t) => t.status === "inprogress").length;
      const pTodo = pTasks.filter((t) => t.status === "todo").length;
      const progress = pTasks.length ? Math.round((pCompleted / pTasks.length) * 100) : 0;
      return {
        ...p,
        totalTasks: pTasks.length,
        completedTasks: pCompleted,
        inProgressTasks: pInProgress,
        todoTasks: pTodo,
        progress,
      };
    });
  }, [projects, tasks]);

  const activeProject = useMemo(() => {
    if (!selectedProjectName) return null;
    return projectSummaries.find((p) => p.name === selectedProjectName) || null;
  }, [projectSummaries, selectedProjectName]);

  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projectSummaries;
    const query = projectSearch.toLowerCase();
    return projectSummaries.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [projectSummaries, projectSearch]);

  const handleSaveProject = (values: {
    name: string;
    description: string;
    deadline?: string;
    color?: string;
  }) => {
    try {
      if (dialogProject && dialogProject !== "new") {
        updateProject(dialogProject.name, {
          name: values.name,
          description: values.description,
          deadline: values.deadline || "",
          color: values.color,
        });
        notify(`Updated project “${values.name}”`);
        if (selectedProjectName === dialogProject.name) {
          setSelectedProjectName(values.name);
        }
      } else {
        createProject(values.name, values.description, values.deadline, values.color);
        notify(`Created project “${values.name}”`);
      }
      setDialogProject(null);
    } catch (err: any) {
      notify(err.message || "Failed to save project.");
    }
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    try {
      deleteProject(projectToDelete.name);
      notify(`Deleted project “${projectToDelete.name}”`);
      if (selectedProjectName === projectToDelete.name) {
        setSelectedProjectName(null);
      }
    } catch (err: any) {
      notify(err.message || "Cannot delete project.");
    } finally {
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* If a project is selected: Project-Specific Task View */}
      {activeProject ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedProjectName(null)}
              className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors"
            >
              <FiArrowLeft size={14} /> Back to All Projects
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDialogProject(activeProject)}
                className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
              >
                <FiEdit2 size={13} /> Edit Project
              </button>
              <button
                type="button"
                onClick={() => setProjectToDelete(activeProject)}
                className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <FiTrash2 size={13} /> Delete
              </button>
            </div>
          </div>

          {/* Project Hero Card */}
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3.5 rounded-full ring-4 ring-offset-2 ring-offset-surface shadow-xs"
                    style={{ backgroundColor: activeProject.color }}
                  />
                  <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                    {activeProject.name}
                  </h1>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted max-w-2xl">
                  {activeProject.description}
                </p>
                {activeProject.deadline && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1 text-xs text-muted">
                    <FiCalendar size={13} />
                    <span>Target deadline: {activeProject.deadline}</span>
                  </div>
                )}
              </div>

              {/* Progress Summary Pill */}
              <div className="flex flex-col items-start md:items-end justify-center rounded-2xl bg-surface-muted/60 p-4 border border-line/60">
                <span className="text-xs font-medium text-muted">Project Completion</span>
                <span className="font-display text-2xl font-extrabold text-ink mt-0.5">
                  {activeProject.progress}%
                </span>
                <span className="text-[11px] text-faint">
                  {activeProject.completedTasks} of {activeProject.totalTasks} tasks done
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 h-2 w-full rounded-full bg-surface-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${activeProject.progress}%`,
                  backgroundColor: activeProject.color,
                }}
              />
            </div>
          </div>

          {/* Project-Specific Kanban Task Board */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-ink">
                Tasks in {activeProject.name}
              </h2>
              <button
                type="button"
                onClick={() => openTaskDialog({ project: activeProject.name })}
                className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-xl bg-accent px-3 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors"
              >
                <FiPlus size={14} /> Add Task
              </button>
            </div>

            <TaskBoard
              initialProject={activeProject.name}
              onAddTask={(status, proj) =>
                openTaskDialog({ status, project: proj || activeProject.name })
              }
              onEditTask={(task) => openTaskDialog({ task })}
              onNotify={notify}
            />
          </div>
        </div>
      ) : (
        /* All Projects Overview */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
                  <FiFolder size={18} />
                </span>
                <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                  Projects
                </h1>
              </div>
              <p className="mt-1 text-xs text-muted">
                Manage your workspaces, track deliverables, and align team efforts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDialogProject("new")}
              className="cursor-pointer inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors self-start sm:self-auto"
            >
              <FiPlus size={16} />
              <span>New Project</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <FiSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                type="search"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search projects by name or description..."
                className="h-8 w-full rounded-xl border border-line bg-surface-muted py-1 pl-8 pr-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:bg-surface focus:outline-hidden"
              />
            </div>

            <span className="text-xs text-muted">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"} found
            </span>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.name}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Color Indicator, Name & Context Menu */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="size-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: project.color }}
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedProjectName(project.name)}
                        className="cursor-pointer text-left font-display text-sm font-bold text-ink hover:text-accent transition-colors truncate"
                      >
                        {project.name}
                      </button>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        className="grid size-7 place-items-center rounded-lg text-faint hover:bg-surface-hover hover:text-ink transition-colors"
                        onClick={() =>
                          setActiveMenuProject((prev) =>
                            prev === project.name ? null : project.name
                          )
                        }
                        aria-label={`Actions for ${project.name}`}
                      >
                        <FiMoreHorizontal size={16} />
                      </button>

                      {activeMenuProject === project.name && (
                        <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-line bg-surface p-1.5 shadow-xl animate-in fade-in">
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-muted hover:bg-surface-hover hover:text-ink"
                            onClick={() => {
                              setActiveMenuProject(null);
                              setSelectedProjectName(project.name);
                            }}
                          >
                            <FiFolder size={13} /> View Tasks
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-muted hover:bg-surface-hover hover:text-ink"
                            onClick={() => {
                              setActiveMenuProject(null);
                              setDialogProject(project);
                            }}
                          >
                            <FiEdit2 size={13} /> Edit Project
                          </button>
                          <div className="my-1 border-t border-line/60" />
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            onClick={() => {
                              setActiveMenuProject(null);
                              setProjectToDelete(project);
                            }}
                          >
                            <FiTrash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted min-h-[36px]">
                    {project.description}
                  </p>
                </div>

                {/* Progress & Metrics */}
                <div className="mt-5 space-y-3 pt-4 border-t border-line/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted">Progress</span>
                    <span className="font-bold text-ink">{project.progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>

                  {/* Tasks count & view button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <span>{project.totalTasks} total</span>
                      <span>·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {project.completedTasks} done
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProjectName(project.name)}
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      <span>Explore</span>
                      <FiArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Create/Edit Dialog */}
      {dialogProject && (
        <ProjectDialog
          project={dialogProject === "new" ? null : dialogProject}
          onClose={() => setDialogProject(null)}
          onSave={handleSaveProject}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {projectToDelete && (
        <ConfirmDialog
          title={`Delete project “${projectToDelete.name}”?`}
          description="Are you sure you want to delete this project? Existing tasks will remain in your workspace."
          confirmLabel="Delete Project"
          onCancel={() => setProjectToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
