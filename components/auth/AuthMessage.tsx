import Link from "next/link";
import { FiCheckCircle, FiInfo, FiShield, FiXCircle } from "react-icons/fi";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type AuthTone = "info" | "error" | "success" | "secure";
type AuthMessageProps = {
  tone?: AuthTone;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  actionHref?: string;
  actionLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const icons = {
  info: FiInfo,
  error: FiXCircle,
  success: FiCheckCircle,
  secure: FiShield,
} satisfies Record<AuthTone, IconType>;

export default function AuthMessage({
  tone = "info",
  eyebrow = "TRACK ACCOUNT",
  title,
  children,
  actionHref = "/login",
  actionLabel = "Back to sign in",
  secondaryHref,
  secondaryLabel,
}: AuthMessageProps) {
  const Icon = icons[tone];
  return (
    <section className="auth-message" aria-labelledby="auth-message-title">
      <div className={`auth-message-icon tone-${tone}`} aria-hidden="true"><Icon /></div>
      <p className="auth-eyebrow">{eyebrow}</p>
      <h1 id="auth-message-title">{title}</h1>
      <div className="auth-message-copy">{children}</div>
      <Link className="primary-button auth-submit auth-message-action" href={actionHref}>
        <span>{actionLabel}</span>
      </Link>
      {secondaryHref && <Link className="auth-message-secondary" href={secondaryHref}>{secondaryLabel}</Link>}
    </section>
  );
}
