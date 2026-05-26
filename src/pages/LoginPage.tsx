import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../api/client.ts";
import { useAuth } from "../context/AuthContext.tsx";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          Kitaab<span className="sidebar-brand-sub">Backoffice</span>
        </div>
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-subtitle">Use your Kitaab account to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Password</span>
            <div className="auth-input-group">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPassword((v) => !v)}
                disabled={submitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting || !email || !password}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
