import type { ReactNode } from "react";

type AuthNoticeProps = {
  tone?: "info" | "error";
  children: ReactNode;
};

export default function AuthNotice({ tone = "info", children }: AuthNoticeProps) {
  return (
    <div className={`auth-notice auth-notice-${tone}`} role={tone === "error" ? "alert" : "status"} aria-live="polite">
      <span className="auth-notice-mark" aria-hidden="true">
        {tone === "error" ? "!" : "i"}
      </span>
      <p>{children}</p>
    </div>
  );
}
