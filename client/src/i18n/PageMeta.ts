/**
 * usePageMeta — sync per-page <title>, <meta name=description>, OG/Twitter tags.
 *
 * Per-page meta descriptions MUST be hand-written (rule #7). This hook
 * accepts already-localized strings — it never auto-generates copy.
 *
 * Also stamps a JSON-LD <script> for structured data so each page emits the
 * right schema.org payload (Organization on every page, Article on posts,
 * BreadcrumbList everywhere).
 */
import { useEffect } from "react";
import { SITE_ORIGIN } from "@/config/site";

export interface PageMetaInput {
  /** Final <title>. Will be suffixed with " · Comm.Inno" automatically. */
  title: string;
  /** Hand-written meta description (max ~160 chars). */
  description: string;
  /** Optional canonical path, e.g. "/about" — used to compute og:url. */
  path?: string;
  /** Optional structured-data payload(s) injected as application/ld+json. */
  jsonLd?: object | object[];
  /**
   * og:type. Defaults to "website"; article pages should pass "article".
   * Every page used to declare "website", including the 24 insight posts.
   */
  type?: "website" | "article";
  /**
   * Absolute or root-relative URL of the social card image. Defaults to the
   * site-wide card. Root-relative values are resolved against SITE_ORIGIN —
   * Open Graph requires an absolute URL, and a relative one silently yields
   * no image at all (audit finding 4.5).
   */
  image?: string;
}

const SUFFIX = " · Comm.Inno";

/**
 * Canonical/OG URLs are built from the configured public origin, never from
 * `window.location.origin`. Deriving them from the live location meant every
 * Vercel preview deployment self-canonicalised, so a preview URL could be
 * indexed as a competing copy of the real page (audit finding 3.1).
 */
const ORIGIN = SITE_ORIGIN;

/** Site-wide social card. 1200x630 PNG — see scripts/og/README.md. */
const DEFAULT_OG_IMAGE = `${ORIGIN}/og-image.png`;

const absolute = (url: string) =>
  /^https?:\/\//.test(url) ? url : `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;

const DATA_KEY = "data-comminno-meta";
const JSONLD_KEY = "data-comminno-jsonld";

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [tagPart, attrPart] = selector.split("[");
    el.setAttribute(attr, attrPart.replace(/[\]"]/g, "").split("=")[1]);
    el.setAttribute(DATA_KEY, "1");
    document.head.appendChild(el);
    void tagPart;
  }
  el.content = value;
}

function setProp(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", name);
    el.setAttribute(DATA_KEY, "1");
    document.head.appendChild(el);
  }
  el.content = content;
}

function setNameMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    el.setAttribute(DATA_KEY, "1");
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    el.setAttribute(DATA_KEY, "1");
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(payload: object | object[] | undefined) {
  // Wipe any prior JSON-LD added by us; static blocks (e.g. Organization in
  // index.html) without our marker stay untouched.
  document
    .querySelectorAll<HTMLScriptElement>(`script[${JSONLD_KEY}]`)
    .forEach((n) => n.remove());
  if (!payload) return;
  const items = Array.isArray(payload) ? payload : [payload];
  for (const item of items) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute(JSONLD_KEY, "1");
    s.text = JSON.stringify(item);
    document.head.appendChild(s);
  }
}

export function usePageMeta({
  title,
  description,
  path,
  jsonLd,
  type = "website",
  image,
}: PageMetaInput) {
  useEffect(() => {
    const fullTitle = title.includes("Comm.Inno") ? title : `${title}${SUFFIX}`;
    document.title = fullTitle;

    setNameMeta("description", description);

    setProp("og:type", type);
    setProp("og:site_name", "Comm.Inno");
    setProp("og:title", fullTitle);
    setProp("og:description", description);

    const card = image ? absolute(image) : DEFAULT_OG_IMAGE;
    setProp("og:image", card);
    setProp("og:image:alt", fullTitle);

    setNameMeta("twitter:card", "summary_large_image");
    setNameMeta("twitter:title", fullTitle);
    setNameMeta("twitter:description", description);
    setNameMeta("twitter:image", card);

    if (path) {
      const url = `${ORIGIN}${path}`;
      setProp("og:url", url);
      setCanonical(url);
    }

    setJsonLd(jsonLd);
  }, [title, description, path, jsonLd, type, image]);
}
