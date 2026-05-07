#!/usr/bin/env node
/**
 * Lighthouse audit runner for Comm.Inno
 *
 * Audits every page in TH and EN (mobile profile) and writes:
 *   - .lighthouse-reports/<page>-<locale>.json (full report)
 *   - .lighthouse-reports/SUMMARY.md         (score table)
 *
 * Rule #10 from the brief: every page must score >= 90 in
 * Performance, Accessibility, Best Practices, and SEO.
 *
 * Usage:
 *   pnpm exec tsx scripts/lighthouse-audit.mjs [base_url]
 *   default base_url = https://comminno-web.vercel.app
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE = process.argv[2] || "https://comminno-web.vercel.app";
const OUT_DIR = ".lighthouse-reports";

const PAGES = [
  { id: "home",            path: "/" },
  { id: "about",           path: "/about" },
  { id: "services",        path: "/services" },
  { id: "service-detail",  path: "/services/book-and-printing" },
  { id: "insights",        path: "/insights" },
  { id: "insight-detail",  path: "/insights/asean-university-network" },
  { id: "contact",         path: "/contact" },
  { id: "privacy",         path: "/privacy" },
];
const LOCALES = ["th", "en"];

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const lhConfig = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: CATEGORIES,
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  console.log(`Launching headless Chromium…`);
  const chrome = await launch({
    chromePath: "/usr/bin/chromium",
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  const results = [];
  try {
    for (const locale of LOCALES) {
      for (const page of PAGES) {
        const url = `${BASE}/${locale}${page.path === "/" ? "" : page.path}`;
        process.stdout.write(`  ${url} … `);
        const start = Date.now();
        try {
          const runnerResult = await lighthouse(url, { port: chrome.port, output: "json", logLevel: "error" }, lhConfig);
          const lhr = runnerResult.lhr;
          const scores = Object.fromEntries(
            CATEGORIES.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)])
          );
          await writeFile(`${OUT_DIR}/${page.id}-${locale}.json`, runnerResult.report);
          const dur = ((Date.now() - start) / 1000).toFixed(1);
          console.log(`P${scores.performance} A${scores.accessibility} BP${scores["best-practices"]} S${scores.seo}  (${dur}s)`);
          results.push({ id: page.id, locale, url, ...scores });
        } catch (err) {
          console.log(`ERROR ${err.message}`);
          results.push({ id: page.id, locale, url, error: err.message });
        }
      }
    }
  } finally {
    await chrome.kill();
  }

  // Write SUMMARY.md
  const headers = "| Page | Locale | Performance | Accessibility | Best Practices | SEO | Verdict |";
  const sep     = "| --- | --- | ---: | ---: | ---: | ---: | --- |";
  const rows = results.map((r) => {
    if (r.error) return `| ${r.id} | ${r.locale} | — | — | — | — | ERROR: ${r.error} |`;
    const min = Math.min(r.performance, r.accessibility, r["best-practices"], r.seo);
    const verdict = min >= 90 ? "PASS" : `FAIL (min ${min})`;
    return `| ${r.id} | ${r.locale} | ${r.performance} | ${r.accessibility} | ${r["best-practices"]} | ${r.seo} | ${verdict} |`;
  });
  const failingPages = results.filter((r) => !r.error && Math.min(r.performance, r.accessibility, r["best-practices"], r.seo) < 90);
  const summary = [
    `# Lighthouse audit summary`,
    ``,
    `- Base URL: ${BASE}`,
    `- Profile: mobile (Lighthouse default throttling)`,
    `- Categories: ${CATEGORIES.join(", ")}`,
    `- Pages audited: ${results.length}`,
    `- Failing pages (any category < 90): **${failingPages.length}**`,
    ``,
    headers, sep, ...rows,
    ``,
  ].join("\n");
  await writeFile(`${OUT_DIR}/SUMMARY.md`, summary);
  console.log(`\nWrote ${OUT_DIR}/SUMMARY.md`);
  console.log(`Failing pages: ${failingPages.length}`);
  process.exit(failingPages.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
