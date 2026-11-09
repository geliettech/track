"use client";

import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "neutral";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div className="flex items-start gap-4">
          <div
            className={`grid size-11 shrink-0 place-items-center rounded-xl ${
              tone === "danger"
                ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
            }`}
          >
            <FiAlertTriangle size={22} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3
              id="confirm-dialog-title"
              className="font-display text-base font-bold text-ink"
            >
              {title}
            </h3>
            <p
              id="confirm-dialog-description"
              className="mt-1.5 text-xs leading-relaxed text-muted"
            >
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid size-8 place-items-center rounded-lg text-faint hover:bg-surface-hover hover:text-ink transition-colors"
            aria-label="Close dialog"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer inline-flex h-9 items-center justify-center rounded-xl border border-line bg-surface px-4 text-xs font-semibold text-muted hover:bg-surface-hover hover:text-ink transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`cursor-pointer inline-flex h-9 items-center justify-center rounded-xl px-4 text-xs font-semibold text-white shadow-xs transition-colors ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                : "bg-accent hover:bg-accent-hover"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
