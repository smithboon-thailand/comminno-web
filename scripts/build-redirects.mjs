// scripts/build-redirects.mjs
// Reads client/src/content/redirects.ts and emits:
//   client/public/_redirects        (Netlify / Cloudflare Pages format)
//   client/public/redirects.json    (Vercel "redirects" array)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "client/src/content/redirects.ts");
const OUT_NETLIFY = resolve(ROOT, "client/public/_redirects");
const OUT_VERCEL = resolve(ROOT, "client/public/redirects.json");

const raw = readFileSync(SRC, "utf-8");
const re = /\{\s*"from":\s*"([^"]+)",\s*"to":\s*"([^"]+)"\s*\}/g;
const entries = [];
let m;
while ((m = re.exec(raw)) !== null) {
  entries.push({ from: m[1], to: m[2] });
}

// Netlify / Cloudflare Pages: "from to status"
const netlifyLines = entries.map((e) => `${e.from}\t${e.to}\t301`);
writeFileSync(OUT_NETLIFY, netlifyLines.join("\n") + "\n", "utf-8");

// Vercel: { redirects: [ { source, destination, permanent: true } ] }
const vercelObj = {
  redirects: entries.map((e) => ({
    source: e.from,
    destination: e.to,
    permanent: true,
  })),
};
writeFileSync(OUT_VERCEL, JSON.stringify(vercelObj, null, 2) + "\n", "utf-8");

console.log(`Wrote ${entries.length} redirects to:`);
console.log(`  ${OUT_NETLIFY}`);
console.log(`  ${OUT_VERCEL}`);
