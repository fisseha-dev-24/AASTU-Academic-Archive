/**
 * services/auth.ts
 *
 * Lightweight auth helpers that orchestrate token storage with the API client.
 * - login: call backend, persist token (localStorage when remember=true, otherwise sessionStorage)
 * - logout: attempt server logout then clear local token
 * - me: fetch current user from /auth/me (or similar) and clear token on 401
 * - utility: saveToken/getToken/clearToken
 *
 * This file uses the client (apiPost/apiGet) but does not invert the dependency (client doesn't import auth).
 */

import { apiPost, apiGet, ApiError } from "./client";

const TOKEN_KEY = "aastu_token";

export function saveToken(token: string, remember = false) {
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      try {
        sessionStorage.removeItem(TOKEN_KEY);
      } catch {}
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {}
    }
  } catch {
    // storage can fail in some environments (privacy mode) — ignore
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/**
 * login(email, password, remember)
 * - calls POST /auth/login
 * - expected shapes (flexible):
 *   { token, user }
 *   { access_token, user }
 *   { data: { token, user } }
 *
 * Returns: { user, token } on success
 */
export async function login(email: string, password: string, remember = false): Promise<{ user: any | null; token: string | null }> {
  const payload = { email, password };
  const res = await apiPost("/auth/login", payload);

  // try several common locations for token & user
  const token: string | null =
    (res && (res as any).token) ||
    (res && (res as any).access_token) ||
    (res && (res as any).data && (res as any).data.token) ||
    null;

  const user: any | null =
    (res && (res as any).user) ||
    (res && (res as any).data && (res as any).data.user) ||
    null;

  if (token) {
    saveToken(token, remember);
  }

  return { user, token };
}

/**
 * logout
 * - call POST /auth/logout if available, then clear token locally.
 */
export async function logout(): Promise<void> {
  try {
    // call server to revoke token if endpoint exists; ignore failures
    await apiPost("/auth/logout", {});
  } catch (err) {
    // ignore errors, we'll clear token locally anyway
  } finally {
    clearToken();
  }
}

/**
 * fetch current user
 * - tries GET /auth/me and returns user object or null
 * - clears token if 401 returned
 */
export async function me(): Promise<any | null> {
  try {
    const res = await apiGet("/auth/me");
    // backend may return { user: {...} } or user directly
    return (res && (res as any).user) ? (res as any).user : res;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      clearToken();
      return null;
    }
    // rethrow unexpected errors so callers can handle them
    throw err;
  }
}

export default {
  saveToken,
  getToken,
  clearToken,
  login,
  logout,
  me,
};
