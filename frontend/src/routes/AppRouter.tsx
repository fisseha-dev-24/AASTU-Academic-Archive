import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../hooks/useAuth";

type Breadcrumb = {
  label: string;
  to?: string;
};

type Props = {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  right?: React.ReactNode; // optional right-side controls in the header
  aside?: React.ReactNode; // optional right-hand aside column
  noSidebar?: boolean; // hide left sidebar (useful for auth pages)
  containerClassName?: string;
};

/**
 * MainLayout
 *
 * - Common application layout used by role dashboards and most pages.
 * - Renders top Navbar, optional left Sidebar (unless noSidebar), main content area, and optional right aside.
 * - Accepts breadcrumbs, title/subtitle, header-right controls, and an aside slot.
 *
 * Accessibility & UX:
 * - Includes a skip-to-content link for keyboard users.
 * - Keeps layout structure simple so pages can control content and actions.
 *
 * Usage:
 * <MainLayout title="Dashboard" breadcrumbs={[{label: "Home", to: "/"}]}>
 *   ...page content...
 * </MainLayout>
 */
export default function MainLayout({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  right,
  aside,
  noSidebar = false,
  containerClassName = "",
}: Props): React.ReactElement {
  const { user } = useAuth() as { user?: any };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: "absolute",
          left: -9999,
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        onFocus={(e) => {
          // Reveal when focused
          const el = e.currentTarget;
          el.style.left = "8px";
          el.style.top = "8px";
          el.style.width = "auto";
          el.style.height = "auto";
          el.style.padding = "8px 12px";
          el.style.background = "var(--surface)";
          el.style.borderRadius = "6px";
          el.style.boxShadow = "var(--shadow-sm)";
          el.style.zIndex = "100";
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          el.style.left = "-9999px";
          el.style.top = "auto";
          el.style.width = "1px";
          el.style.height = "1px";
          el.style.padding = "";
          el.style.background = "";
          el.style.borderRadius = "";
          el.style.boxShadow = "";
          el.style.zIndex = "";
        }}
      >
        Skip to main content
      </a>

      <Navbar />

      <div
        style={{
          flex: 1,
          maxWidth: 1200,
          margin: "24px auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: noSidebar ? "1fr" : "240px 1fr",
          gap: 18,
          padding: "0 16px",
        }}
        className={containerClassName}
      >
        {!noSidebar && (
          <aside>
            <Sidebar>
              {/* Pages pass their own nav into Sidebar children. If none is provided,
                  Sidebar will simply render the children as empty. */}
              <nav aria-label="Main navigation" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
                  Home
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
                    Admin
                  </NavLink>
                )}
                <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}>
                  Profile
                </NavLink>
              </nav>
            </Sidebar>
          </aside>
        )}

        <main id="main-content" tabIndex={-1} style={{ minWidth: 0 }}>
          <header style={{ marginBottom: 12 }}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" style={{ marginBottom: 8 }}>
                <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {breadcrumbs.map((b, idx) => (
                    <li key={idx} style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {b.to ? (
                        <NavLink to={b.to} className="u-muted">
                          {b.label}
                        </NavLink>
                      ) : (
                        <span>{b.label}</span>
                      )}
                      {idx !== breadcrumbs.length - 1 && <span style={{ margin: "0 6px", color: "var(--muted)" }}>›</span>}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ minWidth: 0 }}>
                {title && <h1 style={{ margin: 0, color: "var(--aastu-primary-600)", fontSize: 20 }}>{title}</h1>}
                {subtitle && <div className="u-muted" style={{ marginTop: 6 }}>{subtitle}</div>}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>{right}</div>
            </div>
          </header>

          <div>{children}</div>
        </main>

        {/* Optional right aside column */}
        {aside && (
          <aside style={{ width: 320 }}>
            <div style={{ position: "sticky", top: 18 }}>
              {aside}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
