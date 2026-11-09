import VerifyEmailPanel from "@/components/auth/VerifyEmailPanel";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verify your email · Track" };

export default function VerifyEmailPage() {
  return <VerifyEmailPanel />;
}
