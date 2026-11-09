export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskAction = "created" | "updated" | "moved" | "completed" | "reopened" | "deleted";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
  project: string;
  progress: number;
  assignees: string[];
  has3D?: boolean;
};

export type TaskInput = Omit<Task, "id" | "progress" | "assignees" | "has3D">;
export type TaskUpdate = Partial<Omit<Task, "id" | "progress" | "assignees" | "has3D">>;

export type ActivityEvent = {
  id: string;
  action: TaskAction;
  title: string;
  project: string;
  createdAt: string;
};

export type Project = {
  name: string;
  color: string;
  description: string;
  deadline?: string;
};

export type ProjectUpdate = {
  name: string;
  description: string;
  deadline: string;
  color?: string;
};

export type WorkspaceTier = "free" | "pro" | "business";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  tier: WorkspaceTier;
  role: string;
  avatarColor: string;
  membersCount: number;
  description?: string;
};
