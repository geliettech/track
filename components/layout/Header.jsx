"use client";

import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { getTaskProject } from "@/context/Projects";

function getReminderDate(value) {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatReminderDate(date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export default function Header({ tasks = [], onAddTask, search, onSearchChange, onMenuClick, onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const reminders = tasks
    .filter((task) => task.status !== "done" && task.date)
    .map((task) => ({ task, date: getReminderDate(task.date) }))
    .filter(({ date }) => date)
    .sort((left, right) => left.date - right.date);
  const reminderCount = reminders.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <header className="topbar flex-wrap px-1">
      <div className="greeting">
        <h1>{greeting}, Jordan <span aria-hidden="true">✦</span></h1>
        <p>{date} <span aria-hidden="true">·</span> Let&apos;s make today count.</p>
      </div>

      <div className="header-actions flex-wrap">
        <button
          type="button"
          className="icon-button mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <FiMenu size={18} />
        </button>
        <label className="search-wrap">
          <FiSearch size={16} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />
          <span className="search-shortcut" aria-hidden="true" />
        </label>

        <div className="notification-wrap">
          <button
            type="button"
            className="icon-button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <FiBell size={17} />
            {reminderCount > 0 && <span className="notification-dot" />}
          </button>
          {notificationsOpen && (
            <div className="popover notification-popover">
              <div className="notification-popover-heading">
                <div>
                  <h4>Notifications</h4>
                  <p>{reminderCount ? `${reminderCount} task reminder${reminderCount === 1 ? "" : "s"}` : "You’re all caught up"}</p>
                </div>
                <span className="notification-count">{reminderCount}</span>
              </div>
              {reminderCount ? (
                <div className="notification-list">
                  {reminders.slice(0, 4).map(({ task, date }) => {
                    const overdue = date < today;
                    return (
                      <button
                        type="button"
                        className="notification-entry"
                        key={task.id}
                        onClick={() => { setNotificationsOpen(false); onNavigate("notifications"); }}
                      >
                        <span className={`notification-entry-icon${overdue ? " overdue" : ""}`}><FiClock size={14} /></span>
                        <span className="notification-entry-copy">
                          <strong>{task.title}</strong>
                          <small>{overdue ? "Overdue" : "Due"} {formatReminderDate(date)} · {getTaskProject(task)}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="notification-empty-copy">Task reminders will show up here when a due date is coming up.</p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? <FiMoon size={17} /> : <FiSun size={17} />}
        </button>

        <div className="profile-menu-wrap">
          <button
            type="button"
            className="icon-button profile-trigger"
            onClick={() => setProfileOpen((open) => !open)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <span className="avatar" aria-hidden="true">JD</span>
            <FiChevronDown size={13} />
          </button>
          {profileOpen && (
            <div className="popover">
              <h4>Jordan Davis</h4>
              <p>Personal workspace</p>
              <button type="button" onClick={() => { setProfileOpen(false); onNavigate("settings"); }}>
                Profile settings
              </button>
              <button type="button" onClick={() => { setProfileOpen(false); onNavigate("workspace"); }}>
                Manage workspace
              </button>
            </div>
          )}
        </div>

        <button type="button" className="primary-button" onClick={onAddTask}>
          <FiPlus size={16} aria-hidden="true" />
          <span>Add task</span>
        </button>
      </div>
    </header>
  );
}
