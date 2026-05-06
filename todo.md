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


## Task 6 — Phase 1 confirmed inputs (2026-05-06)

- GitHub username: `smithboon-thailand` (personal; will move to center org later)
- Repo name: `comminno-web` · MIT license · CC BY-NC 4.0 noted for content (later phase)
- GitHub connector: enabled in Manus
- Vercel account: ready (Sign in with GitHub, same `smithboon-thailand`)

Step-by-step (user-driven where Manus/Vercel require browser action):

- [ ] Step A: User opens Management UI → Settings → GitHub → "Export to a new repository"; account `smithboon-thailand`, name `comminno-web`, public, default branch `main`. Confirm export success.
- [ ] Step B: User opens https://vercel.com/new → "Import Git Repository" → pick `smithboon-thailand/comminno-web` → keep auto-detected settings (vercel.json drives them) → Deploy. Confirm production URL works.
- [ ] Step C: I append `_Last verified deploy: <date>_` to README via Manus workspace → user pushes (or Manus push, if connector permits) → Vercel auto-deploys in ~60s → user pastes the new Vercel URL/screenshot.
- [ ] Step D: I report final URLs and the round-trip confirmation; staging at comminno-go6lmsuy.manus.space remains untouched.


## Task 6 — Phase 1 SPA-rewrite fix (2026-05-06)

Symptom: /en/about → 404 NOT_FOUND on Vercel hard-refresh; / and /en (root) work; deep links inside /en/* and /th/* fail.
Cause: rewrite regex `/((?!api/|_next/|_vercel/|.*\\..*).*)` did not match Vercel's v2 path-to-regexp; `cleanUrls: true` may also strip extension-less paths and confuse the SPA fallback.
Fix: switch to the documented two-rule SPA pattern: keep static asset paths verbatim, then catch-all `/(.*)` → `/index.html`. Drop `cleanUrls`.

- [ ] Replace rewrites/cleanUrls in vercel.json
- [ ] Commit + save checkpoint (Manus auto-pushes to GitHub `main`)
- [ ] User: refresh `/en/about` and `/th/insights/the-training-program-for-driving-public-and-social-communication-care-d-plus` to confirm
- [ ] Use this same push as Phase-1 Step C round-trip evidence (no separate README ping needed)


## Task 6 — Phase 1 close-out (2026-05-06)

User-side actions (cannot be done by Manus):
- [ ] Flip repo visibility to public (Settings → Danger Zone → Change visibility)
- [ ] Enable Vercel Speed Insights (one-click in Vercel project)

Manus-side actions:
- [ ] Add `.github/workflows/check.yml` with pnpm check + vite build on PR + push:main
- [ ] Pin Node 22 + pnpm 9 to match local dev
- [ ] Use actions/checkout v4 + pnpm/action-setup v4 + actions/setup-node v4 with pnpm cache
- [ ] Commit + checkpoint + verify Manus pushes to GitHub
- [ ] Confirm Actions tab shows green check on the workflow run


---

## Task 7 — PHASE2_PLAN.md amendments (2026-05-06)

User reviewed plan, approved 95%; 4 structural fixes + 3 additions + 2 question amendments before code starts.

- [ ] A. §3 schema: add Tier-2 (faculty) collection — `content/team` filtered by `tier=2`
- [ ] B. §3 + Q1: drop `pages` collection (contact/privacy) entirely; About becomes a single-file collection
- [ ] C. §4 media: change recommendation to **migrate all 36 existing images to Cloudinary in Phase 2** (clean cutover)
- [ ] D. §1 Sveltia fallback: add commit #0 = smoke-test Sveltia↔Decap config.yml swap on a feature branch BEFORE merge
- [ ] +1 Editor handbook: TH primary / EN secondary
- [ ] +2 Reserve AI fields in frontmatter: `ai_caption: null`, `ai_meta: null`, `ai_translate_en: null`
- [ ] +3 Insert "commit #0 smoke test" before existing #1 in §10
- [ ] Q4: document collaborator-invitation + config.yml update procedure in handbook
- [ ] Q5: `secondary[]` items must include `caption` and `credit`
- [ ] Recompute approval-checklist line count (was 17, now ~20)
- [ ] Re-deliver revised plan; await final approval before commit #0


---

## Task 8 — Phase 2 execution (2026-05-06)

### Track A — Smoke-test branch (commit #0)
- [ ] Create branch `cms/smoke-test-fallback` from `main`
- [ ] Add `client/public/admin/index.html` with Sveltia CMS pinned tag
- [ ] Add `client/public/admin/config.yml` minimal: 1 collection (smoke_test), GitHub backend, base_url=https://sveltia-cms-auth.smith-boon.workers.dev
- [ ] Push branch → Vercel preview URL
- [ ] User logs in to /admin on preview, creates 1 draft post → verify commit lands on branch
- [ ] Swap script tag to `decap-cms@^3` in same file → push
- [ ] User logs in again → verify same draft round-trip works
- [ ] Document result in `PHASE2_PLAN.md` (smoke-test report appendix)
- [ ] Delete branch (squash-merged or simply deleted)

### Track B — Image migration prep
- [ ] Grep all manus-storage URLs in posts.ts / services.ts / about.ts / categories.ts
- [ ] Build canonical inventory CSV: namespace / slug / role (cover/hero/portrait/ambient) / src URL / alt text
- [ ] Create `.migration/originals/` (gitignored)
- [ ] Download all 36 originals via curl
- [ ] Verify byte counts + image dimensions
- [ ] Save inventory to `.migration/inventory.csv` for commit #4 reuse

### Verification
- [ ] All preview deploys load without console errors
- [ ] No accidental write to `main` from smoke-test branch
- [ ] tsc --noEmit still green on main (untouched)


### Smoke-test bug 1 — vercel.json SPA rewrite swallows /admin
- [ ] Add explicit `/admin/(.*)` rewrite (no-op or destination=/admin/$1) before catch-all
- [ ] Confirm Vite default publicDir copies admin/ → dist/public/admin/ (already verified)
- [ ] Push fix to cms/smoke-test-fallback; user re-tests Sveltia + Decap round-trip


---

## Task 8 — Phase 2 CMS execution (2026-05-06)

### Smoke test (commit #0) — DONE ✅
- [x] Branch `cms/smoke-test-fallback` created + pushed
- [x] `/admin/index.html` scaffold (Sveltia + Decap fallback toggle)
- [x] `vercel.json` `/admin` rewrite exclusion
- [x] Cloudflare Worker `sveltia-cms-auth-642` deployed (smith.boon@gmail.com Cloudflare account)
- [x] GitHub OAuth app `Ov23liul1Vd2Zm4We8UN` registered
- [x] Worker secrets `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` re-typed clean (Worker version `ad4fbee4`)
- [x] Sveltia round-trip verified — commit `c7bda22` on smoke branch (markdown + uploaded image)
- [x] Smoke-test results documented in PHASE2_PLAN.md Appendix A

### Decap fallback test — DEFERRED
- [ ] Re-run only if Sveltia loses a needed widget or stalls

### Cleanup (do after commit #3 lands on main)
- [ ] Delete branch `cms/smoke-test-fallback` locally (`git branch -D cms/smoke-test-fallback`)
- [ ] Delete branch `cms/smoke-test-fallback` on origin (`git push origin --delete cms/smoke-test-fallback`)
- [ ] Optionally delete the smoke-test commit `c7bda22` artifacts (`content/smoke-test/*` + `content/uploads/<screenshot>.png`) when they're no longer needed for evidence

### Commit #1 — chore(content): import markdown source into repo at /content
- [ ] `cp -r /home/ubuntu/comminno_assets/content /home/ubuntu/comminno-web/content` (mirror current source-of-truth into repo)
- [ ] Merge `vercel.json` `/admin` rewrite exclusion from smoke branch into `main`
- [ ] Verify build still passes (no path drift yet — `scripts/build-content.mjs` still points to `/home/ubuntu/comminno_assets/content`)
- [ ] Commit + push to `main`

### Commit #2 — build(content): point build-content.mjs at in-repo /content
- [ ] Patch `scripts/build-content.mjs`: change `CONTENT_DIR = '/home/ubuntu/comminno_assets/content'` → `path.join(ROOT, 'content')`
- [ ] Re-run build script → regenerate `client/src/content/{posts,services,about,categories}.ts`
- [ ] Diff regenerated TS modules — should be byte-identical (proves the relocation was lossless)
- [ ] Commit + push

### Commit #3 — chore(cms): scaffold /admin SPA (Sveltia, full schema)
- [ ] Replace smoke-test `client/public/admin/index.html` with production version (Sveltia only; no engine switcher)
- [ ] Replace smoke-test `client/public/admin/config.yml` with full schema:
  - `about` — single-file collection
  - `insights` — folder collection (24 entries) with TH/EN i18n
  - `services` — folder collection (9 entries) with TH/EN i18n
  - `team` — folder collection split by tier (1/2/3) — filtered views
  - Reserve hidden AI fields: `ai_caption`, `ai_meta`, `ai_translate_en` (default null)
  - Image `secondary[]` shape: `{ src, alt, caption, credit }`
  - `publish_mode: simple` for now (editorial workflow lands in commit #6)
- [ ] Commit + push, verify `/admin` loads on Vercel production (main branch)

### Commit #4 — feat(media): migrate 31 images to Cloudinary (URGENT — fixes broken images on Vercel)
**Blocked on Cloudinary credentials from user**
- [ ] User creates Cloudinary free-tier account at https://cloudinary.com/users/register_free
- [ ] User provides: Cloud name + API Key + API Secret (via secret/private channel)
- [ ] Upload all 62 originals from `.migration/originals/` to Cloudinary, namespaced as `comminno/{namespace}/{stem}` (matches inventory.csv `proposed_cloudinary_path`)
- [ ] Replace all 31 image URL pairs in `client/src/content/{posts,services,about}.ts` with Cloudinary `f_auto,q_auto` URLs
- [ ] Visual parity check on Vercel preview (compare against staging Manus URL)
- [ ] Commit + push to `main`

### Commit #5 — feat(cms): wire OAuth proxy backend (final config)
- [ ] Confirm production `config.yml` `backend.base_url` = `https://sveltia-cms-auth-642.smith-boon.workers.dev`
- [ ] Confirm `branch: main` in production config (was `cms/smoke-test-fallback`)
- [ ] Smoke-test on production `/admin` (Vercel main) — login + create dummy entry + delete
- [ ] Commit + push

### Commit #6 — feat(cms): enable editorial workflow + final field schema
- [ ] Switch `publish_mode: editorial_workflow`
- [ ] Verify draft/PR creation flow on Sveltia
- [ ] Confirm admin-only publish (only `smithboon-thailand` can merge)
- [ ] Document workflow in PHASE2_PLAN.md
- [ ] Commit + push

### Commit #7 — chore(perf): add @vercel/speed-insights
- [ ] `pnpm add @vercel/speed-insights`
- [ ] Mount `<SpeedInsights />` in `client/src/main.tsx` behind cookie-consent gate (only fires when `analytics` consented)
- [ ] Verify in Vercel dashboard → Speed Insights tab populates within 24h
- [ ] Commit + push

### Commit #8 — docs(cms): editor handbook (TH primary, EN secondary)
- [ ] Create `docs/cms-handbook-th.md` (primary) — login flow, create/edit insight, create/edit service, edit about, image upload, draft → publish, troubleshooting
- [ ] Create `docs/cms-handbook-en.md` (secondary, faithful translation)
- [ ] Include collaborator-invitation procedure (GitHub repo invite + Sveltia auto-recognizes)
- [ ] Include the smoke-test procedure for future engine swaps (Sveltia ↔ Decap)
- [ ] Link both from README
- [ ] Commit + push

### Phase 2 close-out
- [ ] Final report to user: 8 commits landed, /admin live on production, 31 images on Cloudinary, broken-images bug resolved, editor handbook published
- [ ] Save checkpoint with full delta summary

