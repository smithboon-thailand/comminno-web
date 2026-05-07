/**
 * Cloudinary URL helpers.
 *
 * Source-of-truth URLs in /content/*.yml use the minimal transform
 * `f_auto,q_auto` (auto-format + auto-quality). For LCP-critical
 * responsive images we need to inject a width transform per render
 * size so Cloudinary serves an appropriately-sized variant instead of
 * the full intrinsic image. This trims hero image bytes by ~70 %
 * on mobile and was the difference between Lighthouse Performance
 * 84 and 90+ on /services/<slug> + /insights/<slug> (Rule #10).
 *
 * The helper is purely string manipulation — no network, no SDK —
 * so it stays in `lib/` rather than depending on Cloudinary's React
 * SDK (which would add ~30 KB to the bundle).
 */

const CLOUDINARY_HOST = "res.cloudinary.com";
const TRANSFORM_MARKER = "f_auto,q_auto";

/**
 * Returns the same Cloudinary URL with a width (and optional DPR)
 * transform spliced into the existing `f_auto,q_auto` segment.
 *
 *   sized("https://res.cloudinary.com/x/image/upload/f_auto,q_auto/abc", 800)
 *   → "https://res.cloudinary.com/x/image/upload/f_auto,q_auto,w_800/abc"
 *
 * Non-Cloudinary URLs and URLs that don't match the expected
 * transform marker are returned unchanged.
 */
export function cloudinarySized(
  url: string | null | undefined,
  width: number,
  options: { dpr?: number } = {},
): string | undefined {
  if (!url) return undefined;
  if (!url.includes(CLOUDINARY_HOST)) return url;
  if (!url.includes(TRANSFORM_MARKER)) return url;
  const dprPart = options.dpr ? `,dpr_${options.dpr}` : "";
  return url.replace(
    TRANSFORM_MARKER,
    `${TRANSFORM_MARKER},w_${width}${dprPart}`,
  );
}

/**
 * Builds a srcset string for responsive `<img srcset>` attributes.
 * Pass the widths actually used by the layout — the browser picks
 * the closest match.
 *
 *   cloudinarySrcSet(url, [400, 800, 1200])
 *   → "<…w_400/abc> 400w, <…w_800/abc> 800w, <…w_1200/abc> 1200w"
 */
export function cloudinarySrcSet(
  url: string | null | undefined,
  widths: number[],
): string | undefined {
  if (!url) return undefined;
  if (!url.includes(CLOUDINARY_HOST) || !url.includes(TRANSFORM_MARKER)) {
    return undefined;
  }
  return widths
    .map((w) => `${cloudinarySized(url, w)} ${w}w`)
    .join(", ");
}
