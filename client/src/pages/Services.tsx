/**
 * Services hub — /th/services & /en/services
 *
 * Lists the 9 service shells from content/services.ts. Each card shows a
 * sentence-case title, an SDG chip drawn straight from tokens.css, and a
 * "Copy pending" tag that disappears once `descriptionEn` is populated by
 * the splice script.
 */
import { services } from "@/content/services";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { LocaleLink } from "@/i18n/LocaleLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { SdgChip, type SdgNumber } from "@/components/SdgChip";
import { ArrowRight } from "lucide-react";

const COPY = {
  th: {
    title: "บริการของเรา",
    lede:
      "บริการ 9 ด้านของศูนย์ฯ ครอบคลุมงานวิจัย การผลิตสื่อ การออกแบบการสื่อสาร แคมเปญ และการฝึกอบรม โดยทุกชิ้นงานสอดคล้องกับเป้าหมายการพัฒนาที่ยั่งยืนของสหประชาชาติ (SDG)",
    crumbHome: "หน้าแรก",
    crumbSelf: "บริการ",
    pendingCopy: "เนื้อหารายละเอียดอยู่ระหว่างจัดทำ",
    learnMore: "ดูรายละเอียด",
    metaDesc:
      "บริการ 9 ด้านของศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร จุฬาลงกรณ์มหาวิทยาลัย — งานวิจัย ออกแบบสื่อ ผลิตวิดีโอ ฝึกอบรม จัดอีเวนต์ และบริหารแคมเปญที่ขับเคลื่อนความยั่งยืน",
  },
  en: {
    title: "Services",
    lede:
      "Nine service lines covering research, media production, communication design, campaign management, and training — every engagement is mapped to a UN Sustainable Development Goal.",
    crumbHome: "Home",
    crumbSelf: "Services",
    pendingCopy: "Detailed copy coming soon",
    learnMore: "View details",
    metaDesc:
      "Comm.Inno's nine service lines — research, communication design, video, AR, training, seminars, campaign management, marketing events, and book and printing — all mapped to UN SDGs.",
  },
} as const;

export default function Services() {
  const { locale } = useLocale();
  const t = COPY[locale];

  usePageMeta({
    title: t.title,
    description: t.metaDesc,
    path: `/${locale}/services`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t.title,
      description: t.lede,
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

      <section className="container py-12 md:py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const title = locale === "th" ? (s.titleTh ?? s.titleEn) : s.titleEn;
            const hasCopy = s.descriptionEn || s.descriptionTh;
            const summary = locale === "th" ? (s.descriptionTh ?? s.descriptionEn) : s.descriptionEn;
            return (
              <li key={s.slug}>
                <LocaleLink
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-xl border p-6 transition-all"
                  style={{
                    borderColor: "var(--mist)",
                    backgroundColor: "#fff",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <SdgChip sdg={s.sdgNumber as SdgNumber} />
                    {!hasCopy && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--warning) 15%, #fff)",
                          color: "var(--warning)",
                          border: "1px solid color-mix(in srgb, var(--warning) 35%, #fff)",
                        }}
                      >
                        {t.pendingCopy}
                      </span>
                    )}
                  </div>
                  <h2
                    className="font-display text-xl md:text-2xl"
                    style={{ color: "var(--ink)", lineHeight: 1.2 }}
                  >
                    {title}
                  </h2>
                  {summary && (
                    <p
                      className="text-sm flex-1"
                      style={{ color: "var(--ink-muted)", lineHeight: 1.55 }}
                    >
                      {summary}
                    </p>
                  )}
                  <span
                    className="mt-auto inline-flex items-center gap-1 text-sm font-medium transition-colors group-hover:gap-2"
                    style={{ color: "var(--brand-red)" }}
                  >
                    {t.learnMore} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
