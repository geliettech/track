import AuthMessage from "@/components/auth/AuthMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authentication · Track" };

export default function AuthCallbackPage() {
  return (
    <AuthMessage
      tone="secure"
      eyebrow="SECURE SIGN-IN"
      title="Authentication isn’t connected yet."
      actionHref="/login"
      actionLabel="Return to sign in"
    >
      <p>This page is ready to handle a provider callback. No session was created, and no account status has been changed.</p>
    </AuthMessage>
  );
}
