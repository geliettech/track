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
import type { IconType } from "react-icons";

export type DashboardRouteId =
  | "overview"
  | "tasks"
  | "projects"
  | "calendar"
  | "activity"
  | "workspace"
  | "settings"
  | "notifications"
  | "messages"
  | "users";

export type DashboardRoute = {
  id: DashboardRouteId;
  href: string;
  label: string;
  icon: IconType;
};

export const primaryRoutes: DashboardRoute[] = [
  { id: "overview", href: "/overview", label: "Overview", icon: FiGrid },
  { id: "tasks", href: "/tasks", label: "My tasks", icon: FiCheckSquare },
  { id: "projects", href: "/projects", label: "Projects", icon: FiFolder },
  { id: "calendar", href: "/calendar", label: "Calendar", icon: FiCalendar },
  { id: "activity", href: "/activity", label: "Activity", icon: FiActivity },
];

export const secondaryRoutes: DashboardRoute[] = [
  { id: "settings", href: "/settings", label: "Settings", icon: FiSettings },
];

const dashboardRoutes: DashboardRoute[] = [...primaryRoutes, ...secondaryRoutes];

export const routeById = Object.fromEntries(dashboardRoutes.map((route) => [route.id, route])) as Partial<
  Record<DashboardRouteId, DashboardRoute>
>;

export function getDashboardPageTitle(pathname?: string) {
  const normalizedPath = pathname?.replace(/\/+$/, "") || "/";
  return dashboardRoutes.find(({ href }) =>
    normalizedPath === href || normalizedPath.startsWith(`${href}/`)
  )?.label ?? "Dashboard";
}
