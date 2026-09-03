# Handoff to `cominnocenter-website`

`comminno-web` is being retired in favour of `smithboon-thailand/cominnocenter-website`
(decided 3 Sep 2026). This directory is what should travel out of here before
the 301 goes up.

## What to take

| Item | Where | Why it matters |
|---|---|---|
| **Audit** | `docs/AUDIT-2026-09-comminno-web.md` | 34 findings. Most concern the centre's web presence, not this codebase, so they apply to whichever property survives. |
| **Porting checklist** | `docs/handoff/PORTING-CHECKLIST.md` | The same 34 as a tick-list, with the four to check first and my read on which transfer. |
| **Content checker** | `docs/handoff/check-content.portable.mjs` | Repo-agnostic. Everything specific is in one CONFIG block at the top. Run it *after* the build so it scans shipped output, not sources. |
| **Wix archive** | `content/data/all_pages.json`, `content/pages/` (43 files) | **The most irreplaceable thing here.** The original scrape of the old Wix site. It is how the 15 truncated summaries were restored — the live text was cut mid-word and this held the originals. If the old site is gone, this is the only copy. |
| **Redirect map** | `content/redirects.yml` (43 legacy paths) | Cross-check against the 32 rules in the other repo. A legacy URL nobody catches is a silent 404 for anyone holding an old link. |
| **OG image** | `client/public/og-image.png` + `scripts/og/` | 1200×630, rendered from a committed HTML template so it can be regenerated. |

## Why run the checker after the build, not before

A value can be right in source and wrong in output. The staging host reached
production through a static `index.html` that no source scan would have flagged,
and the debug collector shipped because it sat in `public/` where nothing
imported it. Scanning `dist` catches both. Exclude `.map` files — source maps
embed the original comments, including prose *about* these bugs, which trips
naive string matching.

## The one rule that made the checks worth having

**Never ship a check you have not seen fail.** Every guard here was
negative-tested: the bug was reintroduced deliberately, the check was confirmed
to exit 1, and the file was restored. The route checker earned its place on the
first run by catching `/th/about → /th/about`, an infinite redirect loop that
would have taken a live page down.

## Still open, and not code

- Formspree endpoint — the contact form cannot receive anything until it is set.
- Three Thai spellings unverified: Supatra Petchree, Hrut Sitthipuwabun, Thavin Chaemchaeng.
- Privacy §7 security claims await Chulalongkorn IT.
- Two brand documents (`BRAND.md` and this repo's `README.md`) both claim
  authority and disagree on typography. Whichever wins, delete or mark the other
  superseded — otherwise the next person follows the wrong one correctly.
