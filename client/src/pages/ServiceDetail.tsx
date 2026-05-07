/**
 * ServiceDetail — /th/services/:slug & /en/services/:slug
 *
 * Renders one of the 9 canonical services. Source of truth for body copy:
 * client/src/content/services.ts (spliced from comminno_phase2_copy/services_copy.md).
 *
 * Sections:
 *   1. Hero (PageHeader) — sentence-case title, breadcrumbs, SDG chip,
 *                          subtitle as lede.
 *   2. Description       — multi-paragraph body (splits on "\n\n").
 *   3. Deliverables      — 6–8 concrete outputs as a 2-column card grid.
 *   4. Related insights  — pulled from service.relatedSlugs first, then
 *                          falls back to posts tagged with the service slug.
 *   5. CTA               — service-specific button copy + back-to-hub.
 *
 * The legacy "audience" section was removed because canonical copy frames
 * each service through deliverables, not audience.
 */
import { useRoute } from "wouter";
import { servicesBySlug, type ServiceWithCopy } from "@/content/services";
import { posts } from "@/content/posts";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { LocaleLink } from "@/i18n/LocaleLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { SdgChip, type SdgNumber } from "@/components/SdgChip";
import { ArrowRight } from "lucide-react";
import { cloudinarySized, cloudinarySrcSet } from "@/lib/cloudinary";
import NotFound from "./NotFound";

const COPY = {
  th: {
    crumbHome: "หน้าแรก",
    crumbHub: "บริการ",
    descTitle: "เกี่ยวกับบริการนี้",
    deliverablesTitle: "ผลงานที่ส่งมอบ",
    relatedTitle: "บทความและกรณีศึกษาที่เกี่ยวข้อง",
    noRelated: "ยังไม่มีบทความในหมวดนี้",
    ctaTitle: "อยากร่วมงานกับเรา?",
    ctaLede: "บอกโจทย์ของคุณผ่านหน้าติดต่อ ทีมเราจะตอบกลับภายใน 5 วันทำการ",
    backToHub: "ดูบริการทั้งหมด",
  },
  en: {
    crumbHome: "Home",
    crumbHub: "Services",
    descTitle: "About this service",
    deliverablesTitle: "What we deliver",
    relatedTitle: "Related insights and case studies",
    noRelated: "No insights tagged with this service yet.",
    ctaTitle: "Want to work with us?",
    ctaLede:
      "Tell us what you need on the contact page — we reply within five working days.",
    backToHub: "All services",
  },
} as const;

/**
 * Pick the first ≤160 chars of the description for the meta tag, collapsing
 * paragraph breaks. Mirrors the "never auto-generate" rule by deriving from
 * canonical copy only.
 */
function buildMetaDescription(
  service: ServiceWithCopy,
  locale: "th" | "en",
): string {
  const desc = locale === "th" ? service.descriptionTh : service.descriptionEn;
  if (!desc) return "";
  const flat = desc.replace(/\s+/g, " ").trim();
  if (flat.length <= 160) return flat;
  const cut = flat.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : 157)}…`;
}

export default function ServiceDetail() {
  const [, params] = useRoute<{ locale: string; slug: string }>(
    "/:locale/services/:slug",
  );
  const slug = params?.slug;
  const { locale } = useLocale();
  const t = COPY[locale];
  const service = slug ? servicesBySlug.get(slug) : undefined;

  // Stable hook order: derive everything for the meta hook before the
  // NotFound branch so React sees the same hooks on every render.
  const safeTitle: string = service
    ? locale === "th"
      ? service.titleTh ?? service.titleEn
      : service.titleEn
    : "Service not found";
  const subtitle: string | null = service
    ? (locale === "th" ? service.subtitleTh : service.subtitleEn) ?? null
    : null;
  const metaDesc: string = service
    ? buildMetaDescription(service, locale)
    : locale === "th"
    ? "ไม่พบหน้าบริการที่คุณกำลังมองหา"
    : "The service page you are looking for could not be found.";

  usePageMeta({
    title: safeTitle,
    description: metaDesc,
    path: service ? `/${locale}/services/${service.slug}` : undefined,
    jsonLd: service
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: safeTitle,
          description: metaDesc,
          provider: {
            "@type": "Organization",
            name: "Comm.Inno",
            url: "https://comminno.center",
          },
        }
      : undefined,
  });

  if (!service) {
    return <NotFound />;
  }

  // Resolve related insights: explicit slugs from the canonical copy take
  // precedence over tag-based discovery so we honour the editorial mapping
  // exactly. Fall back to tag-matching when the explicit list is short.
  const explicitRelated = (service.relatedSlugs ?? [])
    .map((relSlug) => posts.find((p) => p.slug === relSlug))
    .filter((p): p is (typeof posts)[number] => Boolean(p));
  const fallbackRelated = posts.filter((p) =>
    p.tags.includes(service.slug),
  );
  const seen = new Set<string>();
  const related = [...explicitRelated, ...fallbackRelated]
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .slice(0, 4);

  const description =
    locale === "th" ? service.descriptionTh : service.descriptionEn;
  const descParagraphs = (description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const deliverables =
    locale === "th" ? service.deliverablesTh : service.deliverablesEn;
  const ctaButton = locale === "th" ? service.ctaTh : service.ctaEn;

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: t.crumbHome },
          { href: "/services", label: t.crumbHub },
          { label: safeTitle },
        ]}
        title={safeTitle}
        lede={subtitle ?? undefined}
        meta={<SdgChip sdg={service.sdgNumber as SdgNumber} size="md" />}
      />

      {/* Hero image band — 16:9 with subtle gradient base for visual depth. */}
      <div className="container -mt-2 mb-10 md:mb-14">
        <figure
          className="relative overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--mist)", aspectRatio: "16 / 9" }}
        >
          <img
            src={cloudinarySized(service.heroImage, 800)}
            srcSet={cloudinarySrcSet(service.heroImage, [400, 800, 1200, 1600])}
            sizes="(min-width: 1024px) 800px, 100vw"
            alt={(locale === "th" ? service.heroAltTh : service.heroAltEn) ?? ""}
            loading="eager"
            decoding="async"
            // fetchpriority hint upgrades this LCP candidate above sibling network requests; React 19 forwards the lowercase attr.
            fetchPriority="high"
            width={1600}
            height={900}
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)",
            }}
          />
        </figure>
      </div>

      <article className="container pb-12 md:pb-16">
        {/* Description */}
        <section className="grid gap-8 md:grid-cols-12 mb-14">
          <header className="md:col-span-4">
            <h2
              className="font-display text-xl md:text-2xl"
              style={{ color: "var(--ink)" }}
            >
              {t.descTitle}
            </h2>
          </header>
          <div className="md:col-span-8 space-y-4">
            {descParagraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: "1.0625rem",
                  lineHeight: 1.65,
                  color: "var(--ink)",
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Deliverables */}
        {deliverables && deliverables.length > 0 && (
          <section className="grid gap-8 md:grid-cols-12 mb-14">
            <header className="md:col-span-4">
              <h2
                className="font-display text-xl md:text-2xl"
                style={{ color: "var(--ink)" }}
              >
                {t.deliverablesTitle}
              </h2>
            </header>
            <div className="md:col-span-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {deliverables.map((d, i) => (
                  <li
                    key={i}
                    className="rounded-lg border p-4 text-sm"
                    style={{
                      borderColor: "var(--mist)",
                      backgroundColor: "#fff",
                      color: "var(--ink)",
                      lineHeight: 1.5,
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Related insights */}
        <section
          className="border-t pt-10 mb-14"
          style={{ borderTopColor: "var(--mist)" }}
        >
          <header className="mb-6">
            <h2
              className="font-display text-xl md:text-2xl"
              style={{ color: "var(--ink)" }}
            >
              {t.relatedTitle}
            </h2>
          </header>
          {related.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <LocaleLink
                    href={`/insights/${p.slug}`}
                    className="block h-full rounded-lg border p-4 transition-colors"
                    style={{
                      borderColor: "var(--mist)",
                      backgroundColor: "#fff",
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-wide font-semibold mb-1"
                      style={{ color: "var(--brand-red)" }}
                    >
                      {p.date
                        ? new Date(p.date).toLocaleDateString(
                            locale === "th" ? "th-TH" : "en-US",
                            { year: "numeric", month: "short" },
                          )
                        : ""}
                    </p>
                    <h3
                      className="font-display text-lg"
                      style={{ color: "var(--ink)", lineHeight: 1.25 }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="mt-2 line-clamp-3 text-sm"
                      style={{ color: "var(--ink-muted)", lineHeight: 1.5 }}
                    >
                      {p.summary}
                    </p>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
              {t.noRelated}
            </p>
          )}
        </section>

        {/* CTA */}
        <section
          className="rounded-xl p-8 md:p-10"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--brand-red) 8%, var(--brand-paper)), color-mix(in srgb, var(--brand-yellow) 8%, var(--brand-paper)))",
            border: "1px solid var(--mist)",
          }}
        >
          <h2
            className="font-display text-2xl md:text-3xl mb-3"
            style={{ color: "var(--ink)" }}
          >
            {t.ctaTitle}
          </h2>
          <p
            className="mb-6"
            style={{ color: "var(--ink-muted)", maxWidth: "44ch" }}
          >
            {t.ctaLede}
          </p>
          <div className="flex flex-wrap gap-3">
            <LocaleLink
              href={`/contact?service=${encodeURIComponent(service.slug)}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--brand-red)" }}
            >
              {ctaButton} <ArrowRight size={16} aria-hidden="true" />
            </LocaleLink>
            <LocaleLink
              href="/services"
              className="inline-flex items-center rounded-full border px-5 py-3 text-sm font-semibold transition-colors"
              style={{ borderColor: "var(--ink)", color: "var(--ink)" }}
            >
              {t.backToHub}
            </LocaleLink>
          </div>
        </section>
      </article>
    </>
  );
}
