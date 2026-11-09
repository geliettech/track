export const PROJECTS = [
  {
    name: "ShiftX",
    color: "#b783f6",
    description: "A thoughtful workspace for the next generation of teams.",
  },
  {
    name: "Elevate",
    color: "#62b8d2",
    description: "Create a more useful, more human mobile experience.",
  },
  {
    name: "Vortex",
    color: "#ed8d92",
    description: "Bring a bold new brand story to life.",
  },
  {
    name: "Solstice",
    color: "#e5b755",
    description: "The foundation for a brighter digital product.",
  },
  {
    name: "Zenith Link",
    color: "#8f83ff",
    description: "Design a connected experience from first click to launch.",
  },
];

const LEGACY_TASK_PROJECTS = {
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

export function getTaskProject(task) {
  if (task.project) return task.project;
  return LEGACY_TASK_PROJECTS[task.title] || PROJECTS[0].name;
}

export function getProjectByName(name) {
  return PROJECTS.find((project) => project.name === name) || PROJECTS[0];
}
