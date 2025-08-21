import React, { useEffect, useState } from "react";
import { API_BASE } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

/**
 * Suggestions page
 * - Students can submit suggestions/request materials
 * - Shows a list of previously submitted suggestions with status
 * - Uses POST /suggestions and GET /suggestions (adjust to backend)
 */

type SuggestionItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  response?: string;
};

export default function Suggestions(): React.ReactElement {
  const { user } = useAuth() as { user?: any };
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const categories = ["General", "Document request", "Correction", "Other"];

  useEffect(() => {
    let cancelled = false;
    async function fetchSuggestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/suggestions`);
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const payload = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(payload?.data) ? payload.data : payload ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("Suggestions: falling back to mock", err);
          setItems([
            {
              id: 101,
              title: "Request: More past exams for Algorithms",
              description: "Please upload past final exams for the Algorithms course (2017-2021).",
              category: "Document request",
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            {
              id: 102,
              title: "Typo in Data Structures lecture note",
              description: "There's a typo on page 12 of the Data Structures lecture note.",
              category: "Correction",
              status: "accepted",
              createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
              response: "Thanks — corrected and re-uploaded.",
            },
          ]);
          setError("Unable to fetch from server; showing sample suggestions.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSuggestions();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) return setFormError("Title is required.");
    if (!description.trim()) return setFormError("Description is required.");

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        user_id: user?.id,
      };

      const res = await fetch(`${API_BASE}/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const js = await res.json().catch(() => null);
        throw new Error(js?.message || `Server ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      // If backend returns created item, prepend it; otherwise create optimistic item
      const created: SuggestionItem = data?.data ?? {
        id: Date.now(),
        title: payload.title,
        description: payload.description,
        category: payload.category,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setItems((s) => [created, ...s]);
      setTitle("");
      setDescription("");
      setCategory("General");
    } catch (err: any) {
      console.error("Suggestion submit failed", err);
      setFormError(err?.message || "Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="suggestions-heading" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 id="suggestions-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Suggestions & Requests</h3>
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Submit improvements or request missing materials</div>
      </div>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Title</div>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary of your suggestion" />
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Category</div>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Description</div>
            <textarea className="input" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you want or the issue you've found" />
          </label>

          {formError && <div role="alert" style={{ color: "var(--danger)" }}>{formError}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Sending…" : "Submit suggestion"}</button>
            <button type="button" className="btn" onClick={() => { setTitle(""); setDescription(""); setCategory("General"); }}>Reset</button>
          </div>
        </form>

        <aside style={{ paddingLeft: 6 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Please be concise and include course/department details where relevant. Suggestions are reviewed by archive staff.
          </div>

          <div style={{ marginTop: 14 }}>
            <strong style={{ color: "var(--aastu-primary-600)" }}>Recent suggestions</strong>
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", display: "grid", gap: 8 }}>
              {items.slice(0, 6).map((s) => (
                <li key={s.id} className="card" style={{ padding: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.category} • {new Date(s.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: s.status === "pending" ? "var(--warning)" : s.status === "accepted" ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>
                        {s.status}
                      </div>
                      {s.response && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{s.response}</div>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div>
        <h4 style={{ marginTop: 0 }}>All suggestions</h4>
        {loading && <div>Loading…</div>}
        {!loading && items.length === 0 && <div className="card">No suggestions yet — be the first to suggest an improvement.</div>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {items.map((s) => (
            <li key={s.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.category} • {new Date(s.createdAt).toLocaleString()}</div>
                  <p style={{ marginTop: 8, color: "var(--text-muted)" }}>{s.description}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: s.status === "pending" ? "var(--warning)" : s.status === "accepted" ? "var(--success)" : "var(--danger)" }}>{s.status}</div>
                  {s.response && <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>{s.response}</div>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error && <div role="alert" style={{ color: "var(--danger)" }}>{error}</div>}
    </section>
  );
}
