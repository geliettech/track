import AuthMessage from "@/components/auth/AuthMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authentication error · Track" };

export default function AuthErrorPage() {
  return (
    <AuthMessage
      tone="error"
      eyebrow="SIGN-IN ISSUE"
      title="We couldn’t complete that request."
      actionHref="/login"
      actionLabel="Try signing in again"
      secondaryHref="/forgot-password"
      secondaryLabel="Reset your password"
    >
      <p>Authentication isn’t connected yet. Your account and session have not been changed.</p>
    </AuthMessage>
  );
}
