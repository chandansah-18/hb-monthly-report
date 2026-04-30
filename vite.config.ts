import { handleLogin, handleLogout, handleSession } from "./api/_lib/adminAuth.js";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function adminApiDevPlugin() {
  return {
    name: "admin-api-dev-plugin",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use("/api/admin/login", async (req, res) => {
        await handleLogin(req, res);
      });

      server.middlewares.use("/api/admin/logout", (req, res) => {
        handleLogout(req, res);
      });

      server.middlewares.use("/api/admin/session", (req, res) => {
        handleSession(req, res);
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [react(), command === "serve" ? adminApiDevPlugin() : null].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
