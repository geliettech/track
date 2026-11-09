"use client";

import { useMemo, useState } from "react";
import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiFolder,
  FiList,
  FiPlus,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import { getTaskProject } from "@/context/Projects";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";

const statuses = [
  { id: "todo", label: "To do" },
  { id: "inprogress", label: "In progress" },
  { id: "done", label: "Completed" },
];

const weekdays = [
  { short: "Mon", day: 1 },
  { short: "Tue", day: 2 },
  { short: "Wed", day: 3 },
  { short: "Thu", day: 4 },
  { short: "Fri", day: 5 },
  { short: "Sat", day: 6 },
  { short: "Sun", day: 0 },
];

function parseDate(value) {
  if (!value) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDueDate(value) {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
    : "No due date";
}

function MetricCard({ label, value, note, tone, icon: Icon }) {
  return (
    <article className={`overview-metric ${tone}`}>
      <div className="overview-metric-copy">
        <span className="overview-metric-label">{label}</span>
        <strong>{value}</strong>
        <span className="overview-metric-note">{note}</span>
      </div>
      <div className="overview-metric-visual">
        <span className="overview-metric-icon"><Icon size={15} aria-hidden="true" /></span>
      </div>
    </article>
  );
}

function projectColor(project) {
  let seed = 0;
  for (let index = 0; index < project.length; index += 1) {
    seed = (seed + project.charCodeAt(index)) % 4;
  }
  return ["blue", "green", "pink", "amber"][seed];
}

export default function OverviewPage() {
  const { tasks, activity, isLoaded, updateTaskStatus } = useTasks();
  const { projects } = useProjects();
  const {
    search,
    setSearch,
    openTaskDialog,
    navigate,
    setSelectedProject,
  } = useDashboardShell();

  const openProjects = (projectName) => {
    if (projectName) setSelectedProject(projectName);
    navigate("projects", { preserveProject: Boolean(projectName) });
  };

  return (
    <Overview
      tasks={tasks}
      activity={activity}
      projects={projects}
      isLoaded={isLoaded}
      search={search}
      onSearchChange={setSearch}
      onEditTask={(task) => openTaskDialog({ task })}
      onUpdateTaskStatus={updateTaskStatus}
      onAddTask={() => openTaskDialog()}
      onOpenProjects={openProjects}
    />
  );
}

function Overview({
  tasks,
  activity = [],
  projects = [],
  isLoaded = true,
  search,
  onSearchChange,
  onEditTask,
  onUpdateTaskStatus,
  onAddTask,
  onOpenProjects,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const today = dateKey();
  const statusCounts = useMemo(
    () => Object.fromEntries(statuses.map(({ id }) => [id, tasks.filter((task) => task.status === id).length])),
    [tasks]
  );
  const highPriorityCount = tasks.filter((task) => task.priority === "high").length;
  const overdueTasks = tasks.filter((task) =>
    task.status !== "done" && /^\d{4}-\d{2}-\d{2}$/.test(task.date || "") && task.date < today
  );
  const pendingCount = statusCounts.todo;
  const tasksByWeekday = useMemo(() => {
    const counts = Array(7).fill(0);
    tasks.forEach((task) => {
      const date = parseDate(task.date);
      if (date) counts[(date.getDay() + 6) % 7] += 1;
    });
    return counts;
  }, [tasks]);
  const maxDayCount = Math.max(...tasksByWeekday, 1);
  const completionRate = tasks.length ? Math.round((statusCounts.done / tasks.length) * 100) : 0;
  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks
      .filter((task) => statusFilter === "all" || task.status === statusFilter)
      .filter((task) => {
        const project = getTaskProject(task);
        return !query || `${task.title || ""} ${project}`.toLowerCase().includes(query);
      })
      .sort((left, right) => {
        const leftDate = parseDate(left.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const rightDate = parseDate(right.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return leftDate - rightDate;
      })
      .slice(0, 6);
  }, [tasks, search, statusFilter]);
  const deadlines = useMemo(() => tasks
    .filter((task) => task.status !== "done" && parseDate(task.date))
    .sort((left, right) => parseDate(left.date).getTime() - parseDate(right.date).getTime())
    .slice(0, 5), [tasks]);
  const projectSummaries = useMemo(() => projects
    .map((project) => {
      const projectTasks = tasks.filter((task) => getTaskProject(task) === project.name);
      const complete = projectTasks.filter((task) => task.status === "done").length;
      return {
        ...project,
        taskCount: projectTasks.length,
        openCount: projectTasks.length - complete,
        progress: projectTasks.length ? Math.round((complete / projectTasks.length) * 100) : 0,
      };
    })
    .sort((left, right) => right.openCount - left.openCount || left.name.localeCompare(right.name))
    .slice(0, 4), [projects, tasks]);

  const metrics = [
    {
      label: "Total tasks",
      value: tasks.length,
      note: "Across your workspace",
      tone: "coral",
      icon: FiList,
    },
    {
      label: "To do",
      value: pendingCount,
      note: "Ready when you are",
      tone: "orange",
      icon: FiClock,
    },
    {
      label: "In progress",
      value: statusCounts.inprogress,
      note: "Tasks underway",
      tone: "mint",
      icon: FiTrendingUp,
    },
    {
      label: "Completed tasks",
      value: statusCounts.done,
      note: "Nicely done",
      tone: "blue",
      icon: FiCheckCircle,
    },
    {
      label: "Overdue",
      value: overdueTasks.length,
      note: "Past their due date",
      tone: "coral",
      icon: FiCalendar,
    },
    {
      label: "High priority",
      value: highPriorityCount,
      note: "Need your attention",
      tone: "orange",
      icon: FiClock,
    },
  ];

  return (
    <section className="overview-grid" aria-label="Workspace overview">
      <div className="overview-quick-actions" aria-label="Quick actions">
        <span>Quick actions</span>
        <button type="button" className="secondary-button" onClick={onAddTask}><FiPlus size={14} /> New task</button>
        <button type="button" className="secondary-button" onClick={onOpenProjects}><FiFolder size={14} /> View projects</button>
      </div>
      {!isLoaded ? (
        <div className="overview-metrics" aria-label="Loading task statistics">
          {Array.from({ length: 6 }, (_, index) => <div className="skeleton overview-metric-skeleton" key={index} />)}
        </div>
      ) : <div className="overview-metrics">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>}

      <div className="overview-panels">
        <section className="overview-panel performance-panel">
          <div className="overview-panel-heading">
            <div>
              <span className="overview-kicker">Your workspace</span>
              <h3>Tasks by due date</h3>
            </div>
            <div className="completion-summary">
              <FiCheckCircle size={14} aria-hidden="true" />
              <span>{completionRate}% completed</span>
            </div>
          </div>

          <div className="chart-summary">
            <strong>{isLoaded ? tasks.length : "—"}</strong>
            <span>tasks across all due dates</span>
          </div>
          {!isLoaded ? (
            <div className="weekday-chart-loading" aria-label="Loading due-date chart">
              {weekdays.map(({ day }) => <span className="skeleton" key={day} />)}
            </div>
          ) : <div className="weekday-chart" role="img" aria-label="Number of tasks due on each weekday">
            {weekdays.map(({ short, day }, index) => {
              const count = tasksByWeekday[index];
              return (
                <div className="weekday-item" key={day} title={`${count} ${count === 1 ? "task" : "tasks"} due on ${short}`}>
                  <div className="weekday-track">
                    <span
                      className={`weekday-bar${index === tasksByWeekday.indexOf(maxDayCount) ? " is-highlighted" : ""}`}
                      style={{ height: `${Math.max(count ? (count / maxDayCount) * 100 : 3, 3)}%` }}
                    />
                  </div>
                  <span className="weekday-label">{short}</span>
                </div>
              );
            })}
          </div>}
        </section>

        <section className="overview-panel today-panel">
          <div className="overview-panel-heading tasks-heading">
            <div>
              <span className="overview-kicker">Your task list</span>
              <h3>Task schedule</h3>
            </div>
            <span className="task-table-count">{visibleTasks.length} of {tasks.length}</span>
          </div>

          <div className="task-table-toolbar">
            <label className="overview-search">
              <FiSearch size={14} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search tasks..."
                aria-label="Search overview tasks"
              />
            </label>
            <label className="overview-filter">
              <FiFilter size={13} aria-hidden="true" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter overview tasks by status"
              >
                <option value="all">All tasks</option>
                {statuses.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
          </div>

          <div className="task-table-wrap">
            <table className="overview-task-table">
              <thead>
                <tr>
                  <th scope="col">Task name</th>
                  <th scope="col">Project</th>
                  <th scope="col">Due date</th>
                  <th scope="col"><span className="visually-hidden">Open task</span></th>
                </tr>
              </thead>
              <tbody>
                {!isLoaded ? (
                  <tr><td colSpan={4} className="table-empty">Loading tasks…</td></tr>
                ) : visibleTasks.map((task) => {
                  const project = getTaskProject(task);
                  return (
                    <tr key={task.id}>
                      <td>
                        <div className="task-name-cell">
                          <button
                            type="button"
                            className={`table-complete-button${task.status === "done" ? " is-complete" : ""}`}
                            onClick={() => onUpdateTaskStatus(task.id, task.status === "done" ? "todo" : "done")}
                            aria-label={task.status === "done" ? `Reopen ${task.title}` : `Complete ${task.title}`}
                          >
                            {task.status === "done" ? <FiCheckCircle size={15} /> : <FiCheck size={14} />}
                          </button>
                          <button type="button" className="table-task-title" onClick={() => onEditTask(task)}>
                            <span>{task.title}</span>
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`project-tag ${projectColor(project)}`}>
                          <span aria-hidden="true" />{project}
                        </span>
                      </td>
                      <td className="table-due-date">
                        <FiCalendar size={12} aria-hidden="true" />
                        {formatDueDate(task.date)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="table-open-button"
                          onClick={() => onEditTask(task)}
                          aria-label={`Edit ${task.title}`}
                        >
                          <FiArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {isLoaded && !visibleTasks.length && (
                  <tr>
                    <td colSpan={4} className="table-empty">
                      {tasks.length ? "No tasks match your search." : "Your upcoming tasks will show up here."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="overview-lower-panels">
        <section className="overview-panel deadline-panel">
          <div className="overview-panel-heading">
            <div>
              <span className="overview-kicker">What needs attention</span>
              <h3>Upcoming deadlines</h3>
            </div>
            <span className="task-table-count">{isLoaded ? overdueTasks.length : "—"} overdue</span>
          </div>
          <div className="overview-deadline-list">
            {!isLoaded ? <div className="overview-inline-empty">Loading deadlines…</div> : deadlines.map((task) => {
              const isPastDue = task.date < today;
              return (
                <button type="button" className="overview-deadline-row" key={task.id} onClick={() => onEditTask(task)}>
                  <span className={`deadline-date${isPastDue ? " overdue" : ""}`}>
                    <FiCalendar size={13} />
                    {isPastDue ? "Overdue" : formatDueDate(task.date)}
                  </span>
                  <span className="deadline-task-copy">
                    <strong>{task.title}</strong>
                    <small>{getTaskProject(task)}</small>
                  </span>
                  <span className={`deadline-status ${task.status}`}>{task.status === "inprogress" ? "In progress" : "To do"}</span>
                  <FiArrowUpRight className="deadline-open-icon" size={14} />
                </button>
              );
            })}
            {isLoaded && !deadlines.length && <div className="overview-inline-empty">No upcoming deadlines. Enjoy the breathing room.</div>}
          </div>
        </section>

        <section className="overview-panel project-summary-panel">
          <div className="overview-panel-heading">
            <div>
              <span className="overview-kicker">Your work, at a glance</span>
              <h3>Project pulse</h3>
            </div>
            <button type="button" className="overview-text-link" onClick={onOpenProjects}>All projects <FiArrowUpRight size={13} /></button>
          </div>
          <div className="overview-project-list">
            {projectSummaries.map((project) => (
              <button type="button" className="overview-project-row" key={project.name} onClick={() => onOpenProjects(project.name)}>
                <span className="overview-project-mark" style={{ backgroundColor: `${project.color}20`, color: project.color }}>{project.name.slice(0, 1)}</span>
                <span className="overview-project-copy">
                  <strong>{project.name}</strong>
                  <small>{project.openCount} open · {project.taskCount} total</small>
                  <span className="directory-progress-track"><span style={{ width: `${project.progress}%`, backgroundColor: project.color }} /></span>
                </span>
                {project.deadline && <span className="overview-project-deadline">{formatDueDate(project.deadline)}</span>}
                <span className="overview-project-percent">{project.progress}%</span>
              </button>
            ))}
            {!projectSummaries.length && <div className="overview-inline-empty">Create a project to organize your tasks.</div>}
          </div>
        </section>

        <section className="overview-panel overview-activity-panel">
          <div className="overview-panel-heading">
            <div>
              <span className="overview-kicker">Your recent work</span>
              <h3>Activity</h3>
            </div>
            <FiActivity className="overview-activity-icon" size={16} />
          </div>
          <div className="overview-activity-list">
            {!isLoaded ? <div className="overview-inline-empty">Loading activity…</div> : activity.length ? activity.slice(0, 4).map((event) => (
              <div className="overview-activity-row" key={event.id}>
                <span className={`activity-event-icon ${event.action === "completed" ? "done" : event.action === "deleted" ? "todo" : "inprogress"}`}><FiCheckCircle size={13} /></span>
                <span><strong>{event.title}</strong><small>{event.action} · {event.project || "Personal"}</small></span>
                <time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(event.createdAt))}</time>
              </div>
            )) : <div className="overview-inline-empty">Your recent task updates will appear here.</div>}
          </div>
        </section>
      </div>
    </section>
  );
}
