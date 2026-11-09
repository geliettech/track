import { FiArrowRight, FiClock, FiLoader } from "react-icons/fi";
import type { ReactNode } from "react";

type AuthSubmitButtonProps = {
  children: ReactNode;
  isSubmitting?: boolean;
  cooldownSeconds?: number;
};

export default function AuthSubmitButton({
  children,
  isSubmitting = false,
  cooldownSeconds = 0,
}: AuthSubmitButtonProps) {
  const cooldownLabel = `${Math.floor(cooldownSeconds / 60)}:${String(cooldownSeconds % 60).padStart(2, "0")}`;
  return (
    <button
      className="primary-button auth-submit"
      type="submit"
      disabled={isSubmitting || cooldownSeconds > 0}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <FiLoader className="auth-spinner" aria-hidden="true" />
          <span>Working…</span>
        </>
      ) : cooldownSeconds > 0 ? (
        <>
          <FiClock aria-hidden="true" />
          <span>Resend in {cooldownLabel}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          <FiArrowRight aria-hidden="true" />
        </>
      )}
    </button>
  );
}
