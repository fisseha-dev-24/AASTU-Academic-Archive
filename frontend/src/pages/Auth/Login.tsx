import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

/**
 * Login page (accessible, validated, redirects by role)
 *
 * Notes:
 * - This page performs a simple POST to `${API_BASE}/auth/login`. Adjust endpoint to match your Laravel backend.
 * - On success it stores the token in localStorage and sets the authenticated user via useAuth().
 * - Redirects users to role-specific dashboard routes.
 * - Students are the only role allowed to self-register; other roles are created by admin.
 */

type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "student" | "teacher" | "department_head" | "dean" | "admin" | string;
  };
};

const roleRoutes: Record<string, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  department_head: "/depthead/dashboard",
  dean: "/dean/dashboard",
  admin: "/admin/dashboard",
};

export default function Login(): React.ReactElement {
  const navigate = useNavigate();
  const { setUser } = useAuth() as { setUser: (u: any) => void };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";

    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const message = payload?.message || "Invalid credentials or server error.";
        setError(message);
        setLoading(false);
        return;
      }

      const data = (await res.json()) as LoginResponse;

      // persist token (simple approach)
      try {
        if (remember) localStorage.setItem("aastu_token", data.token);
        else sessionStorage.setItem("aastu_token", data.token);
      } catch {
        // ignore storage errors (e.g., private mode)
      }

      // set user in auth context
      setUser && setUser(data.user);

      // route by role
      const route = roleRoutes[data.user.role] || "/";
      navigate(route, { replace: true });
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
      <div style={{ width: 680, maxWidth: "100%", background: "var(--surface)", borderRadius: 12, boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", minHeight: 380 }}>
          <div style={{ padding: 28 }}>
            <h2 style={{ marginTop: 0, marginBottom: 6, color: "var(--aastu-primary-600)" }}>Welcome back</h2>
            <p style={{ marginTop: 0, marginBottom: 18, color: "var(--text-muted)" }}>
              Sign in to access the AASTU Archive. Students register via the Sign up page; other roles are created by the admin.
            </p>

            <form onSubmit={handleSubmit} aria-describedby="form-error" noValidate>
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="email" style={{ display: "block", fontSize: "0.9rem", marginBottom: 6 }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <div id="email-error" role="alert" style={{ color: "var(--danger)", marginTop: 6, fontSize: "0.875rem" }}>
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="password" style={{ display: "block", fontSize: "0.9rem", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 6,
                      height: "calc(100% - 12px)",
                      border: "none",
                      background: "transparent",
                      color: "var(--aastu-primary-600)",
                      padding: "6px 8px",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div id="password-error" role="alert" style={{ color: "var(--danger)", marginTop: 6, fontSize: "0.875rem" }}>
                    {fieldErrors.password}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Remember me</span>
                </label>

                <Link to="/forgot-password" style={{ fontSize: 13, color: "var(--aastu-primary-600)" }}>
                  Forgot password?
                </Link>
              </div>

              <div>
                <button type="submit" className="btn btn--primary" disabled={loading} aria-busy={loading} style={{ width: "100%" }}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              {/* Form-level error */}
              {error && (
                <div id="form-error" role="alert" aria-live="assertive" style={{ marginTop: 12, color: "var(--danger)" }}>
                  {error}
                </div>
              )}
            </form>

            <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-muted)" }}>
              New here? <Link to="/signup" style={{ color: "var(--aastu-primary-600)", fontWeight: 600 }}>Create a student account</Link>.
            </div>
          </div>

          <div style={{ padding: 28, background: "linear-gradient(180deg, rgba(11,61,145,0.06), transparent)" }}>
            <h3 style={{ marginTop: 0, color: "var(--aastu-primary-600)" }}>Why sign in?</h3>
            <ul style={{ paddingLeft: 18, color: "var(--text-muted)", marginTop: 8 }}>
              <li>Access verified documents and department resources.</li>
              <li>Save searches and bookmark documents.</li>
              <li>Submit suggestions and request materials from staff.</li>
            </ul>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Need help?</div>
              <a href="mailto:support@aastu.edu.et" style={{ color: "var(--aastu-primary-600)", display: "inline-block", marginTop: 8 }}>
                Contact archive support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
