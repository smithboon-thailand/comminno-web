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
 */
export const SITE_ORIGIN: string =
  import.meta.env.VITE_SITE_ORIGIN?.replace(/\/+$/, "") ??
  "https://comminno-web.vercel.app";

/** Bare hostname — what Plausible's `data-domain` attribute expects. */
export const SITE_DOMAIN: string = SITE_ORIGIN.replace(/^https?:\/\//, "");
