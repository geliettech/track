import AuthMessage from "@/components/auth/AuthMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Access restricted · Track" };

export default function UnauthorizedPage() {
  return (
    <AuthMessage
      tone="secure"
      eyebrow="ACCESS RESTRICTED"
      title="You don’t have access to this page."
      actionHref="/login"
      actionLabel="Go to sign in"
      secondaryHref="/overview"
      secondaryLabel="Continue to the workspace"
    >
      <p>Access checks will be handled by the authentication provider when it is connected.</p>
    </AuthMessage>
  );
}
