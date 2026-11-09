import { FiLoader } from "react-icons/fi";

type AuthLoadingProps = {
  message?: string;
};

export default function AuthLoading({ message = "Checking your secure link…" }: AuthLoadingProps) {
  return (
    <div className="auth-loading" role="status" aria-live="polite">
      <FiLoader className="auth-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
