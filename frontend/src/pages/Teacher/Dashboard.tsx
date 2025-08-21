import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../../services/api";

/**
 * BrowseDocuments
 *
 * Props:
 * - searchQuery: global search text from the dashboard
 * - filters: object with tags, department, year, author, docType
 *
 * Behavior:
 * - Fetches documents from backend with applied search/filter/sort/pagination.
 * - Shows loading, error and empty states.
 * - Provides client-side controls for sorting and pagination.
 * - Falls back to mock data when backend is not reachable.
 *
 * Notes:
 * - Adjust the API endpoint and query parameter names to match your Laravel backend.
 * - This file is intentionally self-contained (small helper subcomponents included) so it's easy
 *   to review and extend. When you are ready, we can extract DocumentCard and Pagination to
 *   shared components.
 */

type Filters = {
  tags: string[];
  department?: string;
  year?: string;
  author?: string;
  docType?: string;
};

type DocumentItem = {
  id: number;
  title: string;
  authors: string[];
  year: string;
  department: string;
  docType: string;
  tags: string[];
  summary?: string;
  uploadedAt?: string;
  isVerified?: boolean;
  downloads?: number;
};

type Props = {
  searchQuery?: string;
  filters?: Filters;
};

const DEFAULT_PAGE_SIZE = 10;

/* Small in-file Document card component */
function DocumentCard({ doc, onView, onDownload }: { doc: DocumentItem; onView: (d: DocumentItem) => void; onDownload: (d: DocumentItem) => void; }) {
  return (
    <article className="card" aria-labelledby={`doc-title-${doc.id}`} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 56, height: 76, background: "linear-gradient(180deg, rgba(11,61,145,0.06), rgba(11,61,145,0.02))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--aastu-primary-600)" }}>
        {doc.docType?.slice(0, 1).toUpperCase() ?? "D"}
      </div>

      <div style={{ flex: 1 }}>
        <h4 id={`doc-title-${doc.id}`} style={{ margin: 0, color: "var(--aastu-primary-600)" }}>{doc.title}</h4>
        <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
          {doc.authors.join(", ")} • {doc.department} • {doc.year}
        </div>

        {doc.summary && <p style={{ marginTop: 10, marginBottom: 8, color: "var(--text-muted)" }}>{doc.summary}</p>}

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 12, padding: "6px 8px", borderRadius: 8, background: doc.isVerified ? "rgba(16,163,127,0.08)" : "rgba(245,158,11,0.06)", color: doc.isVerified ? "var(--success)" : "var(--warning)", fontWeight: 600 }}>
            {doc.isVerified ? "Verified" : "Pending"}
          </span>

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button className="btn" onClick={() => onView(doc)} aria-label={`View ${doc.title}`}>View</button>
            <button className="btn btn--ghost" onClick={() => onDownload(doc)} aria-label={`Download ${doc.title}`}>Download</button>
          </div>
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {doc.tags.slice(0, 6).map((t) => (
            <span key={t} style={{ background: "rgba(11,61,145,0.04)", color: "var(--aastu-primary-600)", padding: "4px 8px", borderRadius: 8, fontSize: 12 }}>{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* Small in-file Pagination component */
function Pagination({ page, pageSize, total, onPage }: { page: number; pageSize: number; total: number; onPage: (p: number) => void; }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = useMemo(() => {
    const visible: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) visible.push(i);
    return visible;
  }, [page, pageSize, total]);

  return (
    <nav aria-label="Pagination" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
      <button className="btn" onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
      {pages[0] > 1 && <button className="btn" onClick={() => onPage(1)}>1</button>}
      {pages[0] > 2 && <span className="u-muted">…</span>}
      {pages.map((p) => (
        <button key={p} className="btn" onClick={() => onPage(p)} aria-current={p === page ? "page" : undefined} style={{ background: p === page ? "rgba(11,61,145,0.08)" : undefined }}>{p}</button>
      ))}
      {pages[pages.length - 1] < totalPages - 1 && <span className="u-muted">…</span>}
      {pages[pages.length - 1] < totalPages && <button className="btn" onClick={() => onPage(totalPages)}>{totalPages}</button>}
      <button className="btn" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>

      <div style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: 13 }}>
        {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </div>
    </nav>
  );
}

export default function BrowseDocuments({ searchQuery = "", filters: initialFilters }: Props): React.ReactElement {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<"relevance" | "newest" | "downloads">("relevance");
  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters || { tags: [] });

  useEffect(() => {
    setLocalFilters(initialFilters || { tags: [] });
    setPage(1);
  }, [initialFilters, searchQuery]);

  useEffect(() => {
    let aborted = false;
    async function fetchDocs() {
      setLoading(true);
      setError(null);

      try {
        // Build query params (adjust param names to match backend)
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (localFilters?.department) params.set("department", localFilters.department);
        if (localFilters?.year) params.set("year", localFilters.year);
        if (localFilters?.author) params.set("author", localFilters.author);
        if (localFilters?.docType) params.set("type", localFilters.docType);
        if (localFilters?.tags?.length) params.set("tags", localFilters.tags.join(","));
        params.set("sort", sort);
        params.set("page", String(page));
        params.set("per_page", String(pageSize));

        const url = `${API_BASE}/documents?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`);
        }

        const payload = await res.json().catch(() => null);

        // Expecting payload shape: { data: DocumentItem[], total: number }
        if (!aborted) {
          const data: DocumentItem[] = payload?.data ?? [];
          setDocs(data);
          setTotal(typeof payload?.total === "number" ? payload.total : data.length);
        }
      } catch (err) {
        // Fallback to mock data so UI remains testable during early frontend work
        if (!aborted) {
          console.warn("BrowseDocuments: API fetch failed, loading mock data.", err);
          const mock: DocumentItem[] = [
            {
              id: 1,
              title: "Introduction to Algorithms - Lecture Notes",
              authors: ["A. Author"],
              year: "2022",
              department: "Computer Science",
              docType: "lecture-note",
              tags: ["algorithms", "data structures"],
              summary: "Comprehensive lecture notes covering core algorithms topics.",
              isVerified: true,
              downloads: 125,
            },
            {
              id: 2,
              title: "Final Exam - Data Structures (2021)",
              authors: ["Course Committee"],
              year: "2021",
              department: "Computer Science",
              docType: "exam",
              tags: ["exam", "data structures"],
              summary: "Closed-book final exam for Data Structures course.",
              isVerified: false,
              downloads: 72,
            },
          ];
          setDocs(mock);
          setTotal(mock.length);
          setError("Unable to fetch from server; showing sample results.");
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    fetchDocs();
    return () => {
      aborted = true;
    };
  }, [searchQuery, localFilters, page, pageSize, sort]);

  function handleView(doc: DocumentItem) {
    // In a full app, this would route to a document detail page or open a modal.
    // For now, show a simple preview alert or open a new tab if a document URL exists.
    alert(`Viewing: ${doc.title}\n\nAuthors: ${doc.authors.join(", ")}\nYear: ${doc.year}`);
  }

  function handleDownload(doc: DocumentItem) {
    // Hook into real download URL in the backend. For now, provide a stub.
    alert(`Requesting download for "${doc.title}". Backend integration required.`);
  }

  function applyTagFilter(tag: string) {
    setLocalFilters((f) => ({ ...f, tags: Array.from(new Set([...(f.tags || []), tag])) }));
  }

  function removeTag(tag: string) {
    setLocalFilters((f) => ({ ...f, tags: (f.tags || []).filter((t) => t !== tag) }));
  }

  return (
    <section aria-labelledby="browse-heading" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 id="browse-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Browse documents</h3>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label htmlFor="sort" style={{ fontSize: 13, color: "var(--text-muted)" }}>Sort</label>
          <select id="sort" className="input" value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="downloads">Most downloaded</option>
          </select>
        </div>
      </div>

      {/* Active filters summary */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {searchQuery ? <span style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(11,61,145,0.04)" }}>Search: <strong style={{ marginLeft: 6 }}>{searchQuery}</strong></span> : null}
        {localFilters?.department ? <span style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(11,61,145,0.04)" }}>Dept: {localFilters.department}</span> : null}
        {localFilters?.year ? <span style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(11,61,145,0.04)" }}>Year: {localFilters.year}</span> : null}
        {localFilters?.author ? <span style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(11,61,145,0.04)" }}>Author: {localFilters.author}</span> : null}
        {(localFilters?.tags || []).map((t) => (
          <button key={t} className="btn" onClick={() => removeTag(t)} aria-label={`Remove tag ${t}`}>
            {t} ×
          </button>
        ))}

        {(searchQuery || (localFilters && ((localFilters.tags && localFilters.tags.length) || localFilters.department || localFilters.year || localFilters.author))) && (
          <button className="btn" onClick={() => { setLocalFilters({ tags: [] }); /* reset all */ }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Main list */}
      <div>
        {loading && <div style={{ padding: 20 }}>Loading results…</div>}
        {!loading && error && <div role="alert" style={{ color: "var(--danger)", padding: 12 }}>{error}</div>}
        {!loading && docs.length === 0 && (
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ marginTop: 0 }}>No documents found</h4>
            <p className="u-muted">Try adjusting your search or filters. You can also browse by department or year to discover more resources.</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {docs.map((d) => (
            <DocumentCard key={d.id} doc={d} onView={handleView} onDownload={handleDownload} />
          ))}
        </div>

        <Pagination page={page} pageSize={pageSize} total={total} onPage={(p) => setPage(p)} />
      </div>

      {/* Sidebar-ish helpers (tree view / suggestions) */}
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button className="btn" onClick={() => alert("Open tree view — not implemented yet")}>Open tree view</button>
        <button className="btn" onClick={() => alert("Refine search — not implemented yet")}>Refine search</button>
        <button className="btn" onClick={() => alert("Suggest a document — not implemented yet")}>Suggest a document</button>
      </div>
    </section>
  );
}
