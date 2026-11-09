"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
  FiLogOut,
  FiPlus,
  FiTarget,
  FiZap,
} from "react-icons/fi";
import { primaryRoutes, secondaryRoutes } from "@/config/route";
import type { DashboardRoute } from "@/config/route";
import { useProjects } from "@/context/ProjectContext";
import { useTasks } from "@/context/TaskContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import WorkspaceSwitcher from "@/components/layout/WorkspaceSwitcher";
import ConfirmDialog from "@/components/ConfirmDialog";

type NavigationLinkProps = {
  route: DashboardRoute;
  pathname: string;
  collapsed: boolean;
  badge?: number;
  onNavigate: () => void;
};

function NavigationLink({
  route,
  pathname,
  collapsed,
  badge,
  onNavigate,
}: NavigationLinkProps) {
  const Icon = route.icon;
  const active =
    pathname === route.href ||
    (route.href !== "/overview" && pathname.startsWith(`${route.href}/`));

  return (
    <Link
      href={route.href}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
        active
          ? "bg-accent/10 text-accent font-semibold dark:bg-accent/15"
          : "text-muted hover:bg-surface-hover hover:text-ink"
      } ${collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""}`}
      onClick={onNavigate}
      aria-label={route.label}
      aria-current={active ? "page" : undefined}
      title={collapsed ? route.label : undefined}
    >
      <Icon
        size={17}
        strokeWidth={2}
        className={active ? "text-accent" : "text-faint group-hover:text-ink"}
        aria-hidden="true"
      />
      {!collapsed && <span className="flex-1 truncate">{route.label}</span>}
      {!collapsed && typeof badge === "number" && badge > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active
              ? "bg-accent text-white"
              : "bg-surface-hover text-muted group-hover:text-ink"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
  pathname,
  collapsed,
  ariaExpanded,
  onToggle,
  mobileOpen,
  onClose,
}: {
  pathname: string;
  collapsed: boolean;
  ariaExpanded: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { activeWorkspace, openUpgradeModal } = useWorkspace();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const openTasksCount = tasks.filter((t) => t.status !== "done").length;

  const handleSignOut = () => {
    window.location.href = "/sign-out";
  };

  return (
    <>
      <aside
        className={`fixed md:sticky top-0 z-40 flex h-screen flex-col border-r border-line bg-surface transition-all duration-300 ease-in-out ${
          collapsed ? "w-18" : "w-64"
        } ${
          mobileOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Main navigation"
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-3.5 border-b border-line/60">
          <Link
            href="/overview"
            className="flex items-center gap-2.5 group"
            aria-label="Track dashboard"
            onClick={onClose}
          >
            <div className="grid size-9 place-items-center rounded-xl bg-accent text-white shadow-xs group-hover:bg-accent-hover transition-colors">
              <FiTarget size={19} strokeWidth={2.5} aria-hidden="true" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display text-base font-bold tracking-tight text-ink">
                  Track
                </span>
                <span className="text-[10px] text-faint font-medium">
                  Workspace OS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className="hidden md:grid size-7 place-items-center rounded-lg text-faint hover:bg-surface-hover hover:text-ink transition-colors cursor-pointer"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={ariaExpanded}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FiChevronRight size={15} />
            ) : (
              <FiChevronLeft size={15} />
            )}
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="p-3 border-b border-line/50">
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          <nav className="space-y-1" aria-label="Primary navigation">
            {primaryRoutes.map((route) => (
              <NavigationLink
                key={route.id}
                route={route}
                pathname={pathname}
                collapsed={collapsed}
                badge={route.id === "tasks" ? openTasksCount : undefined}
                onNavigate={onClose}
              />
            ))}
          </nav>

          {/* Upgrade Banner for Free Tier */}
          {!collapsed && activeWorkspace.tier === "free" && (
            <div className="rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 to-accent/5 p-3 text-left shadow-xs">
              <div className="flex items-center gap-1.5 text-accent font-bold text-xs mb-1">
                <FiZap size={14} />
                <span>Upgrade to Pro</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed mb-2.5">
                Manage tasks free forever. Upgrade for team chat, collaboration
                & business reports.
              </p>
              <button
                type="button"
                onClick={() => openUpgradeModal("Free workspace sidebar")}
                className="w-full h-7 rounded-lg bg-accent text-[11px] font-semibold text-white shadow-xs hover:bg-accent-hover transition-colors cursor-pointer"
              >
                Explore Plans
              </button>
            </div>
          )}
        </div>

        {/* Footer Nav & Sign Out */}
        <div className="p-3  space-y-1">
          {secondaryRoutes.map((route) => (
            <NavigationLink
              key={route.id}
              route={route}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onClose}
            />
          ))}
          {!collapsed && (
            <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-line bg-surface-muted/60 p-2">
              <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-[11px] font-bold text-white">
                JD
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-ink">
                  Jordan Davis
                </p>
                <p className="truncate text-[10px] text-muted">
                  {activeWorkspace.name} · {activeWorkspace.role}
                </p>
              </div>
            </div>
          )}
          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => setConfirmSignOut(true)}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors w-full cursor-pointer ${
              collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""
            }`}
            aria-label="Sign out"
            title={collapsed ? "Sign out" : undefined}
          >
            <FiLogOut
              size={16}
              className="text-red-500 shrink-0"
              aria-hidden="true"
            />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Dialog */}
      {confirmSignOut && (
        <ConfirmDialog
          title="Sign out of Track?"
          description="You will be signed out of your current session. All your local workspace data remains safely preserved in this browser."
          confirmLabel="Sign out"
          tone="danger"
          onCancel={() => setConfirmSignOut(false)}
          onConfirm={handleSignOut}
        />
      )}
    </>
  );
}
