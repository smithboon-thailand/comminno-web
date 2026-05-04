#!/usr/bin/env node
/**
 * build-content.mjs — Comm.Inno content pipeline
 *
 * Parses markdown sources from /home/ubuntu/comminno_assets/content/
 * and emits typed TS modules under client/src/content/.
 *
 * Run: pnpm content
 *
 * Inputs:
 *   - content/pages/post-*.md           (24 posts, EN-only in source)
 *   - content/pages/about.md            (mission + 3 faculty bios)
 *   - content/pages/about__teerada-ne.md
 *   - content/pages/insights__categories__*.md (12 category titles)
 *   - content/data/all_pages.json       (titles, og_description, og_image, visible_clean)
 *   - content/data/all_urls.txt         (43 URLs for redirects.json)
 *
 * Outputs (under client/src/content/):
 *   - posts.ts        — 24 entries
 *   - categories.ts   — 12 entries (display titles + slugs)
 *   - services.ts     — 9 entries (subset of categories that the brief calls "services")
 *   - about.ts        — mission, 3 faculty bios, wider team list
 *   - redirects.ts    — old Wix URL → new path map
 *
 * The script is idempotent and deterministic — re-running it overwrites the TS files.
 * No external runtime deps (uses Node built-ins only).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = "/home/ubuntu/comminno_assets/content";
const PAGES = join(SRC, "pages");
const DATA = join(SRC, "data");
const OUT = join(ROOT, "client/src/content");

mkdirSync(OUT, { recursive: true });

// ─────────────────────────────────────────────────────────────────────────────
// Slug normalization (brief vs source spelling differences)
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_SLUG_REWRITE = {
  // brief uses "and" — source omitted it
  "book-printing": "book-and-printing",
  "research-evaluation": "research-and-evaluation",
};

const normalizeCategorySlug = (raw) => CATEGORY_SLUG_REWRITE[raw] ?? raw;

const CATEGORY_LABEL_TO_SLUG = {
  "Book & Printing": "book-and-printing",
  "Campaign Manage": "campaign-manage",
  "Communication Design": "communication-design",
  Highlights: "highlights",
  "Innovation & Technology": "innovation-technology",
  "Marketing Event": "marketing-event",
  "Motion Effect & AR": "motion-effect-ar",
  "Research & Evaluation": "research-and-evaluation",
  Education: "school",
  School: "school",
  Seminar: "seminar",
  Training: "training",
  "Video Production": "video-production",
};

// The 9 categories the brief calls "services" (vs. 3 left over for /insights filters)
const SERVICE_SLUGS = new Set([
  "book-and-printing",
  "campaign-manage",
  "communication-design",
  "marketing-event",
  "motion-effect-ar",
  "research-and-evaluation",
  "seminar",
  "training",
  "video-production",
]);

// SDG color tag per service (from brand_book/tokens.css — 17 SDG colors).
// These are PROVISIONAL — services_copy.md will override when zip arrives.
// I'm using sensible thematic guesses so the badge renders meaningfully.
const SERVICE_SDG = {
  "book-and-printing": 4, // Quality Education
  "campaign-manage": 17, // Partnerships
  "communication-design": 9, // Industry, Innovation, Infrastructure
  "marketing-event": 8, // Decent Work and Economic Growth
  "motion-effect-ar": 9, // Industry, Innovation, Infrastructure
  "research-and-evaluation": 4, // Quality Education
  seminar: 4, // Quality Education
  training: 4, // Quality Education
  "video-production": 16, // Peace, Justice and Strong Institutions
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const FIX_BOONCHOTIMA = (s) =>
  // Non-negotiable rule #6: always render Smith's surname as "Boonchutima".
  s.replace(/Boonchotima/g, "Boonchutima");

const tsString = (s) => JSON.stringify(s ?? null);

const writeTS = (file, content) => {
  writeFileSync(join(OUT, file), content + "\n", "utf8");
  console.log(`  ✓ ${file}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Parse posts (24)
// ─────────────────────────────────────────────────────────────────────────────
const allPagesData = JSON.parse(readFileSync(join(DATA, "all_pages.json"), "utf8"));

function parsePost(path) {
  const raw = readFileSync(path, "utf8");
  const filename = path.split("/").pop();
  // file is `post-<slug>.md` (or `post-__itd.md` for the leading-underscore case)
  let slug = filename.replace(/^post-/, "").replace(/\.md$/, "");
  slug = slug.replace(/^_+/, "");

  const titleMatch = raw.match(/^# (.+)$/m);
  const title = FIX_BOONCHOTIMA(titleMatch?.[1]?.trim() ?? slug);

  // Body = lines between "## เนื้อหา" and "## รูปภาพ"
  const bodyMatch = raw.match(/## เนื้อหา\s*\n([\s\S]*?)(?=\n## รูปภาพ|\n## |$)/);
  let bodyLines = (bodyMatch?.[1] ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // The trailing lines that match a known category label = the post's tags.
  const tags = [];
  while (bodyLines.length && CATEGORY_LABEL_TO_SLUG[bodyLines[bodyLines.length - 1]]) {
    tags.unshift(CATEGORY_LABEL_TO_SLUG[bodyLines.pop()]);
  }

  // Strip the redundant header lines that scrape included
  // (title, "comm.inno"/"comminno", date, "1 min read", "Updated:", date)
  const META_LINES_RE = /^(comm\.?inno|comminno|\d{1,2} min read|Updated:|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4})$/i;
  // Drop the first line if it duplicates the title
  if (bodyLines[0] && bodyLines[0].toLowerCase() === title.toLowerCase().replace(/[*]/g, "")) {
    bodyLines.shift();
  }
  // Drop following meta lines
  while (bodyLines.length && META_LINES_RE.test(bodyLines[0])) {
    bodyLines.shift();
  }

  // Strip the legacy "(สำหรับเนื้อหาภาษาไทย กรุณาเลื่อนลงด้านล่าง)" prefix that the
  // old Wix posts used to redirect Thai readers — meaningless on the new bilingual site.
  const stripThaiNotice = (s) => s.replace(/\(สำหรับเนื้อหาภาษาไทย[^)]*\)\s*/g, "");
  const body = stripThaiNotice(bodyLines.join("\n\n"));

  // Date: pull first occurrence anywhere in raw
  const dateMatch = raw.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}/);
  const dateRaw = dateMatch?.[0] ?? null;
  const date = dateRaw ? new Date(dateRaw + " UTC").toISOString().slice(0, 10) : null;

  // OG description from all_pages.json (richer than the markdown's first line)
  const allPagesKey = `post__${slug}.html`;
  const allPagesKeyAlt1 = `post____${slug}.html`;
  const allPagesEntry = allPagesData[allPagesKey] || allPagesData[allPagesKeyAlt1];
  const ogDescription = FIX_BOONCHOTIMA(stripThaiNotice(allPagesEntry?.og_description?.trim() ?? ""));

  // Cover filename (from og_image)
  const ogImage = allPagesEntry?.og_image ?? "";
  const coverMatch = ogImage.match(/(25218b_[a-f0-9]+(?:~|%7E)mv2\.[a-z]+)/);
  const coverFilename = coverMatch ? coverMatch[1].replace(/~|%7E/, "-") : null;

  // Summary = first sentence of og_description, or first body sentence
  const summarySrc = ogDescription || body;
  const summary = (summarySrc.split(/(?<=[.!?])\s+/)[0] || "").slice(0, 200);

  return {
    slug,
    title,
    summary,
    body,
    date,
    tags,
    coverFilename,
    ogDescription,
  };
}

const postFiles = readdirSync(PAGES).filter((f) => f.startsWith("post-"));
const posts = postFiles
  .map((f) => parsePost(join(PAGES, f)))
  .sort((a, b) => (b.date || "0").localeCompare(a.date || "0"));

console.log(`Parsed ${posts.length} posts.`);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Parse categories (12)
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_TH = {
  "book-and-printing": "หนังสือและสิ่งพิมพ์",
  "campaign-manage": "บริหารแคมเปญ",
  "communication-design": "ออกแบบการสื่อสาร",
  highlights: "ไฮไลต์",
  "innovation-technology": "นวัตกรรมและเทคโนโลยี",
  "marketing-event": "อีเวนต์การตลาด",
  "motion-effect-ar": "Motion Effect และ AR",
  "research-and-evaluation": "วิจัยและประเมินผล",
  school: "การศึกษา",
  seminar: "สัมมนา",
  training: "ฝึกอบรม",
  "video-production": "งานวิดีโอ",
};

const categories = Array.from(
  new Set(Object.values(CATEGORY_LABEL_TO_SLUG))
).map((slug) => ({
  slug,
  titleEn: Object.keys(CATEGORY_LABEL_TO_SLUG).find(
    (k) => CATEGORY_LABEL_TO_SLUG[k] === slug
  ),
  titleTh: CATEGORY_TH[slug] ?? null,
  isService: SERVICE_SLUGS.has(slug),
}));

// ─────────────────────────────────────────────────────────────────────────────
// 3. Build the 9 services as shells (canonical copy will splice in from
//    services_copy.md — until then, fields are null and pages render with a
//    "Copy pending" inline label).
// ─────────────────────────────────────────────────────────────────────────────
const services = categories
  .filter((c) => c.isService)
  .map((c) => ({
    slug: c.slug,
    titleEn: c.titleEn,
    titleTh: c.titleTh,
    sdgNumber: SERVICE_SDG[c.slug] ?? null,
    // Canonical fields — populated by splice-services-copy.mjs when zip lands.
    descriptionEn: null,
    descriptionTh: null,
    deliverablesEn: null,
    deliverablesTh: null,
    audienceEn: null,
    audienceTh: null,
  }));

// ─────────────────────────────────────────────────────────────────────────────
// 4. Parse /about (mission + 3 faculty bios + wider team)
// ─────────────────────────────────────────────────────────────────────────────
const aboutRaw = FIX_BOONCHOTIMA(readFileSync(join(PAGES, "about.md"), "utf8"));

// Mission paragraph: between "## พันธกิจ" and "## พื้นที่ดำเนินงานหลัก 3 ด้าน"
const missionMatch = aboutRaw.match(/## พันธกิจ\s*\n([\s\S]*?)(?=\n##)/);
const missionEn = missionMatch?.[1]?.trim() ?? "";

// Three pillars (numbered list)
const pillarsMatch = aboutRaw.match(
  /## พื้นที่ดำเนินงานหลัก 3 ด้าน\s*\n([\s\S]*?)(?=\n##)/
);
const pillarsEn = (pillarsMatch?.[1]?.trim() ?? "")
  .split("\n")
  .filter((l) => l.match(/^\d+\./))
  .map((l) => l.replace(/^\d+\.\s*/, ""));

// Faculty bios
const facultyMatch = aboutRaw.match(/## บุคลากรหลัก\s*\n([\s\S]*?)$/);
const facultyBlock = facultyMatch?.[1] ?? "";
const facultySections = facultyBlock.split(/^### \d+\. /m).slice(1);

const faculty = facultySections.map((sec) => {
  const lines = sec.split("\n").map((l) => l.trim());
  // First line: "Assoc. Prof. Dr. Smith Boonchutima — *Head of Research Operations Unit*"
  const headerLine = lines[0] || "";
  const [namePart, rolePart] = headerLine.split(" — ");
  const name = (namePart || "").replace(/\s*—\s*$/, "").trim();
  const role = (rolePart || "").replace(/[*_]/g, "").trim();

  // Education: lines under "**การศึกษา:**" until next "**" or end
  const eduMatch = sec.match(/\*\*การศึกษา:\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n>|\n###|$)/);
  const education = (eduMatch?.[1] ?? "")
    .split("\n")
    .filter((l) => l.trim().startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").trim());

  // Position
  const posMatch = sec.match(/\*\*ตำแหน่ง:\*\*\s*([^\n]+)/);
  const position = posMatch?.[1]?.trim() ?? null;

  // Slug: last token of name lower-cased (smith / teerada / pavel)
  const firstName = name.replace(/^(Assoc\.?|Asst\.?|Prof\.?|Dr\.?|\.|\s)+/g, "").split(" ")[0];
  const slug = firstName.toLowerCase().replace(/[^a-z]/g, "");

  return { slug, name, role, position, education };
});

// Per the user's note: Pavel's role is a copy-paste error in source; correct it.
const PAVEL_FIX = "Faculty researcher · Department of Public Relations"; // pending confirmation
const pavelIndex = faculty.findIndex((f) => f.slug === "pavel");
if (pavelIndex >= 0) {
  faculty[pavelIndex].role = PAVEL_FIX;
  faculty[pavelIndex]._note = "Title pending confirmation from the center";
}

// Wider team — pull names from all_pages.json visible_clean (about.html)
// Heuristic: lines that look like proper names appearing under the "Meet Our Team" anchor.
const aboutVisible = (allPagesData["about.html"]?.visible_clean ?? []).map((s) => s.trim());
const teamStart = aboutVisible.findIndex((l) => l === "Meet Our Team");
let widerTeam = [];
if (teamStart >= 0) {
  const after = aboutVisible.slice(teamStart + 1);
  // Stop at the next H2-style heading we hit
  const stopAt = after.findIndex((l) => /^Our Management Team|DOWNLOAD LOGO$/.test(l));
  const slice = stopAt >= 0 ? after.slice(0, stopAt) : after;
  // Keep lines that look like names (Title Case, no punctuation, not roles)
  const ROLE_RE = /^(Researcher|Research Assistant|Multimedia Designer|Permanent.*|Assoc\..*|Dr\.\s*$)/i;
  for (const l of slice) {
    if (!l || ROLE_RE.test(l)) continue;
    if (l.length < 3 || l.length > 60) continue;
    if (!/[A-Z][a-z]/.test(l)) continue;
    if (l.includes(",") || l.includes(".")) continue;
    widerTeam.push(l);
  }
  widerTeam = Array.from(new Set(widerTeam));
  // Filter out the three Heads (already shown above)
  const headFirstNames = ["Smith", "Teerada", "Pavel"];
  widerTeam = widerTeam.filter(
    (n) => !headFirstNames.some((fn) => n.includes(fn))
  );
  widerTeam.sort();
}

const about = {
  missionEn,
  pillarsEn,
  faculty,
  widerTeam,
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. redirects (43 old Wix URLs → new paths)
// ─────────────────────────────────────────────────────────────────────────────
const allUrls = readFileSync(join(DATA, "all_urls.txt"), "utf8")
  .split("\n")
  .map((u) => u.trim())
  .filter(Boolean)
  .map((u) => new URL(u).pathname.replace(/\/$/, "") || "/");

const redirectFor = (oldPath) => {
  if (oldPath === "/") return "/"; // homepage stays
  if (oldPath === "/about") return "/about";
  if (oldPath === "/about/teerada-ne") return "/about#teerada";
  if (oldPath === "/blank") return "/about#smith"; // /blank was actually Smith's bio
  if (oldPath === "/contact") return "/contact";
  if (oldPath === "/insights") return "/insights";
  if (oldPath === "/privacy-policy") return "/privacy";
  if (oldPath.startsWith("/insights/categories/")) {
    const raw = oldPath.split("/").pop();
    const slug = normalizeCategorySlug(raw);
    if (SERVICE_SLUGS.has(slug)) return `/services/${slug}`;
    return `/insights?category=${slug}`;
  }
  if (oldPath.startsWith("/post/")) {
    let slug = oldPath.split("/").pop();
    slug = slug.replace(/^_+/, ""); // /post/__itd → itd
    // Boonchotima → Boonchutima in the new slug only when it's the misspelled form
    const corrected = slug.replace(/boonchotima/g, "boonchutima");
    return `/insights/${corrected}`;
  }
  return null;
};

const redirects = allUrls
  .map((from) => ({ from, to: redirectFor(from) }))
  .filter((r) => r.to && r.from !== r.to);

// ─────────────────────────────────────────────────────────────────────────────
// Emit TypeScript modules
// ─────────────────────────────────────────────────────────────────────────────
console.log("\nEmitting TS modules:");

writeTS(
  "types.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.

export type Locale = "th" | "en";

/** Post metadata (no body) — safe to import on every page. */
export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  /** ISO date YYYY-MM-DD, or null if source was missing it. */
  date: string | null;
  /** Category slugs from the original Wix taxonomy. */
  tags: string[];
  /** Original Wix-side image filename (binaries arrive in comminno_images.zip). */
  coverFilename: string | null;
  /** Long-form OG description from the original site, sentence-cased. */
  ogDescription: string;
}

/** Full post = metadata + body. Import only on InsightDetail. */
export interface Post extends PostMeta {
  body: string;
}

export interface Category {
  slug: string;
  titleEn: string;
  titleTh: string | null;
  isService: boolean;
}

export interface Service {
  slug: string;
  titleEn: string;
  titleTh: string | null;
  /** UN SDG goal number (1-17) — matches --sdg-{n} in tokens.css. */
  sdgNumber: number | null;
  /** Canonical body copy — null until services_copy.md is spliced in. */
  descriptionEn: string | null;
  descriptionTh: string | null;
  deliverablesEn: string[] | null;
  deliverablesTh: string[] | null;
  audienceEn: string | null;
  audienceTh: string | null;
}

export interface FacultyMember {
  slug: string;
  name: string;
  role: string;
  position: string | null;
  education: string[];
  _note?: string;
}

export interface About {
  missionEn: string;
  pillarsEn: string[];
  faculty: FacultyMember[];
  widerTeam: string[];
}

export interface Redirect {
  /** Wix path (e.g. "/post/chula-zero-waste"). */
  from: string;
  /** New path (e.g. "/insights/chula-zero-waste"). */
  to: string;
}
`
);

// Split metadata from bodies so the home/insights index don't pull body text.
const postsMeta = posts.map(({ body, ...rest }) => rest);
const postBodies = Object.fromEntries(posts.map((p) => [p.slug, p.body]));

writeTS(
  "posts.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
// Lightweight post metadata (no body) — safe to import on every page.
import type { PostMeta } from "./types";

export const posts: readonly PostMeta[] = ${JSON.stringify(postsMeta, null, 2)} as const;

export const postsBySlug = new Map<string, PostMeta>(
  posts.map((p) => [p.slug, p])
);
`
);

writeTS(
  "post-bodies.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
// Long-form post bodies, separated from metadata so non-detail pages don't pay
// the parse cost. Import only from InsightDetail.
export const postBodies: Record<string, string> = ${JSON.stringify(postBodies, null, 2)};
`
);

writeTS(
  "categories.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
import type { Category } from "./types";

export const categories: readonly Category[] = ${JSON.stringify(
    categories,
    null,
    2
  )} as const;

export const categoriesBySlug = new Map<string, Category>(
  categories.map((c) => [c.slug, c])
);
`
);

writeTS(
  "services.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
//
// Canonical body copy (descriptionEn/Th, deliverables*, audience*) will be
// spliced in by scripts/splice-services-copy.mjs once services_copy.md
// arrives in /home/ubuntu/projects/comminno-a8270f37/.
//
import type { Service } from "./types";

export const services: readonly Service[] = ${JSON.stringify(
    services,
    null,
    2
  )} as const;

export const servicesBySlug = new Map<string, Service>(
  services.map((s) => [s.slug, s])
);
`
);

writeTS(
  "about.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
import type { About } from "./types";

export const about: About = ${JSON.stringify(about, null, 2)};
`
);

writeTS(
  "redirects.ts",
  `// AUTO-GENERATED by scripts/build-content.mjs — do not edit by hand.
import type { Redirect } from "./types";

export const redirects: readonly Redirect[] = ${JSON.stringify(
    redirects,
    null,
    2
  )} as const;
`
);

// Also emit a vercel.json-format mapping for deploy targets.
const vercelRedirects = {
  redirects: redirects.map(({ from, to }) => ({
    source: from,
    destination: to,
    permanent: true,
  })),
};
writeFileSync(
  join(ROOT, "redirects.json"),
  JSON.stringify(vercelRedirects, null, 2) + "\n",
  "utf8"
);
console.log(`  ✓ ../redirects.json (Vercel format, ${redirects.length} entries)`);

console.log("\nDone.");
