import AuthMessage from "@/components/auth/AuthMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign out · Track" };

export default function SignOutPage() {
  return (
    <AuthMessage
      tone="info"
      eyebrow="SIGN OUT"
      title="There’s no active session to end."
      actionHref="/login"
      actionLabel="Go to sign in"
    >
      <p>Session management is not connected in this UI-only version, so nothing was signed out.</p>
    </AuthMessage>
  );
}
