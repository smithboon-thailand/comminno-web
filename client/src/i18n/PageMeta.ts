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

export interface PageMetaInput {
  /** Final <title>. Will be suffixed with " · Comm.Inno" automatically. */
  title: string;
  /** Hand-written meta description (max ~160 chars). */
  description: string;
  /** Optional canonical path, e.g. "/about" — used to compute og:url. */
  path?: string;
  /** Optional structured-data payload(s) injected as application/ld+json. */
  jsonLd?: object | object[];
}

const SUFFIX = " · Comm.Inno";
const SITE_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://comminno.example";

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

export function usePageMeta({ title, description, path, jsonLd }: PageMetaInput) {
  useEffect(() => {
    const fullTitle = title.includes("Comm.Inno") ? title : `${title}${SUFFIX}`;
    document.title = fullTitle;

    setNameMeta("description", description);

    setProp("og:type", "website");
    setProp("og:site_name", "Comm.Inno");
    setProp("og:title", fullTitle);
    setProp("og:description", description);

    setNameMeta("twitter:card", "summary_large_image");
    setNameMeta("twitter:title", fullTitle);
    setNameMeta("twitter:description", description);

    if (path) {
      const url = `${SITE_ORIGIN}${path}`;
      setProp("og:url", url);
      setCanonical(url);
    }

    setJsonLd(jsonLd);
  }, [title, description, path, jsonLd]);
}
