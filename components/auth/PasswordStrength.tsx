import { getPasswordStrength } from "./auth-validation";

const strengthLabels = ["", "Getting started", "Good", "Strong"];

type PasswordStrengthProps = {
  password: string;
  id: string;
};

export default function PasswordStrength({ password, id }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-bars" aria-hidden="true">
        {[1, 2, 3].map((level) => (
          <span key={level} className={strength >= level ? `is-level-${strength}` : ""} />
        ))}
      </div>
      <span id={id}>{strengthLabels[strength]}</span>
    </div>
  );
}
