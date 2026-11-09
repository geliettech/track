import AuthMessage from "./AuthMessage";
import type { ReactElement } from "react";

export function RegistrationComplete(): ReactElement {
  return (
    <AuthMessage
      tone="success"
      eyebrow="WELCOME TO TRACK"
      title="Your account is ready."
      actionHref="/overview"
      actionLabel="Continue to your workspace"
    >
      <p>Your email has been confirmed. You can now continue to your Track workspace.</p>
    </AuthMessage>
  );
}

export function PasswordResetComplete(): ReactElement {
  return (
    <AuthMessage
      tone="success"
      eyebrow="PASSWORD UPDATED"
      title="You’re all set."
      actionHref="/login"
      actionLabel="Sign in with your new password"
    >
      <p>Your password was updated. Sign in with your new password to continue.</p>
    </AuthMessage>
  );
}

export function EmailVerificationComplete(): ReactElement {
  return (
    <AuthMessage
      tone="success"
      eyebrow="EMAIL VERIFIED"
      title="Your email is confirmed."
      actionHref="/overview"
      actionLabel="Continue to your workspace"
    >
      <p>Your email address was confirmed by the authentication provider.</p>
    </AuthMessage>
  );
}
