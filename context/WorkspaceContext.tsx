"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Workspace, WorkspaceTier } from "./types";

const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "ws-personal",
    name: "Personal Workspace",
    slug: "personal",
    tier: "free",
    role: "Owner",
    avatarColor: "#6366f1",
    membersCount: 1,
    description: "Your personal task and daily productivity space.",
  },
  {
    id: "ws-acme",
    name: "Acme Design Studio",
    slug: "acme-design",
    tier: "pro",
    role: "Admin",
    avatarColor: "#8b5cf6",
    membersCount: 6,
    description: "Shared workspace for UI/UX product teams and sprints.",
  },
  {
    id: "ws-hyperscale",
    name: "HyperScale Tech",
    slug: "hyperscale",
    tier: "business",
    role: "Member",
    avatarColor: "#06b6d4",
    membersCount: 24,
    description: "Enterprise multi-team engineering and launch hub.",
  },
];

type WorkspaceContextValue = {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string, tier?: WorkspaceTier) => Workspace;
  upgradeActiveWorkspace: (tier: WorkspaceTier) => void;
  isUpgradeModalOpen: boolean;
  upgradeFeatureReason: string | null;
  openUpgradeModal: (featureReason?: string) => void;
  closeUpgradeModal: () => void;
  canAccessFeature: (
    feature: "chat" | "team_collaboration" | "advanced_analytics" | "business_capabilities"
  ) => boolean;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("ws-personal");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeFeatureReason, setUpgradeFeatureReason] = useState<string | null>(null);

  // Load saved state
  useEffect(() => {
    try {
      const savedList = localStorage.getItem("track_workspaces");
      if (savedList) {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWorkspaces(parsed);
        }
      }
      const savedActive = localStorage.getItem("track_active_workspace");
      if (savedActive) {
        setActiveWorkspaceId(savedActive);
      }
    } catch (e) {
      console.error("Failed to read workspaces from localStorage", e);
    }
  }, []);

  const saveWorkspaces = (list: Workspace[]) => {
    setWorkspaces(list);
    try {
      localStorage.setItem("track_workspaces", JSON.stringify(list));
    } catch (e) {
      console.error("Failed to persist workspaces", e);
    }
  };

  const switchWorkspace = (id: string) => {
    const target = workspaces.find((w) => w.id === id);
    if (target) {
      setActiveWorkspaceId(id);
      try {
        localStorage.setItem("track_active_workspace", id);
      } catch (e) {
        console.error("Failed to save active workspace", e);
      }
    }
  };

  const createWorkspace = (name: string, tier: WorkspaceTier = "free"): Workspace => {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      tier,
      role: "Owner",
      avatarColor: colors[workspaces.length % colors.length],
      membersCount: 1,
      description: "Custom team workspace.",
    };
    const nextList = [...workspaces, newWs];
    saveWorkspaces(nextList);
    switchWorkspace(newWs.id);
    return newWs;
  };

  const upgradeActiveWorkspace = (tier: WorkspaceTier) => {
    const nextList = workspaces.map((w) =>
      w.id === activeWorkspaceId ? { ...w, tier } : w
    );
    saveWorkspaces(nextList);
    setIsUpgradeModalOpen(false);
    setUpgradeFeatureReason(null);
  };

  const openUpgradeModal = (featureReason?: string) => {
    setUpgradeFeatureReason(featureReason || null);
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setUpgradeFeatureReason(null);
  };

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const canAccessFeature = (
    feature: "chat" | "team_collaboration" | "advanced_analytics" | "business_capabilities"
  ): boolean => {
    if (activeWorkspace.tier === "business") return true;
    if (activeWorkspace.tier === "pro") {
      return feature !== "business_capabilities";
    }
    // Free tier: only core task management is free
    return false;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        switchWorkspace,
        createWorkspace,
        upgradeActiveWorkspace,
        isUpgradeModalOpen,
        upgradeFeatureReason,
        openUpgradeModal,
        closeUpgradeModal,
        canAccessFeature,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
