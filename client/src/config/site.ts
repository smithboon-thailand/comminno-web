/**
 * SITE_ORIGIN — the one place the site's public origin is defined.
 *
 * Audit finding 3.1 (Sept 2026): the canonical link, all three hreflang
 * alternates, the Organization JSON-LD, robots.txt, sitemap.xml, the CMS
 * config and the Plausible data-domain all hardcoded the *staging* host
 * (comminno-go6lmsuy.manus.space). Production was therefore telling search
 * engines that staging held the authoritative copy of every page, and every
 * consented analytics event was attributed to the staging property.
 *
 * Everything that needs the origin now derives it from here (client) or from
 * the SITE_ORIGIN environment variable (build scripts, see
 * scripts/site-origin.mjs). Never hardcode a host again — scripts/check-content.mjs
 * fails the build if a staging host reappears in shipped output.
 *
 * To change the public domain (e.g. at the cominnocenter.com DNS cutover):
 * set VITE_SITE_ORIGIN in the Vercel project environment and SITE_ORIGIN for
 * the content/sitemap scripts. No code change required.
 *
 * COUPLED TO THE NOINDEX DECISION — read before changing either.
 * `stagingNoIndex()` in vite.config.ts now injects `noindex, nofollow` into
 * EVERY production build, on the basis that this project is a preview host and
 * the centre's real site lives elsewhere. That makes the canonical below inert
 * while it stands: a page search engines are told not to index has no canonical
 * to speak of. The two are only consistent in that narrow sense — they say
 * opposite things about whether this deployment is the real site.
 *
 * So if the noindex is ever lifted, this default MUST be settled first, exactly
 * as the comment above `stagingNoIndex()` warns: pointing it at this Vercel host
 * would declare a preview host canonical all over again, which is finding 3.1
 * of the September 2026 audit returning in a new costume. Point it at whatever
 * domain actually serves the site — but only once that domain serves equivalent
 * paths, since a canonical aimed at a URL that does not exist is worse than a
 * self-referential one.
 */
export const SITE_ORIGIN: string =
  import.meta.env.VITE_SITE_ORIGIN?.replace(/\/+$/, "") ??
  "https://comminno-web.vercel.app";

/** Bare hostname — what Plausible's `data-domain` attribute expects. */
export const SITE_DOMAIN: string = SITE_ORIGIN.replace(/^https?:\/\//, "");
