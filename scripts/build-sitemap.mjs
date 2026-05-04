#!/usr/bin/env node
/**
 * build-sitemap.mjs — Comm.Inno
 *
 * Generates client/public/sitemap.xml from the typed content modules.
 * Each route gets a TH and an EN entry with hreflang alternates.
 *
 * Run after `pnpm content` and before `pnpm build`.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "client/public/sitemap.xml");

// Domain — overridable via env so we can swap from manus.space → vercel.app → cominnocenter.com
const DOMAIN = process.env.SITE_DOMAIN || "https://comminno-go6lmsuy.manus.space";
const NOW = new Date().toISOString().slice(0, 10);

// Pull slugs out of the emitted TS modules with a tiny string parse — avoids importing TS from Node.
function extractSlugs(file, kind) {
  const src = readFileSync(file, "utf8");
  const slugs = [];
  // Very simple regex over the literal `"slug": "...",` lines that build-content emits.
  for (const m of src.matchAll(/"slug":\s*"([^"]+)"/g)) {
    slugs.push(m[1]);
  }
  if (slugs.length === 0) {
    console.warn(`No slugs found in ${file} (${kind})`);
  }
  return slugs;
}

const postSlugs = extractSlugs(join(ROOT, "client/src/content/posts.ts"), "posts");
const serviceSlugs = extractSlugs(join(ROOT, "client/src/content/services.ts"), "services");

// Static routes (priority + change frequency)
const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/insights", priority: "0.9", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
];

const routes = [
  ...staticRoutes,
  ...serviceSlugs.map((slug) => ({
    path: `/services/${slug}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
  ...postSlugs.map((slug) => ({
    path: `/insights/${slug}`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
];

for (const r of routes) {
  for (const locale of ["th", "en"]) {
    const loc = `${DOMAIN}/${locale}${r.path === "/" ? "" : r.path}`;
    const otherLocale = locale === "th" ? "en" : "th";
    const otherLoc = `${DOMAIN}/${otherLocale}${r.path === "/" ? "" : r.path}`;
    xmlLines.push("  <url>");
    xmlLines.push(`    <loc>${loc}</loc>`);
    xmlLines.push(`    <lastmod>${NOW}</lastmod>`);
    xmlLines.push(`    <changefreq>${r.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${r.priority}</priority>`);
    xmlLines.push(
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${loc}" />`,
    );
    xmlLines.push(
      `    <xhtml:link rel="alternate" hreflang="${otherLocale}" href="${otherLoc}" />`,
    );
    xmlLines.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/th${r.path === "/" ? "" : r.path}" />`,
    );
    xmlLines.push("  </url>");
  }
}

xmlLines.push("</urlset>");
writeFileSync(OUT, xmlLines.join("\n") + "\n", "utf8");

const totalUrls = routes.length * 2;
console.log(`Wrote sitemap.xml with ${totalUrls} URLs (${routes.length} routes × 2 locales).`);
