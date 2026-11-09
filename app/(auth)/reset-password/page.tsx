import AuthForm from "@/components/auth/AuthForm";
import AuthMessage from "@/components/auth/AuthMessage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Choose a new password · Track" };

type ResetPasswordPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  if (params?.status === "expired") {
    return (
      <AuthMessage
        tone="error"
        eyebrow="PASSWORD RECOVERY"
        title="This reset link has expired."
        actionHref="/forgot-password"
        actionLabel="Request a new link"
      >
        <p>For your security, reset links can only be used for a limited time. Request a fresh link to continue.</p>
      </AuthMessage>
    );
  }
  return <AuthForm mode="reset" />;
}
