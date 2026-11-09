"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import InitialTasks from "./DefaultTasks";
import type { ActivityEvent, Task, TaskAction, TaskInput, TaskStatus, TaskUpdate } from "./types";

type TaskContextValue = {
  tasks: Task[];
  activity: ActivityEvent[];
  isLoaded: boolean;
  storageError: string;
  addTask: (title: string, status?: TaskStatus, project?: string) => Task;
  createTask: (taskData: TaskInput) => Task;
  updateTask: (id: string, updates: TaskUpdate) => void;
  updateTaskStatus: (id: string, newStatus: TaskStatus, newProgress?: number) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newTitle: string, newDescription: string) => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

const LEGACY_DEFAULT_DATES: Record<string, string> = {
  "Design new ui presentation": "26 Aug 2022",
  "Add more ui/ux mockups": "25 Aug 2022",
  "Design few mobile screens": "26 Aug 2022",
  "Create a tweet and promote": "27 Aug 2022",
  "Design system update": "12 Nov 2022",
  "Create brand guideline": "13 Nov 2022",
  "Create wireframe for ios app": "14 Nov 2022",
  "Create ui kit for layout": "15 Nov 2022",
  "Add product to the market": "6 Jan 2022",
  "Launch product promotion": "7 Jan 2022",
  "Make twitter banner": "8 Jan 2022",
};

function migrateSavedTasks(savedTasks: Task[]): Task[] {
  const defaultTasksByTitle = new Map(InitialTasks.map((task) => [task.title, task]));
  return savedTasks.map((task) => {
    const defaultTask = defaultTasksByTitle.get(task.title);
    if (!defaultTask) return task;
    const hasLegacyDate = task.date === LEGACY_DEFAULT_DATES[task.title];
    return {
      ...task,
      ...(hasLegacyDate ? { date: defaultTask.date } : {}),
      priority: task.priority || defaultTask.priority || "medium",
    };
  });
}

type TaskProviderProps = { children: ReactNode };

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(migrateSavedTasks(parsedTasks as Task[]));
        } else {
          console.error("Saved tasks were not a list. Restoring sample tasks.");
          setStorageError("Saved tasks could not be read. Sample tasks were restored.");
          setTasks(InitialTasks);
        }
      } else {
        setTasks(InitialTasks);
      }
      const savedActivity = localStorage.getItem("activity");
      if (savedActivity) {
        const parsedActivity = JSON.parse(savedActivity);
        if (Array.isArray(parsedActivity)) setActivity(parsedActivity);
        else {
          console.error("Saved activity was not a list. Restoring an empty activity feed.");
          setStorageError("Saved activity could not be read. The activity feed was reset.");
        }
      }
    } catch (error) {
      console.error("Unable to load saved tasks.", error);
      setStorageError("Unable to load saved tasks from this browser.");
      setTasks(InitialTasks);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save tasks to browser storage.", error);
      setStorageError("Unable to save tasks. Check your browser storage settings.");
    }
  }, [isLoaded, tasks]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("activity", JSON.stringify(activity));
    } catch (error) {
      console.error("Unable to save activity to browser storage.", error);
      setStorageError("Unable to save activity. Check your browser storage settings.");
    }
  }, [activity, isLoaded]);

  const recordActivity = (action: TaskAction, task: { title: string; project?: string; [key: string]: unknown }) => {
    setActivity((current) => [{
      id: uuidv4(),
      action,
      title: task.title,
      project: task.project || "",
      createdAt: new Date().toISOString(),
    }, ...current].slice(0, 100));
  };

  const createTask = (taskData: TaskInput): Task => {
    const task: Task = {
      id: uuidv4(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      status: taskData.status,
      priority: taskData.priority,
      date: taskData.date,
      project: taskData.project || "",
      progress: taskData.status === "done" ? 10 : taskData.status === "inprogress" ? 5 : 1,
      assignees: [],
    };
    setTasks((currentTasks) => [task, ...currentTasks]);
    recordActivity("created", task);
    return task;
  };

  const addTask = (title: string, status: TaskStatus = "todo", project = "ShiftX") =>
    createTask({
      title,
      description: "New task added.",
      status,
      priority: "medium",
      date: new Date().toISOString().slice(0, 10),
      project,
    });

  const updateTask = (id: string, updates: TaskUpdate) => {
    const existing = tasks.find((task) => task.id === id);
    if (existing) {
      const statusChanged = updates.status && updates.status !== existing.status;
      const action = statusChanged
        ? updates.status === "done" ? "completed" : updates.status === "todo" && existing.status === "done" ? "reopened" : "moved"
        : "updated";
      recordActivity(action, { ...existing, ...updates });
    }
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              progress:
                updates.status === undefined || updates.status === task.status
                  ? task.progress
                  : updates.status === "done"
                    ? 10
                    : updates.status === "inprogress"
                      ? 5
                      : 1,
              title: updates.title === undefined ? task.title : updates.title.trim(),
              description:
                updates.description === undefined
                  ? task.description
                  : updates.description.trim(),
            }
          : task
      )
    );
  };

  const updateTaskStatus = (id: string, newStatus: TaskStatus, newProgress?: number) => {
    const existing = tasks.find((task) => task.id === id);
    if (existing && existing.status !== newStatus) {
      const action = newStatus === "done"
        ? "completed"
        : newStatus === "todo" && existing.status === "done" ? "reopened" : "moved";
      recordActivity(action, { ...existing, status: newStatus });
    }
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
              progress:
                newProgress ??
                (newStatus === "done" ? 10 : newStatus === "inprogress" ? 5 : 1),
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    const deletedTask = tasks.find((task) => task.id === id);
    if (deletedTask) recordActivity("deleted", deletedTask);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const editTask = (id: string, newTitle: string, newDescription: string) =>
    updateTask(id, { title: newTitle, description: newDescription });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activity,
        isLoaded,
        storageError,
        addTask,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        editTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider.");
  return context;
};
