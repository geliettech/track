"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiPlus,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import type { WorkspaceTier } from "@/context/types";

export default function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    openUpgradeModal,
  } = useWorkspace();
  const { notify } = useDashboardShell();

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    const created = createWorkspace(newWsName.trim(), "free");
    notify(`Created & switched to “${created.name}”`);
    setNewWsName("");
    setCreating(false);
    setOpen(false);
  };

  const tierBadge = (tier: WorkspaceTier) => {
    switch (tier) {
      case "business":
        return {
          label: "Business",
          classes: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        };
      case "pro":
        return {
          label: "Pro",
          classes: "bg-accent/15 text-accent",
        };
      case "free":
      default:
        return {
          label: "Free",
          classes: "bg-surface-muted text-muted border border-line",
        };
    }
  };

  const badgeInfo = tierBadge(activeWorkspace.tier);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Switcher Button Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-2.5 rounded-xl border border-line bg-surface-muted/50 p-2 hover:bg-surface-hover transition-colors cursor-pointer ${
          collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""
        }`}
        aria-label="Switch workspace"
        aria-expanded={open}
        title={collapsed ? `${activeWorkspace.name} (${badgeInfo.label})` : undefined}
      >
        <span
          className="grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-white shadow-xs"
          style={{ backgroundColor: activeWorkspace.avatarColor }}
        >
          {activeWorkspace.name.charAt(0)}
        </span>

        {!collapsed && (
          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center justify-between gap-1">
              <span className="truncate text-xs font-bold text-ink">
                {activeWorkspace.name}
              </span>
              <span
                className={`rounded-md px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${badgeInfo.classes}`}
              >
                {badgeInfo.label}
              </span>
            </div>
            <p className="truncate text-[10px] text-faint">
              {activeWorkspace.membersCount}{" "}
              {activeWorkspace.membersCount === 1 ? "member" : "members"}
            </p>
          </div>
        )}

        {!collapsed && <FiChevronDown size={14} className="text-muted" />}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 top-12 z-50 w-72 rounded-2xl border border-line bg-surface p-2 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-line mb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-faint">
              Your Workspaces
            </p>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto">
            {workspaces.map((ws) => {
              const isActive = ws.id === activeWorkspace.id;
              const badge = tierBadge(ws.tier);

              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setOpen(false);
                    notify(`Switched to “${ws.name}”`);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent/10 text-accent font-semibold dark:bg-accent/15"
                      : "hover:bg-surface-hover text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: ws.avatarColor }}
                    >
                      {ws.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{ws.name}</p>
                      <p className="text-[10px] text-muted">
                        {ws.role} · {ws.membersCount} member{ws.membersCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge.classes}`}
                    >
                      {badge.label}
                    </span>
                    {isActive && <FiCheck size={14} className="text-accent" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="my-1.5 border-t border-line" />

          {creating ? (
            <form onSubmit={handleCreateWorkspace} className="p-2 space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Workspace name..."
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                maxLength={40}
                className="w-full h-8 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink placeholder:text-faint focus:border-accent focus:outline-hidden"
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWsName.trim()}
                  className="px-2.5 py-1 rounded-md bg-accent text-xs font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-muted hover:text-ink hover:bg-surface-hover rounded-xl transition-colors cursor-pointer"
            >
              <FiPlus size={14} /> Create New Workspace
            </button>
          )}

          {activeWorkspace.tier === "free" && (
            <div className="mt-1.5 pt-1.5 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openUpgradeModal("Upgrade this workspace for team collaboration");
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-accent-soft text-accent hover:bg-accent/20 transition-colors text-xs font-bold cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FiZap size={13} /> Upgrade to Pro
                </span>
                <span className="text-[10px] uppercase font-bold">From $12</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
