#!/usr/bin/env node
/**
 * build-vercel-routes.mjs — write the redirect and rewrite tables into vercel.json.
 *
 * Two audit findings drive this (docs/AUDIT-2026-09-comminno-web.md):
 *
 *  4.2  The 39 legacy Wix redirects were emitted to client/public/_redirects
 *       (Netlify format) and client/public/redirects.json (a Vercel-shaped
 *       object). Vercel reads NEITHER — it reads redirects only from
 *       vercel.json, which had no `redirects` array at all. The only thing in
 *       effect was a client-side navigate() after React mounted: a soft
 *       redirect from a 200 response, passing no link equity. These are now
 *       real 308s issued at the edge.
 *
 *  4.1  `"source": "/(.*)"` rewrote EVERY path to index.html, so every URL —
 *       including /this-page-does-not-exist-xyz — returned HTTP 200 and the
 *       SPA painted a 404 screen the crawler never saw. The rewrite table
 *       below matches only the route shapes the app actually serves, so
 *       anything else falls through to Vercel's 404 handling and gets a real
 *       404 status with our branded dist/public/404.html.
 *
 *       Shapes, not slugs: an unknown slug under a valid shape (e.g.
 *       /th/insights/does-not-exist) still reaches the SPA and renders the
 *       NotFound view, which now carries <meta name="robots" content="noindex">.
 *       That is deliberate. Enumerating all 78 slugs here would 404 any post
 *       added through the CMS until someone regenerated this file — a far
 *       worse failure mode than a noindexed soft 404 on a mistyped slug.
 *
 * Run via `pnpm routes`. scripts/check-routes.mjs asserts the result.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERCEL = join(ROOT, "vercel.json");

/** Locales the app serves. `th` is the default and the sitemap's x-default. */
export const LOCALES = ["th", "en"];
const DEFAULT_LOCALE = "th";

/** Top-level app sections (no trailing slug). */
export const SECTIONS = ["about", "services", "insights", "contact", "privacy"];
/** Sections that also serve a `/<section>/<slug>` detail page. */
export const DETAIL_SECTIONS = ["services", "insights"];

/**
 * Paths that exist inside the app and therefore also need locale-prefixed
 * redirect variants — so /th/insights/<old-slug> redirects too, not just the
 * bare /insights/<old-slug> a legacy link would use.
 */
const LOCALIZABLE = /^\/(insights|services|about|contact|privacy)(\/|$)/;

export function buildRedirects(entries) {
  const out = [];
  const seen = new Set();
  const push = (source, destination) => {
    // A rule whose source equals its destination is an infinite redirect loop
    // that takes the page down entirely. These arise naturally here: the
    // identity entries that cover bare legacy paths (/about -> /about) produce
    // /th/about -> /th/about once locale-prefixed. Drop them.
    if (source === destination) return;
    if (seen.has(source)) return; // first rule wins, as on Vercel
    seen.add(source);
    out.push({ source, destination, permanent: true });
  };
  for (const { from, to } of entries) {
    // Bare legacy path → default locale. A 308 can't sniff a cookie, so it
    // lands on th, which is the site's default and the sitemap's x-default.
    push(from, `/${DEFAULT_LOCALE}${to}`);
    if (LOCALIZABLE.test(from)) {
      for (const l of LOCALES) push(`/${l}${from}`, `/${l}${to}`);
    }
  }
  return out;
}

export function buildRewrites() {
  const loc = `(${LOCALES.join("|")})`;
  return [
    { source: "/admin", destination: "/admin/index.html" },
    { source: "/admin/(.*)", destination: "/admin/$1" },
    // Root — LocaleProvider redirects to the detected locale client-side.
    { source: "/", destination: "/index.html" },
    { source: `/:locale${loc}`, destination: "/index.html" },
    { source: `/:locale${loc}/:section(${SECTIONS.join("|")})`, destination: "/index.html" },
    {
      source: `/:locale${loc}/:section(${DETAIL_SECTIONS.join("|")})/:slug`,
      destination: "/index.html",
    },
  ];
}

const entries = JSON.parse(readFileSync(join(ROOT, "client/public/redirects.json"), "utf8"))
  .redirects.map((r) => ({ from: r.source, to: r.destination }));

const config = JSON.parse(readFileSync(VERCEL, "utf8"));
config.redirects = buildRedirects(entries);
config.rewrites = buildRewrites();
writeFileSync(VERCEL, JSON.stringify(config, null, 2) + "\n", "utf8");

console.log(
  `vercel.json: ${config.redirects.length} redirects, ${config.rewrites.length} rewrites`,
);
