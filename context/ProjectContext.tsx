"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PROJECTS } from "./Projects";
import type { Project, ProjectUpdate } from "./types";

type ProjectContextValue = {
  projects: Project[];
  isLoaded: boolean;
  storageError: string;
  createProject: (name: string, description: string, deadline?: string, color?: string) => Project;
  updateProject: (currentName: string, updates: ProjectUpdate) => Project;
  deleteProject: (name: string) => void;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const names = new Set(PROJECTS.map((project) => project.name.toLowerCase()));
          const extraProjects = parsed.filter((project: Project) => {
            if (!project || typeof project.name !== "string" || !project.name.trim()) return false;
            const name = project.name.trim().toLowerCase();
            if (names.has(name)) return false;
            names.add(name);
            return true;
          });
          setProjects([...PROJECTS, ...extraProjects]);
        } else if (Array.isArray(parsed.projects)) {
          setProjects(parsed.projects.filter((project: Project) =>
            project &&
            typeof project.name === "string" &&
            project.name.trim() &&
            typeof project.description === "string"
          ));
        } else {
          console.error("Saved projects had an invalid format. Restoring default projects.");
          setStorageError("Saved projects could not be read. Default projects were restored.");
        }
      }
    } catch (error) {
      console.error("Unable to load saved projects.", error);
      setStorageError("Unable to load projects from this browser.");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("projects", JSON.stringify({ version: 2, projects }));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save projects to browser storage.", error);
      setStorageError("Unable to save projects. Check your browser storage settings.");
    }
  }, [isLoaded, projects]);

  const createProject = (name: string, description: string, deadline = "", color?: string): Project => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("Enter a name for your project.");
    if (projects.some((project) => project.name.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error("A project with that name already exists.");
    }
    const colors = ["#8f83ff", "#64b99a", "#e5a464", "#6c9ed3", "#d27ea8"];
    const project = {
      name: cleanName,
      description: description.trim() || "A new project, ready to take shape.",
      color: color || colors[projects.length % colors.length],
      deadline,
    };
    setProjects((current) => [...current, project]);
    return project;
  };

  const updateProject = (currentName: string, updates: ProjectUpdate): Project => {
    const cleanName = updates.name.trim();
    if (!cleanName) throw new Error("Enter a name for your project.");
    if (projects.some((project) =>
      project.name.toLowerCase() === cleanName.toLowerCase() &&
      project.name !== currentName
    )) {
      throw new Error("A project with that name already exists.");
    }
    const updatedProject = projects.find((project) => project.name === currentName);
    if (!updatedProject) throw new Error("This project no longer exists.");
    const nextProject = {
      ...updatedProject,
      name: cleanName,
      description: updates.description.trim() || "A project, ready to take shape.",
      deadline: updates.deadline,
      ...(updates.color ? { color: updates.color } : {}),
    };
    setProjects((current) =>
      current.map((project) => project.name === currentName ? nextProject : project)
    );
    return nextProject;
  };

  const deleteProject = (name: string) => {
    if (projects.length < 2) throw new Error("Keep at least one project in your workspace.");
    if (!projects.some((project) => project.name === name)) {
      throw new Error("This project no longer exists.");
    }
    setProjects((current) => current.filter((project) => project.name !== name));
  };

  return (
    <ProjectContext.Provider value={{ projects, createProject, updateProject, deleteProject, isLoaded, storageError }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used within a ProjectProvider.");
  return context;
}
