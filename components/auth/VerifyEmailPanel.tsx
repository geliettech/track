"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import AuthNotice from "./AuthNotice";
import AuthSubmitButton from "./AuthSubmitButton";
import { validateEmail } from "./auth-validation";

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "";
  const [localPart, domain] = email.split("@");
  return `${localPart.slice(0, 1)}***@${domain}`;
}

type VerifyEmailPanelProps = {
  destinationEmail?: string;
  cooldownSeconds?: number;
};

export default function VerifyEmailPanel({ destinationEmail, cooldownSeconds = 0 }: VerifyEmailPanelProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ tone: "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);
    setNotice(null);
    if (emailError) return;

    setIsSubmitting(true);
    setNotice({
      tone: "error",
      message: "Verification email could not be sent because authentication is not connected. No email was sent.",
    });
    setIsSubmitting(false);
  }

  return (
    <section className="auth-form-section auth-verify-section" aria-labelledby="auth-form-title">
      <div className="auth-verify-icon" aria-hidden="true"><FiMail /></div>
      <p className="auth-eyebrow">ONE LAST STEP</p>
      <h1 id="auth-form-title">Check your inbox.</h1>
      <p className="auth-description">
        Verify your email address to help keep your Track account secure. Follow the confirmation link in your email when it arrives.
      </p>
      {destinationEmail && <p className="auth-destination">We’ll send instructions to <strong>{maskEmail(destinationEmail)}</strong>.</p>}
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="verification-email">Email address</label>
          <input
            className={`auth-input${error ? " has-error" : ""}`}
            id="verification-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value); setError(""); setNotice(null); }}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "verification-email-error" : undefined}
            placeholder="you@company.com"
          />
          {error && <span className="auth-field-error" id="verification-email-error" aria-live="polite" aria-atomic="true">{error}</span>}
        </div>
        {notice && <AuthNotice tone={notice.tone}>{notice.message}</AuthNotice>}
        <AuthSubmitButton isSubmitting={isSubmitting} cooldownSeconds={cooldownSeconds}>
          Resend verification email
        </AuthSubmitButton>
        {cooldownSeconds > 0 && (
          <p className="auth-cooldown-note" role="status" aria-live="polite">
            You can request another verification email when the timer ends.
          </p>
        )}
      </form>
      <p className="auth-form-footer"><Link href="/login">Back to sign in</Link></p>
      <p className="auth-privacy-note">You’ll see a resend cooldown here after a provider confirms it accepted a message. No verification status is assumed on this page.</p>
    </section>
  );
}
