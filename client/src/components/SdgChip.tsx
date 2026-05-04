/**
 * SdgChip — small inline badge that pairs an SDG number swatch with an
 * accessible label. Used on service cards, post cards, and detail pages.
 *
 * The visible square uses --sdg-N straight from tokens.css; the text label
 * is rendered next to it (not inside) to guarantee readable contrast at
 * any background tint.
 */
import type { CSSProperties } from "react";

export type SdgNumber =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

interface Props {
  /** SDG number 1-17. Falls back to brand-red when undefined. */
  sdg?: SdgNumber | null;
  /** Optional short label (e.g. "Quality education"). */
  label?: string;
  size?: "sm" | "md";
  className?: string;
  style?: CSSProperties;
}

const SDG_LABEL_EN: Record<SdgNumber, string> = {
  1: "No poverty",
  2: "Zero hunger",
  3: "Good health",
  4: "Quality education",
  5: "Gender equality",
  6: "Clean water",
  7: "Affordable energy",
  8: "Decent work",
  9: "Industry & innovation",
  10: "Reduced inequalities",
  11: "Sustainable cities",
  12: "Responsible consumption",
  13: "Climate action",
  14: "Life below water",
  15: "Life on land",
  16: "Peace & justice",
  17: "Partnerships",
};

export function SdgChip({ sdg, label, size = "sm", className = "", style }: Props) {
  if (!sdg) return null;
  const swatchSize = size === "sm" ? 14 : 18;
  const fontSize = size === "sm" ? "0.75rem" : "0.875rem";
  const text = label ?? `SDG ${sdg} · ${SDG_LABEL_EN[sdg]}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ${className}`}
      style={{
        fontSize,
        backgroundColor: "color-mix(in srgb, var(--mist) 45%, transparent)",
        color: "var(--ink)",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: swatchSize,
          height: swatchSize,
          borderRadius: 3,
          backgroundColor: `var(--sdg-${sdg})`,
          flex: "0 0 auto",
        }}
      />
      <span className="font-medium">{text}</span>
    </span>
  );
}

export const SDG_LABEL_EN_MAP = SDG_LABEL_EN;
