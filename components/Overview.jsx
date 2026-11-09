"use client";

import { useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiList,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

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

const metricDecoration = {
  active: [15, 23, 18, 30, 25, 38, 48, 41, 58, 68],
  completed: [22, 30, 27, 38, 34, 50, 45, 59, 67, 82],
  priority: [56, 42, 63, 49, 37, 46, 28, 38, 22, 18],
  total: [24, 35, 29, 42, 37, 48, 59, 53, 70, 82],
};

function parseDate(value) {
  if (!value) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDueDate(value) {
  const date = parseDate(value);
  return date
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
    : "No due date";
}

function Sparkline({ values, tone }) {
  const points = values.map((value, index) => `${index * 10},${40 - value * 0.38}`).join(" ");
  const area = `0,42 ${points} 90,42`;
  return (
    <svg className={`metric-sparkline ${tone}`} viewBox="0 0 90 44" aria-hidden="true">
      <polygon points={area} className="sparkline-fill" />
      <polyline points={points} className="sparkline-line" />
    </svg>
  );
}

function MetricCard({ label, value, note, values, tone, icon: Icon }) {
  return (
    <article className={`overview-metric ${tone}`}>
      <div className="overview-metric-copy">
        <span className="overview-metric-label">{label}</span>
        <strong>{value}</strong>
        <span className="overview-metric-note">{note}</span>
      </div>
      <div className="overview-metric-visual">
        <span className="overview-metric-icon"><Icon size={15} aria-hidden="true" /></span>
        <Sparkline values={values} tone={tone} />
      </div>
    </article>
  );
}

function getTaskProject(task) {
  return task.project || task.description || "Personal";
}

function projectColor(project) {
  let seed = 0;
  for (let index = 0; index < project.length; index += 1) {
    seed = (seed + project.charCodeAt(index)) % 4;
  }
  return ["blue", "green", "pink", "amber"][seed];
}

export default function Overview({ tasks, search, onSearchChange, onEditTask }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const statusCounts = useMemo(
    () => Object.fromEntries(statuses.map(({ id }) => [id, tasks.filter((task) => task.status === id).length])),
    [tasks]
  );
  const highPriorityCount = tasks.filter((task) => task.priority === "high").length;
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

  const metrics = [
    {
      label: "In progress",
      value: statusCounts.inprogress,
      note: "Tasks underway",
      values: metricDecoration.active,
      tone: "mint",
      icon: FiTrendingUp,
    },
    {
      label: "Completed tasks",
      value: statusCounts.done,
      note: "Nicely done",
      values: metricDecoration.completed,
      tone: "blue",
      icon: FiCheckCircle,
    },
    {
      label: "High priority",
      value: highPriorityCount,
      note: "Need your attention",
      values: metricDecoration.priority,
      tone: "orange",
      icon: FiClock,
    },
    {
      label: "Total tasks",
      value: tasks.length,
      note: "Across your workspace",
      values: metricDecoration.total,
      tone: "coral",
      icon: FiList,
    },
  ];

  return (
    <section className="overview-grid" aria-label="Workspace overview">
      <div className="overview-metrics">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

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
            <strong>{tasks.length}</strong>
            <span>tasks across all due dates</span>
          </div>
          <div className="weekday-chart" role="img" aria-label="Number of tasks due on each weekday">
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
          </div>
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
                {visibleTasks.map((task) => {
                  const project = getTaskProject(task);
                  return (
                    <tr key={task.id}>
                      <td>
                        <button type="button" className="table-task-title" onClick={() => onEditTask(task)}>
                          <span className={`table-status ${task.status}`} aria-hidden="true" />
                          <span>{task.title}</span>
                        </button>
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
                {!visibleTasks.length && (
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
    </section>
  );
}
