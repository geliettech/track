"use client";

import { useEffect } from "react";
import {
  FiCheck,
  FiLock,
  FiShield,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useDashboardShell } from "@/components/layout/DashboardShell";
import type { WorkspaceTier } from "@/context/types";

export default function UpgradeModal({ onNotify }: { onNotify?: (message: string) => void }) {
  const {
    activeWorkspace,
    isUpgradeModalOpen,
    upgradeFeatureReason,
    closeUpgradeModal,
    upgradeActiveWorkspace,
  } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUpgradeModal();
    };
    if (isUpgradeModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUpgradeModalOpen, closeUpgradeModal]);

  if (!isUpgradeModalOpen) return null;

  const handleSelectPlan = (tier: WorkspaceTier) => {
    upgradeActiveWorkspace(tier);
    if (onNotify) {
      onNotify(`Workspace upgraded to ${tier.toUpperCase()} plan! Advanced features unlocked.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-xs transition-opacity animate-in fade-in overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeUpgradeModal();
      }}
    >
      <section
        className="w-full max-w-4xl rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl transition-all my-8 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent mb-2">
              <FiZap size={13} />
              <span>Scale Your Productivity</span>
            </div>
            <h2 id="upgrade-modal-title" className="font-display text-2xl font-extrabold text-ink">
              Choose the right plan for your workspace
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {upgradeFeatureReason ? (
                <span className="font-semibold text-accent">
                  🔒 {upgradeFeatureReason} — upgrade your workspace to continue.
                </span>
              ) : (
                "Free for individual tasks. Upgrade for team collaboration, chat, and business controls."
              )}
            </p>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-xl text-faint hover:bg-surface-hover hover:text-ink transition-colors"
            onClick={closeUpgradeModal}
            aria-label="Close dialog"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-ink">Free Starter</h3>
                {activeWorkspace.tier === "free" && (
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold text-muted">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">Core task management for individuals</p>

              <div className="mt-5 mb-6">
                <span className="font-display text-3xl font-extrabold text-ink">$0</span>
                <span className="text-xs text-muted"> / forever</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-line text-xs">
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Unlimited tasks & Kanban board</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Priorities, due dates & statuses</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Up to 3 active projects</span>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <FiLock className="text-faint shrink-0 mt-0.5" size={14} />
                  <span className="text-muted">No team collaboration or chat</span>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <FiLock className="text-faint shrink-0 mt-0.5" size={14} />
                  <span className="text-muted">Standard local browser storage</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={activeWorkspace.tier === "free"}
              onClick={() => handleSelectPlan("free")}
              className={`mt-8 w-full h-10 rounded-xl text-xs font-semibold transition-colors ${
                activeWorkspace.tier === "free"
                  ? "border border-line bg-surface-muted text-muted cursor-default"
                  : "border border-line bg-surface text-ink hover:bg-surface-hover"
              }`}
            >
              {activeWorkspace.tier === "free" ? "Current Plan" : "Downgrade to Free"}
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="rounded-2xl border-2 border-accent bg-surface p-6 flex flex-col justify-between shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-white shadow-xs">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-accent">Pro Team</h3>
                {activeWorkspace.tier === "pro" && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">For teams that need to collaborate & ship</p>

              <div className="mt-5 mb-6">
                <span className="font-display text-3xl font-extrabold text-ink">$12</span>
                <span className="text-xs text-muted"> / user / month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-line text-xs">
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="font-medium text-ink">Everything in Free</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiZap className="text-accent shrink-0 mt-0.5" size={14} />
                  <span className="font-semibold text-accent">Team Collaboration & Chat</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Unlimited projects & teammates</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Advanced schedule & calendar view</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Priority reminders & email digest</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan("pro")}
              className={`mt-8 w-full h-10 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                activeWorkspace.tier === "pro"
                  ? "bg-accent/20 text-accent font-bold cursor-default"
                  : "bg-accent text-white hover:bg-accent-hover"
              }`}
            >
              {activeWorkspace.tier === "pro" ? "Active on this Workspace" : "Upgrade to Pro"}
            </button>
          </div>

          {/* Business Tier */}
          <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-ink">Business</h3>
                {activeWorkspace.tier === "business" && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">Enterprise governance, roles, & scale</p>

              <div className="mt-5 mb-6">
                <span className="font-display text-3xl font-extrabold text-ink">$29</span>
                <span className="text-xs text-muted"> / user / month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-line text-xs">
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="font-medium text-ink">Everything in Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiShield className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="font-semibold text-ink">Custom Team Roles & RBAC</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Full audit log & velocity analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Unlimited workspaces across org</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <span className="text-ink">Dedicated account manager & SLA</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan("business")}
              className={`mt-8 w-full h-10 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeWorkspace.tier === "business"
                  ? "bg-emerald-500/20 text-emerald-600 font-bold cursor-default"
                  : "border border-line bg-surface text-ink hover:bg-surface-hover"
              }`}
            >
              {activeWorkspace.tier === "business"
                ? "Active on this Workspace"
                : "Upgrade to Business"}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted gap-3">
          <p>
            🔒 All plans include a 14-day money-back guarantee. Change or cancel anytime.
          </p>
          <span className="text-faint">Secured with 256-bit SSL encryption</span>
        </div>
      </section>
    </div>
  );
}
