"use client";

import Link from "next/link";
import {
  FiBriefcase,
  FiCheckCircle,
  FiFolder,
  FiPlus,
  FiShield,
  FiUserPlus,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";
import { useWorkspace } from "@/context/WorkspaceContext";

const sampleTeammates = [
  { initials: "JD", name: "Jordan Davis", role: "Workspace Owner", email: "jordan@track.app", status: "Active" },
  { initials: "AM", name: "Alex Morgan", role: "Lead Product Designer", email: "alex@track.app", status: "Active" },
  { initials: "KC", name: "Kai Chen", role: "Senior Frontend Engineer", email: "kai@track.app", status: "Active" },
  { initials: "RL", name: "Riley Lee", role: "Product Manager", email: "riley@track.app", status: "Active" },
];

export default function WorkspacePage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { activeWorkspace, canAccessFeature, openUpgradeModal } = useWorkspace();

  const isTeamAllowed = canAccessFeature("team_collaboration");

  const visibleMembers = isTeamAllowed
    ? sampleTeammates
    : sampleTeammates.slice(0, 1); // Free plan is 1 seat

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
              <FiBriefcase size={18} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              {activeWorkspace.name}
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted">
            {activeWorkspace.description || "Manage workspace members, collaboration limits, and team seats."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeWorkspace.tier === "free" ? (
            <button
              type="button"
              onClick={() => openUpgradeModal("Team member invitation")}
              className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent px-4 text-xs font-bold text-white shadow-xs hover:bg-accent-hover transition-colors"
            >
              <FiZap size={14} /> Upgrade to Pro
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openUpgradeModal("Manage workspace tier")}
              className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
            >
              <FiShield size={14} /> Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Plan & Capacity Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Plan Tier</span>
            <span className="grid size-7 place-items-center rounded-lg bg-accent/15 text-accent">
              <FiShield size={14} />
            </span>
          </div>
          <p className="font-display text-xl font-bold text-ink capitalize">
            {activeWorkspace.tier === "free" ? "Free Starter" : `${activeWorkspace.tier} Plan`}
          </p>
          <p className="text-xs text-muted mt-1">
            {activeWorkspace.tier === "free"
              ? "Free task management forever"
              : "Advanced collaboration unlocked"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Team Members</span>
            <span className="grid size-7 place-items-center rounded-lg bg-surface-muted text-ink">
              <FiUsers size={14} />
            </span>
          </div>
          <p className="font-display text-xl font-bold text-ink">
            {visibleMembers.length}{" "}
            <span className="text-xs font-normal text-muted">
              / {activeWorkspace.tier === "free" ? "1 seat" : "unlimited"}
            </span>
          </p>
          <p className="text-xs text-muted mt-1">
            {activeWorkspace.tier === "free"
              ? "Upgrade to add collaborators"
              : "Active collaborative seats"}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Workspace Projects</span>
            <span className="grid size-7 place-items-center rounded-lg bg-surface-muted text-ink">
              <FiFolder size={14} />
            </span>
          </div>
          <p className="font-display text-xl font-bold text-ink">{projects.length}</p>
          <p className="text-xs text-muted mt-1">{tasks.length} total tasks organized</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <h2 className="font-display text-sm font-bold text-ink">Workspace Collaborators</h2>
            <p className="text-xs text-muted">
              {activeWorkspace.tier === "free"
                ? "Upgrade to Pro to invite team members and assign shared tasks."
                : "People with access to manage tasks and projects in this workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openUpgradeModal("Invite team members")}
            className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
          >
            <FiUserPlus size={13} /> Invite Member
          </button>
        </div>

        <div className="mt-4 divide-y divide-line/60">
          {visibleMembers.map((member) => (
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

        {activeWorkspace.tier === "free" && (
          <div className="mt-4 pt-4 border-t border-line/60 text-center py-4 bg-surface-muted/40 rounded-xl">
            <FiUsers size={22} className="mx-auto text-faint mb-1.5" />
            <p className="text-xs font-semibold text-ink">Collaborate with your team</p>
            <p className="text-[11px] text-muted mt-0.5 mb-3 max-w-sm mx-auto">
              Add designers, engineers, and project managers to your workspace with role-based permissions.
            </p>
            <button
              type="button"
              onClick={() => openUpgradeModal("Invite team members")}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors"
            >
              <FiZap size={13} /> Unlock Team Collaboration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
