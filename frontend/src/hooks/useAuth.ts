import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, ApiError } from "../services/client";
import { API_BASE } from "../services/api";

/**
 * Lightweight Auth context + hook.
 *
 * - Keeps current user in context.
 * - Exposes setUser, login (helper), logout.
 * - On mount, if a token exists in storage, attempts to fetch /auth/me and populate user.
 *
 * Usage:
 * const { user, setUser, login, logout, loading } = useAuth();
 */

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
  [k: string]: any;
} | null;

type AuthContextValue = {
  user: User;
  setUser: (u: User) => void;
  loading: boolean;
  login?: (email: string, password: string, remember?: boolean) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On mount, if token present, try to fetch current user
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // If no token, skip call
        const token = (() => {
          try {
            return localStorage.getItem("aastu_token") || sessionStorage.getItem("aastu_token") || null;
          } catch {
            return null;
          }
        })();

        if (!token) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // /auth/me is a common pattern; adjust if your backend uses another endpoint
        const payload = await apiGet("/auth/me");
        if (!cancelled) {
          setUser(payload?.user ?? payload ?? null);
        }
      } catch (err) {
        // If 401, clear tokens
        if (err instanceof ApiError && err.status === 401) {
          try {
            localStorage.removeItem("aastu_token");
            sessionStorage.removeItem("aastu_token");
          } catch {}
          if (!cancelled) setUser(null);
        } else {
          // other errors: keep user null but don't crash
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Helper login function that performs auth and persists token if returned.
  // Note: your existing Login page already handles token persistence; this helper is optional.
  async function login(email: string, password: string, remember = false): Promise<User> {
    const res = await apiPost("/auth/login", { email, password });
    // Expect shape { token, user } — adjust if your backend differs
    const token = (res && (res as any).token) || null;
    const u = (res && (res as any).user) || null;

    if (token) {
      try {
        if (remember) localStorage.setItem("aastu_token", token);
        else sessionStorage.setItem("aastu_token", token);
      } catch {
        // ignore storage errors
      }
    }

    setUser(u);
    return u;
  }

  function logout() {
    try {
      localStorage.removeItem("aastu_token");
      sessionStorage.removeItem("aastu_token");
    } catch {}
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, setUser: (u: User) => setUser(u), loading, login, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  const Provider = AuthContext.Provider;
  return React.createElement(Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
