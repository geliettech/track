"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InitialTasks from "./DefaultTasks.jsx";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          console.error("Saved tasks were not a list. Restoring sample tasks.");
          setTasks(InitialTasks);
        }
      } else {
        setTasks(InitialTasks);
      }
    } catch (error) {
      console.error("Unable to load saved tasks.", error);
      setTasks(InitialTasks);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save tasks to browser storage.", error);
    }
  }, [isLoaded, tasks]);

  const createTask = (taskData) => {
    const task = {
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
    return task;
  };

  const addTask = (title, status = "todo") =>
    createTask({
      title,
      description: "New task added.",
      status,
      priority: "medium",
      date: new Date().toISOString().slice(0, 10),
    });

  const updateTask = (id, updates) => {
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

  const updateTaskStatus = (id, newStatus, newProgress) => {
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

  const deleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const editTask = (id, newTitle, newDescription) =>
    updateTask(id, { title: newTitle, description: newDescription });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoaded,
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
