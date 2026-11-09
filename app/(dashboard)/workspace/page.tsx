"use client";

import Link from "next/link";
import {
  FiBriefcase,
  FiCheckCircle,
  FiFolder,
  FiList,
  FiSettings,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";

const teammates = [
  { initials: "JD", name: "Jordan Davis", role: "Workspace Owner", email: "jordan@track.app", status: "Active" },
  { initials: "AM", name: "Alex Morgan", role: "Lead Product Designer", email: "alex@track.app", status: "Active" },
  { initials: "KC", name: "Kai Chen", role: "Senior Frontend Engineer", email: "kai@track.app", status: "Active" },
  { initials: "RL", name: "Riley Lee", role: "Product Manager", email: "riley@track.app", status: "Active" },
];

export default function WorkspacePage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const completedCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
            <FiBriefcase size={18} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Workspace Hub
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted">
          Overview of your team members, workspace capacity, and shared resources.
        </p>
      </div>

      {/* Plan & Usage Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Workspace Plan</span>
            <span className="grid size-7 place-items-center rounded-lg bg-accent/15 text-accent">
              <FiShield size={14} />
            </span>
          </div>
          <p className="font-display text-xl font-bold text-ink">Track Pro</p>
          <p className="text-xs text-muted mt-1">Unlimited tasks & projects</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Active Team Members</span>
            <span className="grid size-7 place-items-center rounded-lg bg-surface-muted text-ink">
              <FiUsers size={14} />
            </span>
          </div>
          <p className="font-display text-xl font-bold text-ink">{teammates.length}</p>
          <p className="text-xs text-muted mt-1">4 of 10 seats utilized</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Total Projects</span>
            <span className="grid size-7 place-items-center rounded-lg bg-surface-muted text-ink">
              <FiFolder size={14} />
            </span>
          </div>
          <p className="font-display text-xl font-bold text-ink">{projects.length}</p>
          <p className="text-xs text-muted mt-1">{tasks.length} total tasks tracked</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <h2 className="font-display text-sm font-bold text-ink">Workspace Team</h2>
            <p className="text-xs text-muted">People with access to this workspace</p>
          </div>
          <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
            {teammates.length} members
          </span>
        </div>

        <div className="mt-4 divide-y divide-line/60">
          {teammates.map((member) => (
            <div
              key={member.email}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-accent text-xs font-bold text-white shadow-xs">
                  {member.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">{member.name}</p>
                  <p className="text-[11px] text-muted">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted font-medium hidden sm:inline">
                  {member.role}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="size-1 rounded-full bg-emerald-500" />
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
