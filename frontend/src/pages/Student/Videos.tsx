import React, { useEffect, useState } from "react";
import { API_BASE } from "../../services/api";

/**
 * Videos page
 * - Lists educational videos, allows inline preview in a simple modal
 * - Assumes endpoint GET /videos or /media?type=video
 */

type VideoItem = {
  id: number;
  title: string;
  description?: string;
  author?: string;
  department?: string;
  url?: string; // video URL (YouTube/Vimeo or direct)
  uploadedAt?: string;
  tags?: string[];
};

export default function Videos(): React.ReactElement {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<VideoItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchVideos() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/videos`);
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const payload = await res.json();
        if (!cancelled) setItems(payload?.data ?? []);
      } catch (err) {
        if (!cancelled) {
          console.warn("Videos: using mock data", err);
          setItems([
            { id: 1, title: "Intro to Algorithms - Lecture 1", author: "Prof. A", department: "Computer Science", url: "https://www.youtube.com/embed/Z1Yd7upQsXY", tags: ["algorithms"] },
            { id: 2, title: "Linear Algebra - Matrix ops", author: "Dr. B", department: "Mathematics", url: "https://www.youtube.com/embed/0uWgD5YxM5s", tags: ["algebra"] },
          ]);
          setError("Could not fetch videos; showing sample content.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchVideos();
    return () => { cancelled = true; };
  }, []);

  return (
    <section aria-labelledby="videos-heading" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 id="videos-heading" style={{ margin: 0, color: "var(--aastu-primary-600)" }}>Educational videos</h3>
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Lecture recordings and tutorial videos</div>
      </div>

      {loading && <div>Loading videos…</div>}
      {error && <div role="alert" style={{ color: "var(--danger)" }}>{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {items.map((v) => (
          <article key={v.id} className="card" style={{ padding: 10 }}>
            <div style={{ fontWeight: 700 }}>{v.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{v.author} • {v.department}</div>

            <div style={{ marginTop: 8 }}>
              <div style={{ height: 140, background: "linear-gradient(180deg, rgba(11,61,145,0.04), rgba(11,61,145,0.02))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button className="btn" onClick={() => setActive(v)}>Play</button>
              </div>
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(v.tags || []).map((t) => <span key={t} style={{ padding: "4px 8px", borderRadius: 8, background: "rgba(11,61,145,0.04)", color: "var(--aastu-primary-600)", fontSize: 12 }}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>

      {/* Simple modal for video playback */}
      {active && (
        <div role="dialog" aria-modal="true" aria-label={`Playing ${active.title}`} style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(2,6,23,0.6)", zIndex: 60, padding: 20
        }}>
          <div style={{ width: "min(1000px, 96%)", background: "var(--surface)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{active.title}</div>
              <button className="btn" onClick={() => setActive(null)}>Close</button>
            </div>
            <div style={{ background: "#000", aspectRatio: "16/9" }}>
              {active.url ? (
                // Embedded iframe (YouTube/Vimeo) - be sure backend provides embeddable URLs
                <iframe title={active.title} src={active.url} width="100%" height="100%" frameBorder={0} allowFullScreen />
              ) : (
                <div style={{ color: "#fff", padding: 20 }}>No preview available</div>
              )}
            </div>
            <div style={{ padding: 12, color: "var(--text-muted)" }}>{active.description}</div>
          </div>
        </div>
      )}
    </section>
  );
}
