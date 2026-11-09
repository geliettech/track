"use client";

import { FiCheck, FiMoon, FiSun, FiTarget } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const tasks = [
  { title: "Plan the next sprint", label: "Today", done: true },
  { title: "Review project updates", label: "10:30 AM", done: false },
  { title: "Share the launch brief", label: "Tomorrow", done: false },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="About Track">
        <a className="auth-brand" href="/overview" aria-label="Track home">
          <span className="auth-brand-mark" aria-hidden="true"><FiTarget /></span>
          <span>track</span>
        </a>

        <div className="auth-story-copy">
          <span className="auth-story-kicker"><span /> YOUR WORK, IN FOCUS</span>
          <h2>Make progress<br />feel <em>simple.</em></h2>
          <p>One calm place to plan projects, keep your team in sync, and do your best work.</p>

          <div className="auth-preview" aria-label="A preview of a Track task list">
            <div className="auth-preview-top">
              <div><span className="auth-preview-dot" /><span>My day</span></div>
              <span>3 tasks</span>
            </div>
            <div className="auth-preview-progress"><span /></div>
            <div className="auth-preview-tasks">
              {tasks.map((task) => (
                <div className={`auth-preview-task${task.done ? " is-done" : ""}`} key={task.title}>
                  <span className="auth-preview-check">{task.done && <FiCheck aria-hidden="true" />}</span>
                  <span>{task.title}</span>
                  <small>{task.label}</small>
                </div>
              ))}
            </div>
            <div className="auth-preview-foot"><span>✦</span> A little progress adds up.</div>
          </div>
        </div>

        <p className="auth-story-foot">Thoughtful tools for the work that matters.</p>
        <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
        <div className="auth-orbit auth-orbit-two" aria-hidden="true" />
      </section>

      <section className="auth-main">
        <div className="auth-main-top">
          <a className="auth-mobile-brand" href="/overview" aria-label="Track home">
            <span className="auth-brand-mark" aria-hidden="true"><FiCheck /></span>
            <span>track</span>
          </a>
          <button
            type="button"
            className="auth-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
          </button>
        </div>
        <div className="auth-main-content">{children}</div>
        <p className="auth-main-foot">© {new Date().getFullYear()} Track <span>·</span> Work, in focus.</p>
      </section>
    </main>
  );
}
