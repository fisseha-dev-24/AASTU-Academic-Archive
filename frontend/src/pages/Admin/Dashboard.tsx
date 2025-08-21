import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { apiGet, apiPost, ApiError } from "../../services/client";
import { useAuth } from "../../hooks/useAuth";

/**
 * Admin Dashboard
 *
 * - User & role management: list users, change role, deactivate/reactivate, send invite
 * - Global audit log: view recent audit entries and export CSV
 * - Search, simple filtering and pagination
 *
 * Notes:
 * - Endpoints assumed:
 *   GET /admin/users?page=..&per_page=..&q=..
 *   POST /admin/users/:id/role  { role: "teacher" }
 *   POST /admin/users/:id/deactivate
 *   POST /admin/users/:id/reactivate
 *   POST /admin/invite  { email, role }
 *   GET  /admin/audit?page=..&per_page=..&q=..
 *
 * - This file uses apiGet/apiPost for requests and falls back to mock data when the backend is unavailable.
 */

type UserItem = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  department?: string | null;
  createdAt?: string;
};

type AuditEntry = {
  id: number;
  action: string;
  by?: string;
  at: string;
  note?: string;
  target?: string;
};

export default function AdminDashboard(): React.ReactElement {
  const { user } = useAuth() as { user?: any };
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [totalUsers, setTotalUsers] = useState(0);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("student");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, query, roleFilter]);

  useEffect(() => {
    fetchAudit();
  }, []);

  async function fetchUsers() {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", String(pageSize));
      if (query) params.set("q", query);
      if (roleFilter) params.set("role", roleFilter);

      const payload = await apiGet(`/admin/users?${params.toString()}`);
      const data: UserItem[] = (payload && (payload as any).data) ?? (payload as any) ?? [];
      setUsers(data);
      setTotalUsers(typeof (payload as any)?.total === "number" ? (payload as any).total : data.length);
    } catch (err) {
      console.warn("AdminDashboard.fetchUsers fallback", err);
      // fallback mock
      const mock: UserItem[] = [
        { id: 1, name: "Alice Admin", email: "alice@example.edu", role: "admin", active: true, department: null, createdAt: new Date().toISOString() },
        { id: 2, name: "Dr. X", email: "drx@uni.edu", role: "teacher", active: true, department: "Computer Science", createdAt: new Date().toISOString() },
        { id: 3, name: "Student B", email: "studentb@uni.edu", role: "student", active: false, department: "Engineering", createdAt: new Date().toISOString() },
      ];
      setUsers(mock);
      setTotalUsers(mock.length);
      setUsersError("Could not fetch users; showing sample data.");
    } finally {
      setUsersLoading(false);
    }
  }

  async function fetchAudit() {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const payload = await apiGet(`/admin/audit?page=1&per_page=20`);
      const data: AuditEntry[] = (payload && (payload as any).data) ?? (payload as any) ?? [];
      setAudit(data);
    } catch (err) {
      console.warn("AdminDashboard.fetchAudit fallback", err);
      const mock: AuditEntry[] = [
        { id: 1, action: "user_created", by: "system", at: new Date().toISOString(), target: "studentb@uni.edu", note: "Self-registered" },
        { id: 2, action: "role_changed", by: "alice@example.edu", at: new Date().toISOString(), target: "drx@uni.edu", note: "student → teacher" },
      ];
      setAudit(mock);
      setAuditError("Could not fetch audit log; showing sample entries.");
    } finally {
      setAuditLoading(false);
    }
  }

  async function changeRole(userId: number, newRole: string) {
    if (!window.confirm(`Change role to "${newRole}"?`)) return;
    setActionLoading(true);
    try {
      await apiPost(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setInviteResult(`Role updated to ${newRole}.`);
    } catch (err) {
      console.error("changeRole failed", err);
      setInviteResult((err as any)?.message ?? "Role change failed.");
    } finally {
      setActionLoading(false);
    }
  }

  async function toggleActive(userId: number, makeActive: boolean) {
    const action = makeActive ? "reactivate" : "deactivate";
    if (!window.confirm(`${makeActive ? "Reactivate" : "Deactivate"} this user?`)) return;
    setActionLoading(true);
    try {
      await apiPost(`/admin/users/${userId}/${action}`, {});
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active: makeActive } : u)));
    } catch (err) {
      console.error("toggleActive failed", err);
      alert("Operation failed; try again.");
    } finally {
      setActionLoading(false);
    }
  }

  async function sendInvite(e?: React.FormEvent) {
    e?.preventDefault();
    setInviteResult(null);
    if (!inviteEmail.trim()) {
      setInviteResult("Email required.");
      return;
    }
    setInviteLoading(true);
    try {
      const payload = await apiPost("/admin/invite", { email: inviteEmail.trim(), role: inviteRole });
      setInviteResult((payload as any)?.message ?? "Invite sent.");
      setInviteEmail("");
      setInviteRole("student");
    } catch (err) {
      console.error("Invite failed", err);
      setInviteResult((err as any)?.message ?? "Invite failed.");
    } finally {
      setInviteLoading(false);
    }
  }

  // Export audit to CSV
  function exportAuditCSV() {
    if (!audit || audit.length === 0) {
      alert("No audit entries to export.");
      return;
    }
    const rows = audit.map((a) => ({
      id: a.id,
      action: a.action,
      by: a.by ?? "",
      at: a.at,
      target: a.target ?? "",
      note: a.note ?? "",
    }));
    const header = Object.keys(rows[0]).join(",");
    const csv = [header, ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const roles = useMemo(() => ["student", "teacher", "department_head", "dean", "admin"], []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: 1200, margin: "24px auto", width: "100%", display: "grid", gridTemplateColumns: "240px 1fr", gap: 18, padding: "0 16px" }}>
        <aside>
          <Sidebar>
            <nav aria-label="Admin menu" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontWeight: 700, color: "var(--aastu-primary-600)" }}>Administration</div>
              <div className="u-muted" style={{ fontSize: 13 }}>User & audit management</div>

              <div style={{ height: 1, background: "var(--muted-border)", margin: "12px 0" }} />

              <button className="btn" onClick={() => { setPage(1); fetchUsers(); }}>Refresh users</button>
              <button className="btn" onClick={() => { setInviteResult(null); setInviteEmail(""); }}>New invite</button>
              <button className="btn" onClick={() => { fetchAudit(); }}>Refresh audit</button>
              <button className="btn" onClick={exportAuditCSV}>Export audit CSV</button>
            </nav>
          </Sidebar>
        </aside>

        <main>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Admin dashboard</h2>
              <div className="u-muted" style={{ fontSize: 13 }}>Manage users, roles and review audit logs</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input" placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="">All roles</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={() => { setPage(1); fetchUsers(); }}>Apply</button>
              </div>
            </div>
          </div>

          <section aria-labelledby="users-heading" style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 id="users-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Users</h3>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{totalUsers} users</div>
            </div>

            {usersLoading && <div>Loading users…</div>}
            {!usersLoading && usersError && <div role="alert" style={{ color: "var(--danger)" }}>{usersError}</div>}

            <div style={{ display: "grid", gap: 8 }}>
              {users.map((u) => (
                <div key={u.id} className="card" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{u.name} {u.id === user?.id ? <span style={{ fontSize: 12, color: "var(--text-muted)" }}>(you)</span> : null}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{u.email} • {u.department ?? "—"}</div>
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, padding: "6px 8px", borderRadius: 8, background: "rgba(11,61,145,0.04)", color: "var(--aastu-primary-600)" }}>
                        Role: {u.role}
                      </span>
                      <span style={{ fontSize: 12, padding: "6px 8px", borderRadius: 8, background: u.active ? "rgba(16,163,127,0.06)" : "rgba(245,158,11,0.06)", color: u.active ? "var(--success)" : "var(--warning)" }}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Joined: {new Date(u.createdAt || "").toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                      className="input"
                      aria-label={`Change role for ${u.name}`}
                      defaultValue={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={actionLoading || u.id === user?.id}
                      style={{ minWidth: 140 }}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    <button className="btn" onClick={() => { setSelectedUserId(u.id); fetchAudit(); alert("Opening audit filtered to user (preview) — integrate server-side filtering for full view."); }}>
                      Audit
                    </button>

                    {u.active ? (
                      <button className="btn btn--ghost" onClick={() => toggleActive(u.id, false)} disabled={actionLoading || u.id === user?.id}>
                        Deactivate
                      </button>
                    ) : (
                      <button className="btn btn--primary" onClick={() => toggleActive(u.id, true)} disabled={actionLoading}>
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Simple pagination */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div className="u-muted" style={{ fontSize: 13 }}>
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalUsers)} of {totalUsers}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Prev
                </button>
                <button className="btn" onClick={() => setPage((p) => p + 1)} disabled={page * pageSize >= totalUsers}>
                  Next
                </button>
              </div>
            </div>
          </section>

          {/* Invite form */}
          <section aria-labelledby="invite-heading" style={{ marginBottom: 18 }}>
            <h3 id="invite-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Invite user</h3>
            <form onSubmit={sendInvite} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input className="input" placeholder="user@example.edu" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <select className="input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <button className="btn btn--primary" type="submit" disabled={inviteLoading}>
                {inviteLoading ? "Sending…" : "Send invite"}
              </button>
            </form>
            {inviteResult && <div style={{ marginTop: 8, color: "var(--text-muted)" }}>{inviteResult}</div>}
          </section>

          {/* Audit log */}
          <section aria-labelledby="audit-heading">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 id="audit-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Audit log</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={fetchAudit}>Refresh</button>
                <button className="btn" onClick={exportAuditCSV}>Export CSV</button>
              </div>
            </div>

            {auditLoading && <div>Loading audit…</div>}
            {!auditLoading && auditError && <div role="alert" style={{ color: "var(--danger)" }}>{auditError}</div>}

            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              {audit.map((a) => (
                <div key={a.id} className="card" style={{ padding: 10, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.action.replace(/_/g, " ")}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {a.by ?? "system"} • {new Date(a.at).toLocaleString()}
                      {a.target ? ` • ${a.target}` : ""}
                    </div>
                    {a.note && <div style={{ marginTop: 6, color: "var(--text-muted)" }}>{a.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
