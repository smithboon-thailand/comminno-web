/**
 * Home — Comm.Inno landing page
 *
 * Structure:
 *   1. Hero            — DM Serif Display headline + brand-red CTA pair (real routes)
 *   2. What we do      — 3-column teaser pointing to /services
 *   3. Latest insights — 3 most recent posts → /insights/[slug] + link to all
 *   4. Final CTA       — "Work with us" strip → /contact
 *
 * Hero is rendered eagerly because it contains the LCP element (h1).
 * The two below-the-fold teaser blocks use plain JSX (no lazy split — they are
 * lightweight and live on the same page; the bigger lazy split is the Footer
 * already done in SiteShell).
 */
import { ArrowRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocale } from "@/i18n/LocaleProvider";
import { LocaleLink } from "@/i18n/LocaleLink";
import { posts } from "@/content/posts";
import { services } from "@/content/services";
import { categoriesBySlug } from "@/content/categories";
import { usePageMeta } from "@/i18n/PageMeta";

const FEATURED_SERVICE_SLUGS = ["training", "research-and-evaluation", "communication-design"] as const;

export default function Home() {
  const { locale } = useLocale();
  const intl = useIntl();
  // Suppress unused-import for future use
  void intl;

  // Sentence-case page title — manually crafted, never auto-generated.
  const pageTitle =
    locale === "th"
      ? "Comm.Inno — ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร จุฬาฯ"
      : "Comm.Inno — Center of Excellence in Communication Innovation";
  const pageDescription =
    locale === "th"
      ? "ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
      : "Research, training, and design from the Center of Excellence in Communication Innovation at the Faculty of Communication Arts, Chulalongkorn University.";

  // 3 featured services for the "What we do" block (curated, not most-recent).
  const featuredServices = FEATURED_SERVICE_SLUGS.map((slug) =>
    services.find((s) => s.slug === slug),
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  // 3 most recent posts for the "Latest insights" block.
  const latestPosts = [...posts]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 3);

  // Format human-friendly date per locale.
  const fmtDate = (iso: string | null): string => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // What-we-do teaser headlines per locale (sentence case).
  const teaserCopy = locale === "th"
    ? {
        whatHeadline: "สิ่งที่เราทำ",
        whatLede: "เก้าเส้นบริการครอบคลุมงานวิจัย สื่อสารการตลาด ออกแบบ และอบรม — ทุกโครงการเชื่อมโยงกับเป้าหมาย SDG",
        whatCta: "ดูบริการทั้งหมด",
        latestHeadline: "บทความและกรณีศึกษาล่าสุด",
        latestLede: "บันทึกงาน บทเรียน และผลงานล่าสุดจากศูนย์ฯ",
        latestCta: "อ่านทั้งหมด",
        finalHeadline: "อยากร่วมงานกับเรา?",
        finalLede: "บอกโจทย์ของคุณผ่านหน้าติดต่อ ทีมเราจะตอบกลับภายใน 5 วันทำการ",
        finalCta: "ติดต่อศูนย์ฯ",
      }
    : {
        whatHeadline: "What we do",
        whatLede: "Nine service lines spanning research, media production, communication design, and training — every engagement maps to a UN Sustainable Development Goal.",
        whatCta: "All services",
        latestHeadline: "Latest insights and case studies",
        latestLede: "Field notes, project write-ups, and lessons learned from the center.",
        latestCta: "Read all",
        finalHeadline: "Want to work with us?",
        finalLede: "Tell us what you need on the contact page — we reply within five working days.",
        finalCta: "Contact the center",
      };

  return (
    <>
      <HomeMeta locale={locale} title={pageTitle} description={pageDescription} />

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
          <div
            className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] mb-6"
            style={{ color: "var(--brand-red)" }}
          >
            <FormattedMessage id="hero.eyebrow" />
          </div>
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

          {/* CTAs — primary points to /insights (case studies), secondary to /services. */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <LocaleLink
              href="/insights"
              className="group inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-transform"
              style={{
                backgroundColor: "var(--brand-red)",
                color: "#ffffff",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.4) inset, 0 6px 18px -6px rgba(189,33,45,0.55)",
              }}
            >
              <FormattedMessage id="hero.cta.primary" />
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </LocaleLink>
            <LocaleLink
              href="/services"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "var(--brand-red)",
                border: "1.5px solid var(--brand-red)",
              }}
            >
              <FormattedMessage id="hero.cta.secondary" />
            </LocaleLink>
          </div>
        </div>
      </section>

      {/* ─────────────────────  WHAT WE DO  ───────────────────── */}
      <section aria-labelledby="what-headline" className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div className="max-w-2xl">
              <h2
                id="what-headline"
                className="font-display"
                style={{ color: "var(--ink)", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1 }}
              >
                {teaserCopy.whatHeadline}
              </h2>
              <p className="mt-3 text-base" style={{ color: "var(--slate)" }}>
                {teaserCopy.whatLede}
              </p>
            </div>
            <LocaleLink
              href="/services"
              className="text-sm font-semibold inline-flex items-center gap-1.5"
              style={{ color: "var(--brand-red)" }}
            >
              {teaserCopy.whatCta}
              <ArrowRight size={14} aria-hidden />
            </LocaleLink>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredServices.map((service) => {
              const title =
                locale === "th"
                  ? service.titleTh ?? service.titleEn
                  : service.titleEn;
              return (
                <li key={service.slug}>
                  <LocaleLink
                    href={`/services/${service.slug}`}
                    className="block rounded-2xl p-6 h-full transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid var(--mist)",
                    }}
                  >
                    <h3
                      className="font-display"
                      style={{ color: "var(--ink)", fontSize: 22, lineHeight: 1.2 }}
                    >
                      {title}
                    </h3>
                    <p
                      className="mt-3 text-sm font-semibold inline-flex items-center gap-1.5"
                      style={{ color: "var(--brand-red)" }}
                    >
                      {locale === "th" ? "ดูรายละเอียด" : "View details"}
                      <ArrowRight size={14} aria-hidden />
                    </p>
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ─────────────────  LATEST INSIGHTS  ───────────────── */}
      <section
        aria-labelledby="latest-headline"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", borderTop: "1px solid var(--mist)" }}
      >
        <div className="container">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div className="max-w-2xl">
              <h2
                id="latest-headline"
                className="font-display"
                style={{ color: "var(--ink)", fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1 }}
              >
                {teaserCopy.latestHeadline}
              </h2>
              <p className="mt-3 text-base" style={{ color: "var(--slate)" }}>
                {teaserCopy.latestLede}
              </p>
            </div>
            <LocaleLink
              href="/insights"
              className="text-sm font-semibold inline-flex items-center gap-1.5"
              style={{ color: "var(--brand-red)" }}
            >
              {teaserCopy.latestCta}
              <ArrowRight size={14} aria-hidden />
            </LocaleLink>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestPosts.map((post) => {
              const primaryCategory = post.tags[0];
              const cat = primaryCategory
                ? categoriesBySlug.get(primaryCategory)
                : null;
              const catLabel = cat
                ? locale === "th"
                  ? cat.titleTh ?? cat.titleEn
                  : cat.titleEn
                : null;
              return (
                <li key={post.slug}>
                  <LocaleLink
                    href={`/insights/${post.slug}`}
                    className="block rounded-2xl p-6 h-full transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--brand-paper)",
                      border: "1px solid var(--mist)",
                    }}
                  >
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                      style={{ color: "var(--brand-red)" }}
                    >
                      {fmtDate(post.date) || (catLabel ?? "")}
                    </p>
                    <h3
                      className="mt-2 font-display line-clamp-3"
                      style={{ color: "var(--ink)", fontSize: 18, lineHeight: 1.25 }}
                    >
                      {post.title}
                    </h3>
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ─────────────────  FINAL CTA STRIP  ───────────────── */}
      <section
        aria-labelledby="final-cta-headline"
        className="py-16 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--brand-red) 8%, var(--brand-paper)) 0%, var(--brand-paper) 100%)",
        }}
      >
        <div className="container max-w-3xl text-center">
          <h2
            id="final-cta-headline"
            className="font-display"
            style={{ color: "var(--ink)", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.15 }}
          >
            {teaserCopy.finalHeadline}
          </h2>
          <p className="mt-4 text-base md:text-lg" style={{ color: "var(--slate)" }}>
            {teaserCopy.finalLede}
          </p>
          <LocaleLink
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--brand-red)", color: "#fff" }}
          >
            {teaserCopy.finalCta}
            <ArrowRight size={16} aria-hidden />
          </LocaleLink>
        </div>
      </section>
    </>
  );
}

// Tiny wrapper so we can use the usePageMeta hook declaratively in JSX.
function HomeMeta({ title, description, locale }: { title: string; description: string; locale: string }) {
  usePageMeta({ title, description, path: `/${locale}` });
  return null;
}
