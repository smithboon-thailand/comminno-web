// scripts/site-origin.mjs
// Build-time twin of client/src/config/site.ts. See that file for why this
// exists (audit finding 3.1). Override with the SITE_ORIGIN env var; the
// legacy SITE_DOMAIN name is still honoured so older invocations keep working.
export const SITE_ORIGIN = (
  process.env.SITE_ORIGIN ||
  process.env.SITE_DOMAIN ||
  "https://comminno-web.vercel.app"
).replace(/\/+$/, "");

export const SITE_HOSTNAME = SITE_ORIGIN.replace(/^https?:\/\//, "");
