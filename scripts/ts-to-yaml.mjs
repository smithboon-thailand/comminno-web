#!/usr/bin/env node
/**
 * ts-to-yaml.mjs — reverse pipeline (TS → YAML).
 *
 * Phase 2 r3 commit #5, updated in #7.5 to emit per-slug folder collections
 * for posts / services / categories. Reads the live TS modules under
 * client/src/content/, extracts the exported data, and writes it back as
 * canonical YAML under /content/. Idempotent: re-running on the same
 * working tree should produce byte-identical output.
 *
 * Output layout (matches PHASE2_PLAN r3 §2.2 + #7.5 split):
 *   content/
 *     posts/<slug>.yml          ← one file per insight post (folder coll.)
 *     post-bodies/<slug>.md     ← long-form body, one file per post
 *     services/<slug>.yml       ← one file per service (folder coll.)
 *     categories/<slug>.yml     ← one file per category (folder coll.)
 *     about.yml                 ← single object (one logical page)
 *     redirects.yml             ← single list (bulk-edited)
 *     SCHEMA.md                 ← architectural rules + field conventions
 *
 * Why folders for posts / services / categories: see build-content.mjs.
 *
 * Usage:
 *   pnpm exec tsx scripts/ts-to-yaml.mjs
 *
 * The script is intentionally invoked through tsx so it can `import()`
 * the .ts modules directly (no regex parsing — lossless by construction).
 */
import { mkdir, writeFile, rm, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const SRC = path.join(ROOT, "client/src/content");

// Dynamic imports — tsx resolves the .ts extensions for us.
const { posts } = await import(path.join(SRC, "posts.ts"));
const { postBodies } = await import(path.join(SRC, "post-bodies.ts"));
const { services } = await import(path.join(SRC, "services.ts"));
const { about } = await import(path.join(SRC, "about.ts"));
const { categories } = await import(path.join(SRC, "categories.ts"));
const { redirects } = await import(path.join(SRC, "redirects.ts"));

/** js-yaml dump options tuned for human edits + diff hygiene. */
const YAML_OPTS = {
  indent: 2,
  lineWidth: -1,        // no wrapping (preserve long Thai/English strings as-is)
  noRefs: true,         // no anchors/aliases
  sortKeys: false,      // preserve insertion order — semantic for editor
  quotingType: '"',
  forceQuotes: false,
  styles: { "!!null": "canonical" }, // emit `null` (not empty) — explicit
};

/**
 * Strip undefined fields and convert them to null at the top level so
 * YAML output is stable across runs. Keeps optional → null contract
 * with build-content.mjs (commit #6 reverse direction).
 */
function normalize(value) {
  if (value === undefined) return null;
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue; // drop undefined keys (cleaner YAML)
      out[k] = normalize(v);
    }
    return out;
  }
  return value;
}

// As of commit #6.5 the legacy paired image fields (coverWebp / coverJpg /
// heroImageFallback) have been removed from the schema. Cloudinary's
// `f_auto,q_auto` transform negotiates webp/jpg/avif per client, so a single
// canonical `coverImage` / `heroImage` URL is sufficient.

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/** Write a YAML file with a small header comment. */
async function writeYaml(file, header, data) {
  const body = yaml.dump(normalize(data), YAML_OPTS);
  const text = `# ${header}\n# Source of truth (commit #5+). Edit via /admin or directly in this file;\n# scripts/build-content.mjs reads it and emits client/src/content/*.ts.\n\n${body}`;
  await writeFile(file, text, "utf8");
  return text.length;
}

/**
 * Same as writeYaml but wraps `data` (an array) under a single root key,
 * e.g. `redirects: [...]`. Sveltia's single-file collection list widget
 * needs a root-key wrapper; folder collections do not (#7.5).
 */
async function writeYamlList(file, header, rootKey, list) {
  return writeYaml(file, header, { [rootKey]: list });
}

/**
 * Folder-collection writer. Wipes the folder, then writes one
 * `<slug>.yml` per item. Each file holds a single top-level YAML object
 * (no root-key wrapper) — that's the Sveltia folder-collection
 * convention. Returns the total bytes written across the folder.
 *
 * @param {string} dir — folder path
 * @param {string} headerSingular — single-line comment, prepended to each file
 * @param {Array<{slug: string}>} items — must each have a `slug` field
 */
async function writeYamlFolder(dir, headerSingular, items) {
  // Wipe + recreate so deletions in TS propagate to YAML and there are
  // never orphan files.
  if (existsSync(dir)) await rm(dir, { recursive: true, force: true });
  await ensureDir(dir);
  let bytes = 0;
  for (const item of items) {
    if (!item.slug || typeof item.slug !== "string") {
      throw new Error(
        `[ts-to-yaml] folder collection item is missing a string \`slug\` — ` +
        `cannot determine filename for ${dir}`
      );
    }
    const body = yaml.dump(normalize(item), YAML_OPTS);
    const text = `# ${headerSingular}\n# Source of truth (commit #7.5+). Edit via /admin or directly in this file;\n# scripts/build-content.mjs reads it and emits client/src/content/*.ts.\n\n${body}`;
    const file = path.join(dir, `${item.slug}.yml`);
    await writeFile(file, text, "utf8");
    bytes += text.length;
  }
  return bytes;
}

async function main() {
  await ensureDir(CONTENT_DIR);
  const bodiesDir = path.join(CONTENT_DIR, "post-bodies");
  // Wipe + recreate post-bodies/ to keep the directory deterministic.
  if (existsSync(bodiesDir)) await rm(bodiesDir, { recursive: true, force: true });
  await ensureDir(bodiesDir);

  let totalBytes = 0;

  // 1. posts/<slug>.yml — one file per insight post (folder collection)
  totalBytes += await writeYamlFolder(
    path.join(CONTENT_DIR, "posts"),
    "Insight post (metadata only — body in content/post-bodies/<slug>.md).",
    posts
  );

  // Remove the legacy monolith if it still exists from pre-#7.5 trees.
  const legacyPostsYml = path.join(CONTENT_DIR, "posts.yml");
  if (existsSync(legacyPostsYml)) await unlink(legacyPostsYml);

  // 2. post-bodies/<slug>.md — one file per post
  let bodyCount = 0;
  for (const post of posts) {
    const body = postBodies[post.slug];
    if (typeof body !== "string") {
      console.warn(`  warn: post '${post.slug}' has no body in post-bodies.ts — skipping`);
      continue;
    }
    const bodyFile = path.join(bodiesDir, `${post.slug}.md`);
    // Ensure trailing newline (POSIX).
    const bodyWithNewline = body.endsWith("\n") ? body : body + "\n";
    // Prepend a YAML front matter block with the slug so Sveltia's default
    // `yaml-frontmatter` parser (folder collection) accepts each file.
    // Sveltia rejects empty frontmatter blocks (#7.3 fix), so we surface
    // `slug` (the identifier) as a stable, non-empty stub.
    // build-content.mjs strips this back out on the way to TS so the
    // embedded string remains body-only.
    const text = `---\nslug: ${post.slug}\n---\n\n${bodyWithNewline}`;
    await writeFile(bodyFile, text, "utf8");
    totalBytes += text.length;
    bodyCount += 1;
  }

  // 3. services/<slug>.yml — one file per service (folder collection)
  totalBytes += await writeYamlFolder(
    path.join(CONTENT_DIR, "services"),
    "Service catalogue entry. `descriptionEn` / `descriptionTh` is markdown-safe.",
    services
  );
  const legacyServicesYml = path.join(CONTENT_DIR, "services.yml");
  if (existsSync(legacyServicesYml)) await unlink(legacyServicesYml);

  // 4. about.yml — single object, deeply nested.
  totalBytes += await writeYaml(
    path.join(CONTENT_DIR, "about.yml"),
    "About page — mission, pillars, leadership tiers, partners.",
    about
  );

  // 5. categories/<slug>.yml — one file per category (folder collection)
  totalBytes += await writeYamlFolder(
    path.join(CONTENT_DIR, "categories"),
    "Post category (taxonomy). Mirrors original Wix slugs.",
    categories
  );
  const legacyCategoriesYml = path.join(CONTENT_DIR, "categories.yml");
  if (existsSync(legacyCategoriesYml)) await unlink(legacyCategoriesYml);

  // 6. redirects.yml — single-file (bulk-edited, no per-entry workflow)
  totalBytes += await writeYamlList(
    path.join(CONTENT_DIR, "redirects.yml"),
    "Legacy Wix → new path redirects. Consumed by vercel.json + (future) middleware.",
    "redirects",
    redirects
  );

  console.log("✓ ts-to-yaml migration complete");
  console.log(`  posts:      ${posts.length} entries  (+ ${bodyCount} body files)`);
  console.log(`  services:   ${services.length} entries`);
  console.log(`  about:      mission + ${about.leadership.length} leadership + ${about.faculty2.length} faculty2 + ${about.researchTeam.length} researchTeam + ${about.partners.length} partners`);
  console.log(`  categories: ${categories.length} entries`);
  console.log(`  redirects:  ${redirects.length} entries`);
  console.log(`  total written: ${totalBytes.toLocaleString()} bytes`);
}

main().catch((err) => {
  console.error("✗ ts-to-yaml failed:", err);
  process.exit(1);
});
