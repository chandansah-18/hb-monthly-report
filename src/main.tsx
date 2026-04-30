import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { ReportProvider } from "./report/ReportContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReportProvider>
          <App />
        </ReportProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
