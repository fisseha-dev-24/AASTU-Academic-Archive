// Simple API base constant used across the app.
// Prefer setting REACT_APP_API_BASE at build/runtime to point to your Laravel backend.
export const API_BASE = (globalThis as any).process?.env?.REACT_APP_API_BASE || "http://localhost:8000/api";
