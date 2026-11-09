import type { Project, Task } from "./types";

export const PROJECTS: Project[] = [
  {
    name: "ShiftX",
    color: "#8b5cf6", // vivid violet
    description: "A thoughtful workspace for the next generation of teams.",
  },
  {
    name: "Elevate",
    color: "#06b6d4", // cyan
    description: "Create a more useful, more human mobile experience.",
  },
  {
    name: "Vortex",
    color: "#f43f5e", // rose
    description: "Bring a bold new brand story to life.",
  },
  {
    name: "Solstice",
    color: "#f59e0b", // amber
    description: "The foundation for a brighter digital product.",
  },
  {
    name: "Zenith Link",
    color: "#6366f1", // indigo
    description: "Design a connected experience from first click to launch.",
  },
];

const LEGACY_TASK_PROJECTS: Record<string, string> = {
  "Design new ui presentation": "Zenith Link",
  "Add more ui/ux mockups": "Zenith Link",
  "Design few mobile screens": "Elevate",
  "Create a tweet and promote": "Vortex",
  "Design system update": "Zenith Link",
  "Create brand guideline": "Zenith Link",
  "Create wireframe for ios app": "Elevate",
  "Create ui kit for layout": "Solstice",
  "Add product to the market": "Zenith Link",
  "Launch product promotion": "Zenith Link",
  "Make twitter banner": "Vortex",
};

export function getTaskProject(task: Pick<Task, "project" | "title">): string {
  if (task.project) return task.project;
  return LEGACY_TASK_PROJECTS[task.title] || PROJECTS[0].name;
}

export function getProjectByName(name: string): Project {
  return PROJECTS.find((project) => project.name === name) || PROJECTS[0];
}
