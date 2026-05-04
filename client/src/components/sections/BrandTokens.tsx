/**
 * BrandTokens — below-the-fold proof-of-tokens block.
 *
 * Renders the four primary brand colors straight from `tokens.css` so we can
 * visually confirm the design system is wired (yellow #F1A61D, red #BD212D,
 * blue #279ED6, green #8DC63F). Code-split out of Home.tsx so it doesn't
 * block FCP/LCP for the hero.
 */

import { FormattedMessage } from "react-intl";

const SWATCHES = [
  { token: "--brand-yellow", hex: "#F1A61D", labelId: "tokens.brand.yellow" },
  { token: "--brand-red",    hex: "#BD212D", labelId: "tokens.brand.red" },
  { token: "--brand-blue",   hex: "#279ED6", labelId: "tokens.brand.blue" },
  { token: "--brand-green",  hex: "#8DC63F", labelId: "tokens.brand.green" },
] as const;

export function BrandTokens() {
  return (
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

      <ul role="list" className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
}
