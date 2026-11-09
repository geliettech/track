"use client";

import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiTarget } from "react-icons/fi";
import { primaryRoutes, secondaryRoutes } from "@/config/route";

function NavigationLink({ route, pathname, collapsed, onNavigate }) {
  const Icon = route.icon;
  const active = pathname === route.href || pathname.startsWith(`${route.href}/`);

  return (
    <Link
      href={route.href}
      className={`rail-button${active ? " is-active" : ""}`}
      onClick={onNavigate}
      aria-label={route.label}
      aria-current={active ? "page" : undefined}
      title={collapsed ? route.label : undefined}
    >
      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
      {!collapsed && <span>{route.label}</span>}
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
}) {
  return (
    <aside
      className={`sidebar sidebar-rail overflow-y-auto${collapsed ? " is-collapsed" : " is-expanded"}${mobileOpen ? " mobile-open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="rail-brand-row">
        <Link href="/overview" className="rail-brand" aria-label="Track overview" onClick={onClose}>
          <FiTarget size={19} strokeWidth={2.5} aria-hidden="true" />
        </Link>
        {!collapsed && <span className="rail-brand-name">Track</span>}
        <button
          type="button"
          className="rail-collapse-button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={ariaExpanded}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      <nav className="rail-navigation" aria-label="Main navigation">
        {primaryRoutes.map((route) => (
          <NavigationLink
            key={route.id}
            route={route}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onClose}
          />
        ))}
      </nav>

      <div className="rail-spacer" />

      <div className="rail-footer">
        {!collapsed && <span className="rail-section-label">Workspace</span>}
        {secondaryRoutes.map((route) => (
          <NavigationLink
            key={route.id}
            route={route}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onClose}
          />
        ))}
        Log out
      </div>
    </aside>
  );
}
