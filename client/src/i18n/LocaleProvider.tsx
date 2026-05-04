/**
 * LocaleProvider — Comm.Inno
 *
 * Responsibilities:
 *   1. Read the active locale from the URL (/th/* or /en/*). The URL is the source of truth.
 *   2. On first visit (path = "/"), pick the locale in this order:
 *        a. cookie  `NEXT_LOCALE` (named after Next.js convention so future migration is trivial)
 *        b. localStorage `comminno.locale`
 *        c. navigator.language starts with "en" → en, else th (default)
 *      …then redirect to /<locale>.
 *   3. Persist any active locale to BOTH cookie + localStorage so reloads remember it.
 *   4. Provide `useLocale()` returning { locale, setLocale, t, otherLocale }.
 *   5. Keep <html lang> and <html dir> in sync with the active locale.
 *   6. Wrap children in `<IntlProvider>` so any descendant can use <FormattedMessage/>.
 */

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { IntlProvider } from "react-intl";
import { useLocation } from "wouter";
import {
  DEFAULT_LOCALE,
  type Locale,
  type Messages,
  SUPPORTED_LOCALES,
  localeTag,
  messages,
  metaDescription,
} from "./messages";

const COOKIE_NAME = "NEXT_LOCALE";
const STORAGE_KEY = "comminno.locale";
const COOKIE_MAX_AGE_DAYS = 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function writeCookie(name: string, value: string, days = COOKIE_MAX_AGE_DAYS) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Pick the best locale on first visit (no /th or /en prefix yet). */
function detectInitialLocale(): Locale {
  const fromCookie = readCookie(COOKIE_NAME);
  if (isLocale(fromCookie)) return fromCookie;

  if (typeof window !== "undefined") {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(fromStorage)) return fromStorage;

    const navLang = navigator.language?.toLowerCase() ?? "";
    if (navLang.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}

/** Extract /th or /en prefix from a Wouter path. Returns `null` if no locale segment. */
export function extractLocaleFromPath(path: string): Locale | null {
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  return isLocale(first) ? first : null;
}

/** Replace (or insert) the locale segment in a path. */
export function withLocale(path: string, locale: Locale): string {
  const segments = path.split("/").filter(Boolean);
  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }
  return "/" + segments.join("/");
}

/** Strip the locale prefix — useful for switching language while keeping the page. */
export function stripLocale(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  return "/" + segments.join("/");
}

interface LocaleContextValue {
  locale: Locale;
  otherLocale: Locale;
  setLocale: (next: Locale) => void;
  /** Build a locale-prefixed URL for use in <Link>/<a> tags. */
  href: (path: string) => string;
  /** Plain-string lookup (use FormattedMessage when possible — this is for attrs only). */
  t: (id: keyof Messages | string, fallback?: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: ProviderProps) {
  const [path, navigate] = useLocation();

  // Resolve active locale: URL wins, otherwise detect & redirect.
  const urlLocale = extractLocaleFromPath(path);
  const activeLocale: Locale = urlLocale ?? detectInitialLocale();

  // Side effects when locale or path changes.
  useEffect(() => {
    // 1. Sync <html lang> and <html dir>.
    document.documentElement.lang = activeLocale;
    document.documentElement.dir = "ltr"; // Both TH and EN are LTR.

    // 2. Sync per-page meta description (manually written, never generated).
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = metaDescription[activeLocale];

    // 3. Persist for next visit.
    writeCookie(COOKIE_NAME, activeLocale);
    try {
      window.localStorage.setItem(STORAGE_KEY, activeLocale);
    } catch {
      /* private mode → ignore */
    }
  }, [activeLocale]);

  // If the user landed on `/` (no locale prefix), redirect to the resolved locale.
  useEffect(() => {
    if (urlLocale === null) {
      const target = withLocale(path === "/" ? "" : path, activeLocale);
      navigate(target, { replace: true });
    }
  }, [urlLocale, path, activeLocale, navigate]);

  const setLocale = useCallback(
    (next: Locale) => {
      writeCookie(COOKIE_NAME, next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      navigate(withLocale(path, next));
    },
    [navigate, path]
  );

  const href = useCallback(
    (target: string) => withLocale(target, activeLocale),
    [activeLocale]
  );

  const t = useCallback<LocaleContextValue["t"]>(
    (id, fallback) => {
      const dict = messages[activeLocale] as Messages;
      return dict[id as string] ?? fallback ?? (id as string);
    },
    [activeLocale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: activeLocale,
      otherLocale: activeLocale === "th" ? "en" : "th",
      setLocale,
      href,
      t,
    }),
    [activeLocale, setLocale, href, t]
  );

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider
        locale={localeTag[activeLocale]}
        defaultLocale={localeTag[DEFAULT_LOCALE]}
        messages={messages[activeLocale]}
        // Suppress noisy console warnings when a key is rendered before
        // hot-reloading picks up new strings during development.
        onError={() => {}}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside <LocaleProvider />");
  }
  return ctx;
}
