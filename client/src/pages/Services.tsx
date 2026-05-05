/**
 * Services hub — /th/services & /en/services
 *
 * Lists the 9 canonical services from content/services.ts. Each card shows
 * a sentence-case title, an SDG chip drawn from tokens.css, and the
 * editorial subtitle (not the long descriptionEn) so the hub stays scannable.
 *
 * Page-level copy (hero subtitle + intro paragraph + meta) is taken
 * verbatim from comminno_phase2_copy/services_copy.md → "## Service Hub
 * Page (/services)".
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
    subtitle:
      "เก้าบริการ สี่สีหลัก หนึ่งพันธกิจ — การสื่อสารเพื่อยกระดับคุณภาพชีวิต",
    intro:
      "ทุกบริการด้านล่างจับคู่กับเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) ของสหประชาชาติอย่างน้อยหนึ่งเป้า รหัสสีบอกได้ในทันทีว่าบริการนั้นมักทำงานเพื่อเป้าใด เรารับโจทย์ที่ตรงกับความเชี่ยวชาญด้านวิจัยของทีม และเปลี่ยนให้กลายเป็นผลผลิตที่ภาครัฐ ภาคเอกชน และประชาชนนำไปใช้งานจริงได้",
    crumbHome: "หน้าแรก",
    crumbSelf: "บริการ",
    learnMore: "ดูรายละเอียด",
    metaDesc:
      "บริการ 9 ด้านของ Comm.Inno (ศูนย์เชี่ยวชาญเฉพาะทางด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน) จุฬาลงกรณ์มหาวิทยาลัย — งานวิจัย ออกแบบการสื่อสาร ผลิตวิดีโอ AR หลักสูตรอบรม สัมมนา บริหารแคมเปญ และอีเวนต์การตลาด ทุกชิ้นงานจับคู่กับเป้าหมาย SDG",
  },
  en: {
    title: "What we do",
    subtitle:
      "Nine services, four brand colours, one mission — communication that improves quality of life.",
    intro:
      "Every service below is mapped to one or more UN Sustainable Development Goals. The colour-coding tells you at a glance which global goal a service most often serves. We take on engagements that fit our research strengths and turn them into outputs the public actually uses.",
    crumbHome: "Home",
    crumbSelf: "Services",
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
      description: t.subtitle,
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
        lede={t.subtitle}
      />

      <section className="container py-10 md:py-14">
        <p
          className="max-w-3xl text-base md:text-lg mb-10"
          style={{ color: "var(--ink-muted)", lineHeight: 1.65 }}
        >
          {t.intro}
        </p>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const title =
              locale === "th" ? s.titleTh ?? s.titleEn : s.titleEn;
            // Show the canonical subtitle on the card so the hub reads
            // editorially rather than dumping the long descriptionEn.
            const subtitle =
              locale === "th" ? s.subtitleTh : s.subtitleEn;
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
                  </div>
                  <h2
                    className="font-display text-xl md:text-2xl"
                    style={{ color: "var(--ink)", lineHeight: 1.2 }}
                  >
                    {title}
                  </h2>
                  <p
                    className="text-sm flex-1"
                    style={{ color: "var(--ink-muted)", lineHeight: 1.55 }}
                  >
                    {subtitle}
                  </p>
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
