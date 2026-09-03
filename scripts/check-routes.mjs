#!/usr/bin/env node
/**
 * check-routes.mjs — assert vercel.json's routing table actually works.
 *
 * Vercel preview deployments on this project sit behind deployment protection,
 * so a routing change cannot be verified against a live URL before merge. This
 * script is the substitute: it compiles the `source` patterns from vercel.json
 * with path-to-regexp (the same matcher Vercel uses) and asserts the resulting
 * behaviour against every URL the site actually serves.
 *
 * It exists because generating the table by hand produced a real bug on the
 * first pass — the locale-prefixed variants of the identity redirects came out
 * as `/th/about -> /th/about`, an infinite loop that would have taken the
 * About page down. Assertion 1 below is that bug, frozen.
 *
 * Checks:
 *   1. No redirect is a self-loop, and no redirect chains into another.
 *   2. Every canonical URL in sitemap.xml is rewritten to the SPA and is NOT
 *      caught by a redirect first (redirects run before rewrites on Vercel).
 *   3. Every legacy Wix URL redirects, and lands on a path that itself resolves.
 *   4. Junk paths match no rewrite, so they get a real 404 instead of HTTP 200.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToRegexp } from "path-to-regexp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));

const failures = [];
const fail = (m) => failures.push(m);

const compile = (rules) =>
  rules.map((r) => ({ ...r, re: pathToRegexp(r.source) }));
const redirects = compile(cfg.redirects ?? []);
const rewrites = compile(cfg.rewrites ?? []);

const firstRedirect = (p) => redirects.find((r) => r.re.test(p));
const firstRewrite = (p) => rewrites.find((r) => r.re.test(p));
/** Vercel evaluates redirects before rewrites. */
const resolves = (p) => Boolean(firstRedirect(p) || firstRewrite(p));

// ── 1. No self-loops, no redirect chains ─────────────────────────────────────
for (const r of redirects) {
  if (r.source === r.destination) {
    fail(`self-redirect loop: ${r.source} -> ${r.destination}`);
  }
  const dest = r.destination.split(/[?#]/)[0];
  const onward = firstRedirect(dest);
  if (onward) {
    fail(
      `redirect chain: ${r.source} -> ${dest}, which itself redirects via ` +
        `${onward.source} -> ${onward.destination}`,
    );
  }
  if (!firstRewrite(dest)) {
    fail(`redirect ${r.source} -> ${dest} lands on a path that 404s`);
  }
}

// ── 2. Every canonical URL reaches the SPA, un-intercepted ───────────────────
const sitemap = readFileSync(join(ROOT, "client/public/sitemap.xml"), "utf8");
const canonical = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  decodeURIComponent(new URL(m[1]).pathname),
);
if (canonical.length === 0) fail("sitemap.xml yielded no URLs to check");
for (const p of canonical) {
  const hijacked = firstRedirect(p);
  if (hijacked) {
    fail(`canonical URL ${p} is intercepted by redirect ${hijacked.source}`);
    continue;
  }
  if (!firstRewrite(p)) fail(`canonical URL ${p} matches no rewrite — would 404`);
}

// ── 3. Every legacy Wix URL redirects somewhere real ─────────────────────────
const legacy = readFileSync(join(ROOT, "content/data/all_urls.txt"), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .map((u) => decodeURIComponent(new URL(u).pathname).replace(/\/+$/, "") || "/");
for (const p of new Set(legacy)) {
  if (p === "/") continue; // homepage is a rewrite, not a redirect
  if (!resolves(p)) fail(`legacy URL ${p} resolves to nothing — dead inbound link`);
}

// ── 4. Junk paths must NOT resolve, so Vercel returns a real 404 ─────────────
const junk = [
  "/this-page-does-not-exist-xyz",
  "/th/nope",
  "/fr/about",
  "/th/about/extra/segments",
  "/wp-admin",
  "/th/insights/slug/too/deep",
];
for (const p of junk) {
  const hit = firstRewrite(p);
  if (hit) fail(`junk path ${p} matched rewrite ${hit.source} — would return HTTP 200`);
}

if (failures.length) {
  console.error(`\n✖ check-routes: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`   • ${f}`);
  console.error("");
  process.exit(1);
}
console.log(
  `\n✓ check-routes passed — ${redirects.length} redirects, ${rewrites.length} rewrites, ` +
    `${canonical.length} canonical URLs, ${new Set(legacy).size} legacy URLs, ${junk.length} junk paths.`,
);
