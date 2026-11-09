"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthNotice from "./AuthNotice";
import AuthSubmitButton from "./AuthSubmitButton";
import PasswordStrength from "./PasswordStrength";
import { validateAuthForm, type AuthFormMode, type AuthValues } from "./auth-validation";

type FormCopy = {
  eyebrow: string;
  title: string;
  description: string;
  button: string;
  footer: ReactNode;
};

const copy = {
  login: {
    eyebrow: "WELCOME BACK",
    title: "Good to see you again.",
    description: "Sign in to pick up right where your team left off.",
    button: "Sign in",
    footer: <>New to Track? <Link href="/register">Create an account</Link></>,
  },
  register: {
    eyebrow: "GET STARTED",
    title: "Make room for good work.",
    description: "Create your account and bring your projects into focus.",
    button: "Create account",
    footer: <>Already have an account? <Link href="/login">Sign in</Link></>,
  },
  forgot: {
    eyebrow: "ACCOUNT RECOVERY",
    title: "Let’s get you back in.",
    description: "Enter the email address associated with your account.",
    button: "Request reset link",
    footer: <><Link href="/login">Back to sign in</Link></>,
  },
  reset: {
    eyebrow: "CHOOSE A NEW PASSWORD",
    title: "Secure your account.",
    description: "Choose a new password you haven’t used before.",
    button: "Save new password",
    footer: <>Need a fresh link? <Link href="/forgot-password">Request a reset</Link></>,
  },
} satisfies Record<AuthFormMode, FormCopy>;

const initialValues: AuthValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

type FieldErrorProps = {
  id: string;
  children?: string;
};

function FieldError({ id, children }: FieldErrorProps) {
  return children ? <span className="auth-field-error" id={id} aria-live="polite" aria-atomic="true">{children}</span> : null;
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  errorId: string;
  showStrength?: boolean;
  autoComplete: string;
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  errorId,
  showStrength = false,
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const strengthId = `${id}-strength`;
  const describedBy = [error ? errorId : null, showStrength && value ? strengthId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className={`auth-input-wrap${error ? " has-error" : ""}`}>
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          placeholder="At least 8 characters"
        />
        <button
          type="button"
          className="auth-password-toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
      </div>
      {showStrength && <PasswordStrength password={value} id={strengthId} />}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type AuthFormProps = {
  mode: AuthFormMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const content = copy[mode];
  const [values, setValues] = useState<AuthValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof AuthValues, string>>>({});
  const [notice, setNotice] = useState<{ tone: "info" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!content) throw new Error(`Unsupported authentication form: ${mode}`);

  function updateValue(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked, type } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAuthForm(mode, values);
    setErrors(nextErrors);
    setNotice(null);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    if (mode === "forgot") {
      setNotice({
        tone: "info",
        message: "If an account exists for this address, it can receive a reset link once authentication is connected. No email was sent.",
      });
    } else {
      setNotice({
        tone: "error",
        message: "Authentication is not connected yet. Your information was not sent or saved.",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <section className="auth-form-section" aria-labelledby="auth-form-title">
      <p className="auth-eyebrow">{content.eyebrow}</p>
      <h1 id="auth-form-title">{content.title}</h1>
      <p className="auth-description">{content.description}</p>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="auth-field">
            <label htmlFor="name">Full name</label>
            <input
              className={`auth-input${errors.name ? " has-error" : ""}`}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={updateValue}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder="e.g. Alex Morgan"
            />
            <FieldError id="name-error">{errors.name}</FieldError>
          </div>
        )}

        {mode !== "reset" && (
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              className={`auth-input${errors.email ? " has-error" : ""}`}
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete={mode === "login" ? "username" : "email"}
              value={values.email}
              onChange={updateValue}
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder="you@company.com"
            />
            <FieldError id="email-error">{errors.email}</FieldError>
          </div>
        )}

        {mode !== "forgot" && (
          <PasswordField
            id="password"
            label={mode === "reset" ? "New password" : "Password"}
            value={values.password}
            onChange={updateValue}
            error={errors.password}
            errorId="password-error"
            showStrength={mode === "register" || mode === "reset"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        )}

        {(mode === "register" || mode === "reset") && (
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            onChange={updateValue}
            error={errors.confirmPassword}
            errorId="confirmPassword-error"
            autoComplete="new-password"
          />
        )}

        {mode === "register" && (
          <div className="auth-terms">
            <label>
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={values.acceptedTerms}
                onChange={updateValue}
                aria-invalid={Boolean(errors.acceptedTerms)}
                aria-describedby={errors.acceptedTerms ? "terms-error" : undefined}
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            <FieldError id="terms-error">{errors.acceptedTerms}</FieldError>
          </div>
        )}

        {mode === "login" && (
          <div className="auth-form-options">
            <span>Use your work email to sign in</span>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
        )}

        {notice && <AuthNotice tone={notice.tone}>{notice.message}</AuthNotice>}
        <AuthSubmitButton isSubmitting={isSubmitting}>{content.button}</AuthSubmitButton>
      </form>

      <p className="auth-form-footer">{content.footer}</p>
      {mode === "forgot" && (
        <p className="auth-privacy-note">
          If an account exists for this address, it can receive a reset link once authentication is connected. No email is sent in this UI-only version.
        </p>
      )}
    </section>
  );
}
