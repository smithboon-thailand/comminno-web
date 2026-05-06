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

---

## Task 3 — Phase-2 splice + consent + Formspree (current)

### 3.1 Locate phase-2 zip & inventory scaffold
- [ ] Confirm comminno_phase2_copy.zip in project files
- [ ] Extract services_copy.md + privacy_policy.md
- [ ] Inventory ServiceDetail, /privacy page, ContactForm, Footer, messages.ts

### 3.2 Splice canonical TH/EN copy
- [ ] Map services_copy.md → 9 service slugs; flag any missing TH/EN
- [ ] Splice into service content module (keep markdown rendering)
- [ ] Splice privacy_policy.md into /privacy (TH+EN)
- [ ] Apply NAME_FIXES (Boonchutima); grep for stale spellings
- [ ] Hand-written meta description per service page (TH+EN, ≤160 chars)

### 3.3 vanilla-cookieconsent v3 + Plausible gate
- [ ] pnpm add vanilla-cookieconsent
- [ ] Init with categories: necessary (locked) + analytics (default off)
- [ ] Bilingual TH+EN banner copy from privacy_policy.md
- [ ] cookie.expiresAfterDays: 365 (12-month)
- [ ] Footer 'Cookie settings / ตั้งค่าคุกกี้' → CC.showPreferences()
- [ ] Plausible loads ONLY when CC.acceptedCategory('analytics')
- [ ] Listen for cc:onChange to load/unload Plausible

### 3.4 Contact form → Formspree
- [ ] VITE_CONTACT_ENDPOINT (default https://formspree.io/f/PLACEHOLDER)
- [ ] Required: name, email, organization, service (9-option select), message, pdpa
- [ ] Honeypot 'company_url' (display:none, must be empty)
- [ ] Client-side rate limit (localStorage; 30s cooldown, 5/hour)
- [ ] Inline success state (replaces form) + inline error state (no toast)
- [ ] aria-live polite status

### 3.5 Clean Lighthouse audit (8 routes, mobile)
- [ ] /th, /en, /th/about, /th/services, /th/services/training,
      /th/insights, /th/insights/chula-zero-waste, /th/contact
- [ ] Capture P/A/BP/SEO per route; note any < 90 with failing audit

### 3.6 Deliver
- [ ] webdev_save_checkpoint
- [ ] Preview URL + score table + gaps list to user

---

## Task 2.5 — /about rebuild with verified faculty data (current)

### 2.5.1 Source canonical data
- [ ] Unzip comminno_faculty_data.zip → CIC_Faculty_for_Manus.md
- [ ] Read full markdown; note ORCID IDs, DOIs, role labels, TH/EN spellings

### 2.5.2 Critical spelling corrections (sitewide)
- [ ] Wassayut Kongjan → Watsayut Kongchan
- [ ] Wai Phan Chansem → REMOVE from team; Partner only (Asst. Prof. Waiphot Chansem)
- [ ] Atchara Boonchum → Achara Bunchum / อัจฉรา บุญชุ่ม
- [ ] Ekasit Sumana → Akasit Sumana / เอกสิทธิ์ สุมานะ

### 2.5.3 Team data module (typed)
- [ ] Tier 1 — Leadership × 3: Smith, Teerada, Pavel (TH/EN bio + role + ORCID + Scholar + 5 recent pubs w/ DOI)
- [ ] Tier 2 — Faculty × 1: Watsayut Kongchan (TH/EN + role + ORCID)
- [ ] Tier 3 — Research team × 8 (TH primary + EN transliteration + role)
- [ ] Partners: TNSU Samut Sakhon Campus + Waiphot Chansem

### 2.5.4 /about rebuild
- [ ] Hero with locale-aware copy
- [ ] Leadership section — 3 hero cards (bio + ORCID/Scholar icon-buttons + 5 pubs w/ DOI)
- [ ] Faculty section — 1 secondary card
- [ ] Research team grid — 8 cards (TH primary on /th, EN transliteration secondary)
- [ ] Partners section/page (TNSU)
- [ ] "ORCID coming soon" pattern for missing IDs
- [ ] Hand-written meta description (TH + EN)

### 2.5.5 Build & audit
- [ ] pnpm build clean
- [ ] Strip Manus runtime, serve clean build
- [ ] Lighthouse on /th/about and /en/about (mobile, simulated)
- [ ] webdev_save_checkpoint
- [ ] Deliver /th/about + /en/about preview URLs to user


---

## Task 4 — Smith publications fix (2026-05-05)

User reports the recent-publications block has inaccuracies. Verified source:
`/home/ubuntu/manus-final-batch/docs/CIC_Faculty_data.md`.

- [ ] (2026) Myanmar migrant workers co-designed health study — verify venue, DOI, authors
- [ ] (2026) Thai Gen Z anime — verify venue (Cogent Arts & Humanities), DOI
- [ ] (2026) Disease stigma in Thailand (MSM + Myanmar migrants) — verify venue (Wellcome Open Research), DOI
- [ ] (2025) Advertising fights back against negative online reviews — verify venue (Cogent Social Sciences), DOI
- [ ] (2025) Mazahir / Boonchutima (Corresponding) / Yaseen — Thailand image on YouTube post-cannabis — PLOS ONE 20(2):e0317506
- [ ] Type-check + checkpoint


## Task 5 — Anime paper canonical citation (2026-05-05)

- [ ] Replace 2026 Cogent A&H entry with: Krongbooncho, C., Boonchutima, S., & Mazahir, I. (2026). From stigma to mainstream: a multi-stakeholder thematic analysis of anime consumption and community-driven communication in Thai Generation Z. Cogent Arts & Humanities, 13(1). https://doi.org/10.1080/23311983.2026.2647143
- [ ] Type-check + checkpoint


---

## Task 6 — CMS migration Phase 1: GitHub + Vercel auto-deploy (2026-05-05)

Goal: move source to a public GitHub repo under the user's account, hook it to Vercel for auto-deploy on push to `main`. Keep `comminno-go6lmsuy.manus.space` live and untouched. Pure infra — zero visible content/behavior changes.

- [ ] Confirm with user: GitHub username, repo name (`cominnocenter-website` or `comminno-web`), MIT license OK, GitHub access token availability, Vercel account exists
- [ ] Compose project README (overview, stack, local dev), MIT LICENSE, comprehensive .gitignore
- [ ] Initialize git, single comprehensive commit, create public repo via `gh`, push `main`
- [ ] User connects Vercel → GitHub repo (Vite preset, build `pnpm run build`, output `dist`, install `pnpm install`); trigger first deploy
- [ ] Round-trip test: append `Last verified deploy: <date>` to README, push, confirm Vercel rebuilds in ~60s
- [ ] Deliver GitHub URL + Vercel URL; confirm Manus deployment still works

Out of scope (Phase 1):
- [ ] CMS, admin login (Phase 2)
- [ ] OpenAI / Facebook integration / secrets (Phase 3+/5)
- [ ] DNS cutover for cominnocenter.com (later)
- [ ] Touching the Manus deployment
