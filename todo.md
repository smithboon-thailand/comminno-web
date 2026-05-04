# Comm.Inno — Task progress

## Task 1 — Bootstrap MVP scaffold ✅ shipped (checkpoint 40158743)

- [x] Setup, i18n, layout, homepage, brand-color block
- [x] Round 1 Lighthouse pass (a11y/BP/SEO 100, mobile perf 91/92)
- [x] Round 2 perf/BP lift (EN desktop 100×4, EN mobile 91, TH desktop 100×4, TH mobile 95 — all clean prod build)
- [x] EN + TH screenshots captured

---

## Task 2 — MVP-complete migration

### Phase 1 — Content survey ✅
- [x] Inventory `content/pages/*.md` (about rich, 24 posts in EN, 12 categories title-only, no service detail copy in source)
- [x] Inventory `content/data/all_urls.txt` (43 URLs) → slug map prepared
- [x] Note content gaps (no TH for posts, service detail copy not in source — coming in comminno_phase2_copy.zip)
- [x] Scope confirmed with user: services_copy.md + privacy_policy.md will be spliced in when zip arrives

### Awaiting external input
- [ ] `comminno_phase2_copy.zip` from user (services_copy.md + privacy_policy.md)
- [ ] `comminno_images.zip` (266 webp images) — placeholder boxes used until then

### Phase 2 — Content pipeline + routes scaffold
- [ ] Parse all markdown sources → typed TS modules under `client/src/content/`
- [ ] Bilingual content shape: `{ slug, locale: 'th'|'en', title, ... }`
- [ ] Add Wouter routes for `/about`, `/services`, `/services/:slug`, `/insights`, `/insights/:slug`, `/contact`, `/privacy` (each under `/th` and `/en` prefix)
- [ ] Update LocaleProvider so it doesn't redirect away from non-`/` paths
- [ ] Wire header nav links to real routes

### Phase 3 — Page implementations
- [ ] `/about` — mission + 3 faculty bios (Smith Boonchutima, Teerada Chongkolrattanaporn, Pavel Slutskiy) with placeholder 1:1 portraits
- [ ] `/services` — hub grid of 9 service cards
- [ ] `/services/:slug` — 9 detail templates (SDG colour tag, title, subtitle, description, deliverables list, "Request a quote" CTA → /contact)
- [ ] `/insights` — listing of 24 posts (cover placeholder, date, kicker, title, 2-line summary, category filter)
- [ ] `/insights/:slug` — 24 article templates (hero, body, related-posts strip, "back to insights")
- [ ] `/contact` — form (name, email, message), address, map embed placeholder
- [ ] `/privacy` — placeholder lorem with "Pending PDPA review" disclaimer
- [ ] Shared page chrome: breadcrumbs, "back to" link, footer quick links

### Phase 4 — SEO infrastructure
- [ ] Per-page `<title>` + `<meta name="description">` (manually written, never auto-generated)
- [ ] Open Graph + Twitter Card tags per page
- [ ] JSON-LD: Organization on every page, Person for faculty, Article for posts, BreadcrumbList everywhere
- [ ] Generate `sitemap.xml` covering all routes × both locales
- [ ] `robots.txt` allowing all
- [ ] `redirects.json` (Vercel-compatible) mapping all 43 old Wix URLs → new paths

### Phase 4b — Splice canonical copy (when zip arrives)
- [ ] Replace 9 service-page placeholder shells with TH/EN copy from services_copy.md
- [ ] Replace /privacy lorem with bilingual PDPA copy from privacy_policy.md
- [ ] Remove "Copy pending" inline labels

### Phase 5 — Lighthouse + QA
- [ ] Clean prod-build Lighthouse on 8 routes: `/th`, `/en`, `/th/about`, `/th/services`, `/th/services/training`, `/th/insights`, `/th/insights/chula-zero-waste`, `/th/contact`
- [ ] All 8 routes ≥ 90 a11y/BP/SEO, ≥ 85 perf
- [ ] WCAG AA contrast verified
- [ ] Capture sample screenshots

### Phase 6 — Deliver
- [ ] Save checkpoint
- [ ] Final report: published URL, 8-route Lighthouse table, content-gap list, slug map
