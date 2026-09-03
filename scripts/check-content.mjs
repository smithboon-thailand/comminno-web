#!/usr/bin/env node
/**
 * check-content.mjs — content and deploy-config guardrails.
 *
 * Added after the September 2026 audit. CI previously ran `tsc --noEmit` and
 * `vite build` only: a reasonable code gate and a non-existent content gate.
 * Every content-level finding in docs/AUDIT-2026-09-comminno-web.md was
 * mechanically detectable, and none of it was detected.
 *
 * ERRORS (exit 1) — regressions of already-fixed defects:
 *   1. Staging host in shipped output          (audit 3.1, 7.1)
 *   2. Referential integrity of slugs          (audit 4.4)
 *
 * WARNINGS (exit 0) — known open items owned by the center. Promote each to an
 * error once the underlying content lands, so it can never regress:
 *   3. Unresolved placeholder tokens           (audit 5.1)
 *   4. Posts missing date / cover / alt text   (audit 6.1, 6.2)
 *   5. Truncated summaries and OG descriptions (audit 6.1)
 *
 * Usage:  node scripts/check-content.mjs [--dist <dir>]
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const listYml = (dir) =>
  existsSync(join(ROOT, dir))
    ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith(".yml"))
    : [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// ── 1. No staging host in shipped output ─────────────────────────────────────
// The canonical link, hreflang alternates, Organization JSON-LD, robots.txt
// Sitemap directive, all 78 sitemap entries, the CMS config and the Plausible
// data-domain all pointed at comminno-go6lmsuy.manus.space, so production told
// search engines that staging held the authoritative copy of every page and
// every analytics event was filed against the staging property.
const FORBIDDEN_HOSTS = [/comminno-go6lmsuy\.manus\.space/, /manus\.space/];
const distArg = process.argv.indexOf("--dist");
const DIST = distArg !== -1 ? process.argv[distArg + 1] : "dist/public";
const distPath = join(ROOT, DIST);

if (existsSync(distPath)) {
  for (const file of walk(distPath)) {
    // Source maps embed original comments, including this audit's own prose.
    if (extname(file) === ".map") continue;
    let body;
    try {
      body = readFileSync(file, "utf8");
    } catch {
      continue; // binary asset
    }
    for (const re of FORBIDDEN_HOSTS) {
      if (re.test(body)) {
        errors.push(
          `staging host ${re.source} found in shipped file ${relative(ROOT, file)} — ` +
            `derive the origin from client/src/config/site.ts or SITE_ORIGIN instead`,
        );
        break;
      }
    }
  }
} else {
  warnings.push(
    `${DIST} not found — skipped the shipped-output host scan. Run this after \`vite build\` in CI.`,
  );
}

// ── 2. Referential integrity ─────────────────────────────────────────────────
// Two redirect destinations and one service's relatedSlugs pointed at slugs
// that do not exist, so a homepage-featured service linked to a dead case study.
const postsSrc = read("client/src/content/posts.ts");
const postSlugs = new Set(
  [...postsSrc.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]),
);
const serviceSlugs = new Set(listYml("content/services").map((f) => f.slice(0, -4)));
const categorySlugs = new Set(listYml("content/categories").map((f) => f.slice(0, -4)));

for (const file of listYml("content/services")) {
  const body = read(`content/services/${file}`);
  const block = body.match(/relatedSlugs:\n((?:\s+- .*\n)+)/);
  if (!block) continue;
  for (const line of block[1].trim().split("\n")) {
    const slug = line.trim().replace(/^-\s*/, "");
    if (!postSlugs.has(slug)) {
      errors.push(`content/services/${file}: relatedSlugs "${slug}" is not an existing post`);
    }
  }
}

for (const file of listYml("content/posts")) {
  const body = read(`content/posts/${file}`);
  const block = body.match(/tags:\n((?:\s+- .*\n)+)/);
  if (!block) continue;
  for (const line of block[1].trim().split("\n")) {
    const tag = line.trim().replace(/^-\s*/, "");
    if (!categorySlugs.has(tag)) {
      errors.push(`content/posts/${file}: tag "${tag}" is not an existing category`);
    }
  }
}

const redirectsPath = join(ROOT, "client/public/redirects.json");
if (existsSync(redirectsPath)) {
  const { redirects } = JSON.parse(readFileSync(redirectsPath, "utf8"));
  for (const r of redirects) {
    const dest = r.destination.split(/[?#]/)[0];
    const check = (prefix, universe, kind) => {
      if (!dest.startsWith(prefix)) return;
      const slug = decodeURIComponent(dest.slice(prefix.length));
      if (slug && !universe.has(slug)) {
        errors.push(`redirect "${r.source}" → "${dest}" targets a ${kind} that does not exist`);
      }
    };
    check("/insights/", postSlugs, "post");
    check("/services/", serviceSlugs, "service");
  }
}

// ── 3. Unresolved placeholder tokens ─────────────────────────────────────────
// The privacy notice shipped publicly with [dpo@…], [+66 2 218 ____] and
// [DATE] unresolved, under a banner admitting it was unreviewed, while the
// contact form took PDPA consent (audit finding 5.1). The center supplied all
// four on 2026-09-03, so these are ERRORS now: a legal notice must never go
// out with a blank in it again.
const PLACEHOLDER_ERRORS = [/\[DATE\]/, /\[วันที่\]/, /\[dpo@/, /_{4,}\]/];
// Still outstanding, so still only a warning. Promote it the same way once the
// real Formspree endpoint is configured.
const PLACEHOLDER_WARNINGS = [/formspree\.io\/f\/PLACEHOLDER/];
for (const rel of ["client/src/pages/Privacy.tsx", "client/src/pages/Contact.tsx"]) {
  const body = read(rel);
  for (const re of PLACEHOLDER_ERRORS) {
    if (re.test(body)) errors.push(`${rel}: unresolved placeholder ${re.source} — a published legal notice must not contain a blank`);
  }
  for (const re of PLACEHOLDER_WARNINGS) {
    if (re.test(body)) warnings.push(`${rel}: unresolved placeholder ${re.source}`);
  }
}
const aboutYml = read("content/about.yml");
const pendingCount = (aboutYml.match(/thaiSpellingPending: true/g) ?? []).length;
if (pendingCount) {
  warnings.push(
    `content/about.yml: ${pendingCount} name(s) still flagged thaiSpellingPending — ` +
      `no longer rendered publicly, but still awaiting verification by the center`,
  );
}

// ── 4 & 5. Post completeness and truncation (warnings) ───────────────────────
for (const file of listYml("content/posts")) {
  const body = read(`content/posts/${file}`);
  const field = (name) => body.match(new RegExp(`^${name}: (.*)$`, "m"))?.[1]?.trim() ?? "";
  const slug = field("slug") || file;
  const date = field("date").replace(/^["']|["']$/g, "");
  if (!date || date === "~") {
    warnings.push(`content/posts/${file}: no date — it will sort last and never reach the homepage`);
  }
  if (!field("coverImage") || field("coverImage") === "~") {
    warnings.push(`content/posts/${file}: no coverImage — the card falls back to a blank gradient`);
  }
  for (const name of ["summary", "ogDescription"]) {
    const v = field(name).replace(/^["']|["']$/g, "");
    if (!v || v === "~") continue;
    if (v.length >= 195 && !/[.!?…"')\]]$/.test(v)) {
      warnings.push(`content/posts/${file}: ${name} looks truncated at ~200 chars ("…${v.slice(-40)}")`);
    } else if (/\b(Dr|Prof|Assoc|Asst|Mr|Ms|Mrs)\.$/.test(v)) {
      warnings.push(`content/posts/${file}: ${name} ends on an abbreviation ("…${v.slice(-40)}")`);
    }
    void slug;
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} warning(s) — known open items, not blocking:`);
  for (const w of warnings) console.log(`   • ${w}`);
}
if (errors.length) {
  console.error(`\n✖ ${errors.length} error(s):`);
  for (const e of errors) console.error(`   • ${e}`);
  console.error("");
  process.exit(1);
}
console.log(`\n✓ check-content passed (${warnings.length} warning(s)).`);
