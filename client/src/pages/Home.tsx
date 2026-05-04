/**
 * Home — Comm.Inno (MVP Task 1)
 *
 * The first and only page in this MVP. Two responsibilities:
 *   1. Prove the brand system loads (DM Serif Display + Inter / IBM Plex Sans Thai
 *      Looped + tokens.css colors).
 *   2. Communicate the center's tagline & invite the visitor to two follow-ups
 *      (placeholder CTAs that will hook into Services / Contact in Phase 2).
 *
 * Layout philosophy (per BRAND_BOOK §2): asymmetric, calm whitespace, brand-red
 * as the only saturated colour above the fold so the eye anchors on the headline.
 */

import { ArrowRight } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { toast } from "sonner";
import { useLocale } from "@/i18n/LocaleProvider";

const SWATCHES = [
  { token: "--brand-yellow", hex: "#F1A61D", labelId: "tokens.brand.yellow", textOn: "var(--ink)" },
  { token: "--brand-red",    hex: "#BD212D", labelId: "tokens.brand.red",    textOn: "#ffffff" },
  { token: "--brand-blue",   hex: "#279ED6", labelId: "tokens.brand.blue",   textOn: "#ffffff" },
  { token: "--brand-green",  hex: "#8DC63F", labelId: "tokens.brand.green",  textOn: "var(--ink)" },
] as const;

export default function Home() {
  const { t, locale } = useLocale();

  const announceComingSoon = () => toast(t("nav.placeholder.toast"));

  return (
    <>
      {/* ─────────────────────────  HERO  ───────────────────────── */}
      <section
        aria-labelledby="hero-headline"
        className="relative overflow-hidden"
        style={{
          // Subtle gradient + grain to give depth without competing with the headline.
          background:
            "radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--brand-blue) 10%, transparent) 0%, transparent 60%), radial-gradient(120% 80% at 0% 100%, color-mix(in srgb, var(--brand-yellow) 10%, transparent) 0%, transparent 55%), var(--brand-paper)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(var(--ink) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <div className="container relative pt-16 md:pt-24 pb-20 md:pb-28">
          {/* Eyebrow — brand red, uppercase, tight tracking. */}
          <div
            className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] mb-6"
            style={{ color: "var(--brand-red)" }}
          >
            <FormattedMessage id="hero.eyebrow" />
          </div>

          {/* Headline — DM Serif Display. Sentence case (per writing rules §2.3). */}
          <h1
            id="hero-headline"
            className="font-display max-w-[18ch] md:max-w-[20ch]"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(40px, 7vw, 84px)",
              lineHeight: locale === "th" ? 1.2 : 1.05,
            }}
          >
            <FormattedMessage id="hero.headline" />
          </h1>

          {/* Lede paragraph */}
          <p
            className="mt-6 max-w-2xl text-base md:text-lg"
            style={{
              color: "var(--slate)",
              lineHeight: locale === "th" ? "var(--leading-thai)" : "var(--leading-relaxed)",
            }}
          >
            <FormattedMessage id="hero.lede" />
          </p>

          {/* CTAs — primary brand-red filled, secondary brand-red outlined. */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={announceComingSoon}
              className="group inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-transform"
              style={{
                backgroundColor: "var(--brand-red)",
                color: "#ffffff",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.4) inset, 0 6px 18px -6px rgba(189,33,45,0.55)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--brand-red-700)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--brand-red)")
              }
            >
              <FormattedMessage id="hero.cta.primary" />
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>

            <button
              type="button"
              onClick={announceComingSoon}
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--brand-red)",
                border: "1.5px solid var(--brand-red)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--brand-red)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--brand-red)";
              }}
            >
              <FormattedMessage id="hero.cta.secondary" />
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────  BRAND TOKEN VERIFICATION STRIP  ─────────────── */}
      <section
        aria-labelledby="tokens-heading"
        className="container pb-20 md:pb-28"
      >
        <div className="max-w-2xl">
          <h2
            id="tokens-heading"
            className="text-2xl md:text-3xl font-semibold"
            style={{ color: "var(--ink)" }}
          >
            <FormattedMessage id="tokens.heading" />
          </h2>
          <p
            className="mt-3 text-sm md:text-base"
            style={{ color: "var(--slate)" }}
          >
            <FormattedMessage id="tokens.lede" />
          </p>
        </div>

        <ul
          role="list"
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SWATCHES.map((s) => (
            <li
              key={s.token}
              className="rounded-lg overflow-hidden"
              style={{
                border: "1px solid var(--mist)",
                backgroundColor: "#fff",
              }}
            >
              <div
                className="h-28 md:h-36"
                style={{ backgroundColor: `var(${s.token})` }}
                aria-hidden
              />
              <div className="p-4">
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--ink)" }}
                >
                  <FormattedMessage id={s.labelId} />
                </div>
                <div
                  className="font-mono text-[11px] uppercase"
                  style={{ color: "var(--slate)" }}
                >
                  {s.token} · {s.hex}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
