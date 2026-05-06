/**
 * InsightDetail — /th/insights/:slug & /en/insights/:slug
 *
 * Renders one Post in long-form: cover placeholder, kicker (date + first
 * category), title, summary lede, body paragraphs, related-by-tag links.
 */
import { useRoute } from "wouter";
import { postsBySlug, posts } from "@/content/posts";
import { postBodies } from "@/content/post-bodies";
import { categoriesBySlug } from "@/content/categories";
import { servicesBySlug } from "@/content/services";
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
    crumbHub: "บทความ",
    relatedTitle: "บทความที่เกี่ยวข้อง",
    bilingualNotice:
      "บทความนี้ยังเป็นฉบับภาษาอังกฤษ ฉบับแปลภาษาไทยอยู่ระหว่างจัดทำ — ข้อมูลอ้างอิงจากเว็บไซต์เดิมของศูนย์ฯ",
    backToHub: "ดูบทความทั้งหมด",
    serviceLink: "บริการที่เกี่ยวข้อง",
  },
  en: {
    crumbHome: "Home",
    crumbHub: "Insights",
    relatedTitle: "Related insights",
    bilingualNotice: "",
    backToHub: "All insights",
    serviceLink: "Related service",
  },
} as const;

export default function InsightDetail() {
  const [, params] = useRoute<{ locale: string; slug: string }>("/:locale/insights/:slug");
  const slug = params?.slug;
  const post = slug ? postsBySlug.get(slug) : undefined;
  const { locale } = useLocale();
  const t = COPY[locale];

  // Stable hook order: always call usePageMeta even on the not-found branch.
  const safeTitle = post?.title ?? "Article not found";
  const summary = post?.summary ?? "";
  usePageMeta({
    title: safeTitle,
    description:
      post?.ogDescription || summary ||
      (locale === "th"
        ? "บทความและกรณีศึกษาจาก Comm.Inno (ศูนย์เชี่ยวชาญเฉพาะทางด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน)"
        : "Insights and case studies from Comm.Inno — the Center of Excellence in Communication Innovation for the Development of Quality of Life and Sustainability."),
    path: post ? `/${locale}/insights/${post.slug}` : undefined,
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.ogDescription || summary,
          datePublished: post.date ?? undefined,
          author: {
            "@type": "Organization",
            name: "Comm.Inno",
          },
        }
      : undefined,
  });

  if (!post) return <NotFound />;

  const related = posts
    .filter(
      (p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, 3);

  // The first tag that maps to a real service (skip filter-only categories).
  const linkedService = post.tags
    .map((tag) => servicesBySlug.get(tag))
    .find((s) => !!s);

  // Split body into paragraphs by ". " sequences (parser already cleaned).
  const body = postBodies[post.slug] ?? "";
  const paragraphs = body.split(/\n\n+/).flatMap((para) =>
    para.split(/(?<=[.?!])\s+(?=[A-ZА-Я])/).filter((s) => s.trim().length > 0),
  );

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: t.crumbHome },
          { href: "/insights", label: t.crumbHub },
          { label: post.title },
        ]}
        title={post.title}
        lede={post.summary}
        meta={
          post.tags[0] && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => {
                const cat = categoriesBySlug.get(tag);
                return (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--mist) 50%, #fff)",
                      color: "var(--ink)",
                    }}
                  >
                    {cat ? (locale === "th" ? (cat.titleTh ?? cat.titleEn) : cat.titleEn) : tag}
                  </span>
                );
              })}
            </div>
          )
        }
      />

      <article className="container py-10 md:py-14">
        {/* Bilingual TH notice */}
        {locale === "th" && (
          <p
            className="mb-8 rounded-lg border px-4 py-3 text-sm"
            style={{
              borderColor: "var(--mist)",
              color: "var(--ink-muted)",
              backgroundColor: "#fff",
            }}
          >
            {t.bilingualNotice}
          </p>
        )}

        {/* Cover — single Cloudinary URL (f_auto handles format). Falls back to brand gradient when no image is set. */}
        {(() => {
          const cover = post.coverImage ?? post.coverWebp ?? post.coverJpg;
          return cover ? (
          <figure
            className="relative aspect-[16/9] w-full overflow-hidden rounded-xl mb-10 border"
            style={{ borderColor: "var(--mist)" }}
          >
            <img
              src={cover}
              alt={
                locale === "th"
                  ? post.coverAltTh ?? post.title
                  : post.coverAltEn ?? post.title
              }
              loading="eager"
              decoding="async"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </figure>
          ) : (
          <div
            aria-hidden="true"
            className="aspect-[16/9] w-full rounded-xl mb-10"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--brand-blue) 22%, var(--brand-paper)), color-mix(in srgb, var(--brand-red) 18%, var(--brand-paper)))",
            }}
          />
          );
        })()}

        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <div
              className="prose-styled"
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                color: "var(--ink)",
              }}
            >
              {paragraphs.map((p, i) => (
                <p key={i} className="mb-5">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <aside className="md:col-span-4">
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--mist)", backgroundColor: "#fff" }}
            >
              {post.date && (
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--brand-red)" }}>
                  {new Date(post.date).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
              {linkedService && (
                <div className="border-t pt-3 mt-3" style={{ borderTopColor: "var(--mist)" }}>
                  <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--ink-muted)" }}>
                    {t.serviceLink}
                  </p>
                  <LocaleLink
                    href={`/services/${linkedService.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    style={{ color: "var(--brand-red)" }}
                  >
                    {locale === "th" ? (linkedService.titleTh ?? linkedService.titleEn) : linkedService.titleEn}
                    <ArrowRight size={14} aria-hidden="true" />
                  </LocaleLink>
                  {linkedService.sdgNumber && (
                    <div className="mt-2">
                      <SdgChip sdg={linkedService.sdgNumber as SdgNumber} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t pt-10" style={{ borderTopColor: "var(--mist)" }}>
            <header className="mb-6">
              <h2 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
                {t.relatedTitle}
              </h2>
            </header>
            <ul className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <LocaleLink
                    href={`/insights/${p.slug}`}
                    className="block h-full rounded-lg border p-4 transition-colors"
                    style={{ borderColor: "var(--mist)", backgroundColor: "#fff" }}
                  >
                    <h3 className="font-display text-base" style={{ color: "var(--ink)", lineHeight: 1.3 }}>
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm" style={{ color: "var(--ink-muted)", lineHeight: 1.5 }}>
                      {p.summary}
                    </p>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12">
          <LocaleLink
            href="/insights"
            className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: "var(--brand-red)" }}
          >
            ← {t.backToHub}
          </LocaleLink>
        </div>
      </article>
    </>
  );
}
