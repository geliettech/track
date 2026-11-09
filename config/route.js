import {
  FiActivity,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCheckSquare,
  FiFolder,
  FiGrid,
  FiMessageSquare,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

export const primaryRoutes = [
  { id: "overview", href: "/overview", label: "Overview", icon: FiGrid },
  { id: "projects", href: "/projects", label: "Projects", icon: FiFolder },
  { id: "activity", href: "/activity", label: "Activity", icon: FiActivity },
  { id: "calendar", href: "/calendar", label: "Calendar", icon: FiCalendar },
  { id: "messages", href: "/messages", label: "Messages", icon: FiMessageSquare },
  { id: "users", href: "/users", label: "users", icon: FiUsers },
];

export const secondaryRoutes = [
  { id: "workspace", href: "/workspace", label: "Workspace", icon: FiBriefcase },
  { id: "settings", href: "/settings", label: "Settings", icon: FiSettings },
];

const dashboardRoutes = [...primaryRoutes, ...secondaryRoutes];

export const routeById = Object.fromEntries(dashboardRoutes.map((route) => [route.id, route]));

export function getDashboardPageTitle(pathname) {
  const normalizedPath = pathname?.replace(/\/+$/, "") || "/";
  return dashboardRoutes.find(({ href }) =>
    normalizedPath === href || normalizedPath.startsWith(`${href}/`)
  )?.label ?? "Dashboard";
}
