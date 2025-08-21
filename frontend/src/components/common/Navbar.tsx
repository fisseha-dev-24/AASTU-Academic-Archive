import React, { useState } from "react";
import { Link } from "react-router-dom";
// Update the path and filename to your actual logo file, e.g. logo.png or logo.svg
// If TypeScript reports no declaration for image files, require it and ignore TS for this import
// @ts-ignore: image module missing
const logo = require("../../assets/logo.png") as string; // Adjust path and filename to your logo

/**
 * Shared Navbar for AASTU Archive frontend.
 *
 * - Responsive (desktop menu + mobile drawer)
 * - Accessible (aria attributes, keyboard-focusable)
 * - Uses global tokens / utility classes from src/styles/variables.css and src/styles/global.css
 *
 * Small and focused: expand later to show user info, role-based links, or notifications.
 */

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header-sticky">
      <div className="container">
        <nav
          className="site-nav"
          aria-label="Primary"
          style={{ alignItems: "center", gap: 12 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/" className="site-brand" aria-label="AASTU Archive home">
              <img src={logo} alt="AASTU logo" />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span className="title">AASTU Archive</span>
                <span className="subtitle">Institutional repository</span>
              </div>
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="nav-actions" aria-hidden={open} style={{ display: "flex" }}>
            <Link to="/browse" className="btn" style={{ color: "var(--text-default)" }}>
              Browse
            </Link>

            <Link to="/about" className="btn" style={{ color: "var(--text-default)" }}>
              About
            </Link>

            <Link to="/login" className="btn btn--ghost" aria-label="Sign in">
              Sign in
            </Link>
            <Link to="/signup" className="btn btn--primary" aria-label="Sign up">
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              display: "none",
            }}
            id="nav-toggle-button"
          >
            {/* visible only on small screens via CSS; inline SVG kept for clarity */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={open ? "M6 18L18 6M6 6l12 12" : "M3 7h18M3 12h18M3 17h18"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile menu (simple slide-down) */}
      <div
        id="mobile-menu"
        role="region"
        aria-label="Mobile"
        style={{
          display: open ? "block" : "none",
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <div className="container" style={{ paddingTop: 12, paddingBottom: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link to="/browse" className="btn" onClick={() => setOpen(false)}>
              Browse
            </Link>
            <Link to="/about" className="btn" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/login" className="btn btn--ghost" onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link to="/signup" className="btn btn--primary" onClick={() => setOpen(false)}>
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* Show mobile toggle and hide nav-actions on small screens */
        @media (max-width: 760px) {
          .nav-actions { display: none !important; }
          #nav-toggle-button { display: inline-flex !important; align-items: center; gap: 6px; padding: 8px; border-radius: var(--radius-sm); color: var(--aastu-primary-600); }
        }
        /* On larger screens ensure mobile menu is hidden */
        @media (min-width: 761px) {
          #mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
