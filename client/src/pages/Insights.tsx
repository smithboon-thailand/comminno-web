/**
 * Insights index — /th/insights & /en/insights
 *
 * Lists all 24 posts with optional category filter (?category=<slug>).
 * Filter chips include the 9 service slugs plus the 3 non-service
 * categories (highlights, innovation-technology, school) so visitors
 * coming from old Wix /insights/categories/* URLs still find content.
 */
import { useMemo } from "react";
import { useLocation } from "wouter";
import { posts } from "@/content/posts";
import { categories } from "@/content/categories";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { LocaleLink } from "@/i18n/LocaleLink";
import { PageHeader } from "@/components/layout/PageHeader";

const COPY = {
  th: {
    title: "บทความและกรณีศึกษา",
    lede:
      "งานวิจัย กรณีศึกษา และบทเรียนจากโครงการสื่อสารเพื่อความยั่งยืนของศูนย์ฯ — ทั้งหมดคัดมาจากเว็บไซต์เดิมและจะอัปเดตอย่างต่อเนื่อง",
    crumbHome: "หน้าแรก",
    crumbSelf: "บทความ",
    filterAll: "ทั้งหมด",
    bilingualNotice:
      "ขณะนี้บทความยังเป็นภาษาอังกฤษเป็นหลัก ฉบับแปลภาษาไทยอยู่ระหว่างจัดทำ",
    metaDesc:
      "บทความและกรณีศึกษาจาก Comm.Inno (ศูนย์เชี่ยวชาญเฉพาะทางด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน) จุฬาลงกรณ์มหาวิทยาลัย — งานวิจัยและโครงการสื่อสารเพื่อความยั่งยืน 24 ชิ้น",
    countLabel: (n: number) => `${n} บทความ`,
  },
  en: {
    title: "Insights and case studies",
    lede:
      "Research notes, project write-ups, and lessons learned from Comm.Inno's communication-for-sustainability work — migrated from the legacy site and growing steadily.",
    crumbHome: "Home",
    crumbSelf: "Insights",
    filterAll: "All",
    bilingualNotice: "",
    metaDesc:
      "Research and case studies from Comm.Inno (Center of Excellence in Communication Innovation for the Development of Quality of Life and Sustainability, Chulalongkorn University) — 24 articles on sustainability communication.",
    countLabel: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
  },
} as const;

function getQueryParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

export default function Insights() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const [path] = useLocation();

  // Re-evaluate the active category on every navigation (path/search change).
  const activeCategory = useMemo(() => getQueryParam("category"), [path]);

  // Only show categories that actually have at least one post tagged.
  const usedCats = useMemo(() => {
    const seen = new Set<string>();
    posts.forEach((p) => p.tags.forEach((tag) => seen.add(tag)));
    return categories.filter((c) => seen.has(c.slug));
  }, []);

  const filtered = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((p) => p.tags.includes(activeCategory));
  }, [activeCategory]);

  usePageMeta({
    title: t.title,
    description: t.metaDesc,
    path: `/${locale}/insights`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t.title,
      description: t.lede,
      hasPart: posts.slice(0, 10).map((p) => ({
        "@type": "Article",
        headline: p.title,
        url: `/${locale}/insights/${p.slug}`,
        datePublished: p.date ?? undefined,
      })),
    },
  });

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: t.crumbHome },
          { label: t.crumbSelf },
        ]}
        title={t.title}
        lede={t.lede}
      />

      <section className="container py-10 md:py-12">
        {/* Bilingual notice for TH route only */}
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

        {/* Category filter — accessible as a list of links so it survives JS-off */}
        <nav aria-label="Filter by category" className="mb-8">
          <ul className="flex flex-wrap gap-2">
            <li>
              <LocaleLink
                href="/insights"
                className="rounded-full border px-3 py-1.5 text-sm transition-colors"
                aria-current={!activeCategory ? "true" : undefined}
                style={{
                  borderColor: !activeCategory ? "var(--brand-red)" : "var(--mist)",
                  backgroundColor: !activeCategory ? "var(--brand-red)" : "#fff",
                  color: !activeCategory ? "#fff" : "var(--ink)",
                }}
              >
                {t.filterAll}
              </LocaleLink>
            </li>
            {usedCats.map((c) => {
              const active = activeCategory === c.slug;
              const label = locale === "th" ? (c.titleTh ?? c.titleEn) : c.titleEn;
              return (
                <li key={c.slug}>
                  <LocaleLink
                    href={`/insights?category=${c.slug}`}
                    aria-current={active ? "true" : undefined}
                    className="rounded-full border px-3 py-1.5 text-sm transition-colors"
                    style={{
                      borderColor: active ? "var(--brand-red)" : "var(--mist)",
                      backgroundColor: active ? "var(--brand-red)" : "#fff",
                      color: active ? "#fff" : "var(--ink)",
                    }}
                  >
                    {label}
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs" style={{ color: "var(--ink-muted)" }}>
            {t.countLabel(filtered.length)}
          </p>
        </nav>

        {/* Posts grid */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.slug}>
              <LocaleLink
                href={`/insights/${p.slug}`}
                className="group flex h-full flex-col gap-3 rounded-xl border p-6 transition-all"
                style={{
                  borderColor: "var(--mist)",
                  backgroundColor: "#fff",
                }}
              >
                {/* Cover image — webp preferred, jpg fallback. */}
                {p.coverWebp || p.coverJpg ? (
                  <div
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-lg"
                    style={{ backgroundColor: "var(--mist)" }}
                  >
                    <picture>
                      {p.coverWebp && (
                        <source srcSet={p.coverWebp} type="image/webp" />
                      )}
                      <img
                        src={p.coverJpg ?? p.coverWebp ?? ""}
                        alt={
                          locale === "th"
                            ? p.coverAltTh ?? p.title
                            : p.coverAltEn ?? p.title
                        }
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={675}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </picture>
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="aspect-[16/9] w-full rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--brand-blue) 18%, var(--brand-paper)), color-mix(in srgb, var(--brand-yellow) 18%, var(--brand-paper)))",
                    }}
                  />
                )}
                <div className="flex items-center gap-2 text-xs">
                  {p.date && (
                    <time
                      dateTime={p.date}
                      style={{ color: "var(--brand-red)" }}
                      className="font-semibold uppercase tracking-wide"
                    >
                      {new Date(p.date).toLocaleDateString(
                        locale === "th" ? "th-TH" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </time>
                  )}
                  {p.tags[0] && (
                    <span
                      className="rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--mist) 50%, #fff)",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {p.tags[0]}
                    </span>
                  )}
                </div>
                <h2
                  className="font-display text-lg md:text-xl flex-1"
                  style={{ color: "var(--ink)", lineHeight: 1.25 }}
                >
                  {p.title}
                </h2>
                <p
                  className="line-clamp-3 text-sm"
                  style={{ color: "var(--ink-muted)", lineHeight: 1.55 }}
                >
                  {p.summary}
                </p>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
