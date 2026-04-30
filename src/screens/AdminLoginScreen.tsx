import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AdminLoginScreen() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(password);
      const nextPath =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof location.state.from === "object" &&
        location.state.from !== null &&
        "pathname" in location.state.from &&
        typeof location.state.from.pathname === "string"
          ? location.state.from.pathname
          : "/admin";
      navigate(nextPath, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-screen">
      <div className="auth-card">
        <div className="section-label">Admin Access</div>
        <h2 className="admin-title">Protected editing portal</h2>
        <p className="auth-copy">
          The dashboard is public, but the admin tools require the configured password. Once you
          sign in, your browser keeps a short-lived secure session.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Admin password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter admin password"
              required
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Unlocking…" : "Unlock Admin Portal"}
          </button>
        </form>
      </div>
    </section>
  );
}
