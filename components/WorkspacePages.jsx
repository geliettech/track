"use client";

import { useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFolder,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import { getTaskProject } from "@/context/Projects";
import { useProjects } from "@/context/ProjectContext";

const teammates = [
  { initials: "JD", name: "Jordan Davis", role: "Workspace owner", color: "lavender" },
  { initials: "AM", name: "Alex Morgan", role: "Product designer", color: "peach" },
  { initials: "KC", name: "Kai Chen", role: "Frontend developer", color: "mint" },
  { initials: "RL", name: "Riley Lee", role: "Project manager", color: "blue" },
];

const startingConversations = [
  {
    id: "alex",
    name: "Alex Morgan",
    initials: "AM",
    color: "peach",
    project: "Zenith Link",
    preview: "The latest board looks great!",
    time: "10:42 AM",
    messages: [
      { from: "Alex", text: "Hey Jordan, I added a few notes to the project board." },
      { from: "You", text: "Thanks! I’ll review them this afternoon." },
      { from: "Alex", text: "The latest board looks great!" },
    ],
  },
  {
    id: "kai",
    name: "Kai Chen",
    initials: "KC",
    color: "mint",
    project: "Elevate",
    preview: "Can you take a look at the new flow?",
    time: "Yesterday",
    messages: [
      { from: "Kai", text: "I’ve pushed the new onboarding flow to review." },
      { from: "You", text: "Perfect, I’ll take a look." },
      { from: "Kai", text: "Can you take a look at the new flow?" },
    ],
  },
  {
    id: "riley",
    name: "Riley Lee",
    initials: "RL",
    color: "blue",
    project: "Vortex",
    preview: "Kickoff notes are ready to share.",
    time: "Mon",
    messages: [
      { from: "Riley", text: "I’ve gathered the kickoff notes and project links." },
      { from: "You", text: "Great, thank you." },
      { from: "Riley", text: "Kickoff notes are ready to share." },
    ],
  },
];

function getTaskDate(value) {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTaskDate(value, options = { month: "short", day: "numeric" }) {
  const date = getTaskDate(value);
  return date ? new Intl.DateTimeFormat("en-US", options).format(date) : "No due date";
}

function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="workspace-page-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function MessagesPage() {
  const [conversations, setConversations] = useState(startingConversations);
  const [selectedId, setSelectedId] = useState(startingConversations[0].id);
  const [reply, setReply] = useState("");
  const selected = conversations.find((conversation) => conversation.id === selectedId);

  const sendReply = (event) => {
    event.preventDefault();
    const text = reply.trim();
    if (!text || !selected) return;
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedId
          ? {
              ...conversation,
              preview: text,
              time: "Now",
              messages: [...conversation.messages, { from: "You", text }],
            }
          : conversation
      )
    );
    setReply("");
  };

  return (
    <section className="workspace-page">
      <PageTitle eyebrow="Team communication" title="Messages" description="Keep up with the conversations around your work." />
      <div className="messages-layout">
        <div className="conversation-list">
          <div className="conversation-list-heading"><span>Conversations</span><button type="button" aria-label="New message"><FiPlus size={15} /></button></div>
          {conversations.map((conversation) => (
            <button type="button" className={`conversation-item${selectedId === conversation.id ? " active" : ""}`} key={conversation.id} onClick={() => setSelectedId(conversation.id)}>
              <span className={`workspace-avatar ${conversation.color}`}>{conversation.initials}</span>
              <span className="conversation-copy">
                <span className="conversation-name">{conversation.name}<time>{conversation.time}</time></span>
                <span className="conversation-preview">{conversation.preview}</span>
                <span className="conversation-project"><FiFolder size={10} />{conversation.project}</span>
              </span>
            </button>
          ))}
        </div>
        {selected ? (
          <div className="conversation-thread">
            <header className="thread-heading">
              <span className={`workspace-avatar ${selected.color}`}>{selected.initials}</span>
              <span><strong>{selected.name}</strong><small>{selected.project}</small></span>
            </header>
            <div className="thread-messages">
              {selected.messages.map((message, index) => (
                <div className={`thread-message${message.from === "You" ? " own" : ""}`} key={`${selected.id}-${index}`}>
                  <span>{message.from}</span><p>{message.text}</p>
                </div>
              ))}
            </div>
            <form className="thread-reply" onSubmit={sendReply}>
              <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Message ${selected.name.split(" ")[0]}...`} aria-label="Write a message" />
              <button type="submit" disabled={!reply.trim()} aria-label="Send message"><FiSend size={15} /></button>
            </form>
          </div>
        ) : <div className="workspace-empty">Select a conversation to view messages.</div>}
      </div>
    </section>
  );
}

function UsersPage({ onNotify }) {
  return (
    <section className="workspace-page">
      <PageTitle
        eyebrow="People"
        title="Users"
        description="The people who make up your workspace."
        action={<button type="button" className="primary-button" onClick={() => onNotify("Workspace invitations are not connected yet.")}><FiPlus size={15} /> Invite user</button>}
      />
      <div className="users-summary"><FiUsers size={16} /><strong>{teammates.length} members</strong><span>in your personal workspace</span></div>
      <div className="users-grid">
        {teammates.map((user) => (
          <article className="user-card" key={user.initials}>
            <span className={`workspace-avatar user-avatar ${user.color}`}>{user.initials}</span>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
            <button type="button" className="secondary-button" onClick={() => onNotify(`${user.name} is part of your workspace.`)}>View profile <FiArrowUpRight size={13} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityPage({ tasks }) {
  const events = useMemo(() => {
    const labels = {
      todo: "is in the to do list",
      inprogress: "is in progress",
      done: "was completed",
    };
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      project: getTaskProject(task),
      status: task.status,
      label: labels[task.status] || "was updated",
      date: task.date,
    }));
  }, [tasks]);

  return (
    <section className="workspace-page">
      <PageTitle eyebrow="Workspace updates" title="Activity" description="A live snapshot of tasks across your workspace." />
      <div className="activity-feed">
        {events.length ? events.map((event) => (
          <article className="activity-item" key={event.id}>
            <span className={`activity-event-icon ${event.status}`}><FiCheckCircle size={14} /></span>
            <div className="activity-item-copy">
              <strong>{event.title}</strong>
              <p>{event.label} in <span>{event.project}</span></p>
            </div>
            <time>{event.date ? formatTaskDate(event.date, { month: "short", day: "numeric", year: "numeric" }) : "No due date"}</time>
          </article>
        )) : <div className="workspace-empty">Task updates will show here as you work.</div>}
      </div>
    </section>
  );
}

function CalendarPage({ tasks, onEditTask, onAddTask }) {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const numberOfDays = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: numberOfDays }, (_, index) => index + 1)];
  while (cells.length % 7) cells.push(null);
  const tasksByDay = new Map();
  tasks.forEach((task) => {
    const date = getTaskDate(task.date);
    if (date && date.getFullYear() === year && date.getMonth() === monthIndex) {
      tasksByDay.set(date.getDate(), [...(tasksByDay.get(date.getDate()) || []), task]);
    }
  });
  const today = new Date();

  return (
    <section className="workspace-page">
      <PageTitle
        eyebrow="Plan your time"
        title="Calendar"
        description="Your tasks, arranged by due date."
        action={<button type="button" className="primary-button" onClick={onAddTask}><FiPlus size={15} /> Add task</button>}
      />
      <div className="calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-month-label">
            <button type="button" className="calendar-nav-button" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))} aria-label="Previous month"><FiChevronLeft size={16} /></button>
            <h4>{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month)}</h4>
            <button type="button" className="calendar-nav-button" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))} aria-label="Next month"><FiChevronRight size={16} /></button>
          </div>
          <button type="button" className="quiet-button" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
          {cells.map((day, index) => (
            <div className={`calendar-cell${day && day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear() ? " is-today" : ""}`} key={`${day || "empty"}-${index}`}>
              {day && <><span className="calendar-day-number">{day}</span><div className="calendar-day-tasks">
                {(tasksByDay.get(day) || []).slice(0, 3).map((task) => (
                  <button type="button" className={`calendar-task ${task.status}`} key={task.id} onClick={() => onEditTask(task)} title={task.title}>{task.title}</button>
                ))}
                {(tasksByDay.get(day) || []).length > 3 && <span className="calendar-more">+{tasksByDay.get(day).length - 3} more</span>}
              </div></>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotificationsPage({ tasks }) {
  const notifications = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return tasks
      .filter((task) => task.status !== "done" && task.date)
      .map((task) => ({ task, date: getTaskDate(task.date) }))
      .filter(({ date }) => date)
      .map(({ task, date }) => ({
        id: task.id,
        title: task.title,
        project: getTaskProject(task),
        date,
        overdue: /^\d{4}-\d{2}-\d{2}$/.test(task.date) && task.date < today,
      }))
      .sort((left, right) => left.date - right.date);
  }, [tasks]);

  return (
    <section className="workspace-page">
      <PageTitle eyebrow="Stay in the loop" title="Notifications" description="Due dates and task reminders that need your attention." />
      <div className="notification-feed">
        {notifications.length ? notifications.map((notification) => (
          <article className="notification-item" key={notification.id}>
            <span className={`notification-event-icon${notification.overdue ? " overdue" : ""}`}><FiBell size={14} /></span>
            <div><strong>{notification.overdue ? "Task is overdue" : "Upcoming task due"}</strong><p>{notification.title} <span>· {notification.project}</span></p></div>
            <time>{formatTaskDate(notification.date, { month: "short", day: "numeric", year: "numeric" })}</time>
          </article>
        )) : (
          <div className="notification-empty">
            <span><FiCheck size={18} /></span>
            <strong>You&apos;re all caught up</strong>
            <p>New task reminders will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkspacePage({ projectCount }) {
  return (
    <section className="workspace-page">
      <PageTitle eyebrow="Workspace" title="Personal workspace" description="A home for your projects, conversations, and team." />
      <div className="workspace-settings-grid">
        <article className="workspace-settings-card">
          <span className="workspace-settings-icon"><FiBriefcase size={17} /></span>
          <div><strong>Workspace details</strong><p>Personal workspace</p><small>Private · Only you and invited teammates can access this space.</small></div>
          <button type="button" className="quiet-button">Edit</button>
        </article>
        <article className="workspace-settings-card">
          <span className="workspace-settings-icon"><FiUsers size={17} /></span>
          <div><strong>Members</strong><p>{teammates.length} workspace members</p><small>Manage the people who collaborate on your projects.</small></div>
          <span className="workspace-settings-avatars">{teammates.slice(0, 3).map((user) => <span className={`workspace-avatar ${user.color}`} key={user.initials}>{user.initials}</span>)}</span>
        </article>
        <article className="workspace-settings-card">
          <span className="workspace-settings-icon"><FiFolder size={17} /></span>
          <div><strong>Projects</strong><p>Your project spaces</p><small>Keep tasks, plans, and updates organized by project.</small></div>
          <span>{projectCount} projects</span>
        </article>
      </div>
    </section>
  );
}

export default function WorkspacePages({ section, tasks, onNotify, onEditTask, onAddTask }) {
  const { projects } = useProjects();
  if (section === "messages") return <MessagesPage />;
  if (section === "users") return <UsersPage onNotify={onNotify} />;
  if (section === "activity") return <ActivityPage tasks={tasks} />;
  if (section === "calendar") return <CalendarPage tasks={tasks} onEditTask={onEditTask} onAddTask={onAddTask} />;
  if (section === "notifications") return <NotificationsPage tasks={tasks} />;
  if (section === "workspace") return <WorkspacePage projectCount={projects.length} />;
  return null;
}
