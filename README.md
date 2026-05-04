# Comm.Inno · Website (MVP)

> Center of Excellence in Communication Innovation
> Faculty of Communication Arts · Chulalongkorn University

This repository rebuilds the Comm.Inno marketing site that previously lived at
`cominnocenter.com` (Wix). It is the **Phase 1 MVP** described in `ROADMAP.md`
of the project brief.

> **Folder note:** the on-disk path is `comminno-web` because the Manus
> webdev pipeline binds the dev preview, checkpoint, and publish flow to that
> name. The published domain (Settings → Domains) and any future GitHub repo
> can be named `comminno-website` independently.

---

## Stack

The brief specified Next.js 15 + next-intl as a *preference*. The center
explicitly approved switching to a React + Vite SPA on 2026-05-04 because
the platform's webdev runtime ships React/Vite scaffolds, and the Phase 1
MVP needs neither SSR nor RSC. Every non-negotiable rule from the brief is
preserved.

| Layer | Choice | Why |
|---|---|---|
| Runtime | **React 19** | Latest stable; concurrent features available if needed later. |
| Bundler | **Vite 7** | Fast HMR, near-zero config, ESM-native. |
| Styling | **Tailwind CSS v4** + `tw-animate-css` | Brand tokens flow in via `@theme inline`. |
| Routing | **Wouter** | Tiny (~1 kB) hooks-based router; ample for /th, /en, /404. |
| i18n | **react-intl** + custom `LocaleProvider` | Cookie + localStorage persistence, URL is source of truth. |
| Icons | **lucide-react** | Tree-shakable SVG icons. |
| Toasts | **sonner** | For "coming in next sprint" placeholder feedback. |
| Fonts | **@fontsource** (self-hosted) | DM Serif Display, Inter, IBM Plex Sans Thai Looped, JetBrains Mono — no third-party CDN requests. |

### Files of interest

```
client/
  index.html                     ← title, manual meta description, theme-color
  public/
    logo-official.svg            ← brand_book/logos/logo-official.svg, embedded as-is
  src/
    index.css                    ← imports tokens.css + Fontsource + Tailwind
    styles/tokens.css            ← VERBATIM copy of brand_book/tokens.css (do not edit)
    i18n/
      messages.ts                ← TH + EN catalogs, manual meta descriptions
      LocaleProvider.tsx         ← URL ↔ cookie ↔ localStorage; <html lang> sync
      LocaleLink.tsx             ← wouter <Link> wrapper that auto-prefixes locale
    components/
      layout/
        Header.tsx               ← sticky, logo + 5 placeholder nav links + EN/TH switcher
        Footer.tsx               ← logo + Mongkut Sammitr address + copyright
        SiteShell.tsx            ← skip-link + header + main + footer
    pages/
      Home.tsx                   ← hero (DM Serif Display) + 4-color brand verification
      NotFound.tsx               ← localized 404
```

---

## Non-negotiables (from the project brief)

1. **Logo** — `client/public/logo-official.svg` is the verbatim
   `brand_book/logos/logo-official.svg`. Never redraw, recolor, or substitute.
2. **Color system** — only the four brand colors and 17 SDG colors from
   `tokens.css`. `--brand-red` is the primary CTA.
3. **Typography** — DM Serif Display (display only), Inter (UI / EN body),
   IBM Plex Sans Thai Looped (Thai body), JetBrains Mono (code).
4. **Bilingual TH/EN** — `/th` and `/en` routes. Default `th`. Every
   user-visible string lives in `client/src/i18n/messages.ts`.
5. **Center head spelling** — always `Smith Boonchutima` (never *Smit* or
   *Smith Boonchotima*).
6. **Sentence case** for headings. Manual meta descriptions per page.
7. **MVP first.** No member area, no AR demos, no publications DB until
   the MVP ships.
8. **Lighthouse ≥ 90** on Performance, Accessibility, Best Practices, and
   SEO on every page. WCAG 2.1 AA mandatory.

---

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000  (use the Manus webdev preview URL)
pnpm check        # tsc --noEmit
pnpm build        # production bundle in dist/
```

The Manus webdev pipeline runs `pnpm dev` automatically; you don't normally
invoke it by hand.

---

## Adding strings

Open `client/src/i18n/messages.ts`, add the EN copy first, then have
the Thai team review the TH copy — never auto-translate. Use the key as
`<section>.<element>` (e.g. `services.heroes.training`).

In components, prefer `<FormattedMessage id="..." />` over the imperative
`t()` helper; reach for `t()` only when you need a plain string for an
attribute (`aria-label`, `alt`, `title`).

---

## Deployment target

Vercel or Cloudflare Pages — the build is a static SPA (`pnpm build` →
`dist/`). The `server/` directory exists only as a placeholder for the
Manus template; it is **not** required at runtime.

---

## Roadmap reminder

Task 1 (this scaffold) intentionally builds **only**: layout chrome,
language switcher, and a single homepage hero with brand-color
verification blocks. About / Services / Insights / Team / Contact pages,
content migration, forms, and analytics arrive in subsequent tasks.
