"use client";

import { FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, setLight, setDark } = useTheme();

  return (
    <section className="space-y-6 p-6" aria-label="Settings">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Make Track yours</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Settings</h1>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"><FiUser size={17} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Your account</p>
            <h2 className="text-xl font-semibold text-slate-900">Profile settings</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">JD</span>
          <div>
            <p className="font-semibold text-slate-900">Jordan Davis</p>
            <p className="text-sm text-slate-500">Workspace owner</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600"><FiSun size={17} /></span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Preferences</p>
            <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
          </div>
        </div>

        <div className="flex gap-3" role="group" aria-label="Color theme">
          <button type="button" className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium ${theme === "light" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"}`} onClick={setLight}>
            <FiSun size={16} /> Light
          </button>
          <button type="button" className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium ${theme === "dark" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"}`} onClick={setDark}>
            <FiMoon size={16} /> Dark
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-500">Your preferences are saved in this browser.</p>
      </div>
    </section>
  );
}
