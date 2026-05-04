/**
 * ServiceDetail — /th/services/:slug & /en/services/:slug
 *
 * Renders one service shell. Until services_copy.md is spliced in, the
 * description / deliverables / audience sections show "Copy pending" tags;
 * structure (SDG chip, breadcrumbs, related insights, CTA) is fully usable.
 */
import { useRoute } from "wouter";
import { servicesBySlug } from "@/content/services";
import { posts } from "@/content/posts";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { LocaleLink } from "@/i18n/LocaleLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { SdgChip, type SdgNumber } from "@/components/SdgChip";
import { ArrowRight } from "lucide-react";
import NotFound from "./NotFound";

const COPY = {
  th: {
    crumbHome: "หน้าแรก",
    crumbHub: "บริการ",
    pendingCopy: "เนื้อหารายละเอียดอยู่ระหว่างจัดทำ — ฉบับสมบูรณ์จะอัปโหลดเมื่อทีมศูนย์ฯ ส่งสำเนามา",
    descTitle: "เกี่ยวกับบริการนี้",
    deliverablesTitle: "ผลงานที่ส่งมอบ",
    audienceTitle: "เหมาะสำหรับ",
    relatedTitle: "บทความและกรณีศึกษาที่เกี่ยวข้อง",
    noRelated: "ยังไม่มีบทความในหมวดนี้",
    ctaTitle: "อยากร่วมงานกับเรา?",
    ctaLede: "บอกโจทย์ของคุณผ่านหน้าติดต่อ ทีมเราจะตอบกลับภายใน 5 วันทำการ",
    ctaButton: "ติดต่อศูนย์ฯ",
    backToHub: "ดูบริการทั้งหมด",
  },
  en: {
    crumbHome: "Home",
    crumbHub: "Services",
    pendingCopy:
      "Detailed copy is pending — the full description will be added once the center sends final wording.",
    descTitle: "About this service",
    deliverablesTitle: "What we deliver",
    audienceTitle: "Who it's for",
    relatedTitle: "Related insights and case studies",
    noRelated: "No insights tagged with this service yet.",
    ctaTitle: "Want to work with us?",
    ctaLede: "Tell us what you need on the contact page — we reply within five working days.",
    ctaButton: "Contact the center",
    backToHub: "All services",
  },
} as const;

export default function ServiceDetail() {
  const [, params] = useRoute<{ locale: string; slug: string }>("/:locale/services/:slug");
  const slug = params?.slug;
  const { locale } = useLocale();
  const t = COPY[locale];

  const service = slug ? servicesBySlug.get(slug) : undefined;

  // Always call the meta hook so React's hook order is stable, even when service is missing.
  const safeTitle: string = service
    ? (locale === "th" ? (service.titleTh ?? service.titleEn) : service.titleEn)
    : "Service not found";
  const description: string | null =
    (service?.[locale === "th" ? "descriptionTh" : "descriptionEn"]) ?? null;
  const metaDesc: string =
    description ??
    (locale === "th"
      ? `บริการ ${safeTitle} จากศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร จุฬาลงกรณ์มหาวิทยาลัย — รายละเอียดเพิ่มเติมเร็ว ๆ นี้`
      : `Comm.Inno service · ${safeTitle}. Full description coming soon as the center confirms canonical copy.`);

  usePageMeta({
    title: safeTitle,
    description: metaDesc,
    path: service ? `/${locale}/services/${service.slug}` : undefined,
    jsonLd: service
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: safeTitle,
          provider: {
            "@type": "Organization",
            name: "Comm.Inno",
          },
        }
      : undefined,
  });

  if (!service) {
    return <NotFound />;
  }

  // Cross-link any insights tagged with this service slug.
  const related = posts.filter((p) => p.tags.includes(service.slug)).slice(0, 4);
  const deliverables =
    locale === "th" ? service.deliverablesTh : service.deliverablesEn;
  const audience = locale === "th" ? service.audienceTh : service.audienceEn;

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: t.crumbHome },
          { href: "/services", label: t.crumbHub },
          { label: safeTitle },
        ]}
        title={safeTitle}
        meta={
          <SdgChip
            sdg={service.sdgNumber as SdgNumber}
            size="md"
          />
        }
      />

      <article className="container py-12 md:py-16">
        {/* Description */}
        <section className="grid gap-8 md:grid-cols-12 mb-14">
          <header className="md:col-span-4">
            <h2 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
              {t.descTitle}
            </h2>
          </header>
          <div className="md:col-span-8">
            {description ? (
              <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: "var(--ink)" }}>
                {description}
              </p>
            ) : (
              <p
                className="rounded-lg border p-4 text-sm"
                style={{
                  borderColor: "color-mix(in srgb, var(--warning) 35%, #fff)",
                  backgroundColor: "color-mix(in srgb, var(--warning) 8%, #fff)",
                  color: "var(--ink)",
                }}
              >
                {t.pendingCopy}
              </p>
            )}
          </div>
        </section>

        {/* Deliverables */}
        <section className="grid gap-8 md:grid-cols-12 mb-14">
          <header className="md:col-span-4">
            <h2 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
              {t.deliverablesTitle}
            </h2>
          </header>
          <div className="md:col-span-8">
            {deliverables && deliverables.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {deliverables.map((d, i) => (
                  <li
                    key={i}
                    className="rounded-lg border p-4 text-sm"
                    style={{
                      borderColor: "var(--mist)",
                      backgroundColor: "#fff",
                      color: "var(--ink)",
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-sm"
                style={{ color: "var(--ink-muted)", fontStyle: "italic" }}
              >
                {t.pendingCopy}
              </p>
            )}
          </div>
        </section>

        {/* Audience */}
        <section className="grid gap-8 md:grid-cols-12 mb-14">
          <header className="md:col-span-4">
            <h2 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
              {t.audienceTitle}
            </h2>
          </header>
          <div className="md:col-span-8">
            {audience ? (
              <p style={{ lineHeight: 1.6, color: "var(--ink)" }}>{audience}</p>
            ) : (
              <p
                className="text-sm"
                style={{ color: "var(--ink-muted)", fontStyle: "italic" }}
              >
                {t.pendingCopy}
              </p>
            )}
          </div>
        </section>

        {/* Related insights */}
        <section className="border-t pt-10 mb-14" style={{ borderTopColor: "var(--mist)" }}>
          <header className="mb-6">
            <h2 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
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
                    style={{ borderColor: "var(--mist)", backgroundColor: "#fff" }}
                  >
                    <p
                      className="text-xs uppercase tracking-wide font-semibold mb-1"
                      style={{ color: "var(--brand-red)" }}
                    >
                      {p.date ? new Date(p.date).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { year: "numeric", month: "short" }) : ""}
                    </p>
                    <h3 className="font-display text-lg" style={{ color: "var(--ink)", lineHeight: 1.25 }}>
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
          <p className="mb-6" style={{ color: "var(--ink-muted)", maxWidth: "44ch" }}>
            {t.ctaLede}
          </p>
          <div className="flex flex-wrap gap-3">
            <LocaleLink
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--brand-red)" }}
            >
              {t.ctaButton} <ArrowRight size={16} aria-hidden="true" />
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
