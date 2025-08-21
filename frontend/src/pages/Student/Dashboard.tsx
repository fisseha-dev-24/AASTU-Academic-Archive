import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import BrowseDocuments from "../../pages/Student/BrowseDocuments";
import Suggestions from "../../pages/Student/Suggestions";
import Exams from "../../pages/Student/Exams";
import Videos from "../../pages/Student/Videos";

/**
 * Student Dashboard shell
 *
 * - Left sidebar with primary student actions
 * - Top search + advanced filter panel
 * - Main content area that switches between section components (keeps routing internal for now)
 * - Uses design tokens from variables.css and global.css
 *
 * This file is intentionally self-contained: it orchestrates the student area and renders the
 * separate section components which are provided as lightweight placeholders you can expand.
 *
 * We'll improve this later by wiring real routes (React Router) and connecting the search to the backend.
 */

type SectionKey = "browse" | "suggestions" | "exams" | "videos" | "profile";

const sidebarItems: { key: SectionKey; title: string }[] = [
  { key: "browse", title: "Browse documents" },
  { key: "suggestions", title: "Suggestions" },
  { key: "exams", title: "Exam papers" },
  { key: "videos", title: "Videos" },
  { key: "profile", title: "My profile" },
];

export default function StudentDashboard(): React.ReactElement {
  const [section, setSection] = useState<SectionKey>("browse");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    department: "",
    year: "",
    author: "",
    docType: "",
  });

  function clearFilters() {
    setFilters({ tags: [], department: "", year: "", author: "", docType: "" });
  }

  // Render the selected section component
  function renderSection() {
    switch (section) {
      case "browse":
        return <BrowseDocuments searchQuery={query} filters={filters} />;
      case "suggestions":
        return <Suggestions />;
      case "exams":
        return <Exams />;
      case "videos":
        return <Videos />;
      case "profile":
        return (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginTop: 0, color: "var(--aastu-primary-600)" }}>My profile</h3>
            <p className="u-muted">Profile details, saved searches and bookmarks will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: 1200, margin: "24px auto", width: "100%", display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, padding: "0 16px" }}>
        <aside>
          <Sidebar>
            <nav aria-label="Student menu" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sidebarItems.map((it) => (
                <button
                  key={it.key}
                  onClick={() => setSection(it.key)}
                  className="btn"
                  style={{
                    justifyContent: "flex-start",
                    background: section === it.key ? "rgba(11,61,145,0.08)" : "transparent",
                    border: "none",
                    color: "var(--text-default)",
                    padding: "10px 12px",
                    borderRadius: 8,
                    width: "100%",
                    textAlign: "left",
                  }}
                  aria-current={section === it.key ? "page" : undefined}
                >
                  {it.title}
                </button>
              ))}

              <div style={{ height: 1, background: "var(--muted-border)", margin: "12px 0" }} />

              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Saved</div>
              <button
                className="btn"
                style={{ justifyContent: "flex-start", border: "none", background: "transparent", padding: "8px 12px", borderRadius: 8 }}
                onClick={() => alert("Bookmarks — not implemented yet")}
              >
                Bookmarks
              </button>
              <button
                className="btn"
                style={{ justifyContent: "flex-start", border: "none", background: "transparent", padding: "8px 12px", borderRadius: 8 }}
                onClick={() => alert("Saved searches — not implemented yet")}
              >
                Saved searches
              </button>
            </nav>
          </Sidebar>
        </aside>

        <main>
          {/* Top utilities: search + filter toggle */}
          <div style={{ marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="student-search" className="u-hidden">Search documents</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  id="student-search"
                  className="input"
                  placeholder="Search by title, tag, author..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search documents"
                />
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    // For now, we only set the query state; backend integration will happen later.
                    // This button emphasizes search intent and could trigger analytics.
                    // TODO: connect to API search endpoint.
                    // small visual feedback:
                    (document.activeElement as HTMLElement)?.blur?.();
                  }}
                  aria-label="Run search"
                >
                  Search
                </button>
                <button
                  className="btn"
                  onClick={() => setFiltersOpen((s) => !s)}
                  aria-expanded={filtersOpen}
                  aria-controls="student-filters"
                  style={{ alignSelf: "center" }}
                >
                  {filtersOpen ? "Hide filters" : "Filters"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => alert("Export results — not implemented")}>
                Export
              </button>
              <button className="btn" onClick={() => alert("Help / documentation — not implemented")}>Help</button>
            </div>
          </div>

          {/* Advanced Filters */}
          {filtersOpen && (
            <div id="student-filters" className="card" style={{ marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Tags (comma separated)</label>
                  <input
                    className="input"
                    value={filters.tags.join(", ")}
                    onChange={(e) => setFilters((f) => ({ ...f, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                    placeholder="e.g., data structures, algorithms"
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Department</label>
                  <input className="input" value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))} placeholder="e.g., Computer Science" />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Year</label>
                  <input className="input" value={filters.year} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))} placeholder="e.g., 3rd" />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Author</label>
                  <input className="input" value={filters.author} onChange={(e) => setFilters((f) => ({ ...f, author: e.target.value }))} placeholder="Author name" />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6 }}>Document type</label>
                  <select className="input" value={filters.docType} onChange={(e) => setFilters((f) => ({ ...f, docType: e.target.value }))}>
                    <option value="">Any</option>
                    <option value="thesis">Thesis</option>
                    <option value="exam">Exam</option>
                    <option value="lecture-note">Lecture note</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <button className="btn btn--primary" onClick={() => { /* in future, trigger filtered search */ }}>
                    Apply
                  </button>
                  <button className="btn" onClick={clearFilters}>Clear</button>
                </div>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div>{renderSection()}</div>
        </main>
      </div>
    </div>
  );
}
