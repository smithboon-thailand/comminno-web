# Comm.Inno content schema

> Single source of truth for **how the website's content is structured** and **what each field means**.
> Editors: open `/admin` (Sveltia CMS) — every field below appears with its bilingual description.
> Developers: this file is consumed by `scripts/build-content.mjs` (commit #6) and by the CMS schema in `client/public/admin/config.yml` (commit #7).

---

## File layout

```
content/
├── posts.yml                    # 24 insight / news entries (metadata only)
├── post-bodies/
│   └── <slug>.md                # one file per post — long-form body
├── services.yml                 # 9 service catalogue entries
├── about.yml                    # mission, pillars, leadership, partners
├── categories.yml               # 12 post taxonomy entries
├── redirects.yml                # 39 legacy Wix → new path redirects
└── SCHEMA.md                    # this file
```

The build pipeline reads these YAML files and emits `client/src/content/*.ts`. Editors **never** touch the generated TS modules.

---

## Bilingual policy (TH-first)

The site's primary audience is Thai. Field requirements follow this rule:

| Collection | TH fields | EN fields |
| --- | --- | --- |
| `posts.yml` | required (`title`, `summary`, `coverAltTh`) | optional (used as a fallback when present) |
| `services.yml` | required (`titleTh`, `subtitleTh`, `descriptionTh`, `deliverablesTh`, `ctaTh`, `heroAltTh`) | required (English UI sections still need parity) |
| `about.yml` | required (every `nameTh`, `centerRoleTh`, `bioTh`, `synergyTh` …) | required (mirror) |

When a translation is genuinely unavailable, set the field to `null` (`~` in YAML) — never leave a stale English string in a Thai slot.

---

## Image fields

All image references point at **Cloudinary** (commit #4). Either store the full URL **or** the bare public_id — the build script accepts both:

```yaml
# both of these resolve to the same image at render time
coverImage: https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/insights/treasury
coverImage: comminno/insights/treasury
```

As of commit **#5b**, image fields are **single canonical URLs**:

| Collection | Field | Replaces |
| --- | --- | --- |
| `posts.yml` | `coverImage` | legacy `coverWebp` + `coverJpg` |
| `services.yml` | `heroImage` | legacy `heroImage` + `heroImageFallback` |

Cloudinary's `f_auto,q_auto` transform negotiates webp / jpg / avif per client at request time, so a separate fallback URL is no longer needed. As of commit **#6.5** the transitional `@deprecated` aliases (`coverWebp` / `coverJpg` / `heroImageFallback`) have been removed from `client/src/content/types.ts` and from all component readers — the schema is now strictly single-field.

---

## `posts.yml` — Insights / news posts

```yaml
- slug: chula-zero-waste              # required, kebab-case, also used as URL & body filename
  title: Chula Zero Waste              # required (EN, used in cards + nav)
  titleTh: เครือข่ายจุฬาฯ ลดขยะ        # optional — falls back to title when missing
  summary: One-sentence teaser…        # required (TH-first audience: shown on cards)
  date: "2024-03-15"                   # ISO date YYYY-MM-DD or null
  tags: [campaign, sustainability]     # array of category slugs (see categories.yml)
  coverFilename: null                  # legacy Wix filename — leave null for new posts
  coverImage: comminno/insights/<slug> # Cloudinary public_id (single field, #5b)
  coverAltEn: Conference room…         # short alt text (no "Photo of" prefix)
  coverAltTh: ห้องประชุม…              # required for accessibility
  ogDescription: |                     # 2–3 sentences for OG/Twitter cards
    Long-form description…
```

The body lives at `content/post-bodies/<slug>.md` as plain markdown. Editors use Sveltia's full-screen markdown widget; the diff is one file per post.

---

## `services.yml` — Service catalogue

```yaml
- slug: book-and-printing
  titleEn: Books and printed media
  titleTh: หนังสือและสื่อสิ่งพิมพ์
  subtitleEn: Research-grade publications, designed to be read.
  subtitleTh: งานวิจัยที่ออกแบบให้คนอยากอ่าน
  sdgNumber: 4                       # primary UN SDG goal (1–17), drives the chip colour
  descriptionEn: |                   # multi-paragraph; rendered as <p> blocks split on \n\n
    Long-form copy…
  descriptionTh: |
    เนื้อหาภาษาไทย…
  deliverablesEn:                    # bullet list of concrete outputs
    - Published research book
    - ISBN registration
  deliverablesTh:
    - หนังสือผลงานวิจัย
    - ขึ้นทะเบียน ISBN
  audienceEn: null                   # currently null — brief framed services through deliverables
  audienceTh: null
  ctaEn: Talk to us about your book
  ctaTh: พูดคุยเรื่องหนังสือของคุณ
  relatedSlugs: [chula-zero-waste]   # post slugs to surface as case studies on detail page
  heroImage: comminno/services/book-and-printing  # single Cloudinary URL (#5b)
  heroAltEn: Stack of academic books on a desk
  heroAltTh: หนังสือวิชาการวางซ้อนบนโต๊ะ
```

> **Schema history:** as of commit **#5a** `subtitle*`, `relatedSlugs`, `cta*`, and `hero*` live on the base `Service` interface in `client/src/content/types.ts`. As of commit **#5b** the paired `heroImage` + `heroImageFallback` and `coverWebp` + `coverJpg` fields collapse into single canonical `heroImage` / `coverImage` URLs. As of commit **#6.5** the legacy aliases are removed entirely.

---

## `about.yml` — About page

```yaml
missionEn: …                         # required
missionTh: …                         # required (TH-first)
pillarsEn:                           # required, ordered list (3–4 items)
  - Research
  - Training
pillarsTh:
  - งานวิจัย
  - การฝึกอบรม

leadership:                          # Tier 1 — full bilingual cards w/ bios + publications
  - slug: smith
    nameTh: รศ. ดร. สมิทธิ์ บุญชุติมา       # required, includes academic title prefix
    nameEn: Assoc. Prof. Smith Boonchutima, Ph.D.
    centerRoleTh: หัวหน้าศูนย์
    centerRoleEn: Center Head
    photo: comminno/team/smith       # webp preferred (Cloudinary auto-selects)
    photoFallback: comminno/team/smith
    photoAlt: …                      # required for accessibility
    facultyRoleTh: …                 # optional
    facultyRoleEn: …
    internationalRoleTh: …           # optional, Tier 1 typically uses this
    internationalRoleEn: …
    email: smith.b@chula.ac.th       # optional
    bioTh: |                         # required, multi-paragraph
      Long-form Thai bio…
    bioEn: |                         # required
      Long-form English bio…
    expertiseTh: "การประชาสัมพันธ์, สื่อ"  # comma-separated string, locale-formatted
    expertiseEn: "Public relations, media"
    publications:                    # Tier 1 should carry 5+ entries
      - citationEn: …                # APA-ish, already TH/EN aware
        citationTh: …                # optional
        year: 2024                   # required, used for sort + badge
        venue: …                     # required (journal / publisher)
        doi: https://doi.org/…       # optional but preferred
        url: …                       # optional alternative when no DOI
    links:                           # external profile URLs (rendered as icon buttons)
      orcid: https://orcid.org/…
      scholar: …
      researchgate: …
      scopus: …
      orcidPending: false            # explicit "coming soon" pill — true to render placeholder

faculty2: […]                        # Tier 2 — same shape as leadership
researchTeam: […]                    # Tier 3 — lightweight grid card (no bio/pubs)
partners:                            # institutional partners
  - slug: chula-arts
    organizationTh: คณะนิเทศศาสตร์ จุฬาฯ
    organizationEn: Faculty of Communication Arts, Chulalongkorn University
    contactNameTh: …                 # bridge contact (a person)
    contactNameEn: …
    contactRoleTh: …
    contactRoleEn: …
    contactPhoto: …                  # square portrait (webp)
    contactPhotoFallback: …
    contactPhotoAlt: …
    synergyTh: |                     # short bilingual paragraph — what links us
      เนื้อหาภาษาไทย…
    synergyEn: |
      English content…
    websiteUrl: https://…            # optional

faculty: […]                         # legacy JSON-LD members — keep until SEO refactor
widerTeam: […]                       # legacy plain-text list — keep until UI refactor
```

---

## `categories.yml` — Post taxonomy

Mirrors the original Wix slugs. The `isService` flag distinguishes service categories from editorial ones at render time.

```yaml
- slug: training
  titleEn: Training
  titleTh: การฝึกอบรม
  isService: true
```

---

## `redirects.yml` — Legacy redirects

Old Wix paths → new paths. Consumed by `vercel.json` (Phase 1.5) and Next.js middleware (future).

```yaml
- from: /post/chula-zero-waste
  to:   /insights/chula-zero-waste
```

---

## How the build pipeline uses these files

`scripts/build-content.mjs` (rewired in commit #6) does, in this order:

1. Reads every `*.yml` and `post-bodies/*.md` under `content/`.
2. Validates against the TS interfaces in `client/src/content/types.ts`.
3. Emits the AUTO-GENERATED modules under `client/src/content/`.

The generated TS modules are committed to git so Vercel can build the site from a clean checkout without running the script. The CI hook (`pnpm content` in `package.json#scripts.build`) regenerates them on every build to guarantee the YAML and TS are never out of sync.

If you find yourself editing `client/src/content/*.ts` by hand, **stop** — your edit will be overwritten on the next deploy. Edit the corresponding YAML or body markdown instead.
