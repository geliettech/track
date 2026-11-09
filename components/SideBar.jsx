"use client";

import {
  FiActivity,
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
  FiGrid,
  FiMessageSquare,
  FiSettings,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

const primaryNavigation = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "projects", label: "Projects", icon: FiFolder },
  { id: "messages", label: "Messages", icon: FiMessageSquare },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "activity", label: "Activity", icon: FiActivity },
  { id: "calendar", label: "Calendar", icon: FiCalendar },
];

export default function SideBar({
  activeSection,
  onNavigate,
  collapsed,
  ariaExpanded,
  onToggle,
  mobileOpen,
  onClose,
}) {
  const navigate = (section) => {
    onNavigate(section);
    onClose();
  };

  return (
    <aside
      className={`sidebar sidebar-rail${collapsed ? " is-collapsed" : " is-expanded"}${mobileOpen ? " mobile-open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="rail-brand-row">
        <button
          type="button"
          className="rail-brand"
          onClick={() => navigate("overview")}
          aria-label="Track overview"
          title="Track overview"
        >
          <FiTarget size={19} strokeWidth={2.5} aria-hidden="true" />
        </button>
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
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      <button
        type="button"
        className={`rail-workspace${activeSection === "workspace" ? " is-active" : ""}`}
        onClick={() => navigate("workspace")}
        aria-label="Personal workspace"
        aria-current={activeSection === "workspace" ? "page" : undefined}
        title="Personal workspace"
      >
        <span className="rail-workspace-icon"><FiBriefcase size={15} /></span>
        {!collapsed && (
          <span className="rail-workspace-copy">
            <small>Workspace</small>
            <strong>Personal</strong>
          </span>
        )}
        {!collapsed && <FiChevronDown className="rail-workspace-chevron" size={13} />}
      </button>

      <nav className="rail-navigation" aria-label="Workspace navigation">
        {primaryNavigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`rail-button${activeSection === id ? " is-active" : "flex items-center"}`}
            onClick={() => navigate(id)}
            aria-label={label}
            aria-current={activeSection === id ? "page" : undefined}
            title={label}
          >
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className="rail-spacer" />

      <div className="rail-footer">
        <button
          type="button"
          className={`rail-button${activeSection === "settings" ? " is-active" : ""}`}
          onClick={() => navigate("settings")}
          aria-label="Settings"
          aria-current={activeSection === "settings" ? "page" : undefined}
          title="Settings"
        >
          <FiSettings size={17} strokeWidth={1.8} aria-hidden="true" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
