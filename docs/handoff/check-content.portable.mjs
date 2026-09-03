#!/usr/bin/env node
/**
 * check-content.portable.mjs — content and deploy-config guardrails.
 *
 * A repo-agnostic version of scripts/check-content.mjs, for porting to
 * cominnocenter-website (or anywhere else). Everything repo-specific is in the
 * CONFIG block below; nothing under it should need editing.
 *
 * Why it exists. CI that only runs a type-check and a build is a code gate with
 * no content gate. Every content-level finding in the September 2026 audit was
 * mechanically detectable, and none of it was detected — a wrong email in ten
 * places, a staging host declared canonical on every page, a legal notice
 * published with blanks in it, slug references resolving to nothing.
 *
 * Run it AFTER the build, so it scans what actually ships rather than what the
 * sources say. A value can be correct in source and wrong in output.
 *
 *   node check-content.portable.mjs
 *   node check-content.portable.mjs --dist out
 *
 * Exit 1 on any error; warnings never fail the build. Promote a warning to an
 * error the moment its underlying content lands — that is the whole point of
 * the two lists.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";

// ─── CONFIG — the only part that is repo-specific ────────────────────────────
const CONFIG = {
  /** Build output directory, relative to the repo root. Next.js: "out" or ".next". */
  distDir: "dist/public",

  /**
   * Strings that must never reach shipped output. Each becomes a build failure.
   * Add every superseded value here the moment you correct it — that is what
   * stops a fixed bug coming back six months later in a file nobody re-reads.
   */
  forbidden: [
    { re: /comminno-go6lmsuy\.manus\.space/, why: "superseded staging host — derive the origin from one constant" },
    { re: /(?<!\.)comminno@chula\.ac\.th/,   why: "the centre's email is comm.inno@chula.ac.th WITH a dot" },
    { re: /218[\s\-]?2215/,                  why: "the centre's phone is +66 2 218 2163" },
  ],

  /**
   * Placeholder patterns that must never be published. These are ERRORS: a
   * legal notice with a blank in it is worse than no notice, because it invites
   * a request nobody can receive.
   */
  placeholderErrors: [/\[DATE\]/, /\[วันที่\]/, /\[dpo@/, /_{4,}\]/],

  /** Same idea, but still outstanding — reported, not fatal. */
  placeholderWarnings: [/formspree\.io\/f\/PLACEHOLDER/],

  /** Source files to scan for placeholders (build output strips comments). */
  placeholderFiles: [],

  /**
   * Referential integrity. Point these at your content collections and the
   * checker will assert every cross-reference resolves. Leave empty to skip.
   *   { dir, ext, idField, refs: [{ block, universe }] }
   */
  collections: [],
};
// ─── END CONFIG ──────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const errors = [];
const warnings = [];
const argDist = process.argv.indexOf("--dist");
const DIST = argDist !== -1 ? process.argv[argDist + 1] : CONFIG.distDir;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// ─── 1. Forbidden strings in shipped output ──────────────────────────────────
const distPath = resolve(ROOT, DIST);
if (existsSync(distPath)) {
  for (const file of walk(distPath)) {
    // Source maps embed original comments, including prose ABOUT these bugs.
    if (extname(file) === ".map") continue;
    let body;
    try {
      body = readFileSync(file, "utf8");
    } catch {
      continue; // binary asset
    }
    for (const { re, why } of CONFIG.forbidden) {
      if (re.test(body)) {
        errors.push(`${relative(ROOT, file)} contains ${re.source} — ${why}`);
      }
    }
  }
} else {
  warnings.push(`${DIST} not found — run this after the build, or pass --dist.`);
}

// ─── 2. Placeholders in source ───────────────────────────────────────────────
for (const rel of CONFIG.placeholderFiles) {
  if (!existsSync(resolve(ROOT, rel))) continue;
  const body = readFileSync(resolve(ROOT, rel), "utf8");
  for (const re of CONFIG.placeholderErrors) {
    if (re.test(body)) {
      errors.push(`${rel}: unresolved placeholder ${re.source} — a published notice must not contain a blank`);
    }
  }
  for (const re of CONFIG.placeholderWarnings) {
    if (re.test(body)) warnings.push(`${rel}: unresolved placeholder ${re.source}`);
  }
}

// ─── 3. Referential integrity ────────────────────────────────────────────────
for (const c of CONFIG.collections) {
  const dir = resolve(ROOT, c.dir);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => f.endsWith(c.ext));
  for (const f of files) {
    const body = readFileSync(join(dir, f), "utf8");
    for (const ref of c.refs) {
      const block = body.match(new RegExp(`${ref.block}:\\n((?:\\s+- .*\\n)+)`));
      if (!block) continue;
      for (const line of block[1].trim().split("\n")) {
        const id = line.trim().replace(/^-\s*/, "");
        if (!ref.universe.has(id)) {
          errors.push(`${c.dir}/${f}: ${ref.block} "${id}" does not resolve`);
        }
      }
    }
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
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
