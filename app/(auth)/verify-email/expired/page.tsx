import AuthMessage from "@/components/auth/AuthMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verification link expired · Track" };

export default function VerificationExpiredPage() {
  return (
    <AuthMessage
      tone="error"
      eyebrow="EMAIL VERIFICATION"
      title="This verification link has expired."
      actionHref="/verify-email"
      actionLabel="Request a new verification email"
    >
      <p>For your security, verification links can only be used for a limited time. Request a fresh email to continue.</p>
    </AuthMessage>
  );
}
