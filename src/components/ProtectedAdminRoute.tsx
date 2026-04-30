import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section className="auth-screen">
        <div className="auth-card">
          <div className="section-label">Checking Session</div>
          <h2 className="admin-title">Opening the admin workspace…</h2>
          <p className="auth-copy">
            Verifying your admin session before loading the editing tools.
          </p>
        </div>
      </section>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
