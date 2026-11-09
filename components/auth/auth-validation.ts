export type AuthFormMode = "login" | "register" | "forgot" | "reset";

export type AuthValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export function validateEmail(value: string): string {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return "";
}

export function getPasswordStrength(value: string): number {
  if (!value) return 0;
  return [
    value.length >= 8,
    /[a-z]/i.test(value) && /\d/.test(value),
    value.length >= 12 && /[^a-z\d]/i.test(value),
  ].filter(Boolean).length;
}

export function validatePassword(value: string): string {
  if (!value) return "Enter a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (!/[a-z]/i.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
  return "";
}

export function validateAuthForm(
  mode: AuthFormMode,
  values: AuthValues
): Partial<Record<keyof AuthValues, string>> {
  const errors: Partial<Record<keyof AuthValues, string>> = {};

  if (mode === "register" && !values.name.trim()) {
    errors.name = "Enter your full name.";
  }

  if (mode !== "reset") {
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
  }

  if (mode === "login" && !values.password) {
    errors.password = "Enter a password.";
  }

  if (mode === "register" || mode === "reset") {
    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;
  }

  if (mode === "register" || mode === "reset") {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  if (mode === "register" && !values.acceptedTerms) {
    errors.acceptedTerms = "Accept the terms to create an account.";
  }

  return errors;
}
