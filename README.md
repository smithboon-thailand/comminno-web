# comminno-web

> Source code for **Comm.Inno** — the Center of Excellence in Communication Innovation
> for the Development of Quality of Life and Sustainability,
> Faculty of Communication Arts, **Chulalongkorn University**.

[![Production](https://img.shields.io/badge/production-comminno--web.vercel.app-BD212D)](https://comminno-web.vercel.app)
[![Staging](https://img.shields.io/badge/staging-comminno--go6lmsuy.manus.space-279ED6)](https://comminno-go6lmsuy.manus.space)
[![License: MIT](https://img.shields.io/badge/license-MIT-8DC63F)](LICENSE)
[![Bilingual](https://img.shields.io/badge/bilingual-TH%20%2F%20EN-F1A61D)](#languages)

_Last verified deploy: 2026-05-06 — first end-to-end Manus → GitHub → Vercel auto-deploy round-trip; SPA rewrite simplified to the single-rule pattern recommended by Vercel docs._

This repository hosts the bilingual (Thai / English) website that replaces
the legacy Wix property at `cominnocenter.com`. The site is a static React
single-page application; a CMS layer (Decap) and AI-assisted authoring will
land in subsequent phases.

---

## Stack

| Layer | Choice |
|---|---|
| Runtime | React 19 |
| Bundler | Vite 7 |
| Styling | Tailwind CSS v4 (with brand tokens via `@theme inline`) |
| Routing | Wouter |
| i18n | `react-intl` + custom `LocaleProvider` (URL is source of truth, with cookie + `localStorage` persistence) |
| Fonts | DM Serif Display (display), Inter (UI / EN body), IBM Plex Sans Thai Looped (Thai), JetBrains Mono (code) — self-hosted via `@fontsource` |
| Forms | Formspree |
| Analytics | Plausible (loaded only after consent) |
| Hosting (production) | Vercel |
| Hosting (staging) | Manus webdev (`comminno-go6lmsuy.manus.space`) |

The original brief specified Next.js 15 + next-intl as a *preference*. The
center approved switching to a React + Vite SPA on 2026-05-04 — neither SSR
nor RSC is required for the MVP, and the Manus webdev pipeline natively
serves React/Vite scaffolds. Every non-negotiable rule from the brief is
preserved.

---

## Languages

Both routes are first-class. Thai (`/th`) is the default; English (`/en`) is the
fallback. Every page exists in both languages. All user-visible strings live in
`client/src/i18n/messages.ts`.

---

## Local development

Requires Node 22 LTS and `pnpm` 9+.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # tsc --noEmit
pnpm build        # production bundle in dist/public/
```

---

## Project layout

```
client/
  index.html                     ← title, manual meta description, theme-color
  public/                        ← favicon, robots.txt, logo-official.svg (verbatim from brand book)
  src/
    index.css                    ← Tailwind v4 + brand tokens + Fontsource
    styles/tokens.css            ← VERBATIM copy of brand_book/tokens.css (do not edit)
    i18n/
      messages.ts                ← TH + EN catalogs, manual meta descriptions per page
      LocaleProvider.tsx         ← URL ↔ cookie ↔ localStorage; <html lang> sync
      LocaleLink.tsx             ← wouter <Link> wrapper that auto-prefixes locale
    components/
      consent/                   ← PDPA-compliant cookie consent (gate for analytics)
      layout/                    ← Header, Footer, SiteShell
      ui/                        ← shadcn/ui primitives
    content/
      about.ts                   ← Faculty bios + verified bibliographies
      services.ts                ← 9 services (TH/EN copy, hero images, deliverables)
      posts.ts                   ← 24 articles (TH/EN, cover images, SDG tags)
    pages/                       ← Home, About, Services, ServiceDetail, Insights, InsightDetail, Contact, Privacy, NotFound
vercel.json                      ← SPA rewrite + security headers
```

The on-disk path is `comminno-web` for parity with the Manus project name.
The published Vercel domain is `comminno-web.vercel.app` (or whatever Vercel
auto-suggests at import time); the production Comm.Inno domain
(`cominnocenter.com`) will point to Vercel after the CMS phase ships.

---

## Non-negotiables (from the project brief)

1. **Logo** — `client/public/logo-official.svg` is the verbatim brand-book
   `logos/logo-official.svg`. Never redraw, recolor, or substitute.
2. **Color system** — only the four brand colors and 17 SDG colors from
   `tokens.css`. `--brand-red` (`#BD212D`) is the primary CTA color.
3. **Typography** — DM Serif Display (display only), Inter (UI / EN body),
   IBM Plex Sans Thai Looped (Thai body), JetBrains Mono (code).
4. **Bilingual TH/EN** — every page exists in both. Default `th`. Never
   auto-translate; the Thai team reviews all TH copy.
5. **Center head spelling** — always `Smith Boonchutima` (never *Smit* or
   *Smith Boonchotima*).
6. **Sentence case** for headings. Manual meta descriptions per page.
7. **MVP first.** No member area, no AR demos, no publications DB until
   the MVP ships.
8. **Lighthouse ≥ 90** on Performance, Accessibility, Best Practices, and
   SEO on every page. **WCAG 2.1 AA** mandatory. **PDPA-compliant** cookie
   banner.

---

## Deployment

### Production (Vercel)

`main` is auto-deployed by Vercel on every push:

- Framework preset: **Vite**
- Build: `pnpm exec vite build`
- Install: `pnpm install --frozen-lockfile`
- Output: `dist/public`
- SPA rewrite + security headers: configured in [`vercel.json`](vercel.json)

PRs and feature branches automatically receive preview URLs.

### Staging (Manus)

`https://comminno-go6lmsuy.manus.space` remains the staging/preview URL
maintained through the Manus webdev workspace. It will not be retired
until DNS for `cominnocenter.com` cuts over to Vercel.

---

## License

Source code is released under the [MIT License](LICENSE).

Editorial content rendered by the application — articles, faculty bios, and
images under `client/src/content/` and any uploaded media — will be
re-licensed under **Creative Commons Attribution-NonCommercial 4.0
International** (CC BY-NC 4.0) in a later phase. The Comm.Inno center logo
and Chulalongkorn University marks remain the property of their respective
owners; do not redistribute or modify them without permission.

---

## Roadmap

The full roadmap lives in `ROADMAP.md` (project workspace). At a glance:

- ✅ MVP: layout, brand system, bilingual content, About/Services/Insights/Contact/Privacy
- ✅ Cookie consent + Formspree contact form + analytics gating
- ✅ All 9 services + 24 articles migrated with verified copy and cover images
- ⏳ Phase 1 (this commit): GitHub + Vercel auto-deploy
- ⏳ Phase 2: Decap CMS at `/admin` with GitHub OAuth
- ⏳ Phase 3+: AI-assisted captions, Open Graph polish, member area
