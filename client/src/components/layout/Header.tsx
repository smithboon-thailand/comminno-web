/**
 * Header — Comm.Inno
 *
 * Sticky top bar.
 *   • Left:   official logo (40px tall) → links to current-locale home
 *   • Center: five placeholder nav items (About / Services / Insights / Team / Contact).
 *             Real pages don't exist yet, so clicks emit a Sonner toast with localized
 *             "coming in next sprint" copy. The buttons remain keyboard-reachable
 *             with proper focus rings to satisfy WCAG.
 *   • Right:  EN/TH language switcher (segmented control). Persists via LocaleProvider.
 *   • Mobile: nav collapses behind a hamburger.
 *
 * Tokens come from index.css (--brand-paper, --ink, --brand-red, --mist).
 */

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { toast } from "sonner";
import { useLocale } from "@/i18n/LocaleProvider";
import { LocaleLink } from "@/i18n/LocaleLink";

const NAV_KEYS = [
  "nav.about",
  "nav.services",
  "nav.insights",
  "nav.team",
  "nav.contact",
] as const;

export function Header() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  // Close mobile menu when locale changes (since the page re-mounts the nav).
  useEffect(() => setOpen(false), [locale]);

  const onPlaceholderClick = () => {
    toast(t("nav.placeholder.toast"));
  };

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: "color-mix(in srgb, var(--brand-paper) 92%, transparent)",
        backdropFilter: "saturate(140%) blur(12px)",
        WebkitBackdropFilter: "saturate(140%) blur(12px)",
        borderBottom: "1px solid var(--mist)",
      }}
    >
      <div className="container flex h-16 items-center justify-between gap-2 md:gap-6">
        {/* Brand mark */}
        <LocaleLink
          href="/"
          aria-label={t("site.name")}
          className="inline-flex items-center"
        >
          <img
            src="/logo-official.svg"
            alt={t("site.name")}
            width={141}
            height={40}
            decoding="async"
            // Slightly smaller on phones so the right cluster (lang switch + menu)
            // never collides with the logo at 360-412px viewports.
            className="h-8 md:h-10 w-auto block"
          />
        </LocaleLink>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1"
        >
          {NAV_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={onPlaceholderClick}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
              style={{ color: "var(--ink)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--brand-red)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
            >
              <FormattedMessage id={key} />
            </button>
          ))}
        </nav>

        {/* Right cluster: lang switcher + mobile menu trigger */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} onChange={setLocale} />

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2"
            style={{ color: "var(--ink)" }}
            aria-label={t(open ? "nav.menu.close" : "nav.menu.open")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile primary"
          className="md:hidden"
          style={{ borderTop: "1px solid var(--mist)" }}
        >
          <ul className="container flex flex-col py-3">
            {NAV_KEYS.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onPlaceholderClick();
                  }}
                  className="w-full text-left rounded-md px-3 py-3 text-base font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  <FormattedMessage id={key} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

interface LocaleSwitcherProps {
  locale: "th" | "en";
  onChange: (next: "th" | "en") => void;
}

function LocaleSwitcher({ locale, onChange }: LocaleSwitcherProps) {
  const { t } = useLocale();
  return (
    <div
      role="group"
      aria-label={t("lang.switch.label")}
      className="inline-flex items-center rounded-full p-0.5"
      style={{ border: "1px solid var(--mist)", backgroundColor: "#fff" }}
    >
      {(['th', 'en'] as const).map((lang) => {
        const active = lang === locale;
        const fullName = lang === "th" ? t("lang.switch.toTH") : t("lang.switch.toEN");
        const short = lang === "th" ? t("lang.switch.shortTH") : t("lang.switch.shortEN");
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            aria-pressed={active}
            // Accessible name must include the visible text ("TH" / "EN")
            // to satisfy WCAG 2.5.3 Label in Name. We append the full language
            // name as a hidden suffix purely for screen readers.
            className="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: active ? "var(--brand-red)" : "transparent",
              color: active ? "#ffffff" : "var(--ink)",
              minWidth: 36,
            }}
          >
            {short}
            <span className="sr-only">&nbsp;{fullName}</span>
          </button>
        );
      })}
    </div>
  );
}
