/**
 * services/client.ts
 *
 * Small fetch wrapper used across the app.
 * - Attaches Bearer token (from localStorage/sessionStorage) automatically.
 * - Handles JSON request/response bodies.
 * - Throws ApiError with structured payload on non-2xx responses.
 *
 * Keep this file independent of services/auth to avoid circular imports.
 */

import { API_BASE } from "./api";

export type RequestOptions = RequestInit & { noJson?: boolean };

export class ApiError extends Error {
  status: number;
  statusText: string;
  body: any | null;
  constructor(status: number, statusText: string, body: any | null) {
    super(`${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

function getToken(): string | null {
  try {
    // prefer localStorage (remember me) fallback to sessionStorage
    const t = localStorage.getItem("aastu_token");
    if (t) return t;
    return sessionStorage.getItem("aastu_token");
  } catch {
    return null;
  }
}

async function request(path: string, opts: RequestOptions = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;

  const token = getToken();

  const headers: Record<string, string> = {
    ...(opts.headers ? (opts.headers as Record<string, string>) : {}),
  };

  // If body is a plain object and not FormData and not explicitly noJson, stringify it
  if (opts.body && !(opts.body instanceof FormData) && typeof opts.body === "object" && !opts.noJson) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    // @ts-ignore - safe to stringify
    opts.body = JSON.stringify(opts.body);
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let body: any = null;
  if (isJson) {
    try {
      body = await res.json();
    } catch {
      body = null;
    }
  } else if (opts.noJson) {
    body = null;
  } else {
    // try text fallback
    try {
      body = await res.text();
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, body);
  }

  return body;
}

export async function apiGet(path: string, opts: RequestOptions = {}) {
  return request(path, { ...opts, method: "GET" });
}

export async function apiPost(path: string, body?: any, opts: RequestOptions = {}) {
  return request(path, { ...opts, method: "POST", body });
}

export async function apiPut(path: string, body?: any, opts: RequestOptions = {}) {
  return request(path, { ...opts, method: "PUT", body });
}

export async function apiDelete(path: string, opts: RequestOptions = {}) {
  return request(path, { ...opts, method: "DELETE" });
}

export default {
  request,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  ApiError,
};
