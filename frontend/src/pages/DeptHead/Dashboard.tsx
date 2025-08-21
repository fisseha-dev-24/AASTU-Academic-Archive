import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { API_BASE } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

/**
 * Department Head — Approval workflow
 *
 * - Lists documents awaiting department-head review.
 * - Supports single and bulk approve/reject with optional reason.
 * - Shows a detail panel with metadata and an audit trail for each item.
 * - Provides search, simple filters and pagination.
 *
 * Notes:
 * - Endpoints assumed: GET /approvals?role=dept_head, POST /approvals/:id/approve, POST /approvals/:id/reject
 * - Bulk endpoints assumed: POST /approvals/bulk/approve and /approvals/bulk/reject (adjust as needed)
 * - Fallback to mock data so the UI is testable without backend changes.
 */

type AuditEntry = {
  id: number;
  action: "uploaded" | "submitted" | "reviewed" | "approved" | "rejected" | "comment";
  by?: string;
  at: string;
  note?: string;
};

type ApprovalItem = {
  id: number;
  title: string;
  uploaderName: string;
  uploaderRole?: string;
  department?: string;
  year?: string;
  docType?: string;
  tags?: string[];
  uploadedAt?: string;
  status?: "pending" | "verified" | "rejected";
  summary?: string;
  history?: AuditEntry[];
};

export default function DeptHeadDashboard(): React.ReactElement {
  const { user } = useAuth() as { user?: any };
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);

  const [active, setActive] = useState<ApprovalItem | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, deptFilter, typeFilter]);

  async function fetchPending() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("role", "dept_head");
      params.set("page", String(page));
      params.set("per_page", String(pageSize));
      if (query) params.set("q", query);
      if (deptFilter) params.set("department", deptFilter);
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`${API_BASE}/approvals?${params.toString()}`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const payload = await res.json();
      const data: ApprovalItem[] = payload?.data ?? payload ?? [];
      setItems(data);
      setTotal(typeof payload?.total === "number" ? payload.total : data.length);
    } catch (err) {
      console.warn("DeptHeadDashboard.fetchPending fallback to mock", err);
      // Mock sample data
      const mock: ApprovalItem[] = [
        {
          id: 9001,
          title: "Student Thesis - Deep Learning Approaches (Draft)",
          uploaderName: "Student A",
          uploaderRole: "student",
          department: "Computer Science",
          year: "2024",
          docType: "thesis",
          tags: ["deep learning", "neural networks"],
          uploadedAt: new Date().toISOString(),
          status: "pending",
          summary: "Thesis draft requiring departmental verification prior to archival.",
          history: [
            { id: 1, action: "uploaded", by: "Student A", at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
            { id: 2, action: "submitted", by: "Student A", at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), note: "Submitted for review" },
          ],
        },
        {
          id: 9002,
          title: "Final Exam - Data Structures 2024",
          uploaderName: "Dr. X",
          uploaderRole: "teacher",
          department: "Computer Science",
          year: "2024",
          docType: "exam",
          tags: ["exam", "data structures"],
          uploadedAt: new Date().toISOString(),
          status: "pending",
          summary: "Final exam requiring departmental sign-off before publishing.",
          history: [{ id: 1, action: "uploaded", by: "Dr. X", at: new Date().toISOString() }],
        },
      ];
      setItems(mock);
      setTotal(mock.length);
      setError("Could not fetch approvals; showing sample items.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: number) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function selectAllVisible() {
    const visibleIds = items.map((i) => i.id);
    const allSelected = visibleIds.every((id) => selected[id]);
    if (allSelected) {
      // deselect all visible
      setSelected((s) => {
        const copy = { ...s };
        visibleIds.forEach((id) => delete copy[id]);
        return copy;
      });
    } else {
      setSelected((s) => {
        const copy = { ...s };
        visibleIds.forEach((id) => (copy[id] = true));
        return copy;
      });
    }
  }

  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[Number(k)]).map((k) => Number(k)), [selected]);

  async function approveOne(id: number, reason?: string) {
    if (!window.confirm("Mark this document as approved?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/approvals/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: reason ?? "" }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      // Optimistic UI update
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelected((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      alert("Approve failed; try again.");
    } finally {
      setActionLoading(false);
    }
  }

  async function rejectOne(id: number, reason?: string) {
    const note = reason ?? window.prompt("Enter rejection reason (optional):") ?? "";
    if (note === null) return; // cancelled
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/approvals/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelected((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      alert("Reject failed; try again.");
    } finally {
      setActionLoading(false);
    }
  }

  async function bulkAction(action: "approve" | "reject") {
    if (selectedIds.length === 0) {
      alert("No items selected.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to ${action} ${selectedIds.length} item(s)?`);
    if (!confirmed) return;

    setActionLoading(true);
    try {
      // Try bulk endpoint first
      const endpoint = `${API_BASE}/approvals/bulk/${action}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) {
        // If bulk endpoint is not available, fallback to sequential calls
        throw new Error("Bulk endpoint failed, falling back to sequential");
      }

      // remove items locally
      setItems((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
      setSelected({});
    } catch (err) {
      // fallback sequentially
      for (const id of selectedIds) {
        try {
          if (action === "approve") {
            await fetch(`${API_BASE}/approvals/${id}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: "" }) });
          } else {
            await fetch(`${API_BASE}/approvals/${id}/reject`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: "" }) });
          }
          setItems((prev) => prev.filter((i) => i.id !== id));
        } catch {
          console.warn(`Failed ${action} for id ${id}`);
        }
      }
      setSelected({});
    } finally {
      setActionLoading(false);
    }
  }

  function openDetail(item: ApprovalItem) {
    setActive(item);
    setAuditOpen(true);
  }

  function closeDetail() {
    setActive(null);
    setAuditOpen(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: 1200, margin: "24px auto", width: "100%", display: "grid", gridTemplateColumns: "240px 1fr", gap: 18, padding: "0 16px" }}>
        <aside>
          <Sidebar>
            <nav aria-label="Department head menu" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontWeight: 700, color: "var(--aastu-primary-600)" }}>Approvals</div>
              <div className="u-muted" style={{ fontSize: 13 }}>Department review queue</div>

              <div style={{ height: 1, background: "var(--muted-border)", margin: "12px 0" }} />

              <button className="btn" onClick={() => { setPage(1); fetchPending(); }}>Refresh</button>
              <button className="btn" onClick={() => bulkAction("approve")}>Bulk approve</button>
              <button className="btn" onClick={() => bulkAction("reject")}>Bulk reject</button>
            </nav>
          </Sidebar>
        </aside>

        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Department approvals</h2>
              <div className="u-muted" style={{ fontSize: 13 }}>Review and sign off documents submitted to your department</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="input" placeholder="Search title, uploader or tag" value={query} onChange={(e) => setQuery(e.target.value)} />
              <input className="input" placeholder="Department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} />
              <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All types</option>
                <option value="thesis">Thesis</option>
                <option value="exam">Exam</option>
                <option value="lecture-note">Lecture note</option>
                <option value="other">Other</option>
              </select>
              <button className="btn" onClick={() => { setPage(1); fetchPending(); }}>Apply</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" onChange={selectAllVisible} aria-label="Select all visible" />
              <span className="u-muted">Select visible</span>
            </label>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => bulkAction("approve")} disabled={actionLoading}>Approve selected</button>
              <button className="btn" onClick={() => bulkAction("reject")} disabled={actionLoading}>Reject selected</button>
            </div>
          </div>

          {loading && <div>Loading approvals…</div>}
          {!loading && error && <div role="alert" style={{ color: "var(--danger)" }}>{error}</div>}
          {!loading && items.length === 0 && <div className="card">No documents awaiting your review.</div>}

          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => (
              <article key={it.id} className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={!!selected[it.id]} onChange={() => toggleSelect(it.id)} aria-label={`Select ${it.title}`} />
                  </label>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{it.docType?.toUpperCase()}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--aastu-primary-600)" }}>{it.title}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{it.uploaderName} • {it.department} • {it.year}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => openDetail(it)}>Open</button>
                      <button className="btn btn--primary" onClick={() => approveOne(it.id)} disabled={actionLoading}>Approve</button>
                      <button className="btn btn--ghost" onClick={() => rejectOne(it.id)} disabled={actionLoading}>Reject</button>
                    </div>
                  </div>

                  {it.summary && <p style={{ marginTop: 8, color: "var(--text-muted)" }}>{it.summary}</p>}

                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(it.tags || []).map((t) => (
                      <span key={t} style={{ fontSize: 12, background: "rgba(11,61,145,0.04)", color: "var(--aastu-primary-600)", padding: "4px 8px", borderRadius: 8 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination (simple) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div className="u-muted" style={{ fontSize: 13 }}>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <button className="btn" onClick={() => setPage((p) => p + 1)} disabled={page * pageSize >= total}>Next</button>
            </div>
          </div>
        </main>
      </div>

      {/* Detail / audit modal */}
      {auditOpen && active && (
        <div role="dialog" aria-modal="true" aria-label={`Details for ${active.title}`} style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(2,6,23,0.6)", zIndex: 70, padding: 20
        }}>
          <div style={{ width: "min(1000px, 96%)", background: "var(--surface)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
              <div>
                <div style={{ fontWeight: 800 }}>{active.title}</div>
                <div className="u-muted" style={{ fontSize: 13 }}>{active.uploaderName} • {active.department} • {active.year}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => { /* placeholder for opening file preview */ alert("Open document preview — integrate with viewer"); }}>Preview</button>
                <button className="btn btn--primary" onClick={() => { approveOne(active.id); closeDetail(); }}>Approve</button>
                <button className="btn btn--ghost" onClick={() => { rejectOne(active.id); closeDetail(); }}>Reject</button>
                <button className="btn" onClick={closeDetail}>Close</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12, padding: 12 }}>
              <div>
                <div style={{ marginBottom: 8, color: "var(--text-muted)" }}>{active.summary}</div>

                <div style={{ marginTop: 12 }}>
                  <h4 style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Metadata</h4>
                  <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                    <li><strong>Type:</strong> {active.docType}</li>
                    <li><strong>Department:</strong> {active.department}</li>
                    <li><strong>Year:</strong> {active.year}</li>
                    <li><strong>Uploaded:</strong> {new Date(active.uploadedAt || "").toLocaleString()}</li>
                  </ul>
                </div>
              </div>

              <aside>
                <h4 style={{ marginTop: 0, color: "var(--aastu-primary-600)" }}>Audit trail</h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {(active.history || []).map((h) => (
                    <div key={h.id} className="card" style={{ padding: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-muted)" }}>{h.action}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{h.by} • {new Date(h.at).toLocaleString()}</div>
                      {h.note && <div style={{ marginTop: 6, color: "var(--text-muted)" }}>{h.note}</div>}
                    </div>
                  ))}
                  {(!active.history || active.history.length === 0) && <div className="card">No audit entries available.</div>}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
