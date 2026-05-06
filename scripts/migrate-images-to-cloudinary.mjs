/**
 * scripts/migrate-images-to-cloudinary.mjs
 *
 * Phase 2 r3, commit #4 — one-shot migration of every /manus-storage/*
 * image referenced by the site into Cloudinary.
 *
 * Reads originals from /home/ubuntu/webdev-static-assets/{insights,services,team}/
 * Uploads each (webp + jpg) under public_id = comminno/<scope>/<subject>
 * Cloudinary deduplicates by public_id, so re-running is idempotent.
 *
 * Writes .migration/cloudinary-map.json with both:
 *   - byManusPath:  "/manus-storage/<file>" -> "comminno/<scope>/<subject>"
 *   - bySubject:    { scope, subject, public_id, webp_secure_url, jpg_secure_url }
 *
 * Env required at runtime:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import { v2 as cloudinary } from "cloudinary";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO = join(__dirname, "..");
const ORIGINS = "/home/ubuntu/webdev-static-assets";
const MAP_PATH = join(REPO, ".migration", "cloudinary-map.json");
const REFS_PATH = join(REPO, ".migration", "manus-storage-refs.txt");

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
  console.error("Missing env: CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET");
  process.exit(1);
}

cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

// ── Build the catalog of subjects from on-disk originals ─────────────────
// Layout: /home/ubuntu/webdev-static-assets/<scope>/<subject>.{webp,jpg}
const SCOPES = ["insights", "services", "team"];
const subjects = []; // { scope, subject, webpPath, jpgPath }

for (const scope of SCOPES) {
  const dir = join(ORIGINS, scope);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir);
  const subjectSet = new Set(files.map(f => basename(f, extname(f))));
  for (const subject of [...subjectSet].sort()) {
    const webpPath = join(dir, `${subject}.webp`);
    const jpgPath = join(dir, `${subject}.jpg`);
    if (existsSync(webpPath) && existsSync(jpgPath)) {
      subjects.push({ scope, subject, webpPath, jpgPath });
    } else {
      console.warn(`[skip] ${scope}/${subject} missing pair (webp:${existsSync(webpPath)} jpg:${existsSync(jpgPath)})`);
    }
  }
}

console.log(`Found ${subjects.length} subjects across ${SCOPES.length} scopes.`);

// ── Read the catalog of /manus-storage/* refs the codemod must rewrite ──
// File written earlier by: grep -roh '/manus-storage/[a-zA-Z0-9._-]*' client/ | sort -u
const refs = existsSync(REFS_PATH)
  ? readFileSync(REFS_PATH, "utf8").split("\n").filter(Boolean)
  : [];
console.log(`Loaded ${refs.length} unique /manus-storage/* refs to map.`);

// Map each manus-storage filename to a (scope, subject).
// Filenames look like:
//   /manus-storage/smith_ac844165.webp     -> team/smith
//   /manus-storage/care-d-plus_a991466b.webp -> insights/care-d-plus
//   /manus-storage/book-and-printing_1a9fea16.webp -> services/book-and-printing
function resolveRef(ref) {
  const file = basename(ref);                       // smith_ac844165.webp
  const stem = basename(file, extname(file));       // smith_ac844165
  const subject = stem.replace(/_[a-f0-9]{8}$/i, ""); // smith
  // Find which scope owns this subject.
  for (const s of subjects) {
    if (s.subject === subject) return { scope: s.scope, subject };
  }
  return null;
}

// ── Upload pass ──────────────────────────────────────────────────────────
const map = {
  generated_at: new Date().toISOString(),
  cloud_name,
  byManusPath: {},
  bySubject: [],
};

let okCount = 0;
let failCount = 0;

for (const { scope, subject, webpPath, jpgPath } of subjects) {
  const public_id = `comminno/${scope}/${subject}`;
  try {
    // Upload the webp as the canonical resource for this public_id.
    // f_auto in delivery URL will negotiate the best format per browser.
    const webp = await cloudinary.uploader.upload(webpPath, {
      public_id,
      overwrite: true,
      resource_type: "image",
      // No eager transforms — f_auto/q_auto handle delivery on demand.
    });
    // Upload the jpg under a sibling public_id only as a paranoid fallback.
    const jpg = await cloudinary.uploader.upload(jpgPath, {
      public_id: `${public_id}-jpg`,
      overwrite: true,
      resource_type: "image",
    });
    map.bySubject.push({
      scope,
      subject,
      public_id,
      webp_secure_url: webp.secure_url,
      jpg_secure_url: jpg.secure_url,
      bytes_webp: webp.bytes,
      bytes_jpg: jpg.bytes,
    });
    okCount++;
    console.log(`[ok]  ${scope}/${subject}  (${webp.bytes}B webp, ${jpg.bytes}B jpg)`);
  } catch (err) {
    failCount++;
    console.error(`[err] ${scope}/${subject}: ${err.message}`);
  }
}

// ── Build byManusPath from refs ──────────────────────────────────────────
let mappedRefs = 0;
let unmappedRefs = [];
for (const ref of refs) {
  const r = resolveRef(ref);
  if (r) {
    map.byManusPath[ref] = `comminno/${r.scope}/${r.subject}`;
    mappedRefs++;
  } else {
    unmappedRefs.push(ref);
  }
}

writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + "\n");

console.log("\n── Migration summary ──");
console.log(`Subjects uploaded: ${okCount} ok, ${failCount} failed`);
console.log(`Refs mapped: ${mappedRefs} / ${refs.length}`);
if (unmappedRefs.length) {
  console.log(`Unmapped refs (need manual review):`);
  unmappedRefs.forEach(r => console.log(`  ${r}`));
}
console.log(`Map written to: ${MAP_PATH}`);

if (failCount > 0 || unmappedRefs.length > 0) {
  process.exit(2);
}
