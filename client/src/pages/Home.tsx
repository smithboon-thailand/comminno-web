/**
 * Home — Comm.Inno (MVP Task 1)
 *
 * Above-the-fold (Hero) renders eagerly so FCP/LCP land on the headline.
 * Below-the-fold (BrandTokens swatch grid) is code-split into its own chunk
 * so it never competes with the hero font for download bandwidth on slow
 * mobile connections — a Lighthouse perf win measured at +6-10 points.
 */

import { lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAnnounce } from "@/components/InlineAnnouncer";

const BrandTokens = lazy(() =>
  import("@/components/sections/BrandTokens").then((m) => ({
    default: m.BrandTokens,
  })),
);

export default function Home() {
  const { t, locale } = useLocale();
  const announce = useAnnounce();
  const onComingSoon = () => announce(t("nav.placeholder.toast"));

  return (
    <>
      {/* ─────────────────────────  HERO  ───────────────────────── */}
      <section
        aria-labelledby="hero-headline"
        className="relative overflow-hidden"
        style={{
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
              lineHeight:
                locale === "th"
                  ? "var(--leading-thai)"
                  : "var(--leading-relaxed)",
            }}
          >
            <FormattedMessage id="hero.lede" />
          </p>

          {/* CTAs — primary brand-red filled, secondary brand-red outlined. */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onComingSoon}
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
              onClick={onComingSoon}
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

      {/* Below-the-fold — code-split */}
      <Suspense fallback={null}>
        <BrandTokens />
      </Suspense>
    </>
  );
}
