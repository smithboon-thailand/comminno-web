# Porting checklist — 34 audit findings against cominnocenter-website

Source: `docs/AUDIT-2026-09-comminno-web.md` in `smithboon-thailand/comminno-web`.
Rendered: https://claude.ai/code/artifact/f2031366-9c83-45b6-8aaf-824e7b1a24f2

These findings were written against `comminno-web`, which is being retired. Most
of them are about **the centre's web presence**, not about that codebase, so they
transfer directly. The "Applies?" column is my read on which ones to check
against the live site; verify rather than trust it, since I cannot see that
repository.

Status legend: `[ ]` not checked · `[~]` checked, needs work · `[x]` confirmed
fine or fixed.

| ✓ | # | Finding | Severity | Transfers? |
|---|---|---|---|---|
| [ ] | 3.1 | Production canonicals, hreflang, JSON-LD and sitemap all point to the staging domain | **Critical** | **yes** |
| [ ] | 3.2 | Three copies of the site live and crawlable at once (legacy, staging, production) | **Critical** | **yes** |
| [ ] | 5.1 | Privacy notice published with placeholder tokens and "pending review" banner | **Critical** | **yes** |
| [ ] | 5.2 | Privacy notice names processors the site does not use; omits the ones it does | **Critical** | **yes** |
| [ ] | 4.1 | Every URL returns HTTP 200 — no real 404, no real 301 anywhere | **High** | **yes** |
| [ ] | 4.2 | 39 legacy Wix redirects are client-side only and never reach Vercel | **High** | **yes** |
| [ ] | 4.3 | Legacy `/about`, `/contact`, `/insights` have no redirect and dead-end | **High** | **yes** |
| [ ] | 4.4 | Two redirect destinations point to slugs that do not exist | **High** | codebase-specific |
| [ ] | 4.5 | Zero server-rendered content; all ~78 URLs share one title and OG card | **High** | **yes** |
| [ ] | 6.1 | 26 truncated summaries/descriptions, three cut at "Associate Professor Dr." | **High** | **yes** |
| [ ] | 6.2 | Newest story (Keio, March 2026) undated and therefore invisible | **High** | **yes** |
| [ ] | 6.3 | "Thai spelling pending verification" badges shown publicly beside real names | **High** | **yes** |
| [ ] | 7.1 | Analytics reports to the staging domain — production traffic data is lost | **High** | **yes** |
| [ ] | 8.1 | Admin CMS loads an unpinned third-party script with no SRI | **High** | **yes** |
| [ ] | 5.4 | Center email published as `comminno@` (no dot) in 12 places — enquiries bounce silently | **High** | **yes** |
| [ ] | 9.1 | Contact form accepts empty submissions (`noValidate` with no JS validation) | **Medium** | **yes** |
| [ ] | 6.4 | Misspelled name in a public URL, contradicting the project's own rule | **Medium** | **yes** |
| [ ] | 6.5 | Same academic's surname romanised two different ways on the site | **Medium** | **yes** |
| [ ] | 3.3 | Four different domain identities used across the project | **Medium** | **yes** |
| [ ] | 4.6 | Insight cards display raw category slugs (`book-and-printing`) | **Medium** | codebase-specific |
| [ ] | 4.7 | Article bodies rendered as plain text; Markdown and links do not render | **Medium** | codebase-specific |
| [ ] | 10.1 | Production Lighthouse below the mandated 90 (perf 83, best-practices 81) | **Medium** | **yes** |
| [ ] | 8.2 | Unsigned Cloudinary upload preset published in a public repository | **Medium** | **yes** |
| [x] | 8.3 | No Content-Security-Policy header | **Medium** | **yes** — already done on the live site |
| [ ] | 8.4 | Session/network-logging debug collector shipped in the production bundle | **Medium** | codebase-specific |
| [ ] | 11.1 | Post schema has no Thai summary or body field — bilingual parity unreachable | **Medium** | **yes** |
| [ ] | 5.5 | Center phone published as +66 2 218 2215; the real line is +66 2 218 2163 | **Medium** | **yes** |
| [ ] | 5.3 | Privacy §7 states security commitments nobody has verified | **Medium** | **yes** |
| [ ] | 9.2 | No scroll-to-top on navigation | **Low** | codebase-specific |
| [ ] | 9.3 | `.tag-brand-blue` utility fails WCAG AA at 2.89:1 | **Low** | **yes** |
| [ ] | 9.4 | Dark mode half-built: no toggle, no auto-detect, hardcoded white surfaces | **Low** | codebase-specific |
| [ ] | 6.6 | "This section is coming in the next sprint" — internal jargon in user-facing copy | **Low** | codebase-specific |
| [ ] | 12.1 | 51 of 53 UI components and both server/Express dependencies are dead code | **Low** | codebase-specific |
| [ ] | 12.2 | GitHub repository description misstates the stack as Next.js + next-intl | **Low** | **yes** |

## The four to check first

These are the ones that cost the centre something every day they stand, and all
four are about the public presence rather than any one repository.

1. **3.1 — canonical identity.** On the live site, check that `<link rel="canonical">`,
   all three `hreflang` alternates, the `Organization` JSON-LD `url` and `logo`,
   the `Sitemap:` line in `robots.txt`, every `<loc>` in the sitemap, and the
   analytics `data-domain` all name the real domain. On `comminno-web` all seven
   named a preview host, which told search engines a temporary URL held the
   authoritative copy of every page.
2. **5.1 — the PDPA notice.** Confirm no bracketed placeholder survives, and that
   the effective and last-updated dates are real. A notice with a blank in it is
   worse than none: it invites a request nobody can receive.
3. **5.2 — processor disclosure.** The notice must name the services that
   actually receive personal data, and must not name ones that do not. Check the
   form handler and the image CDN in particular — both receive data and both
   were missing.
4. **4.1 / 4.5 — status codes and social cards.** Does a nonsense URL return a
   real 404, or 200 with a client-rendered error page? Does `og:image` resolve to
   an absolute URL of a raster image? An SVG or a relative path yields an
   imageless card on every platform, and LINE runs no JavaScript at all.

## Notes carried over

- **5.4 / 5.5 (contact details)** are fixed in both repositories now. Worth one
  check on the live site anyway: these were wrong in ten to twelve places and
  the email failed *silently* — the sender got a bounce and the centre never
  learned anyone had tried.
- **6.3** — three Thai spellings are still unverified: Supatra Petchree, Hrut
  Sitthipuwabun, Thavin Chaemchaeng. Do not present them as checked.
- **5.3** — privacy section 7 security claims are softened pending Chulalongkorn
  IT. Do not restate encryption-at-rest, an annual IT audit, or 72-hour PDPC
  notification as settled fact until they confirm.
- **9.3** — `.tag-brand-blue` fails WCAG AA at 2.89:1. If the design system moves
  to Kanit, re-run the contrast pairs; a font change does not fix a colour pair,
  and loopless Thai at body size makes low contrast harder to read, not easier.

