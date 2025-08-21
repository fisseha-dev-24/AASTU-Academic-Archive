export function truncate(s: string, n = 100) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
