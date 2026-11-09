"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PROJECTS } from "./Projects";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(PROJECTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const names = new Set(PROJECTS.map((project) => project.name.toLowerCase()));
          const extraProjects = parsed.filter((project) => {
            if (!project || typeof project.name !== "string" || !project.name.trim()) return false;
            const name = project.name.trim().toLowerCase();
            if (names.has(name)) return false;
            names.add(name);
            return true;
          });
          setProjects([...PROJECTS, ...extraProjects]);
        } else {
          console.error("Saved projects were not a list. Restoring default projects.");
        }
      }
    } catch (error) {
      console.error("Unable to load saved projects.", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("projects", JSON.stringify(projects.slice(PROJECTS.length)));
    } catch (error) {
      console.error("Unable to save projects to browser storage.", error);
    }
  }, [isLoaded, projects]);

  const createProject = (name, description) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("Enter a name for your project.");
    if (projects.some((project) => project.name.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error("A project with that name already exists.");
    }
    const colors = ["#8f83ff", "#64b99a", "#e5a464", "#6c9ed3", "#d27ea8"];
    const project = {
      name: cleanName,
      description: description.trim() || "A new project, ready to take shape.",
      color: colors[projects.length % colors.length],
    };
    setProjects((current) => [...current, project]);
    return project;
  };

  return (
    <ProjectContext.Provider value={{ projects, createProject, isLoaded }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used within a ProjectProvider.");
  return context;
}
