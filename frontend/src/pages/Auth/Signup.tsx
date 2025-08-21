import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

/**
 * Student signup page (students only)
 *
 * - Performs client-side validation for common fields.
 * - Posts to `${API_BASE}/auth/register` (adjust if your backend uses a different route).
 * - On success: if the backend returns a token + user, we persist token and setUser then redirect to student dashboard.
 *   Otherwise we show a success message and a link to sign in.
 *
 * Notes:
 * - The backend must enforce that only students can self-register; other roles are created by admin.
 * - Keep the form fairly minimal: name, email, student id, department, year, password.
 */

type RegisterResponse = {
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  message?: string;
};

export default function Signup(): React.ReactElement {
  const navigate = useNavigate();
  const { setUser } = useAuth() as { setUser?: (u: any) => void };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!studentId.trim()) errs.studentId = "Student ID is required.";
    if (!department.trim()) errs.department = "Department is required.";
    if (!year.trim()) errs.year = "Year is required.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (password !== confirm) errs.confirm = "Passwords do not match.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        student_id: studentId.trim(),
        department: department.trim(),
        year: year.trim(),
        password,
        role: "student",
      };

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as RegisterResponse;

      if (!res.ok) {
        // Try to parse field-level errors from backend (common Laravel shape)
        if ((data as any).errors) {
          const serverErrors: Record<string, string> = {};
          const errors = (data as any).errors;
          for (const k of Object.keys(errors)) {
            serverErrors[k] = Array.isArray(errors[k]) ? errors[k][0] : String(errors[k]);
          }
          setFieldErrors((prev) => ({ ...prev, ...serverErrors }));
        }
        setFormError(data.message || "Registration failed. Please check your input.");
        setLoading(false);
        return;
      }

      // If backend returned token + user, persist and set auth
      if (data.token && data.user) {
        try {
          localStorage.setItem("aastu_token", data.token);
        } catch {
          // ignore storage issue
        }
        setUser && setUser(data.user);
        // Redirect students to their dashboard
        navigate("/student/dashboard", { replace: true });
        return;
      }

      // Otherwise show success message and invite to login
      setSuccessMessage(data.message || "Registration successful. Please sign in.");
      // Optionally redirect to login after a short delay:
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setFormError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
      <div style={{ width: 820, maxWidth: "100%", background: "var(--surface)", borderRadius: 12, boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", minHeight: 520 }}>
          <div style={{ padding: 28 }}>
            <h2 style={{ marginTop: 0, marginBottom: 6, color: "var(--aastu-primary-600)" }}>Create a student account</h2>
            <p style={{ marginTop: 0, marginBottom: 20, color: "var(--text-muted)" }}>
              Students may self-register. Teachers, department heads, deans and admins are created by the system administrator.
            </p>

            <form onSubmit={handleSubmit} noValidate aria-live="polite">
              <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
                <div>
                  <label htmlFor="name" style={{ display: "block", marginBottom: 6 }}>Full name</label>
                  <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!fieldErrors.name} />
                  {fieldErrors.name && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.name}</div>}
                </div>

                <div>
                  <label htmlFor="email" style={{ display: "block", marginBottom: 6 }}>Email</label>
                  <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fieldErrors.email} />
                  {fieldErrors.email && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.email}</div>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label htmlFor="studentId" style={{ display: "block", marginBottom: 6 }}>Student ID</label>
                    <input id="studentId" className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)} aria-invalid={!!fieldErrors.studentId} />
                    {fieldErrors.studentId && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.studentId}</div>}
                  </div>

                  <div>
                    <label htmlFor="department" style={{ display: "block", marginBottom: 6 }}>Department</label>
                    <input id="department" className="input" value={department} onChange={(e) => setDepartment(e.target.value)} aria-invalid={!!fieldErrors.department} />
                    {fieldErrors.department && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.department}</div>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label htmlFor="year" style={{ display: "block", marginBottom: 6 }}>Year (e.g., 2nd, 3rd)</label>
                    <input id="year" className="input" value={year} onChange={(e) => setYear(e.target.value)} aria-invalid={!!fieldErrors.year} />
                    {fieldErrors.year && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.year}</div>}
                  </div>

                  <div>
                    <label htmlFor="password" style={{ display: "block", marginBottom: 6 }}>Password</label>
                    <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!fieldErrors.password} />
                    {fieldErrors.password && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.password}</div>}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm" style={{ display: "block", marginBottom: 6 }}>Confirm password</label>
                  <input id="confirm" type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={!!fieldErrors.confirm} />
                  {fieldErrors.confirm && <div role="alert" style={{ color: "var(--danger)", marginTop: 6 }}>{fieldErrors.confirm}</div>}
                </div>
              </div>

              <div style={{ marginTop: 6 }}>
                <button type="submit" className="btn btn--primary" disabled={loading} style={{ width: "100%" }}>
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>

              {formError && <div role="alert" style={{ marginTop: 12, color: "var(--danger)" }}>{formError}</div>}
              {successMessage && <div role="status" style={{ marginTop: 12, color: "var(--aastu-primary-600)" }}>{successMessage}</div>}
            </form>

            <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-muted)" }}>
              Already have an account? <Link to="/login" style={{ color: "var(--aastu-primary-600)", fontWeight: 600 }}>Sign in</Link>.
            </div>
          </div>

          <aside style={{ padding: 28, background: "linear-gradient(180deg, rgba(11,61,145,0.04), transparent)" }}>
            <h3 style={{ marginTop: 0, color: "var(--aastu-primary-600)" }}>Registration tips</h3>
            <ul style={{ paddingLeft: 18, color: "var(--text-muted)", marginTop: 8 }}>
              <li>Use your official AASTU email when possible.</li>
              <li>Provide accurate department and year so materials are filtered correctly.</li>
              <li>If the admin already created your account, use your provided credentials to sign in instead.</li>
            </ul>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Questions?</div>
              <a href="mailto:support@aastu.edu.et" style={{ color: "var(--aastu-primary-600)", display: "inline-block", marginTop: 8 }}>
                Contact archive support
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
