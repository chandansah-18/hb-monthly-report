import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readApiResponse(response: Response) {
  try {
    return (await response.json()) as { authenticated?: boolean; message?: string };
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "include",
      });
      const payload = await readApiResponse(response);
      setStatus(payload.authenticated ? "authenticated" : "unauthenticated");
    } catch {
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (password: string) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    const payload = await readApiResponse(response);

    if (!response.ok || !payload.authenticated) {
      setStatus("unauthenticated");
      throw new Error(payload.message ?? "Login failed.");
    }

    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      refreshSession,
    }),
    [login, logout, refreshSession, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
