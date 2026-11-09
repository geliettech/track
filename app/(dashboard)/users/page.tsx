"use client";

import { FiUserCheck, FiUsers } from "react-icons/fi";

const teamMembers = [
  { initials: "JD", name: "Jordan Davis", role: "Workspace Owner", email: "jordan@track.app", project: "Zenith Link" },
  { initials: "AM", name: "Alex Morgan", role: "Product Designer", email: "alex@track.app", project: "Zenith Link" },
  { initials: "KC", name: "Kai Chen", role: "Frontend Developer", email: "kai@track.app", project: "Elevate" },
  { initials: "RL", name: "Riley Lee", role: "Project Manager", email: "riley@track.app", project: "Vortex" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
            <FiUsers size={18} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Workspace Members
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted">
          View all collaborators and assignees across your projects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((user) => (
          <div
            key={user.email}
            className="rounded-2xl border border-line bg-surface p-5 shadow-xs flex flex-col items-center text-center space-y-3"
          >
            <div className="grid size-14 place-items-center rounded-2xl bg-accent text-lg font-bold text-white shadow-xs">
              {user.initials}
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-ink">{user.name}</h3>
              <p className="text-xs text-muted mt-0.5">{user.role}</p>
              <p className="text-[11px] text-faint mt-0.5">{user.email}</p>
            </div>
            <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted">
              {user.project}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
