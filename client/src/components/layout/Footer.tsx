/**
 * Footer — Comm.Inno
 *
 * Holds the secondary lockup of the brand:
 *   • Smaller logo (height 32px) linking to the locale home.
 *   • Mongkut Sammitr / Faculty of Communication Arts address (TH/EN).
 *   • Copyright with current year, "all rights reserved" line.
 *   • Discreet note that this site replaces the legacy cominnocenter.com.
 *
 * No social links yet — those arrive once Phase 2 publishes real channels.
 */

import { FormattedMessage } from "react-intl";
import { useLocale } from "@/i18n/LocaleProvider";
import { LocaleLink } from "@/i18n/LocaleLink";
import { openCookieSettings } from "@/components/consent/CookieConsentProvider";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="mt-24"
      style={{
        borderTop: "1px solid var(--mist)",
        backgroundColor: "var(--brand-cream)",
        color: "var(--ink)",
      }}
    >
      <div className="container py-12 md:py-16 grid gap-8 md:grid-cols-12">
        {/* Brand block */}
        <div className="md:col-span-5">
          <LocaleLink
            href="/"
            aria-label={t("site.name")}
            className="inline-flex items-center"
          >
            <img
              src="/logo-official.svg"
              alt={t("site.name")}
              width={113}
              height={32}
              loading="lazy"
              decoding="async"
              style={{ height: 32, width: "auto", display: "block" }}
            />
          </LocaleLink>

          <p className="mt-5 max-w-md text-sm" style={{ color: "var(--slate)" }}>
            <FormattedMessage id="site.tagline" />
          </p>
        </div>

        {/* Address */}
        <address
          className="md:col-span-5 not-italic text-sm leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          <div className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
            <FormattedMessage id="site.name" />
          </div>
          <div><FormattedMessage id="footer.address.line1" /></div>
          <div><FormattedMessage id="footer.address.line2" /></div>
          <div><FormattedMessage id="footer.address.line3" /></div>
        </address>

        {/* Spacer to balance grid */}
        <div className="hidden md:block md:col-span-2" aria-hidden />
      </div>

      <div
        className="container py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--ink) 8%, transparent)",
          color: "var(--slate)",
        }}
      >
        <div>
          <FormattedMessage
            id="footer.copyright"
            values={{ year }}
          />
        </div>
        <nav
          aria-label={t("footer.utility.label")}
          className="flex flex-wrap items-center gap-x-5 gap-y-1"
        >
          <LocaleLink
            href="/privacy"
            className="hover:underline"
            style={{ color: "var(--slate)" }}
          >
            <FormattedMessage id="footer.privacy" />
          </LocaleLink>
          <button
            type="button"
            onClick={openCookieSettings}
            className="hover:underline"
            style={{
              color: "var(--slate)",
              background: "none",
              border: 0,
              padding: 0,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            <FormattedMessage id="footer.cookieSettings" />
          </button>
          <span><FormattedMessage id="footer.legacy" /></span>
        </nav>
      </div>
    </footer>
  );
}
