/**
 * DetailSkeleton — Suspense fallback for code-split detail routes
 * (ServiceDetail, InsightDetail).
 *
 * Why this exists
 *   We code-split the detail pages out of the main bundle so the home/list
 *   routes don't pay the parse-and-execute cost. The risk is the classic
 *   "Suspense fallback CLS" — a thin spinner paints first, then the heavy
 *   route arrives and the page height jumps, scoring CLS ≈ 0.20.
 *
 *   SiteShell uses `<main className="flex-1">` inside a `min-h-screen` flex
 *   column, so the Footer is pinned to the bottom of the viewport and does
 *   not move based on `<main>` content height. As long as the skeleton's
 *   own height ≥ viewport, no Footer shift happens. We additionally mirror
 *   the real detail-page skeleton (page-header band + 16:9 hero placeholder
 *   + a few text lines) so what little shift remains is sub-element and
 *   well below the 0.1 CLS threshold.
 *
 * Notes
 *  - aria-hidden + role=presentation: screen readers are told this is a
 *    purely decorative loading state.
 *  - Uses brand tokens (`--mist`, `--brand-paper`) so it visually belongs.
 *  - No animation: the route lands within ~150 ms after Suspense kicks in
 *    on cached navigations; a pulse would call attention to nothing.
 */

export function DetailSkeleton() {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="min-h-screen"
      style={{ backgroundColor: "var(--brand-paper)" }}
    >
      {/* PageHeader band */}
      <div
        className="border-b"
        style={{ borderColor: "var(--mist)", paddingTop: "5rem", paddingBottom: "3rem" }}
      >
        <div className="container">
          <div className="h-3 w-24 mb-4 rounded" style={{ backgroundColor: "var(--mist)" }} />
          <div className="h-10 w-3/4 max-w-xl rounded" style={{ backgroundColor: "var(--mist)" }} />
        </div>
      </div>

      {/* Hero image placeholder (16:9 — matches real detail layout) */}
      <div className="container py-10">
        <div
          className="w-full rounded-xl border"
          style={{
            borderColor: "var(--mist)",
            backgroundColor: "var(--mist)",
            aspectRatio: "16 / 9",
            opacity: 0.4,
          }}
        />
        {/* Body text placeholder */}
        <div className="mt-10 space-y-4">
          <div className="h-4 w-full rounded" style={{ backgroundColor: "var(--mist)", opacity: 0.5 }} />
          <div className="h-4 w-11/12 rounded" style={{ backgroundColor: "var(--mist)", opacity: 0.5 }} />
          <div className="h-4 w-5/6 rounded" style={{ backgroundColor: "var(--mist)", opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}
