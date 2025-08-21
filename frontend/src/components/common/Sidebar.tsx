import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Common Sidebar
 *
 * Purpose:
 * - Lightweight, accessible sidebar wrapper used across role dashboards.
 * - Renders a small header with current user info, collapse toggle for narrow screens,
 *   and a scrollable region that renders children (typically a <nav>).
 *
 * Usage:
 * <Sidebar>
 *   <nav> ... buttons / links ... </nav>
 * </Sidebar>
 *
 * Notes:
 * - Styling is intentionally minimal and relies on the app's global CSS classes
 *   (e.g. .card, .btn, .input). You can override or extend these styles in your
 *   global stylesheet.
 */

export default function Sidebar({ children }: { children?: React.ReactNode }): React.JSX.Element {
  const { user, logout } = useAuth() as { user?: any; logout?: () => void };
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "stretch",
      }}
    >
      <div
        className="card"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: 12,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "linear-gradient(180deg,#0b3d91 0%, #0b61c6 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name ?? "Anonymous"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user?.role ?? "guest"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            type="button"
            className="btn"
            aria-pressed={collapsed}
            onClick={() => setCollapsed((s) => !s)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ padding: "6px 8px" }}
          >
            {collapsed ? "⤢" : "⤡"}
          </button>

          <NavLink to="/profile" className="btn" style={{ padding: "6px 8px" }}>
            Profile
          </NavLink>
        </div>
      </div>

      <div
        role="region"
        aria-label="Sidebar navigation"
        style={{
          display: collapsed ? "none" : "block",
          maxHeight: "60vh",
          overflow: "auto",
        }}
      >
        {/*
          Children are expected to include the actual navigation (buttons/links).
          Keep Sidebar dumb so pages can supply custom menus per role.
        */}
        {children}
      </div>

      <div style={{ marginTop: "auto" }}>
        <div className="card" style={{ padding: 10, display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Quick actions</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                // simple client-side logout; pages using useAuth can override behavior if needed
                if (logout) logout();
                // a full app might navigate to /login here; we keep Sidebar isolated.
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
