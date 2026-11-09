"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiEdit2,
  FiFilter,
  FiFolder,
  FiGrid,
  FiImage,
  FiList,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiSliders,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useTasks } from "@/context/TaskContext";
import { getProjectByName, getTaskProject } from "@/context/Projects";
import { useProjects } from "@/context/ProjectContext";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";

const columns = [
  { id: "todo", title: "To do", tone: "todo" },
  { id: "inprogress", title: "In progress", tone: "progress" },
  { id: "done", title: "Done", tone: "done" },
];

const views = [
  { id: "backlog", label: "Backlog", icon: FiList },
  { id: "board", label: "Board", icon: FiGrid },
  { id: "timeline", label: "Timeline", icon: FiActivity },
];

function parseProjectDate(value) {
  if (!value) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDueDate(value) {
  const parsed = parseProjectDate(value);
  if (!parsed) return value ? "Invalid date" : "No due date";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(parsed);
}

function ProjectCreateDialog({
  editing,
  name,
  description,
  deadline,
  error,
  onNameChange,
  onDescriptionChange,
  onDeadlineChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(18_22_30_/_48%)] p-[18px] backdrop-blur-[3px]" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="max-h-[min(90vh,760px)] w-full max-w-[500px] animate-[modal-in_160ms_ease-out] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-[0_24px_70px_rgb(0_0_0_/_24%)] max-[640px]:p-5" role="dialog" aria-modal="true" aria-labelledby="create-project-title">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="m-0 mb-[5px] font-display text-[19px] leading-[1.3] font-bold" id="create-project-title">{editing ? "Edit project" : "Create a project"}</h2>
            <p className="m-0 text-[11px] text-muted">{editing ? "Update your project details." : "Give your next piece of work a home."}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><FiX size={18} /></button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-[15px] flex flex-col gap-[7px]">
            <label className="text-[11px] font-semibold" htmlFor="project-name">Project name</label>
            <input className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="project-name" value={name} onChange={(event) => onNameChange(event.target.value)} maxLength={50} required autoFocus placeholder="e.g. Product launch" />
          </div>
          <div className="mb-[15px] flex flex-col gap-[7px]">
            <label className="text-[11px] font-semibold" htmlFor="project-description">Description</label>
            <textarea className="min-h-[90px] w-full resize-y rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="project-description" value={description} onChange={(event) => onDescriptionChange(event.target.value)} maxLength={160} placeholder="What are you working toward?" />
          </div>
          <div className="mb-[15px] flex flex-col gap-[7px]">
            <label className="text-[11px] font-semibold" htmlFor="project-deadline">Deadline</label>
            <input className="min-h-[41px] w-full rounded-lg border border-line bg-surface px-[11px] py-[10px] text-[12px] text-ink" id="project-deadline" type="date" value={deadline} onChange={(event) => onDeadlineChange(event.target.value)} />
          </div>
          {error && <p className="-mt-[7px] mb-3 text-[11px] text-red" role="alert">{error}</p>}
          <div className="mt-[22px] flex justify-end gap-[9px]">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">{editing ? "Save changes" : "Create project"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function previewClass(task) {
  if (/design system|wireframe|ui kit|mockup/i.test(task.title || "")) return "design-preview";
  if (/brand|presentation|homepage/i.test(task.title || "")) return "brand-preview";
  return "";
}

function ProjectCard({ task, onEdit, onNotify }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const statusLabels = { todo: "To do", inprogress: "In progress", done: "Done" };
  const priority = task.priority || "medium";
  const preview = previewClass(task);
  const moveTask = (status) => {
    updateTaskStatus(task.id, status);
    setMenuOpen(false);
    onNotify(`Moved to ${statusLabels[status]}`);
  };

  return (
    <article className="project-task-card">
      {preview && (
        <div className={`project-card-cover ${preview}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <FiImage size={16} />
        </div>
      )}
      <div className="project-card-topline">
        <span className={`project-task-tag ${priority}`}>{priority} priority</span>
        <button type="button" className="project-card-menu-button" aria-label={`More actions for ${task.title}`} onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((open) => !open);
        }} aria-expanded={menuOpen}>
          <FiMoreHorizontal size={16} />
        </button>
        {menuOpen && <div className="project-card-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => { onEdit(task); setMenuOpen(false); }}>Edit task</button>
          {columns.filter((column) => column.id !== task.status).map((column) => (
            <button type="button" role="menuitem" key={column.id} onClick={() => moveTask(column.id)}>Move to {column.title}</button>
          ))}
          <button type="button" role="menuitem" className="remove" onClick={() => {
            deleteTask(task.id);
            setMenuOpen(false);
            onNotify("Task deleted");
          }}>Delete task</button>
        </div>}
      </div>
      <button type="button" className="project-card-title" onClick={() => onEdit(task)}>{task.title}</button>
      {task.description && <p className="project-card-description">{task.description}</p>}
      <div className="project-card-due"><FiCalendar size={12} /> <span>{formatDueDate(task.date)}</span></div>
      <div className="project-card-footer">
        <button type="button" className="project-card-check" onClick={() => moveTask(task.status === "done" ? "todo" : "done")} aria-label={task.status === "done" ? `Reopen ${task.title}` : `Complete ${task.title}`}>
          {task.status === "done" ? <FiCheckCircle size={13} /> : <FiCheck size={13} />}
        </button>
      </div>
    </article>
  );
}

function ProjectBoard({ tasks, onAddTask, onEditTask, onNotify }) {
  return (
    <div className="project-kanban">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        return (
          <section className="project-column" key={column.id} aria-label={`${column.title} project tasks`}>
            <div className="project-column-heading">
              <span className={`project-column-dot ${column.tone}`} />
              <h4>{column.title}</h4>
              <span className="project-column-count">{columnTasks.length}</span>
            </div>
            <button type="button" className="project-add-task" onClick={() => onAddTask(column.id)}>
              <FiPlus size={14} /> Add new task
            </button>
            <div className="project-column-cards">
              {columnTasks.map((task) => (
                <ProjectCard key={task.id} task={task} onEdit={onEditTask} onNotify={onNotify} />
              ))}
              {!columnTasks.length && (
                <div className="project-empty-column">
                  <span>No tasks yet</span>
                  <button type="button" onClick={() => onAddTask(column.id)}>Add a task</button>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function BacklogView({ tasks, onEditTask }) {
  return (
    <div className="project-backlog">
      <div className="project-backlog-heading">
        <span>Task</span><span>Priority</span><span>Status</span><span>Due date</span>
      </div>
      {tasks.map((task) => (
        <button type="button" className="project-backlog-row" key={task.id} onClick={() => onEditTask(task)}>
          <span className="backlog-task-name"><FiCheckCircle size={14} />{task.title}</span>
          <span className={`project-task-tag ${task.priority || "medium"}`}>{task.priority || "medium"}</span>
          <span className={`backlog-status ${task.status}`}>{task.status === "inprogress" ? "In progress" : task.status === "done" ? "Done" : "To do"}</span>
          <span>{formatDueDate(task.date)}</span>
        </button>
      ))}
      {!tasks.length && <div className="project-empty-state">Tasks added to this project will appear here.</div>}
    </div>
  );
}

function TimelineView({ tasks, onEditTask }) {
  const sortedTasks = [...tasks].sort((a, b) => {
    const first = parseProjectDate(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const second = parseProjectDate(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return first - second;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div className="project-timeline">
      <div className="timeline-scale">
        {["Overdue", "This week", "Next week", "Later"].map((label) => <span key={label}>{label}</span>)}
      </div>
      {sortedTasks.map((task) => {
        const dueDate = parseProjectDate(task.date);
        const daysUntil = dueDate ? Math.floor((dueDate - today) / 86400000) : null;
        const offset = daysUntil === null ? 0 : Math.min(Math.max(daysUntil, 0), 27) / 28 * 88;
        return (
        <button type="button" className="timeline-row" key={task.id} onClick={() => onEditTask(task)}>
          <span className="timeline-task-name"><span className={`project-column-dot ${task.status}`} />{task.title}</span>
          <span
            className={`timeline-bar ${task.status}${daysUntil === null ? " is-unscheduled" : ""}`}
            style={{
              "--timeline-offset": `${offset}%`,
              "--timeline-width": `${daysUntil === null ? 100 : Math.max(8, 92 - offset)}%`,
            }}
          >
            <span>{daysUntil === null ? "Unscheduled" : formatDueDate(task.date)}</span>
          </span>
        </button>
      );
      })}
      {!sortedTasks.length && <div className="project-empty-state">Add a task to start your project timeline.</div>}
    </div>
  );
}

function ProjectDirectory({
  projects,
  tasks,
  isLoaded,
  search,
  onSearchChange,
  onOpen,
  onCreate,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
}) {
  const query = search.trim().toLowerCase();
  const projectSummaries = projects.map((project) => {
    const projectTasks = tasks.filter((task) => getTaskProject(task) === project.name);
    const completed = projectTasks.filter((task) => task.status === "done").length;
    return {
      ...project,
      taskCount: projectTasks.length,
      openCount: projectTasks.length - completed,
      percent: projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0,
    };
  });
  const visibleProjects = projectSummaries
    .filter((project) => `${project.name} ${project.description}`.toLowerCase().includes(query))
    .filter((project) => filterBy === "all" ||
      (filterBy === "active" && project.openCount > 0) ||
      (filterBy === "completed" && project.taskCount > 0 && project.openCount === 0) ||
      (filterBy === "not-started" && project.taskCount === 0))
    .sort((left, right) => {
      if (sortBy === "progress") return right.percent - left.percent || left.name.localeCompare(right.name);
      if (sortBy === "tasks") return right.taskCount - left.taskCount || left.name.localeCompare(right.name);
      if (sortBy === "deadline") return (left.deadline || "9999-12-31").localeCompare(right.deadline || "9999-12-31");
      return left.name.localeCompare(right.name);
    });
  return (
    <section className="project-directory" aria-label="All projects">
      <div className="project-directory-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h3>All projects</h3>
          <p>Keep every initiative moving in one place.</p>
        </div>
        <button type="button" className="primary-button" onClick={onCreate}><FiPlus size={15} /> New project</button>
      </div>
      <label className="project-directory-search">
        <FiSearch size={15} />
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Find a project..." aria-label="Search projects" />
      </label>
      <div className="project-directory-controls">
        <label>
          <span>Filter</span>
          <select value={filterBy} onChange={(event) => onFilterChange(event.target.value)} aria-label="Filter projects">
            <option value="all">All projects</option>
            <option value="active">In progress</option>
            <option value="completed">Completed</option>
            <option value="not-started">Not started</option>
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} aria-label="Sort projects">
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="tasks">Task count</option>
            <option value="deadline">Deadline</option>
          </select>
        </label>
      </div>
      <div className="project-directory-grid">
        {!isLoaded
          ? Array.from({ length: 4 }, (_, index) => <div className="skeleton project-directory-skeleton" key={index} aria-hidden="true" />)
          : visibleProjects.map((project) => {
          return (
            <button type="button" className="project-directory-card" key={project.name} onClick={() => onOpen(project.name)}>
              <span className="directory-project-mark" style={{ backgroundColor: `${project.color}20`, color: project.color }}>{project.name.slice(0, 1)}</span>
              <span className="directory-project-copy">
                <strong>{project.name}</strong>
                <span>{project.deadline ? `${project.description} · Due ${formatDueDate(project.deadline)}` : project.description}</span>
              </span>
              <span className="directory-project-count">{project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}</span>
              <span className="directory-progress-track"><span style={{ width: `${project.percent}%`, backgroundColor: project.color }} /></span>
              <span className="directory-project-progress">{project.percent}% complete</span>
              <FiChevronRight className="directory-project-arrow" size={16} />
            </button>
          );
        })}
        {isLoaded && !visibleProjects.length && <div className="project-empty-state">No projects match that search.</div>}
      </div>
    </section>
  );
}

function ProjectWorkspaceContent({
  selectedProject,
  onSelectProject,
  search,
  onSearchChange,
  onAddTask,
  onEditTask,
  onNotify,
}) {
  const { tasks, isLoaded: tasksLoaded, updateTask } = useTasks();
  const { projects, isLoaded: projectsLoaded, createProject, updateProject, deleteProject } = useProjects();
  const { theme } = useTheme();
  const [view, setView] = useState("board");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("manual");
  const [projectSortBy, setProjectSortBy] = useState("name");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [projectOptionsOpen, setProjectOptionsOpen] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectDeadline, setNewProjectDeadline] = useState("");
  const [projectError, setProjectError] = useState("");
  const project = projects.find((item) => item.name === selectedProject) || getProjectByName(selectedProject);
  useEffect(() => {
    if (!showProjectDialog && !showDeleteProject) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        closeProjectDialog();
        setShowDeleteProject(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showProjectDialog, showDeleteProject]);
  const projectTasks = tasks.filter((task) => getTaskProject(task) === project.name);
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = projectTasks.filter((task) => {
      const matchesSearch = !query || `${task.title || ""} ${task.description || ""}`.toLowerCase().includes(query);
      const matchesPriority = priorityFilter === "all" || (task.priority || "medium") === priorityFilter;
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
    if (sortBy === "due") {
      result.sort((left, right) => new Date(left.date || "9999-12-31") - new Date(right.date || "9999-12-31"));
    } else if (sortBy === "priority") {
      const ranks = { high: 0, medium: 1, low: 2 };
      result.sort((left, right) => ranks[left.priority || "medium"] - ranks[right.priority || "medium"]);
    }
    return result;
  }, [projectTasks, priorityFilter, search, sortBy, statusFilter]);
  const completedCount = projectTasks.filter((task) => task.status === "done").length;
  const progress = projectTasks.length ? Math.round((completedCount / projectTasks.length) * 100) : 0;
  const openProjectDialog = (projectToEdit = null) => {
    setEditingProject(projectToEdit);
    setNewProjectName(projectToEdit?.name || "");
    setNewProjectDescription(projectToEdit?.description || "");
    setNewProjectDeadline(projectToEdit?.deadline || "");
    setProjectError("");
    setShowProjectDialog(true);
    setProjectOptionsOpen(false);
  };
  const closeProjectDialog = () => {
    setShowProjectDialog(false);
    setEditingProject(null);
    setProjectError("");
  };
  const saveProject = (event) => {
    event.preventDefault();
    try {
      if (editingProject) {
        const updated = updateProject(editingProject.name, {
          name: newProjectName,
          description: newProjectDescription,
          deadline: newProjectDeadline,
        });
        tasks.filter((task) => getTaskProject(task) === editingProject.name).forEach((task) => {
          updateTask(task.id, { project: updated.name });
        });
        onSelectProject(updated.name);
        onNotify("Project updated");
      } else {
        const created = createProject(newProjectName, newProjectDescription, newProjectDeadline);
        onSelectProject(created.name);
        onNotify("Project created");
      }
      closeProjectDialog();
    } catch (error) {
      setProjectError(error.message);
    }
  };
  const confirmDeleteProject = () => {
    const replacement = projects.find((item) => item.name !== project.name);
    if (!replacement) {
      setProjectError("Keep at least one project in your workspace.");
      return;
    }
    try {
      tasks.filter((task) => getTaskProject(task) === project.name).forEach((task) => {
        updateTask(task.id, { project: replacement.name });
      });
      deleteProject(project.name);
      setShowDeleteProject(false);
      setProjectError("");
      onSelectProject(null);
      onNotify(`Project deleted. Tasks moved to ${replacement.name}.`);
    } catch (error) {
      setProjectError(error.message);
    }
  };

  if (!selectedProject) {
    return (
      <>
        <ProjectDirectory
          projects={projects}
          tasks={tasks}
          isLoaded={projectsLoaded}
          search={search}
          onSearchChange={onSearchChange}
          onOpen={onSelectProject}
          onCreate={() => openProjectDialog()}
          sortBy={projectSortBy}
          onSortChange={setProjectSortBy}
          filterBy={projectFilter}
          onFilterChange={setProjectFilter}
        />
        {showProjectDialog && (
          <ProjectCreateDialog
            editing={Boolean(editingProject)}
            name={newProjectName}
            description={newProjectDescription}
            deadline={newProjectDeadline}
            error={projectError}
            onNameChange={(value) => { setNewProjectName(value); setProjectError(""); }}
            onDescriptionChange={setNewProjectDescription}
            onDeadlineChange={setNewProjectDeadline}
            onClose={closeProjectDialog}
            onSubmit={saveProject}
          />
        )}
      </>
    );
  }

  return (
    <section className={`project-workspace${theme === "light" ? " project-workspace-light" : ""}`}>
      <div className="project-breadcrumbs">
        <FiFolder size={13} />
        <span>Projects</span>
        <FiChevronRight size={13} />
        <strong>{project.name}</strong>
        <span className="breadcrumb-view">{view}</span>
      </div>

      <header className="project-overview-header">
        <div className="project-overview-info">
          <span className="project-main-mark" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
            {project.name.slice(0, 1)}
          </span>
          <div className="project-overview-title">
            <div className="project-title-line">
              <h3>{project.name}</h3>
              <button
                type="button"
                className="project-title-menu"
                aria-label="Project options"
                aria-expanded={projectOptionsOpen}
                onClick={() => setProjectOptionsOpen((open) => !open)}
              >
                <FiChevronDown size={14} />
              </button>
              {projectOptionsOpen && (
                <div className="project-options-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => openProjectDialog(project)}><FiEdit2 size={13} /> Edit project</button>
                  <button type="button" role="menuitem" className="remove" onClick={() => { setShowDeleteProject(true); setProjectOptionsOpen(false); }}><FiTrash2 size={13} /> Delete project</button>
                </div>
              )}
            </div>
            <p>{project.description}</p>
            <div className="project-progress-line">
              <span className="project-progress-track"><span style={{ width: `${progress}%`, background: project.color }} /></span>
              <span>{progress}% completed</span>
            </div>
            <div className="project-deadline-summary">
              <FiCalendar size={12} /> Deadline: {project.deadline ? formatDueDate(project.deadline) : "Not set"}
              <span>{projectTasks.length} tasks · {projectTasks.length - completedCount} open</span>
            </div>
          </div>
        </div>
      </header>

      <div className="project-layout">
        <aside className="project-navigator" aria-label="Project views">
          <div className="project-switcher-heading">
            <span>Projects</span>
            <button type="button" aria-label="Add project" onClick={() => openProjectDialog()}><FiPlus size={15} /></button>
          </div>
          <div className="project-switcher-list">
            {projects.map((item) => {
              const count = tasks.filter((task) => getTaskProject(task) === item.name).length;
              return (
                <button
                  type="button"
                  className={`project-switcher-item${project.name === item.name ? " active" : ""}`}
                  key={item.name}
                  onClick={() => onSelectProject(item.name)}
                >
                  <span className="project-dot" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                  {project.name === item.name && <FiChevronDown size={13} />}
                  {project.name !== item.name && <span className="project-switcher-count">{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="project-view-list">
            <span className="project-view-label">{project.name}</span>
            {views.map(({ id, label, icon: Icon }) => (
              <button type="button" key={id} className={`project-view-item${view === id ? " active" : ""}`} onClick={() => setView(id)}>
                <Icon size={14} />
                <span>{label}</span>
                {id === "backlog" && <span className="project-view-count">{projectTasks.length}</span>}
              </button>
            ))}
          </div>
          <div className="project-sidebar-footer"><FiUsers size={14} /> <span>Private project</span></div>
        </aside>

        <div className="project-content">
          <div className="project-tools">
            <label className="project-search">
              <FiSearch size={14} />
              <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search in project" aria-label="Search project tasks" />
            </label>
            <div className="project-tool-actions">
            <label className="project-sort-control">
              <FiCheckCircle size={14} />
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter project tasks by status">
                <option value="all">All statuses</option>
                <option value="todo">To do</option>
                <option value="inprogress">In progress</option>
                <option value="done">Completed</option>
              </select>
            </label>
            <div className="project-filter-wrap">
                <button type="button" className={`project-tool-button${priorityFilter !== "all" ? " active" : ""}`} onClick={() => setShowFilter((open) => !open)} aria-expanded={showFilter}>
                  <FiFilter size={14} /> Filters{priorityFilter !== "all" ? " · 1" : ""}
                </button>
                {showFilter && (
                  <label className="project-filter-popover">
                    <span>Priority</span>
                    <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                      <option value="all">All priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </label>
                )}
              </div>
              <label className="project-sort-control">
                <FiSliders size={14} />
                <span>Sort</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort project tasks">
                  <option value="manual">Default</option>
                  <option value="due">Due date</option>
                  <option value="priority">Priority</option>
                </select>
              </label>
              <div className="project-view-switch" role="group" aria-label="Project layout">
                <button type="button" className={view === "board" ? "active" : ""} onClick={() => setView("board")} aria-label="Board view"><FiGrid size={14} /></button>
                <button type="button" className={view === "backlog" ? "active" : ""} onClick={() => setView("backlog")} aria-label="List view"><FiList size={14} /></button>
                <button type="button" className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")} aria-label="Timeline view"><FiActivity size={14} /></button>
              </div>
            </div>
          </div>

          <div className="project-view-content">
            {!tasksLoaded ? (
              <div className="project-loading-state" aria-label="Loading project tasks">
                {[0, 1, 2].map((item) => <div className="skeleton" key={item} />)}
              </div>
            ) : view === "board" ? (
              <ProjectBoard
                tasks={filteredTasks}
                onAddTask={(status) => onAddTask({ status, project: project.name })}
                onEditTask={onEditTask}
                onNotify={onNotify}
              />
            ) : view === "backlog" ? (
              <BacklogView tasks={filteredTasks} onEditTask={onEditTask} />
            ) : (
              <TimelineView tasks={filteredTasks} onEditTask={onEditTask} />
            )}
          </div>
          {showProjectDialog && (
            <ProjectCreateDialog
              editing={Boolean(editingProject)}
              name={newProjectName}
              description={newProjectDescription}
              deadline={newProjectDeadline}
              error={projectError}
              onNameChange={(value) => { setNewProjectName(value); setProjectError(""); }}
              onDescriptionChange={setNewProjectDescription}
              onDeadlineChange={setNewProjectDeadline}
              onClose={closeProjectDialog}
              onSubmit={saveProject}
            />
          )}
          {showDeleteProject && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(18_22_30_/_48%)] p-[18px] backdrop-blur-[3px]" onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowDeleteProject(false);
            }}>
              <section className="max-h-[min(90vh,760px)] w-full max-w-[500px] animate-[modal-in_160ms_ease-out] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-[0_24px_70px_rgb(0_0_0_/_24%)] max-[640px]:p-5" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="m-0 mb-[5px] font-display text-[19px] leading-[1.3] font-bold" id="delete-project-title">Delete {project.name}?</h2>
                    <p className="m-0 text-[11px] text-muted">Tasks in this project will move to another project.</p>
                  </div>
                  <button type="button" className="icon-button" onClick={() => setShowDeleteProject(false)} aria-label="Close dialog"><FiX size={18} /></button>
                </div>
                {projectError && <p className="-mt-[7px] mb-3 text-[11px] text-red" role="alert">{projectError}</p>}
                <div className="mt-[22px] flex justify-end gap-[9px]">
                  <button type="button" className="secondary-button" onClick={() => { setShowDeleteProject(false); setProjectError(""); }}>Cancel</button>
                  <button type="button" className="primary-button danger-button" onClick={confirmDeleteProject}>Delete project</button>
                </div>
              </section>
            </div>
          )}
          <div className="project-footer-note"><FiClock size={12} /> All project changes are saved in this browser.</div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  const {
    search,
    setSearch,
    selectedProject,
    setSelectedProject,
    openTaskDialog,
    notify,
  } = useDashboardShell();

  return (
    <ProjectWorkspaceContent
      selectedProject={selectedProject}
      onSelectProject={setSelectedProject}
      search={search}
      onSearchChange={setSearch}
      onAddTask={(details = {}) => openTaskDialog({
        ...details,
        project: details.project || selectedProject || undefined,
      })}
      onEditTask={(task) => openTaskDialog({ task })}
      onNotify={notify}
    />
  );
}
