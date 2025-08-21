import React, { useEffect, useState } from "react";
import { API_BASE } from "../../services/api";

/**
 * Exams page
 * - Lists exam papers (filter by year / department)
 * - Allows preview or download
 * - Endpoint assumed: GET /exams or /documents?type=exam
 */

type ExamItem = {
  id: number;
  title: string;
  course?: string;
  year?: string;
  department?: string;
  uploadedAt?: string;
  isVerified?: boolean;
  downloads?: number;
};

export default function Exams(): React.ReactElement {
  const [items, setItems] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [yearFilter, setYearFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchExams() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("type", "exam");
        if (yearFilter) params.set("year", yearFilter);
        if (deptFilter) params.set("department", deptFilter);

        const res = await fetch(`${API_BASE}/documents?${params.toString()}`);
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const payload = await res.json();
        if (!cancelled) setItems(payload?.data ?? []);
      } catch (err) {
        if (!cancelled) {
          console.warn("Exams: using mock data", err);
          setItems([
            { id: 1, title: "Final Exam - Data Structures 2022", course: "Data Structures", year: "2022", department: "Computer Science", isVerified: true, downloads: 120 },
            { id: 2, title: "Midterm - Operating Systems 2021", course: "Operating Systems", year: "2021", department: "Computer Science", isVerified: false, downloads: 45 },
          ]);
          setError("Could not fetch from server; showing sample exams.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchExams();
    return () => {
      cancelled = true;
    };
  }, [yearFilter, deptFilter]);

  function handlePreview(item: ExamItem) {
    alert(`Preview: ${item.title}\nCourse: ${item.course}\nYear: ${item.year}`);
  }

  function handleDownload(item: ExamItem) {
    alert(`Download requested: ${item.title}`);
  }

  return (
    <section aria-labelledby="exams-heading" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 id="exams-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Exam papers</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input className="input" placeholder="Filter by year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} />
          <input className="input" placeholder="Filter by department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} />
        </div>
      </div>

      {loading && <div>Loading exams…</div>}
      {!loading && items.length === 0 && <div className="card">No exam papers found.</div>}
      {error && <div role="alert" style={{ color: "var(--danger)" }}>{error}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it) => (
          <div key={it.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{it.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{it.course} • {it.department} • {it.year}</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, padding: "6px 8px", borderRadius: 8, background: it.isVerified ? "rgba(16,163,127,0.08)" : "rgba(245,158,11,0.06)", color: it.isVerified ? "var(--success)" : "var(--warning)", fontWeight: 700 }}>
                {it.isVerified ? "Verified" : "Pending"}
              </span>
              <button className="btn" onClick={() => handlePreview(it)}>Preview</button>
              <button className="btn btn--ghost" onClick={() => handleDownload(it)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
