import React from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png"; // fixed: added .png extension
import heroImg from "../../assets/aastu.png";

/**
 * Landing page for AASTU Archive System
 *
 * - Uses CSS variables defined in src/styles/variables.css (assumes those exist)
 * - Responsive, accessible hero + features section
 * - Smooth transitions and subtle motion
 *
 * Keep this file self-contained (no external module CSS) so you can review quickly.
 * If you want a separate CSS module instead, tell me and I'll extract styles to Landing.module.css next.
 */

const features = [
  {
    title: "Advanced search",
    desc: "Search by tags, department, year, author and more with rich filters.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Verified uploads",
    desc: "Teacher uploads are reviewed by department heads before public release.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Structured archive",
    desc: "Organized by college, department, year and document type — browse with tree views.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 7h6v6H3zM15 3h6v6h-6zM15 15h6v6h-6zM9 3h6v6H9z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Landing(): React.ReactElement {
  return (
    <div style={styles.page}>
      <header style={styles.header} aria-label="Site header">
        <div style={styles.headerLeft}>
          <img src={logo} alt="AASTU logo" style={styles.logo} />
          <div style={styles.brand}>
            <span style={styles.brandTitle}>AASTU Archive</span>
            <span style={styles.brandSubtitle}>Official institutional archive</span>
          </div>
        </div>

        <nav style={styles.headerRight} aria-label="Primary navigation">
          <Link to="/login" style={{ ...styles.link, marginRight: 12 }}>
            Log in
          </Link>
          <Link to="/signup" style={styles.primaryLink}>
            Sign up
          </Link>
        </nav>
      </header>

      <main style={styles.hero} role="main">
        <section style={styles.heroContent}>
          <h1 style={styles.title}>
            AASTU Archive — discover, verify, preserve
          </h1>

          <p style={styles.lead}>
            A centralized repository for exams, theses, lecture notes and educational videos — curated, searchable and verified by AASTU staff.
          </p>

          <div style={styles.ctaRow}>
            <Link to="/signup" style={styles.ctaPrimary} aria-label="Sign up (students only)">
              Get started (Students)
            </Link>
            <Link to="/login" style={styles.ctaGhost} aria-label="Sign in">
              Sign in
            </Link>
          </div>

          <ul style={styles.featureList} aria-hidden>
            {features.map((f) => (
              <li key={f.title} style={styles.featureItem}>
                <div style={styles.featureIconWrapper} aria-hidden>
                  <div style={styles.featureIcon}>{f.icon}</div>
                </div>
                <div>
                  <strong style={styles.featureTitle}>{f.title}</strong>
                  <div style={styles.featureDesc}>{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside style={styles.heroMedia} aria-hidden>
          <div style={styles.mediaCard}>
            <img src={heroImg} alt="AASTU campus" style={styles.heroImage} />
            <div style={styles.mediaBadge}>AASTU</div>
          </div>
        </aside>
      </main>

      <footer style={styles.footer}>
        <div>© {new Date().getFullYear()} Addis Ababa Science & Technology University — Archive System</div>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy</a>
          <a href="#" style={styles.footerLink}>Contact</a>
        </div>
      </footer>
    </div>
  );
}

/* Inline styles use CSS variables defined in src/styles/variables.css:
   --aastu-primary, --aastu-accent, --text-default, --muted, etc.
   This keeps color palette consistent with the AASTU brand.
*/
const styles: { [k: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, rgba(11,61,145,0.03), rgba(0,0,0,0))",
    color: "var(--text-default)",
    transition: "background 300ms ease",
    paddingBottom: 40,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 28px",
    gap: 12,
    borderBottom: "1px solid rgba(15, 23, 42, 0.04)",
    background: "transparent",
    position: "sticky",
    top: 0,
    zIndex: 40,
    backdropFilter: "saturate(120%) blur(6px)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { height: 44, width: 44, objectFit: "contain" },
  brand: { display: "flex", flexDirection: "column", lineHeight: 1 },
  brandTitle: { fontWeight: 700, fontSize: 16, color: "var(--aastu-primary)" },
  brandSubtitle: { fontSize: 12, color: "var(--muted)" },

  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  link: { color: "var(--text-default)", padding: "8px 10px", borderRadius: 8, transition: "all 180ms" },
  primaryLink: {
    background: "var(--aastu-primary)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    transition: "transform 200ms ease, box-shadow 200ms ease",
    boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    gap: 28,
    alignItems: "center",
    padding: "42px 28px",
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
  heroContent: { paddingRight: 8 },
  title: { fontSize: 34, margin: "0 0 12px 0", color: "var(--aastu-primary)" },
  lead: { margin: "0 0 20px 0", color: "var(--muted)", maxWidth: 640 },

  ctaRow: { display: "flex", gap: 12, marginBottom: 20 },
  ctaPrimary: {
    display: "inline-block",
    background: "var(--aastu-primary)",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 10,
    textDecoration: "none",
    boxShadow: "0 8px 24px rgba(11,61,145,0.06)",
    transform: "translateY(0)",
    transition: "transform 180ms ease, box-shadow 180ms ease",
  },
  ctaGhost: {
    display: "inline-block",
    background: "transparent",
    color: "var(--aastu-primary)",
    padding: "12px 18px",
    borderRadius: 10,
    textDecoration: "none",
    border: "1px solid rgba(11,61,145,0.12)",
  },

  featureList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    listStyle: "none",
    padding: 0,
    margin: 0,
    marginTop: 6,
  },
  featureItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    background: "rgba(11,61,145,0.03)",
    transition: "transform 220ms ease, box-shadow 220ms ease",
  },
  featureIconWrapper: {
    minWidth: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(11,61,145,0.06)",
    color: "var(--aastu-primary)",
  },
  featureIcon: { display: "flex" },
  featureTitle: { display: "block", marginBottom: 6, color: "var(--text-default)" },
  featureDesc: { fontSize: 13, color: "var(--muted)" },

  heroMedia: { display: "flex", justifyContent: "center" },
  mediaCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    transform: "translateY(0)",
    transition: "transform 300ms ease, box-shadow 300ms ease",
  },
  heroImage: { width: "100%", height: "auto", display: "block" },
  mediaBadge: {
    position: "relative",
    top: -42,
    left: 12,
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 8,
    background: "var(--aastu-accent)",
    color: "#111",
    fontWeight: 600,
    fontSize: 12,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  },

  footer: {
    marginTop: 40,
    padding: "20px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "var(--muted)",
    fontSize: 13,
    borderTop: "1px solid rgba(15, 23, 42, 0.04)",
  },
  footerLinks: { display: "flex", gap: 12 },
  footerLink: { color: "var(--muted)", textDecoration: "none" },

  // small screens
  "@media (maxWidth: 900px)": {},
};

/* Note:
   - This file expects CSS variables in src/styles/variables.css. If you want I can:
     1) implement that variables.css now (recommended), or
     2) extract these inline styles into a CSS module Landing.module.css so they are easier to edit.

   Tell me which you'd like next (variables.css or Navbar or Landing.module.css) and I'll provide the file next.
*/
