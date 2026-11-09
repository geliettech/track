import { v4 as uuidv4 } from "uuid";
import type { Task } from "./types";

function dateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const InitialTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Design new ui presentation",
    project: "Zenith Link",
    description: "Dribbble marketing",
    status: "todo",
    progress: 7,
    priority: "high",
    date: dateOffset(1),
    assignees: [
      "https://i.pravatar.cc/150?u=a",
      "https://i.pravatar.cc/150?u=b",
    ],
  },
  {
    id: uuidv4(),
    title: "Add more ui/ux mockups",
    project: "Zenith Link",
    description: "Pinterest promotion",
    status: "todo",
    progress: 4,
    priority: "medium",
    date: dateOffset(2),
    assignees: ["https://i.pravatar.cc/150?u=c"],
    has3D: true,
  },
  {
    id: uuidv4(),
    title: "Design few mobile screens",
    project: "Elevate",
    description: "Dropbox mobile app",
    status: "todo",
    progress: 3,
    priority: "medium",
    date: dateOffset(3),
    assignees: [
      "https://i.pravatar.cc/150?u=d",
      "https://i.pravatar.cc/150?u=e",
    ],
  },
  {
    id: uuidv4(),
    title: "Create a tweet and promote",
    project: "Vortex",
    description: "Twitter marketing",
    status: "todo",
    progress: 1,
    priority: "low",
    date: dateOffset(5),
    assignees: [
      "https://i.pravatar.cc/150?u=f",
      "https://i.pravatar.cc/150?u=g",
    ],
  },
  {
    id: uuidv4(),
    title: "Design system update",
    project: "Zenith Link",
    description: "Oreo website project",
    status: "inprogress",
    progress: 3,
    priority: "high",
    date: dateOffset(2),
    assignees: [
      "https://i.pravatar.cc/150?u=h",
      "https://i.pravatar.cc/150?u=i",
    ],
  },
  {
    id: uuidv4(),
    title: "Create brand guideline",
    project: "Zenith Link",
    description: "Oreo branding project",
    status: "inprogress",
    progress: 7,
    priority: "medium",
    date: dateOffset(4),
    assignees: [
      "https://i.pravatar.cc/150?u=j",
      "https://i.pravatar.cc/150?u=k",
    ],
  },
  {
    id: uuidv4(),
    title: "Create wireframe for ios app",
    project: "Elevate",
    description: "Oreo ios app project",
    status: "inprogress",
    progress: 4,
    priority: "medium",
    date: dateOffset(6),
    assignees: [
      "https://i.pravatar.cc/150?u=l",
      "https://i.pravatar.cc/150?u=m",
    ],
  },
  {
    id: uuidv4(),
    title: "Create ui kit for layout",
    project: "Solstice",
    description: "Crypto mobile app",
    status: "inprogress",
    progress: 3,
    priority: "low",
    date: dateOffset(7),
    assignees: [
      "https://i.pravatar.cc/150?u=n",
      "https://i.pravatar.cc/150?u=o",
    ],
  },
  {
    id: uuidv4(),
    title: "Add product to the market",
    project: "Zenith Link",
    description: "Ulll marketplace",
    status: "done",
    progress: 10,
    priority: "high",
    date: dateOffset(-2),
    assignees: ["https://i.pravatar.cc/150?u=p"],
  },
  {
    id: uuidv4(),
    title: "Launch product promotion",
    project: "Zenith Link",
    description: "Kickstarter campaign",
    status: "done",
    progress: 10,
    priority: "medium",
    date: dateOffset(-5),
    assignees: [
      "https://i.pravatar.cc/150?u=q",
      "https://i.pravatar.cc/150?u=r",
    ],
  },
  {
    id: uuidv4(),
    title: "Make twitter banner",
    project: "Vortex",
    description: "Twitter marketing",
    status: "done",
    progress: 10,
    priority: "low",
    date: dateOffset(-7),
    assignees: [
      "https://i.pravatar.cc/150?u=s",
      "https://i.pravatar.cc/150?u=t",
    ],
  },
];

export default InitialTasks;
