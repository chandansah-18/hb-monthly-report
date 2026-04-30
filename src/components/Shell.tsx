import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Shell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/dashboard");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Huntsmen &amp; Barons</div>
          <h1 className="topbar-title">Monthly Recruitment Reporting Hub</h1>
        </div>
        <nav className="topbar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-chip${isActive ? " active" : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-chip${isActive ? " active" : ""}`}
          >
            Admin
          </NavLink>
          {isAuthenticated ? (
            <button className="nav-chip nav-chip-button" type="button" onClick={handleLogout}>
              Log Out
            </button>
          ) : null}
        </nav>
      </header>
      {children}
    </div>
  );
}
