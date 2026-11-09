import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset your password · Track" };

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
