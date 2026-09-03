# Comm.Inno website audit — error, misinformation and reputation risk review

**Property audited:** Comm.Inno — Center of Excellence in Communication Innovation for the Development of Quality of Life and Sustainability, Faculty of Communication Arts, Chulalongkorn University

**Repository:** `smithboon-thailand/comminno-web` (branch `main`, HEAD `0e67e59`, last commit 2026-05-07)
**Live properties checked:** `comminno-web.vercel.app` (production), `comminno-go6lmsuy.manus.space` (staging), `www.cominnocenter.com` (legacy Wix)
**Audit date:** 2 September 2026
**Scope:** content accuracy, factual and reputational risk, discoverability, accessibility, privacy/PDPA compliance, security, performance, editorial governance
**Method:** full source review of the repository (119 content files, 9 page components, build and deploy configuration), plus live HTTP verification of all three deployed properties

---

## 1. Executive summary

The Comm.Inno site is, in terms of visual design, brand discipline and information architecture, a well-built piece of work. The brand tokens are honoured, the bilingual scaffolding is real, the cookie consent implementation is genuinely PDPA-shaped rather than decorative, and the accessibility baseline scores 100 on Lighthouse. Nothing in this report should be read as a criticism of the design direction.

The problems are elsewhere, and they are serious. They cluster into three groups.

**First, the site is publishing under the wrong identity.** Every page served from production tells search engines, social networks and structured-data consumers that the canonical, authoritative version of that page lives on the *staging* domain `comminno-go6lmsuy.manus.space`. This is not a subtle configuration drift — it is present in the canonical link, in all three `hreflang` alternates, in the `Organization` JSON-LD `url` and `logo`, in the `Sitemap:` directive of `robots.txt`, in all 78 sitemap entries, in the CMS `site_url`, and in the Plausible analytics `data-domain`. All three properties (legacy Wix, staging, production) are simultaneously live and fully crawlable. The center is currently competing against itself for its own name in three places, and pointing search engines at the copy it least wants people to find.

**Second, migrated content carries visible defects that reflect on the center's credibility.** Twenty-six fields across the 24 insight posts are truncated mid-sentence or mid-word — three article summaries end at the literal string "Associate Professor Dr." Fifteen of 24 posts have no cover image and no alt text. Three posts have no publication date, including the newest and most internationally significant story (the March 2026 Keio/Bunkyo University collaboration), which is consequently buried at the bottom of the archive and absent from the homepage. Twenty-one of 24 article bodies exist only in English on a Thai-default site. The public "About" page displays "Thai spelling pending verification" badges next to five named staff members.

**Third, the published privacy notice is not fit to be public.** It contains unreplaced placeholder tokens — `[dpo@comminno.center]`, `[+66 2 218 ____]`, `[DATE]` — and a self-declared banner saying it is awaiting legal review. It also names the wrong data processors: it discloses Resend and Cloudflare, neither of which the site uses, and omits Formspree and Cloudinary, both of which actually receive user data. For a university research center whose own stated expertise includes risk communication, a PDPA notice with blanks in it is a reputational exposure out of proportion to the effort required to fix it.

None of the top-tier findings are architectural. They are configuration values, content-pipeline artefacts and unfinished handoffs. The highest-impact items in this report are collectively a few days of work.

### Severity summary

| # | Finding | Severity | Effort |
|---|---|---|---|
| 3.1 | Production canonicals, hreflang, JSON-LD and sitemap all point to the staging domain | **Critical** | Low |
| 3.2 | Three copies of the site live and crawlable at once (legacy, staging, production) | **Critical** | Low |
| 5.1 | Privacy notice published with placeholder tokens and "pending review" banner | **Critical** | Low |
| 5.2 | Privacy notice names processors the site does not use; omits the ones it does | **Critical** | Low |
| 4.1 | Every URL returns HTTP 200 — no real 404, no real 301 anywhere | **High** | Medium |
| 4.2 | 39 legacy Wix redirects are client-side only and never reach Vercel | **High** | Low |
| 4.3 | Legacy `/about`, `/contact`, `/insights` have no redirect and dead-end | **High** | Low |
| 4.4 | Two redirect destinations point to slugs that do not exist | **High** | Low |
| 4.5 | Zero server-rendered content; all ~78 URLs share one title and OG card | **High** | Medium |
| 6.1 | 26 truncated summaries/descriptions, three cut at "Associate Professor Dr." | **High** | Medium |
| 6.2 | Newest story (Keio, March 2026) undated and therefore invisible | **High** | Low |
| 6.3 | "Thai spelling pending verification" badges shown publicly beside real names | **High** | Low |
| 7.1 | Analytics reports to the staging domain — production traffic data is lost | **High** | Low |
| 8.1 | Admin CMS loads an unpinned third-party script with no SRI | **High** | Low |
| 9.1 | Contact form accepts empty submissions (`noValidate` with no JS validation) | **Medium** | Low |
| 6.4 | Misspelled name in a public URL, contradicting the project's own rule | **Medium** | Medium |
| 6.5 | Same academic's surname romanised two different ways on the site | **Medium** | Low |
| 3.3 | Four different domain identities used across the project | **Medium** | Low |
| 4.6 | Insight cards display raw category slugs (`book-and-printing`) | **Medium** | Low |
| 4.7 | Article bodies rendered as plain text; Markdown and links do not render | **Medium** | Medium |
| 10.1 | Production Lighthouse below the mandated 90 (perf 83, best-practices 81) | **Medium** | Medium |
| 8.2 | Unsigned Cloudinary upload preset published in a public repository | **Medium** | Low |
| 8.3 | No Content-Security-Policy header | **Medium** | Low |
| 8.4 | Session/network-logging debug collector shipped in the production bundle | **Medium** | Low |
| 11.1 | Post schema has no Thai summary or body field — bilingual parity unreachable | **Medium** | Medium |
| 9.2 | No scroll-to-top on navigation | **Low** | Low |
| 9.3 | `.tag-brand-blue` utility fails WCAG AA at 2.89:1 | **Low** | Low |
| 9.4 | Dark mode half-built: no toggle, no auto-detect, hardcoded white surfaces | **Low** | Medium |
| 6.6 | "This section is coming in the next sprint" — internal jargon in user-facing copy | **Low** | Low |
| 12.1 | 51 of 53 UI components and both server/Express dependencies are dead code | **Low** | Medium |
| 12.2 | GitHub repository description misstates the stack as Next.js + next-intl | **Low** | Low |

---

## 2. Methodology and scope

This audit combined three passes.

**Source review.** Every file under `content/` (119 files: 24 posts, 24 post bodies, 9 services, 12 categories, the About record, the redirect map and the migration data dump), every page component under `client/src/pages/`, the layout and consent components, the i18n layer, the build scripts, the CMS configuration, and the deployment configuration (`vercel.json`, `robots.txt`, `sitemap.xml`, the GitHub Actions workflow).

**Programmatic validation.** Cross-reference checks were scripted rather than eyeballed: every `relatedSlugs` entry and every redirect destination was resolved against the actual post and service slug sets; every post summary and OG description was tested for mid-sentence truncation; the legacy URL inventory in `content/data/all_urls.txt` was diffed against the redirect map; every brand colour pair used as foreground-on-background was run through the WCAG relative-luminance formula.

**Live verification.** All three deployed properties were checked over HTTP for availability, status codes on real and synthetic paths, response headers, `robots.txt` policy, and the actual markup served to a non-JavaScript client.

**Out of scope.** This audit did not verify the substance of the academic claims on the About page against external databases — publication counts, citation totals, h-index, editorial board memberships and society presidencies are reported as *risks requiring verification and a refresh policy*, not as errors. It also did not perform a dependency CVE scan (no network install was available) or a manual screen-reader pass.

---

## 3. Domain, canonical and indexing architecture

### 3.1 — Production tells the world that staging is canonical *(Critical)*

This is the single most consequential finding in the audit. A live request to the production homepage returns:

```html
<link rel="canonical" href="https://comminno-go6lmsuy.manus.space/th" />
<link rel="alternate" hreflang="th"        href="https://comminno-go6lmsuy.manus.space/th" />
<link rel="alternate" hreflang="en"        href="https://comminno-go6lmsuy.manus.space/en" />
<link rel="alternate" hreflang="x-default" href="https://comminno-go6lmsuy.manus.space/th" />
```

and an `Organization` JSON-LD block whose `url` and `logo` also resolve to `manus.space`. `robots.txt` on production advertises `Sitemap: https://comminno-go6lmsuy.manus.space/sitemap.xml`. All 78 `<loc>` entries in `sitemap.xml` — 312 staging-domain occurrences once alternates are counted — use the staging host.

A canonical tag is a directive, not a hint. Every production page is instructing Google, Bing and every structured-data consumer to attribute that page's content, links and authority to a temporary preview host. `usePageMeta` does rewrite the canonical to `window.location.origin` once React mounts, but that rewrite happens after JavaScript execution; the served HTML — which is what social crawlers, LINE, most AI crawlers and Google's initial fetch see — carries the staging URL.

Fix: introduce a single `SITE_ORIGIN` constant sourced from an environment variable, thread it through `client/index.html` (build-time substitution), `scripts/build-sitemap.mjs` (already supports `SITE_DOMAIN`), `robots.txt`, `client/public/admin/config.yml` and `CookieConsentProvider`. Nothing should hardcode a host.

### 3.2 — Three live, crawlable copies of the same content *(Critical)*

All three properties respond `200`:

| Host | Role | `robots.txt` |
|---|---|---|
| `www.cominnocenter.com` | Legacy Wix | `Allow: /` — fully open, explicitly welcoming AI crawlers |
| `comminno-go6lmsuy.manus.space` | Staging | `Allow: /` — fully open |
| `comminno-web.vercel.app` | Production | `Allow: /` — fully open |

The legacy Wix `robots.txt` is notable: it has been deliberately configured with a Thai-language policy note inviting both search and AI bots to crawl the whole site. That was a reasonable decision for the old site; it is now actively harmful, because it means the outdated property is the best-indexed of the three and the one most likely to be quoted by AI assistants answering questions about the center.

Fix, in order: (a) correct the canonicals per 3.1; (b) put staging behind HTTP basic auth or serve `X-Robots-Tag: noindex` from it; (c) cut DNS for `cominnocenter.com` to the production deployment and serve 301s from the legacy path structure, rather than leaving Wix running.

### 3.3 — Four competing domain identities *(Medium)*

The project refers to itself under four different names: `cominnocenter.com` (README, footer copy, legacy data), `comminno.center` (the DPO email in the privacy notice, and `comminno.center/th/insights/…` in the editorial handbook), `comminno-web.vercel.app` (production), and `comminno-go6lmsuy.manus.space` (staging, and every canonical). The privacy notice directs data-subject requests to an email address at a domain that appears nowhere else in the project and may not exist. Under PDPA that is not a cosmetic issue — see 5.1.

Decide the permanent public domain, then make every reference in the repository derive from one constant.

---

## 4. Discoverability, crawlability and migration integrity

### 4.1 — No URL on the site ever returns a 404 *(High)*

Verified live:

```
/th/about                        → 200
/about                           → 200
/post/chula-zero-waste           → 200
/this-page-does-not-exist-xyz    → 200
```

`vercel.json` rewrites `/(.*)` to `/index.html`, so every conceivable path returns the SPA shell with a success status. The React `NotFound` component then paints a 404 screen, but the HTTP layer has already said "this page exists." Search engines treat this as a soft 404: they will crawl, index and then quietly demote an unbounded space of non-existent URLs. There is also no `noindex` on the NotFound view, so nothing signals the mistake.

Fix: add a Vercel `cleanUrls`/rewrite exception that returns a real 404 for unmatched paths, or add a lightweight edge function that resolves known routes and returns 404 otherwise. At minimum, have `NotFound` inject `<meta name="robots" content="noindex">`.

### 4.2 — The 39 legacy redirects never reach Vercel *(High)*

`scripts/build-redirects.mjs` emits two files: `client/public/_redirects` (Netlify/Cloudflare Pages format) and `client/public/redirects.json` (a Vercel-shaped `{"redirects":[…]}` object). Both land in `client/public/`, which Vite copies verbatim into the build output. Vercel does not read either. Vercel reads redirects only from `vercel.json` — and `vercel.json` contains no `redirects` array at all.

The CMS configuration states, in a comment editors will read, that redirects are *"Consumed by vercel.json so legacy bookmarks and external backlinks keep working."* That is not true today. The only redirect mechanism in effect is `RedirectHandler` in `App.tsx`, which performs a client-side `navigate(..., { replace: true })` after React has mounted — a soft redirect from a 200 response, not a 301. Link equity from external backlinks to the old Wix URLs is not being passed.

Two side effects: `redirects.json` and `_redirects` are publicly fetchable at `/redirects.json` and `/_redirects`, and the generated files are committed rather than built, so they can silently drift from `content/redirects.yml`.

Fix: have the build write the redirect array into `vercel.json` (or a generated config Vercel reads), delete the two public artefacts, and correct the misleading CMS comment.

### 4.3 — The three highest-value legacy URLs dead-end *(High)*

The legacy inventory contains 43 URLs. Four have no redirect entry: `/about`, `/contact`, `/insights`, and the Türkiye post (4.4). The first three are, after the homepage, the most-linked and most-bookmarked paths on any institutional site.

Traced through the router: `/about` matches the `/:locale` route with `locale === "about"`, fails the `th`/`en` guard, falls through to `RedirectHandler`, finds no map entry, and renders `NotFound`. A visitor arriving on an old bookmark to the center's About page sees a 404 screen.

Fix: add `/about → /about`, `/contact → /contact`, `/insights → /insights` to `content/redirects.yml` (the handler prefixes the locale), and — better — make `RedirectHandler` fall back to prefixing the detected locale onto any path that matches a known route shape, so unlocalised paths self-heal.

### 4.4 — Two redirects point at slugs that do not exist *(High)*

| Source (legacy) | Destination | Problem |
|---|---|---|
| `/post/associate-professor-dr-smith-boonchotima-…-krungthai-bank` | `/insights/associate-professor-dr-smith-boonch**u**tima-…` | Destination slug does not exist; the real post is stored under the `boonchotima` spelling |
| `/post/dr-teerada-…-in-t%C3%BCrkiye-for-the-wo` | `/insights/…-t%C3%BCrkiye-…` | Destination is percent-encoded; the real slug contains a literal `ü` |

Both currently resolve to the 404 view. The first is compounded by `content/services/training.yml`, whose `relatedSlugs` list references the same non-existent `boonchutima` slug — so the "Training programs" service page, one of three services featured on the homepage, links to a dead case study.

Fix: correct both destinations to the actual slugs, and add the cross-reference validation described in §13 to CI so this class of error cannot ship again.

### 4.5 — Nothing is server-rendered; every page shares one identity *(High)*

The body served for *every* URL is:

```html
<body>
  <div id="root"></div>
</body>
```

and every URL — homepage, About, each of the 9 services, each of the 24 articles — is served the same `<title>` and the same `og:title`, `og:description` and `og:image` from `client/index.html`.

Consequences:

- **Social sharing is broken across the board.** Any article shared on Facebook, LINE, X or LinkedIn produces an identical generic card. In Thailand, where LINE is the dominant sharing channel and does not execute JavaScript, this means the center's articles have effectively no shareable identity.
- **`og:image` cannot render even in principle.** It is set to `/logo-official.svg` — a *relative* path (Open Graph requires absolute URLs) pointing at an *SVG* (which Facebook, LinkedIn, X and LINE all refuse). There is no raster OG image anywhere in `client/public/`. `usePageMeta` never sets `og:image` or `twitter:image` at all, so even JS-executing consumers get nothing.
- **Non-JS crawlers see an empty site.** Google renders JavaScript, but with a delay and not always completely; most AI crawlers, LINE, and many aggregators do not.
- `usePageMeta` also sets `og:type: "website"` on article pages (should be `article`), and never updates the per-page `hreflang` alternates — so every page declares the homepage as its language alternate.

Fix, in ascending cost: (a) add a 1200×630 PNG OG image and set absolute `og:image`/`twitter:image` in `usePageMeta`; (b) add a build-time prerender step (`vite-plugin-ssg` or a simple Puppeteer pass over the known route list) so each URL ships correct static head tags and body content; (c) set `og:type: "article"` and per-page `hreflang` alternates.

### 4.6 — Raw category slugs shown to users *(Medium)*

`client/src/pages/Insights.tsx` renders the card tag chip as `{p.tags[0]}` — the raw slug. Users on both locales see `book-and-printing`, `research-and-evaluation`, `campaign-manage`. The lookup that would fix this (`categoriesBySlug`) is already imported and correctly used on the article detail page; the index page simply does not use it.

### 4.7 — Article bodies are rendered as plain text *(Medium)*

`InsightDetail.tsx` takes the Markdown body and splits it with:

```js
para.split(/(?<=[.?!])\s+(?=[A-ZА-Я])/)
```

This has three effects. Markdown is never parsed — headings, links, lists and emphasis would render as literal characters (the CMS explicitly instructs editors to "Use `##` for section headings", so this will break as soon as an editor follows the guidance). The two URLs currently in article bodies (`anyflip.com/wyzmm/tiog/`, `nia100faces.com`) render as inert text rather than links. And because the lookahead only matches Latin and Cyrillic capitals, Thai passages are never split at all — a Thai section renders as one unbroken wall of text, while `Dr. Smith` is *incorrectly* split into two paragraphs.

Fix: render bodies through a real Markdown renderer with a sanitiser.

---

## 5. Legal, privacy and PDPA compliance

### 5.1 — The published privacy notice contains blanks *(Critical)*

`/th/privacy` and `/en/privacy` are live and carry a prominent amber banner reading *"Pending PDPA review — the bracketed […] tokens (DPO email, phone number, effective dates) are pending final confirmation from the center's legal team."* The body then delivers on that warning:

- Section 1, 6, 10 and 12: contact address for all data-subject rights is `[dpo@comminno.center]`, in brackets.
- Section 12: `Phone: [+66 2 218 ____]` / `โทรศัพท์: [02-218-____]`.
- Header metadata: `Effective: [DATE]` and `Last updated: [วันที่]`.

Under the PDPA a data controller must give data subjects a workable channel for exercising their rights and must state the notice's effective date. A notice that names no reachable DPO, no phone number and no date does not meet that bar. It is also visible on the same page as a contact form that collects name, email, organisation and free-text message under an explicit consent checkbox — so the site is taking consent while telling the user the terms of that consent are unfinished.

This is the fastest high-value fix in the report: confirm four values with the center, replace the tokens, delete the banner.

### 5.2 — The notice discloses the wrong data processors *(Critical)*

Section 4 ("Who sees your data") and Section 9 ("International transfers") name **Resend** (transactional email), **Vercel/Cloudflare** (hosting logs), **Plausible** and **Vercel Speed Insights**.

The site does not use Resend. It does not use Cloudflare. What it actually uses, and does not disclose:

| Processor | Data it receives | Disclosed? |
|---|---|---|
| **Formspree** (US) | Every contact-form submission: name, email, organisation, service interest, free-text message | **No** |
| **Cloudinary** (US) | Visitor IP and user-agent on every image request, from every page | **No** |
| **unpkg / Cloudflare CDN** | Visitor IP on `/admin` load | No |
| Resend | *nothing — not used* | Yes (incorrectly) |
| Cloudflare (as host) | *nothing — not used* | Yes (incorrectly) |

Formspree is the significant one: it is the only third party that receives identifiable personal data submitted by users, and it is the one the notice omits. Section 7's assurances ("encrypted at rest; role-based access; annual security audit by university IT; breach notification to PDPC within 72 hours") should also be confirmed as commitments the center can actually honour, since they are being made publicly on the center's behalf.

Fix: rewrite Sections 4 and 9 against the actual processor list; remove Resend and Cloudflare unless they are about to be adopted; confirm or soften Section 7.

### 5.3 — Ancillary privacy observations *(Low)*

- Five staff email addresses are published as plain `mailto:` links on `/about`, harvestable by scrapers. Consider an obfuscated or form-mediated contact route.
- The Contact page renders a second `Organization` JSON-LD node whose address disagrees with the site-wide one in `index.html` (no street number, `addressLocality: "Pathumwan"` vs `"Wang Mai, Pathum Wan"`). Two conflicting entity descriptions on one page weakens the knowledge-graph signal. Emit one `Organization` sitewide and use `ContactPage` on the contact route.
- The consent gate is well built and defaults analytics to off, which is correct. The `NEXT_LOCALE` cookie is correctly treated as strictly necessary.

---

## 6. Content accuracy, misinformation and reputation risk

### 6.1 — Twenty-six truncated fields, three of them acutely embarrassing *(High)*

The Wix migration applied a hard 200-character cut to `summary` and a similar cut to `ogDescription`, with no sentence-boundary awareness. Representative examples, all currently live:

| Post | What the card actually says |
|---|---|
| Krungthai Bank leadership training | *"Today (July 23, 2025), Associate Professor Dr."* |
| Treasury Officer Program lecture | *"Today (August 6, 2025), Associate Professor Dr."* |
| Türkiye workshop | *"On 4 - 5 July 2025, Assistant Professor Dr."* |
| Chula Zero Waste | *"…Emphasizing Fun, Brightness, Simplicity, and Practicality.The Action Plan for Sustainable Management of Solid and Haza"* |
| Keio/Bunkyo collaboration | *"…to strengthen international academic ties and foster innovativ"* |

Twenty-six fields across 15 posts are affected. A second artefact class is the missing space after a full stop where the scraper joined a heading to a paragraph: `"…Practicality.The Action Plan"`, `"…WorkshopAs the head"`, `"…MethodsWe supported"`, `"…AR images.https://www.nia100faces.com/"`. A third is leaked escape characters and stray caption text: `"Peace Playground Workshop\_On March 11"`, and in the Seeds for CU Sustainability description, `"…involved in the project.อุทยาน 100ปี final sub engค่ายปลายปี final sub eng"` — raw video-file names from the original media library, published as body copy.

For a communications center, prose that visibly breaks mid-word is the most directly reputation-damaging category of defect in this report. It is also entirely mechanical to fix: 15 posts need a human-written one-sentence summary and a two-to-three-sentence OG description, which the CMS already has fields for.

### 6.2 — The newest and strongest story is invisible *(High)*

Three posts have `date: null`: the Keio/Bunkyo University collaboration, Sri Trang Agro-Industry, and the Thai Health Promotion Foundation training. The Keio post's own body dates the visit to **11 March 2026** — it is the most recent item on the site and describes an international partnership with a named dean at a major Japanese university.

Because both the homepage and the Insights index sort with `(b.date ?? "").localeCompare(a.date ?? "")`, an empty date sorts last. The result: the center's newest, most prestigious story sits at the bottom of the archive and never appears in "Latest insights."

Compounding this, the newest *dated* post is 2025-08-06. To a visitor, the site's news feed has been silent for thirteen months. For a "Center of Excellence" this is the impression that matters most — more than any individual defect in this report, an apparently dormant news feed suggests a dormant center.

Fix: date the three undated posts; make the sort treat missing dates as "unknown, surface for review" rather than "oldest"; and publish the backlog of 2025–2026 activity that evidently exists.

### 6.3 — Work-in-progress badges published beside real people's names *(High)*

`/th/about` renders, next to five named research staff (Wanwisa Wetchprasit, Chanapa Itthiamornkulchai, Supatra Petchree, Hrut Sitthipuwabun, Thavin Chaemchaeng, Pornpavee Thiuthipsakul), the badge **"การสะกดภาษาไทยอยู่ระหว่างยืนยัน"** — *"Thai spelling pending verification."* This is driven by the `thaiSpellingPending: true` flag in `content/about.yml`.

The same page renders "ORCID coming soon" and "Google Scholar coming soon" pills for two faculty members.

The intent — transparency about auto-transliterated names — is honourable, but the effect is that the center publicly states it has not verified how its own staff's names are spelled. These flags belong in the CMS as an editorial to-do, not in the rendered page. Verify the six spellings, clear the flags, and change the component to omit the slot rather than render a placeholder.

### 6.4 — A misspelled name in a public URL *(Medium)*

Non-negotiable #5 of the project brief reads: *"Center head spelling — always `Smith Boonchutima` (never *Smit* or *Smith Boonchotima*)."*

The build pipeline honours this in prose: `scripts/build-content.mjs` applies a `Boonchotima → Boonchutima` substitution, and the article's rendered title and body are correct. But the **slug is not normalised**, so the live URL is:

```
/th/insights/associate-professor-dr-smith-boonchotima-delivers-leadership-training-at-krungthai-bank
```

The misspelling is therefore in the URL bar, in every share of that link, and in the breadcrumb path. Two internal references (the redirect map and the training service's `relatedSlugs`) point at the *corrected* slug, which does not exist — see 4.4 — so the rule is currently being half-applied in a way that produces broken links.

Fix: rename the content files to the corrected slug, point the internal references at it, and add a redirect from the misspelled slug to preserve any external links.

### 6.5 — One academic, two romanisations *(Medium)*

Dr. Kamonrat's surname appears as **"Kitrungpaisan"** (12 occurrences, in the FDA summit post) and **"Kijrungpaisarn"** (2 occurrences, in Teerada Chongkolrattanaporn's 2025 *Journal of Communication Arts* citation on the About page). Both refer to the same co-author. On a site that already enforces a spelling rule for the center head, applying it to only one person is an inconsistency worth closing — particularly since one of the two spellings appears inside a formal academic citation, where accuracy is checkable and matters.

Conduct a name sweep across all content and adopt one romanisation per person, recorded in a glossary the CMS references.

### 6.6 — Internal jargon and transitional messaging in public copy *(Low)*

- `messages.ts` defines `nav.placeholder.toast`: *"This section is coming in the next sprint."* / *"ส่วนนี้จะเปิดให้ใช้งานในเฟสถัดไป"*. "Sprint" is internal vocabulary; if this string can surface, it should read as a plain "coming soon."
- The footer permanently displays *"Replacing the legacy site at cominnocenter.com."* This tells every visitor the site is mid-migration and names a competing live property they can go to instead. Remove it once DNS cuts over; until then, at least drop the domain name.
- The Contact page's `errorPlaceholder` string reads *"The form endpoint (Formspree) hasn't been wired up yet — engineering is on it."* This exposes an internal status and a vendor name to end users. It should read as a neutral "the form is temporarily unavailable, please email us" message.
- `PageMeta.ts` carries a `https://comminno.example` placeholder origin as its SSR fallback.

### 6.9 — The public repository description misstates the stack *(Low)*

The GitHub repository description — public text, shown on the repo page and in
search results — reads:

> Bilingual TH/EN marketing site (MVP) for the Center of Excellence in
> Communication Innovation… **Next.js 15 App Router + Tailwind v4 + next-intl.**
> · Built with Manus

The project is React 19 + Vite 7 + Wouter + `react-intl`. The README documents
that the center approved moving off Next.js on 2026-05-04, so the description
contradicts the project's own documentation, and the "Built with Manus" tag is
a leftover from the scaffolding phase. It is the same staleness pattern as 3.3
and 6.7, on the surface a prospective collaborator or contributor sees first.

Fix: edit the description in the repository settings (it is GitHub metadata,
not a file in the tree, so it cannot be changed by a pull request).

### 6.7 — Claims requiring verification and a refresh policy *(Medium — informational)*

The About page makes a number of specific, checkable claims that are almost certainly accurate today but will silently rot:

- *"60+ peer-reviewed publications, 231 citations, h-index 9, i10-index 8 (Google Scholar, Dec 2025)"* — correctly dated, which is good practice, but the date is now nine months stale and metrics drift continuously.
- *"Editorial Board Member of BMC Public Health (Springer Nature, **IF 3.6**)"* — impact factors are re-issued annually; publishing one is a maintenance commitment.
- *"President of the Asian Congress for Media and Communication (ACMC) **2024–2026**"* — a term that expires this year.
- *"reviews for 20+ international journals"*, *"Twelve case studies"* (training service), *"we reply within five working days"* (contact page and homepage).

None of these is an error. But each is a public commitment or a decaying fact. Recommendation: mark time-bound claims in the CMS with a review date, prefer ranged language ("over 60 publications") to precise counts where precision adds nothing, and schedule an annual About-page verification.

Two further items warrant a conscious decision rather than a correction:

- **Role title mismatch.** Dr. Watsayut Kongchan's Thai title reads *รองคณบดี* (Associate/Vice Dean) while the English reads *"Assistant Dean"* — two different ranks. Similarly, Dr. Teerada's role is given as "Deputy Head of Research Operations Unit" in the leadership block and "Head of Department of Public Relations" in the legacy JSON-LD block. Titles are the kind of detail colleagues notice.
- **Concurrent appointment disclosure.** Assoc. Prof. Pavel Slutskiy's concurrent appointment at Saint-Petersburg State Electrotechnical University (LETI) is disclosed, alongside research on Russian pro-government media. Disclosure is the correct choice and should stand; the center may nonetheless want to be deliberate about how it is framed, given the current sensitivity of Russian institutional affiliations in international academic partnerships.

### 6.8 — SDG mapping is asserted without rationale *(Medium)*

The homepage states: *"Nine service lines… every engagement maps to a UN Sustainable Development Goal."* Each service carries exactly one `sdgNumber`, which drives a coloured chip. Some mappings are natural (training → SDG 4); others are a stretch (campaign management → SDG 13 Climate Action; communication design → SDG 10 Reduced Inequalities; both seminars and research → SDG 17 Partnerships).

For a center whose name is built on sustainability, a one-goal-per-service colour system with no stated basis is the shape of claim that invites an SDG-washing critique — precisely the critique this center's own researchers are equipped to make of others. Recommendation: allow multiple SDGs per service, add a sentence per service explaining *how* the work contributes, and consider a short methodology note on `/services`. Note also that the SDG chip labels (`SDG_LABEL_EN` in `SdgChip.tsx`) exist only in English and render untranslated on Thai pages.

---

## 7. Analytics and measurement

### 7.1 — Analytics is reporting to the wrong site *(High)*

`CookieConsentProvider.tsx`:

```js
const PLAUSIBLE_DOMAIN = "comminno-go6lmsuy.manus.space";
```

Plausible attributes events by the `data-domain` attribute. Every consented pageview from the production site is being submitted against the staging property. Depending on the Plausible account configuration, those events are either rejected outright or silently pooled into a staging dashboard nobody reads. Either way, the center currently has no reliable traffic data for its live website — which also means there is no baseline against which to measure any of the improvements in this report.

Fix: derive the domain from the same `SITE_ORIGIN` constant introduced in 3.1, and confirm the Plausible site is registered under the production hostname.

### 7.2 — Measurement gaps *(Low)*

There is no goal or event tracking on the contact form, no outbound-link tracking to the faculty's DOIs and profile links, and no 404 tracking (which, given §4.1, would be the fastest way to discover broken legacy links). Once the domain is corrected, adding a `submit` event on the contact form gives the center its only real conversion signal.

---

## 8. Security

### 8.1 — The admin CMS loads an unpinned third-party script *(High)*

`client/public/admin/index.html`:

```html
<script type="module"
        src="https://unpkg.com/@sveltia/cms@^0.42/dist/sveltia-cms.js"></script>
```

Three problems compound here. The version is a **range**, not a pin — `^0.42` resolves to whatever the latest `0.42.x` is at load time, so the code executing in the editor's browser can change without any commit to this repository (the file's own comment claims it is "pinned to a known-good release", which is not what `^` means). There is no **Subresource Integrity** hash. And the page it runs on is the one where an editor holds a **GitHub OAuth token with write access to the repository**.

A compromised or malicious `unpkg` response would execute with that token in scope. This is the highest-severity technical finding in the audit.

Fix: pin an exact version (`@sveltia/cms@0.42.7`), add an `integrity` attribute with the matching SRI hash, and — preferably — vendor the bundle into `client/public/admin/` so it is version-controlled and served same-origin. Bump deliberately, with a smoke test, as the file's comment already intends.

### 8.2 — Unsigned Cloudinary upload preset in a public repository *(Medium)*

`admin/config.yml` publishes `cloud_name: dpzdw1bkr` and `upload_preset: comminno-cms-uploads` in a repository licensed MIT and readable by anyone. An unsigned upload preset accepts uploads from any origin without authentication. The `client_allowed_formats` and `max_file_size` constraints in this file are enforced by the *widget*, not by Cloudinary, unless the same limits are configured on the preset itself.

Practical exposure: quota and bandwidth abuse, and unwanted content sitting in the center's media library under the center's account.

Fix: confirm that format, size and folder restrictions are set on the preset in the Cloudinary console (not just here); enable moderation on the preset; or switch to signed uploads brokered by a small serverless endpoint.

### 8.3 — No Content-Security-Policy *(Medium)*

`vercel.json` sets a reasonable header baseline — `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS with preload, `X-Frame-Options`. There is no `Content-Security-Policy`, which is the header that would actually constrain the third-party script surface described in 8.1 and 8.2.

Suggested starting policy (tighten after testing): `default-src 'self'; script-src 'self' https://plausible.io https://unpkg.com; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https://plausible.io https://formspree.io; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formspree.io`.

Also worth adding: `X-Robots-Tag: noindex` on the staging deployment, and a `Cross-Origin-Opener-Policy` header.

### 8.4 — Debug/session-logging collector shipped to production *(Medium)*

`client/public/__manus__/debug-collector.js` (25 KB) is a Manus development instrument that captures console output, all `fetch`/XHR traffic including request and response bodies, and semantic UI events (clicks, typing, submits, scrolls) as a session-replay stream, POSTing them to `/__manus__/logs`.

Because it lives in `client/public/`, Vite copies it verbatim into the production build; it is publicly fetchable on the live site today. The Vite plugin that injects it is guarded on `NODE_ENV === "production"`, so it is not *referenced* by the production HTML — but a single environment-variable change would activate a keystroke-and-network logger on a site with a PDPA notice promising privacy-friendly analytics only. It is also the source of the `beforeunload` handler that costs the site its `bf-cache` eligibility and its Best Practices score (§10.1).

Fix: delete the file and the plugin from the production path entirely; keep it, if needed, in a dev-only directory outside `public/`.

### 8.5 — Client-side rate limiting is not a control *(Low)*

The contact form's rate limit (30-second cooldown, 5 per hour) is stored in `localStorage`. Clearing site data or using a private window bypasses it completely. This is fine as a UX guard against double-submits — it should simply not be relied on as spam protection. Formspree's own server-side protections and the honeypot are the real defences; consider adding a lightweight CAPTCHA if abuse appears.

---

## 9. Accessibility, usability and correctness

### 9.1 — The contact form accepts empty submissions *(Medium)*

`Contact.tsx` renders `<form onSubmit={onSubmit} className="grid gap-4" noValidate>`. The `noValidate` attribute disables native browser validation, and `onSubmit` checks only the consent checkbox and the rate limit — it never validates that name, email, organisation, service or message are non-empty, despite each input carrying `required`.

A user who checks the consent box and clicks "Send message" submits a completely blank enquiry to Formspree, and is shown the success card. There is also no field-level error messaging and no `aria-describedby` linking inputs to errors, so a user who does make a mistake gets no guidance — a WCAG 3.3.1 (Error Identification) and 3.3.3 (Error Suggestion) gap.

Fix: either remove `noValidate` and let the browser validate, or add explicit validation with per-field error text wired via `aria-describedby` and `aria-invalid`.

### 9.2 — No scroll restoration on navigation *(Low)*

There is no `window.scrollTo(0, 0)` on route change anywhere in the app (the only scroll call is `About.tsx`'s anchor handling). Clicking an article from the bottom of the Insights grid lands the reader partway down the article. Add a scroll reset in `SiteShell` on pathname change, respecting `prefers-reduced-motion`.

Related: `AnnouncerHost` is mounted in `SiteShell` but nothing announces route changes, so SPA navigation is silent for screen-reader users. Announcing the new page title on navigation is a small addition with real benefit.

### 9.3 — Contrast issues in the token utility classes and dark theme *(Low)*

Lighthouse reports accessibility 100, and the colours actually used in the layout pass comfortably (brand red on paper 5.88:1, white on brand red 6.14:1, slate on paper 7.20:1, ink on paper 17.71:1). However:

| Pair | Ratio | Status |
|---|---|---|
| `.tag-brand-blue` — `#FAFAF8` on `#279ED6` | **2.89:1** | Fails AA for normal text |
| `.tag-brand-green` / `.tag-brand-yellow` as *text colour* on paper | 1.95:1 / 1.97:1 | Fail if ever used for text |
| Dark theme: `--brand-red` on `--brand-paper` (`#0F1419`) | **3.01:1** | Fails AA |

`.tag-brand-blue` is currently unused, so this is latent rather than live — but it sits in `tokens.css` as a ready-made accessibility failure for the next developer. Since `tokens.css` is a verbatim brand-book copy that must not be edited, the correct fix is to define corrected variants in `index.css` (darken the blue or use ink text on the blue chip) and document that the raw `.tag-brand-*` classes are not AA-safe.

The dark-theme red is the more important of the two if dark mode is ever shipped — see 9.4.

### 9.4 — Dark mode is half-built *(Low)*

`ThemeContext` supports light and dark and applies a `.dark` class; `tokens.css` defines a dark palette. But there is no theme toggle anywhere in the UI, no `prefers-color-scheme` detection, and the default is hardcoded to light — so the dark palette is unreachable. Meanwhile a dozen components hardcode `backgroundColor: "#fff"` (Insight cards, article aside, contact inputs, the TH bilingual notice), which would break the moment dark mode was enabled, and the dark red fails contrast per 9.3.

Decide: either finish it (toggle + `prefers-color-scheme` + replace hardcoded whites with `var(--brand-paper)` + fix the dark red) or remove the dead theme code.

### 9.5 — Smaller usability observations *(Low)*

- The phone number on the Contact page is plain text, not a `tel:` link — a friction point on mobile.
- The footer carries no contact link, no email, no link to the Faculty or University, and no social channels. For an institutional site these are basic trust signals.
- The English hero CTA reads **"Book a training"** but links to `/services`, the full nine-service hub. The Thai equivalent (`อบรมกับเรา`) does the same. A booking CTA that lands on a catalogue is a small credibility cost; point it at `/services/training` or `/contact`.
- `footer.legacy` is a non-interactive `<span>` inside a `<nav>` element — it should sit outside the navigation landmark.
- The "Team" nav item points to `/about#team` and never shows an active state.
- Dates are parsed with `new Date("2024-07-06")`, which JavaScript interprets as UTC midnight and then formats in local time — visitors west of UTC see every date one day early.

---

## 10. Performance and technical quality

### 10.1 — Production scores are below the project's own mandate *(Medium)*

Non-negotiable #8 requires **Lighthouse ≥ 90 on Performance, Accessibility, Best Practices and SEO on every page**. The most recent stored run (`.lighthouse/*-prod.json`, dated 2026-05-04):

| Run | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/th` mobile | **0.83** | 1.00 | **0.81** | 1.00 |
| `/en` mobile | **0.83** | 1.00 | **0.81** | 1.00 |
| `/en` desktop | 0.99 | 1.00 | **0.81** | 1.00 |

Two structural caveats about this evidence. First, the files named `*-prod.json` were captured against `http://localhost:4173` — a local preview build, not the deployed site — so the project has no Lighthouse measurement of production as users experience it. Second, only `/th` and `/en` were measured; the mandate says *every page*, and the article and service detail pages (the heaviest routes) are unmeasured.

The failing audits are consistent and diagnosable:

- **Best Practices 0.81** is caused by a single item: `"Unload event listeners are deprecated"`. The source is the `beforeunload` handler in the Manus debug collector (§8.4). The same handler also fails `bf-cache` ("The page has an unload handler in the main frame"), costing instant back/forward navigation. **Deleting one file fixes both.**
- **`unused-javascript`: 143 KiB** — consistent with §12.1 (51 unused UI components and unused runtime dependencies).
- **`cache-insight`: 329–405 KiB** of re-fetchable bytes — the Cloudinary images are served without long-lived cache headers, and only `/assets/` and `/fonts/` carry immutable caching in `vercel.json`.
- **FCP 3.4 s / LCP 3.5 s on mobile**, with `render-blocking-insight` estimating 1,200 ms of savings — the expected cost of a client-only SPA with no prerendering (§4.5).

Fix order: delete the debug collector (recovers ~9 Best Practices points and bf-cache immediately); prune unused dependencies; add Cloudinary cache headers; then re-run Lighthouse against the real production URL across the full eight-route set the project's own `todo.md` already specifies.

### 10.2 — Dead code and dependency bloat *(Low)*

- **51 of 53** shadcn/ui components under `client/src/components/ui/` are never imported outside that directory. Only two are used.
- `express` and `axios` are production dependencies, and `server/index.ts` exists — but Vercel's `buildCommand` is `pnpm exec vite build` with `outputDirectory: dist/public`, so the Express server is never built or deployed. It is dead weight that implies a backend that does not exist.
- `recharts`, `embla-carousel-react`, `framer-motion`, `cmdk`, `vaul`, `input-otp`, `react-day-picker`, `streamdown`, `zod`, `react-hook-form` and ~30 Radix packages back components nothing renders.
- `components/Map.tsx` and `@types/google.maps` are unused. If a map embed is added later, it must be gated behind analytics consent — a Google Maps iframe sets third-party cookies before any consent decision, which would break the PDPA posture the rest of the site maintains carefully.
- `pnpm` is listed as its own devDependency; `packageManager` pins `pnpm@10.4.1` while the devDependency requests `^10.15.1`.
- `client/public/redirects.json` and `client/public/_redirects` are generated files, committed, publicly served, and read by nothing (§4.2).

Each is individually trivial. Together they are the difference between a codebase a new maintainer can read in an afternoon and one they cannot.

---

## 11. Bilingual parity and editorial governance

### 11.1 — Bilingual parity is structurally unreachable for insights *(Medium)*

Non-negotiable #4 states: *"Bilingual TH/EN — every page exists in both. Default `th`. Never auto-translate."* The chrome, navigation, homepage, services, About page and privacy notice honour this properly. The insights section does not, and cannot as currently modelled:

- The post schema (`content/posts/*.yml`, and the CMS `insights` collection) has `title`, `summary` and `ogDescription` — **English only**. A `titleTh` field is defined in the CMS but used by zero posts, and there is **no `summaryTh` and no Thai body field at all**.
- **21 of 24** article bodies are English-only. The remaining 3 contain Thai and English concatenated in one blob, so both languages render simultaneously on both the `/th` and `/en` versions of those pages.
- The `/th` article view honestly discloses this with a notice — *"บทความนี้ยังเป็นฉบับภาษาอังกฤษ ฉบับแปลภาษาไทยอยู่ระหว่างจัดทำ"* — which is the right thing to do, but it appears on 24 of 24 Thai article pages. On the default language of the site.
- SDG chip labels are English-only in both locales.
- Academic citations render `citationEn` regardless of locale (defensible — citations are conventionally not translated — but the unused `citationTh` field suggests the decision was never made explicitly).

The net effect: a Thai-default site where the entire news and case-study archive is in English. Fix in two steps: add `summaryTh` and a `post-bodies-th/` collection to the schema so parity is *possible*; then prioritise translation of the ten strongest case studies rather than all 24.

### 11.2 — Sentence-case rule inconsistently applied *(Low)*

Non-negotiable #6 mandates sentence case for headings. Seven of 24 post titles are in Title Case, all inherited from Wix: *"Associate Professor Dr. Smith Boonchutima Delivers Leadership Training at Krungthai Bank"*, *"Chula Communication Arts Strengthens Academic Collaboration with Keio University and Bunkyo University"*, *"Creative Tourism Development Project in Nan Province"*, and four others. Where a title has been rewritten (e.g. *"Comm.Inno head invited to lead executive crisis communication training"*) the rule is followed correctly — the migration simply stopped partway.

### 11.3 — Governance and CI gaps *(Medium)*

The editorial workflow itself is well designed: Sveltia CMS opens a PR per save, a reviewer merges, Vercel deploys. `EDITORIAL.md` is a genuinely good bilingual handbook. The gap is that **nothing validates content**.

`.github/workflows/check.yml` runs `tsc --noEmit`, `vite build`, and asserts that `dist/public/index.html` exists. That is a reasonable code gate and a non-existent content gate. Every content finding in §4 and §6 of this report — broken `relatedSlugs`, redirect destinations pointing at missing slugs, missing dates, missing cover images, truncated summaries, unresolved `[TOKEN]` placeholders, `pending: true` flags reaching production — is mechanically detectable and none of it is detected.

Recommended CI additions, in rough order of value per line of code:

1. **Referential integrity** — every `relatedSlugs` entry, every redirect destination, and every post `tag` must resolve to an existing entity. *(Would have caught 4.4 and the training-service dead link.)*
2. **Placeholder scan** — fail the build if `[DATE]`, `[dpo@`, `____`, `PLACEHOLDER` or `thaiSpellingPending: true` appear in shipped content. *(Would have caught 5.1 and 6.3.)*
3. **Truncation heuristic** — warn when a `summary` or `ogDescription` is exactly 200 characters, ends mid-word, or ends in `Dr.`. *(Would have caught 6.1.)*
4. **Completeness** — warn on posts missing `date`, `coverImage` or `coverAltEn`/`coverAltTh`. *(Would have caught 6.2.)*
5. **Domain guard** — fail if `manus.space` appears in any shipped artefact. *(Would have caught 3.1 and 7.1 — the highest-impact findings in this report — with a single grep.)*
6. **Lighthouse CI** on the eight routes the project's own `todo.md` already enumerates, with the ≥ 90 threshold enforced.
7. **Link check** on outbound URLs in content (DOIs, partner sites, `anyflip.com`, `nia100faces.com`, `thesharpener.school`).

---

## 12. Prioritised remediation roadmap

### Remediation status

Sprints 1 and 2 were applied on 2026-09-03 in the same branch as this report.
Verified by `tsc --noEmit`, a clean `vite build`, the two new guard scripts, and
a scan of the actual build output. Not verified against a live URL: Vercel
preview deployments on this project sit behind deployment protection, which is
why `check-routes.mjs` exists.

| Finding | Status |
|---|---|
| 3.1 · 7.1 · 3.3 — origin hardcoding | **Fixed.** All hosts now derive from `SITE_ORIGIN` (`client/src/config/site.ts` / `scripts/site-origin.mjs`). Canonical, hreflang, JSON-LD, `robots.txt`, all 78 sitemap entries, the CMS config, the Plausible domain and `usePageMeta` updated. `usePageMeta` no longer derives the canonical from `window.location.origin`, so preview deployments stop self-canonicalising. |
| 5.2 — wrong processors disclosed | **Fixed.** Privacy §4 and §9 now disclose Formspree and Cloudinary (TH and EN) and no longer name Resend or Cloudflare. |
| 8.4 · 10.1 — shipped session logger | **Fixed.** `client/public/__manus__/` and its Vite plugin deleted; confirmed absent from the build and no `unload` handler remains in shipped output. |
| 8.1 — unpinned CMS script | **Fixed.** Pinned to `@sveltia/cms@0.42.2` with a verified SHA-384 SRI hash and `crossorigin`. |
| 4.4 — broken slug references | **Fixed.** Both redirect destinations and the training service's `relatedSlugs` now resolve; redirect lookup also tolerates percent-encoded non-ASCII slugs. |
| 4.3 — uncovered legacy paths | **Fixed** at the client-redirect layer: `/about`, `/contact`, `/insights` added to the redirect map. Still soft redirects until 4.2 moves them into `vercel.json`. |
| 6.3 — pending badges | **Partly fixed.** The badges no longer render publicly. The six Thai spellings still need verification by the center; the flags stay in `content/about.yml` as the editorial to-do and `check-content.mjs` reports them. |
| 11.3 — no content validation in CI | **Fixed.** `scripts/check-content.mjs` runs in CI after the build. Hard-fails on a staging host in shipped output or a slug reference that resolves to nothing; warns on the open content items. Negative-tested. |
| 4.2 · 4.1 — soft redirects, no real 404 | **Fixed.** `scripts/build-vercel-routes.mjs` writes the redirect and rewrite tables into `vercel.json`: 72 real 308s at the edge, replacing files Vercel never read. The blanket `/(.*)` rewrite is gone — rewrites now match only the route shapes the app serves, so unknown shapes get a genuine 404 with a branded `client/public/404.html`. An unknown *slug* under a valid shape still reaches the SPA (deliberate: enumerating slugs would 404 any CMS-added post), and the NotFound view now carries `noindex`. |
| 6.1 — truncated content | **Fixed.** All 15 summaries and OG descriptions rewritten by hand from the original Wix article text preserved in `content/data/all_pages.json` — nothing invented. The "Associate Professor Dr." cut-offs, the run-together sentences and the leaked video filenames are gone. |
| 6.2 — undated posts | **Partly fixed.** Two of three dated from their own sources: Keio 2026-03-15 (the Wix publication date) and Sri Trang 2022-07-20 (the course date in its own text). The third has no date evidence anywhere and stays flagged. |
| 6.4 — misspelled slug | **Fixed.** Renamed to `...boonchutima...`, with a redirect from the old spelling so shared links survive. |
| 6.5 — name romanisation | **Fixed.** The Thai source reads the surname as กิจรุ่งไพศาล, which romanises as Kijrungpaisarn and matches the About-page citation — so "Kitrungpaisan" was the outlier, not the citation. Normalised. |
| 4.5 — broken social cards | **Fixed.** A real 1200x630 PNG (`client/public/og-image.png`, rendered from `scripts/og/og-image.template.html`) replaces the relative-path SVG. `usePageMeta` now emits absolute `og:image`/`twitter:image`, and article pages declare `og:type: article` and use their own cover. |
| 4.6 — raw category slugs | **Fixed.** Insight cards render the localized category title. |
| 9.1 — blank form submissions | **Fixed.** `noValidate` removed and `onSubmit` re-checks every required field plus email shape, with bilingual error copy. |
| Routing had no test | **Fixed.** `scripts/check-routes.mjs` compiles `vercel.json` with the same matcher Vercel uses and asserts every canonical URL, every legacy URL, and that junk paths still 404. It caught a real self-redirect loop (`/th/about` to itself) in the first generated table. |
| 5.5 — wrong center phone (new) | **Fixed.** The contact page and the `Organization` JSON-LD published +66 2 218 2215. The center confirmed on 2026-09-03 that its number is **+66 2 218 2163** — the Department of Public Relations line, where department staff answer and pass enquiries to the Center. Because a caller reaches a department office rather than the Center, the number is never printed bare: `/contact` and privacy §12 both name who answers, and the privacy notice adds that email is the faster route for a data request. Also fixed audit 9.5 in passing — the number is now a `tel:` link, and renders `0 2218 2163` on Thai routes and `+66 2 218 2163` on English ones. Guarded against regression. |
| 5.4 — wrong center email sitewide (new) | **Fixed.** The general address was published as `comminno@chula.ac.th` (no dot) in 12 places across three files — the contact page, both form success states, both error states, the cookie banner in both languages, and the `Organization` JSON-LD. The center confirmed on 2026-09-03 that the real mailbox is `comm.inno@chula.ac.th` **with** a dot, so every one of those was a silent failure: the sender gets a bounce and the center never learns anyone tried to make contact. Now read from one constant (`client/src/config/contact.ts`), with a `check-content.mjs` guard that fails the build if the no-dot form reappears in shipped output — negative-tested. Found by the parallel redesign session, not by this audit. |
| 5.1 — privacy placeholders | **Fixed.** The center supplied all four on 2026-09-03: DPO `comm.inno@chula.ac.th`, phone `+66 2 218 2163`, effective 2026-09-01, last updated 2026-09-03. The "Pending PDPA review" banner is gone, and `check-content.mjs` now treats a reintroduced bracket token in the notice as a hard error, negative-tested. |
| 5.3 — §7 security claims | **Softened, pending confirmation.** The center is checking with Chulalongkorn IT. Until then §7 states only what is verifiable — TLS 1.3 in transit, need-to-know access, processors' own controls, PDPA breach notification — and says plainly that encryption at rest and a periodic University IT review are being confirmed. Restore the fuller wording once IT confirms; do not add an unverified security claim back. |
| 6.3 — pending badges | **Half closed.** Three of six names resolved: วันวิสา เวชประสิทธิ์ / Wanwisa Wechprasith and Chanapa Itdhiamornkulchai corrected, Pornpavee Thiuthipsakul confirmed correct. Supatra, Hrut and Thavin remain unverified and keep the flag. |
| 6.7 — role titles | **Half closed.** รองคณบดี is **Deputy Dean** per the center — applied. Teerada's two conflicting center roles are still unresolved. |
| 3.3 — domain | **Deferred, deliberately.** `SITE_ORIGIN` stays on the live Vercel host. The center's intended permanent home is a `chula.ac.th` subdomain, to be decided later; it is one environment variable when that happens. |
| 3.2 — staging indexable | **Blocked.** `noindex` on `comminno-go6lmsuy.manus.space` is Manus hosting configuration, outside this repository. |
| 12.2 — repo description | **Blocked.** GitHub metadata, not a file — must be edited in repository settings. |

One assumption to confirm: `SITE_ORIGIN` defaults to `https://comminno-web.vercel.app`,
the currently live production host. At the `cominnocenter.com` cutover this becomes a
single environment-variable change (`VITE_SITE_ORIGIN` for the app, `SITE_ORIGIN` for
the scripts) — no code edit.



### Sprint 1 — Stop the bleeding (½–1 day, highest return in the report) — *applied, see status above*

| Task | Fixes |
|---|---|
| Introduce a single `SITE_ORIGIN` env constant; thread through `index.html`, `sitemap`, `robots.txt`, CMS config and Plausible | 3.1, 7.1, 3.3 |
| Fill the four privacy-notice tokens; delete the "pending review" banner | 5.1 |
| Rewrite privacy Sections 4 and 9 to name Formspree and Cloudinary; remove Resend and Cloudflare | 5.2 |
| Delete `client/public/__manus__/` and the injecting plugin | 8.4, 10.1 |
| Pin `@sveltia/cms` to an exact version + SRI, or vendor it | 8.1 |
| Clear the six `thaiSpellingPending` flags after verification | 6.3 |
| Fix the two broken redirect destinations and the training service's dead `relatedSlugs` | 4.4 |
| Add `noindex` to staging | 3.2 |

### Sprint 2 — Migration integrity (2–3 days) — *applied, see status above*

| Task | Fixes |
|---|---|
| Move redirects into `vercel.json`; delete the two public artefacts; correct the CMS comment | 4.2 |
| Add `/about`, `/contact`, `/insights` redirects and a locale-prefix fallback in `RedirectHandler` | 4.3 |
| Return a real 404 for unmatched paths; add `noindex` to the NotFound view | 4.1 |
| Rewrite the 15 truncated summaries and 15 OG descriptions by hand | 6.1 |
| Date the three undated posts; fix the sort to surface undated items for review | 6.2 |
| Rename the `boonchotima` slug, add a redirect from the old one | 6.4 |
| Add a 1200×630 PNG OG image; set absolute `og:image`/`twitter:image` per page; `og:type: article` on posts | 4.5 |
| Fix the contact-form validation gap | 9.1 |
| Use `categoriesBySlug` for the insight-card tag chip | 4.6 |

### Sprint 3 — Substance and trust (1–2 weeks)

| Task | Fixes |
|---|---|
| Source or commission cover images for the 15 posts that lack them, with bilingual alt text | 6.1 |
| Add `summaryTh` and Thai body support to the schema; translate the 10 strongest case studies | 11.1 |
| Publish the 2025–2026 activity backlog so the news feed is current | 6.2 |
| Render article bodies through a real Markdown renderer | 4.7 |
| Name sweep and glossary; normalise Kitrungpaisan/Kijrungpaisarn and all role titles | 6.5, 6.7 |
| Add SDG rationale per service; allow multiple goals; translate SDG labels | 6.8 |
| Add the seven CI content checks | 11.3 |
| Add a CSP header | 8.3 |

### Sprint 4 — Consolidation and polish

| Task | Fixes |
|---|---|
| Cut `cominnocenter.com` DNS to production; retire the Wix property | 3.2 |
| Add build-time prerendering for the ~78 known routes | 4.5, 10.1 |
| Prune the 51 unused UI components, Express, axios and unused runtime deps | 10.2 |
| Finish or remove dark mode; fix `.tag-brand-blue` contrast | 9.3, 9.4 |
| Scroll restoration, route announcements, `tel:` link, footer trust links, hero CTA target | 9.2, 9.5 |
| Re-run Lighthouse against production across all eight routes; enforce ≥ 90 in CI | 10.1 |

---

## 13. Closing assessment

The Comm.Inno site is closer to excellent than this report's length suggests. The brand system is disciplined, the consent implementation is better than most commercial sites, the accessibility baseline is genuinely 100, the CMS and editorial handbook are thoughtfully built for a non-technical Thai-language team, and the information architecture is sound. Someone cared about this.

What went wrong is a specific and recognisable failure mode: a project that reached "feature complete" on a staging host and was then deployed to production without a launch checklist. Every one of the four Critical findings is a value that was correct for staging and was never changed — the canonical host, the analytics domain, the placeholder tokens awaiting legal sign-off, the processor list written before the vendors were chosen. The last commit is dated 2026-05-07; the site has been live and drifting for four months.

The corollary is encouraging. The Sprint 1 list — half a day of work, mostly find-and-replace — resolves every Critical finding and three of the High ones. The single highest-leverage change in this entire audit is one string constant, and the single highest-leverage process change is one grep in CI that fails the build if `manus.space` appears in shipped output.

The content work in Sprint 3 is where the real investment lies, and it is not an engineering problem. Fifteen missing cover images, fifteen hand-written summaries, ten translated case studies and a current news feed are what will actually determine whether a visiting researcher, a prospective client or a partner university comes away thinking this is an active center of excellence. The infrastructure is ready for that content. It is waiting for it.

---

*Audit conducted against repository `smithboon-thailand/comminno-web` at commit `0e67e59`, with live verification of all three deployed properties on 2 September 2026. All findings cite the specific file, line or HTTP response that evidences them; every cross-reference and contrast figure in this report was computed programmatically rather than estimated.*
