"use client";

import { useState } from "react";
import {
  FiCheck,
  FiLock,
  FiMessageSquare,
  FiSend,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { useWorkspace } from "@/context/WorkspaceContext";

const sampleConversations = [
  {
    id: "alex",
    name: "Alex Morgan",
    initials: "AM",
    role: "Product Designer",
    project: "Zenith Link",
    messages: [
      { sender: "Alex", text: "Hey Jordan, I updated the presentation mockups on the board.", time: "10:30 AM" },
      { sender: "You", text: "Looks great, Alex! I'll review them before our sync.", time: "10:45 AM" },
    ],
  },
  {
    id: "kai",
    name: "Kai Chen",
    initials: "KC",
    role: "Frontend Developer",
    project: "Elevate",
    messages: [
      { sender: "Kai", text: "The new mobile screens are ready for testing.", time: "Yesterday" },
      { sender: "You", text: "Awesome, I'll test the touch interactions today.", time: "Yesterday" },
    ],
  },
];

export default function MessagesPage() {
  const { activeWorkspace, canAccessFeature, openUpgradeModal, switchWorkspace, workspaces } =
    useWorkspace();
  const [selectedId, setSelectedId] = useState(sampleConversations[0].id);
  const [inputMessage, setInputMessage] = useState("");
  const [conversations, setConversations] = useState(sampleConversations);

  const isChatAllowed = canAccessFeature("chat");
  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { sender: "You", text: inputMessage.trim(), time: "Just now" },
              ],
            }
          : c
      )
    );
    setInputMessage("");
  };

  const proWorkspace = workspaces.find((w) => w.tier === "pro" || w.tier === "business");

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
              <FiMessageSquare size={18} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              Team Messages & Chat
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted">
            Direct team messaging and contextual conversations around your tasks.
          </p>
        </div>

        {!isChatAllowed && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent self-start sm:self-auto">
            <FiLock size={12} />
            <span>Pro Feature</span>
          </span>
        )}
      </div>

      {/* Paywall Banner if Free Tier */}
      {!isChatAllowed && (
        <div className="rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-surface to-surface p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                <FiZap size={11} /> Team Collaboration & Chat
              </div>
              <h2 className="font-display text-xl font-bold text-ink">
                Manage your tasks free. Upgrade for live team collaboration.
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                Your personal task management is 100% free forever. To chat with teammates, share project threads, and collaborate in real-time, upgrade <strong>{activeWorkspace.name}</strong> to Pro.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => openUpgradeModal("Team Chat & Collaboration")}
                className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-bold text-white shadow-xs hover:bg-accent-hover transition-colors"
              >
                <FiZap size={14} /> Upgrade to Pro ($12/mo)
              </button>

              {proWorkspace && (
                <button
                  type="button"
                  onClick={() => switchWorkspace(proWorkspace.id)}
                  className="cursor-pointer inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
                >
                  <FiUsers size={13} /> Switch to {proWorkspace.name}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messaging Container */}
      <div className={`relative rounded-2xl border border-line bg-surface shadow-xs overflow-hidden min-h-[480px] grid grid-cols-1 md:grid-cols-3 ${
        !isChatAllowed ? "opacity-75 pointer-events-none select-none blur-[0.6px]" : ""
      }`}>
        {/* Conversation List */}
        <div className="border-r border-line p-3 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-faint">
            Direct Messages
          </p>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setSelectedId(conv.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${
                selectedId === conv.id
                  ? "bg-accent/10 text-accent font-semibold dark:bg-accent/15"
                  : "hover:bg-surface-hover text-muted hover:text-ink"
              }`}
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-xs font-bold text-white shadow-xs">
                {conv.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ink truncate">{conv.name}</p>
                <p className="text-[10px] text-faint truncate">{conv.project}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Thread */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 sm:p-5">
          {/* Thread Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-line">
            <div className="grid size-8 place-items-center rounded-lg bg-accent text-xs font-bold text-white">
              {activeConv.initials}
            </div>
            <div>
              <p className="text-xs font-bold text-ink">{activeConv.name}</p>
              <p className="text-[10px] text-muted">{activeConv.project} · {activeConv.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[300px]">
            {activeConv.messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    m.sender === "You"
                      ? "bg-accent text-white shadow-xs"
                      : "bg-surface-muted text-ink border border-line/60"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-faint mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-line">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${activeConv.name}...`}
              className="flex-1 h-9 rounded-xl border border-line bg-surface px-3 text-xs text-ink placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="grid size-9 place-items-center rounded-xl bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-xs"
              aria-label="Send message"
            >
              <FiSend size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
