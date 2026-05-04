# Task 1 — Bootstrap Comm.Inno MVP

## Setup
- [x] Install `react-intl`, fontsource packages, drop tokens.css, upload logo

## i18n
- [x] Wouter routes (/, /th, /en, /404), LocaleProvider, message catalogs, LocaleLink

## Layout
- [x] Sticky header (logo + 5 nav + EN/TH switcher)
- [x] Footer with Mongkut Sammitr address
- [x] html lang and body font swap per locale

## Homepage
- [x] Eyebrow, DM Serif Display tagline, two CTAs, 4 brand-color blocks

## Quality
- [x] Top-level README documenting stack
- [x] Lighthouse on stripped prod build ≥ 90 (EN desktop 100, EN mobile 92, TH desktop 100, TH mobile 91)
- [x] WCAG AA verified (a11y 100)
- [x] Logo vector sharp
- [x] Initial checkpoint saved

## Round 2 — Perf / BP lift on real-world incognito audit

- [ ] Drop bulk @fontsource imports; use Fontsource subset CSS (`/latin.css`, `/thai-400.css`)
- [ ] Self-host fonts as static woff2 + add `<link rel="preload">` for the two critical hero faces
- [ ] Verify font-display: swap on every face
- [ ] Add `<link rel="preconnect">` is irrelevant (we self-host) — confirm and skip
- [ ] Code-split brand-color block + footer below the fold via React.lazy + Suspense
- [ ] Audit Best Practices failures on the **published manus.space** URL (not dev preview)
- [ ] Re-Lighthouse on prod build AND on the live published URL in incognito
- [ ] Capture EN-route hero screenshot (DM Serif Display tagline)
- [ ] Capture brand-color swatches screenshot (4 blocks visible)
- [ ] Confirm "Made with Manus" / AI tooltips not shown to end users
- [ ] Confirm Smith Boonchutima spelling intact
