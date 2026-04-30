import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AdminScreen } from "./screens/AdminScreen";
import { AdminLoginScreen } from "./screens/AdminLoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { useReport } from "./report/ReportContext";

export default function App() {
  const { publishedReport } = useReport();

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardScreen report={publishedReport} />} />
        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminScreen />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Shell>
  );
}
