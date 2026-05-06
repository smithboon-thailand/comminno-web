/**
 * scripts/swap-manus-storage-to-cloudinary.mjs
 *
 * Phase 2 r3, commit #4 — codemod that rewrites every /manus-storage/<file>
 * occurrence under client/ to its Cloudinary delivery URL.
 *
 * Source of truth: .migration/cloudinary-map.json (committed).
 * Delivery URL pattern:
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/<public_id>
 *
 * f_auto + q_auto are added at delivery time so a single Cloudinary asset
 * serves the optimal format (AVIF/WebP/JPEG) at the optimal quality per
 * client. The webp/jpg pair on disk collapses into one CDN URL — the
 * coverWebp/coverJpg duplication can be cleaned up in a later commit
 * (flagged §2.3 of PHASE2_PLAN r3).
 */
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO = join(__dirname, "..");
const MAP_PATH = join(REPO, ".migration", "cloudinary-map.json");
const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));

const CLOUD = map.cloud_name;
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto`;

function cdnUrl(publicId) {
  return `${BASE}/${publicId}`;
}

// Scan every tracked file under client/ via git ls-files (skips node_modules,
// dist, etc. by definition). Filter to source-like extensions.
const tracked = execSync("git ls-files client/", { cwd: REPO, encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((p) => /\.(ts|tsx|js|jsx|css|html|json|md)$/.test(p));

// Sort the manus-storage keys longest-first so we never have a substring
// collision (e.g. a hypothetical key that's a prefix of another).
const keys = Object.keys(map.byManusPath).sort((a, b) => b.length - a.length);

const summary = { filesScanned: tracked.length, filesChanged: 0, totalReplacements: 0, byFile: {} };

for (const rel of tracked) {
  const abs = join(REPO, rel);
  let src;
  try {
    src = readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  let changed = src;
  let count = 0;
  for (const key of keys) {
    if (!changed.includes(key)) continue;
    const url = cdnUrl(map.byManusPath[key]);
    // Replace the bare path verbatim — works inside string literals,
    // JSX attribute values, CSS url(), and Markdown image syntax alike.
    const before = changed;
    changed = changed.split(key).join(url);
    const occurrences = (before.length - changed.length) / (key.length - url.length) * -1;
    // Cheap occurrence count via split is unreliable when length deltas
    // align; recount directly:
    count += (before.match(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  }
  if (changed !== src) {
    writeFileSync(abs, changed);
    summary.filesChanged++;
    summary.totalReplacements += count;
    summary.byFile[rel] = count;
  }
}

console.log("── Codemod summary ──");
console.log(`Files scanned:  ${summary.filesScanned}`);
console.log(`Files changed:  ${summary.filesChanged}`);
console.log(`Replacements:   ${summary.totalReplacements}`);
console.log("\nPer file:");
for (const [f, n] of Object.entries(summary.byFile)) {
  console.log(`  ${n.toString().padStart(3)}  ${f}`);
}

// Verify nothing slipped through.
const remaining = execSync(
  `grep -rn "/manus-storage/" client/ || true`,
  { cwd: REPO, encoding: "utf8" },
).trim();
if (remaining) {
  console.log("\n⚠  Remaining /manus-storage/ refs after codemod:");
  console.log(remaining);
  process.exit(2);
}
console.log("\n✓ No /manus-storage/ refs remain in client/.");
