#!/usr/bin/env node
/**
 * build-content.mjs — Comm.Inno content pipeline (YAML → TS).
 *
 * Phase 2 r3 commit #6, updated in #7.5 to read per-slug folder collections
 * for posts / services / categories. Reads canonical content from
 * `content/**` and emits the typed modules under `client/src/content/`.
 * Every consumer of the site reads from those generated TS files; no
 * runtime YAML parser ships to the browser.
 *
 * Pipeline:
 *   content/posts/<slug>.yml      ─┐
 *   content/post-bodies/<slug>.md ─┤
 *   content/services/<slug>.yml   ─┼─►  client/src/content/posts.ts
 *   content/about.yml             ─┤    client/src/content/post-bodies.ts
 *   content/categories/<slug>.yml ─┤    client/src/content/services.ts
 *   content/redirects.yml         ─┘    client/src/content/about.ts
 *                                       client/src/content/categories.ts
 *                                       client/src/content/redirects.ts
 *
 * Why folders for posts / services / categories (#7.5):
 *   Sveltia's per-entry editorial workflow opens one PR per file. With a
 *   monolithic posts.yml every save mutated the same 95 KB blob and two
 *   editors saving in parallel produced merge conflicts. Folder
 *   collections give each entry its own file → 1 PR per entry → no
 *   conflicts. Redirects + about stay single-file because they have no
 *   per-entry editorial workflow.
 *
 * Determinism:
 *   • Folder readers sort by filename (lexicographic) before consuming, so
 *     output ordering is stable regardless of OS readdir order.
 *   • All emit goes through `JSON.stringify(value, null, 2)` and is wrapped
 *     with the same `as const` / `Map` exports the codebase relies on.
 *     Field order = insertion order from YAML.
 *   • No timestamps, git SHAs, or env-dependent strings touch the output —
 *     re-running on an unchanged YAML tree must produce byte-identical
 *     `client/src/content/*.ts`. This is the Phase B idempotency gate.
 *
 * Run: pnpm content        (or  pnpm exec tsx scripts/build-content.mjs)
 *
 * Inverse direction (one-shot, used during the migration):
 *   pnpm exec tsx scripts/ts-to-yaml.mjs
 *
 * The previous markdown-scraping pipeline lives at
 *   scripts/build-content.legacy.mjs
 * and is scheduled for deletion ~1 week after Phase 2 GA (commit #9+).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT = join(ROOT, "content");
const BODIES = join(CONTENT, "post-bodies");
const OUT = join(ROOT, "client/src/content");

mkdirSync(OUT, { recursive: true });

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const readYaml = (file) =>
  yaml.load(readFileSync(join(CONTENT, file), "utf8"));

/**
 * Unwrap `{ <key>: [...] }` → `[...]`. Strict mode (no fallback): the YAML
 * MUST carry the expected root key with an array value. Anything else throws
 * so we can't accidentally ship an empty collection.
 *
 * Used for `redirects.yml` (single-file collection, kept for bulk-edit UX).
 * Posts / services / categories migrated to folder collections in #7.5
 * — see `readYamlFolder`.
 */
const readYamlList = (file, rootKey) => {
  const data = yaml.load(readFileSync(join(CONTENT, file), "utf8"));
  const list = data?.[rootKey];
  if (!Array.isArray(list)) {
    throw new Error(
      `[build-content] expected '${rootKey}: [...]' at the root of ${file}, ` +
      `got ${data === null ? "null" : typeof data}.`
    );
  }
  return list;
};

/**
 * Read every `*.yml` in a folder and return the parsed objects as an array,
 * sorted by filename (lexicographic). Each file is expected to contain a
 * single top-level YAML object (no root-key wrapper) — that's the
 * Sveltia folder-collection convention.
 *
 * Throws if the folder is missing or any file fails to parse.
 *
 * @param {string} dir — folder name relative to /content
 * @returns {Array<Record<string, unknown>>}
 */
const readYamlFolder = (dir) => {
  const folder = join(CONTENT, dir);
  if (!existsSync(folder)) {
    throw new Error(`[build-content] folder not found: content/${dir}/`);
  }
  const files = readdirSync(folder)
    .filter((f) => f.endsWith(".yml"))
    .sort();
  if (files.length === 0) {
    throw new Error(`[build-content] no .yml files in content/${dir}/`);
  }
  return files.map((f) => {
    const data = yaml.load(readFileSync(join(folder, f), "utf8"));
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      throw new Error(
        `[build-content] expected a YAML object at the root of content/${dir}/${f}, ` +
        `got ${data === null ? "null" : Array.isArray(data) ? "array" : typeof data}.`
      );
    }
    return data;
  });
};

const writeTS = (file, content) => {
  const out = content.endsWith("\n") ? content : content + "\n";
  writeFileSync(join(OUT, file), out, "utf8");
  console.log(`  ✓ client/src/content/${file}`);
};

/** JSON.stringify with two-space indent (matches the legacy TS shape). */
const dumpJson = (value) => JSON.stringify(value, null, 2);

// ─────────────────────────────────────────────────────────────────────────────
// 1. posts.ts — metadata only
// ─────────────────────────────────────────────────────────────────────────────
// As of #7.5, each post is its own file under content/posts/<slug>.yml.
// Stable display order is enforced by sorted filenames; if the editorial
// team needs a custom display order, introduce a numeric `order:` field
// and sort on that instead.

const posts = readYamlFolder("posts");

const postsTS =
  `// AUTO-GENERATED by scripts/build-content.mjs from content/posts/ — do not edit by hand.\n` +
  `// Lightweight post metadata (no body) — safe to import on every page.\n` +
  `import type { PostMeta } from "./types";\n` +
  `export const posts: readonly PostMeta[] = ${dumpJson(posts)} as const;\n` +
  `export const postsBySlug = new Map<string, PostMeta>(\n` +
  `  posts.map((p) => [p.slug, p])\n` +
  `);\n`;

writeTS("posts.ts", postsTS);

// ─────────────────────────────────────────────────────────────────────────────
// 2. post-bodies.ts — long-form body, one entry per post
// ─────────────────────────────────────────────────────────────────────────────

const bodyFiles = readdirSync(BODIES)
  .filter((f) => f.endsWith(".md"))
  .sort();
const knownSlugs = new Set(bodyFiles.map((f) => f.replace(/\.md$/, "")));

// Emit bodies in the same order as `posts` so the generated literal mirrors
// the canonical post ordering (clean diffs when posts/ is reordered).
const postBodies = {};
for (const post of posts) {
  if (!knownSlugs.has(post.slug)) {
    throw new Error(
      `Missing body file for post '${post.slug}' — expected content/post-bodies/${post.slug}.md`,
    );
  }
  const raw = readFileSync(join(BODIES, `${post.slug}.md`), "utf8");
  // Strip the leading YAML front matter block (added in #7.2 so Sveltia's
  // folder-collection `yaml-frontmatter` parser accepts the file). We don't
  // currently bind any frontmatter fields — it's strictly a parser shim —
  // so the body the runtime sees is unchanged from pre-#7.2.
  const noFrontMatter = raw.replace(/^---\r?\n([\s\S]*?\r?\n)?---\r?\n+/, "");
  // Strip a single trailing newline (POSIX EOF) so the embedded string
  // matches what the legacy pipeline emitted.
  postBodies[post.slug] = noFrontMatter.replace(/\n$/, "");
}

const bodiesTS =
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.\n` +
  `// Long-form post bodies, separated from metadata so non-detail pages don't pay\n` +
  `// the parse cost. Import only from InsightDetail.\n` +
  `export const postBodies: Record<string, string> = ${dumpJson(postBodies)};\n`;

writeTS("post-bodies.ts", bodiesTS);

// ─────────────────────────────────────────────────────────────────────────────
// 3. categories.ts
// ─────────────────────────────────────────────────────────────────────────────

const categories = readYamlFolder("categories");

const categoriesTS =
  `// AUTO-GENERATED by scripts/build-content.mjs from content/categories/ — do not edit by hand.\n` +
  `import type { Category } from "./types";\n` +
  `export const categories: readonly Category[] = ${dumpJson(categories)} as const;\n` +
  `export const categoriesBySlug = new Map<string, Category>(\n` +
  `  categories.map((c) => [c.slug, c])\n` +
  `);\n`;

writeTS("categories.ts", categoriesTS);

// ─────────────────────────────────────────────────────────────────────────────
// 4. redirects.ts
// ─────────────────────────────────────────────────────────────────────────────
// Stays single-file: redirects are bulk-edited (one PR for a sweep) rather
// than per-entry, so a folder collection would just add overhead.

const redirects = readYamlList("redirects.yml", "redirects");

const redirectsTS =
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.\n` +
  `import type { Redirect } from "./types";\n` +
  `export const redirects: readonly Redirect[] = ${dumpJson(redirects)} as const;\n`;

writeTS("redirects.ts", redirectsTS);

// ─────────────────────────────────────────────────────────────────────────────
// 5. services.ts
// ─────────────────────────────────────────────────────────────────────────────
// As of #7.5, each service is its own file under content/services/<slug>.yml.
// Stable display order is enforced by sorted filenames.

const services = readYamlFolder("services");

const servicesTS =
  `// AUTO-GENERATED by scripts/build-content.mjs from content/services/ — do not edit by hand.\n` +
  `// Canonical service catalogue (9 entries). Source of truth lives at\n` +
  `// content/services/<slug>.yml. Editors use the Sveltia /admin form (commit #7) or\n` +
  `// edit the YAML directly; the next \`pnpm content\` run regenerates this file.\n` +
  `import type { Service } from "./types";\n` +
  `\n` +
  `/**\n` +
  ` * Backward-compat alias retained from commit #5a — historically\n` +
  ` * \`ServiceWithCopy\` carried subtitle / relatedSlugs / cta / hero* fields\n` +
  ` * that were missing from the base \`Service\` interface. Those fields now\n` +
  ` * live on \`Service\` itself, so this alias is purely for source\n` +
  ` * compatibility with older imports. Callers may migrate to \`Service\`.\n` +
  ` */\n` +
  `export type ServiceWithCopy = Service;\n` +
  `\n` +
  `export const services: readonly ServiceWithCopy[] = ${dumpJson(services)} as const;\n` +
  `export const servicesBySlug = new Map<string, ServiceWithCopy>(\n` +
  `  services.map((s) => [s.slug, s]),\n` +
  `);\n` +
  `/** Stable display order — mirrors content/services/ filename order. */\n` +
  `export const serviceOrder: readonly string[] = services.map((s) => s.slug);\n`;

writeTS("services.ts", servicesTS);

// ─────────────────────────────────────────────────────────────────────────────
// 6. about.ts
// ─────────────────────────────────────────────────────────────────────────────
// about.yml is the deepest collection — mission, pillars, leadership tiers,
// research team, partners, plus the legacy `faculty` + `widerTeam` arrays
// retained for JSON-LD and downstream consumers. Stays single-file because
// it represents one logical page with strongly coupled sections.

const about = readYaml("about.yml");

const aboutTS =
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.\n` +
  `// Canonical About page data: mission, pillars, leadership tiers,\n` +
  `// research team, partners, plus legacy faculty / widerTeam arrays.\n` +
  `// Source of truth: content/about.yml. Editors use the Sveltia /admin\n` +
  `// form (commit #7) or edit the YAML directly; the next \`pnpm content\`\n` +
  `// run regenerates this file.\n` +
  `//\n` +
  `// Name corrections enforced upstream by the YAML and SCHEMA.md:\n` +
  `//   "Wassayut Kongjan"   → "Watsayut Kongchan" (วรรษยุต คงจันทร์)\n` +
  `//   "Wai Phan Chansem"   → "Waiphot Chansem" (Partners)\n` +
  `//   "Atchara Boonchum"   → "Achara Bunchum"   (อัจฉรา บุญชุ่ม)\n` +
  `//   "Ekasit Sumana"      → "Akasit Sumana"    (เอกสิทธิ์ สุมานะ)\n` +
  `//   "Boonchotima"        → "Boonchutima"      (any occurrence)\n` +
  `import type { About } from "./types";\n` +
  `export const about: About = ${dumpJson(about)};\n`;

writeTS("about.ts", aboutTS);

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n✓ build-content complete");
console.log(
  `  posts:      ${posts.length} entries  (+ ${Object.keys(postBodies).length} body files)`,
);
console.log(`  categories: ${categories.length} entries`);
console.log(`  redirects:  ${redirects.length} entries`);
console.log(`  services:   ${services.length} entries`);
console.log(
  `  about:      mission + ${about.leadership?.length ?? 0} leadership` +
    ` + ${about.faculty2?.length ?? 0} faculty2` +
    ` + ${about.researchTeam?.length ?? 0} researchTeam` +
    ` + ${about.partners?.length ?? 0} partners` +
    ` + ${about.faculty?.length ?? 0} legacy faculty` +
    ` + ${about.widerTeam?.length ?? 0} widerTeam`,
);
