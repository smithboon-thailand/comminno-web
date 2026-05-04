/**
 * Privacy — /th/privacy & /en/privacy
 *
 * Placeholder PDPA notice. Real bilingual policy will be spliced in from
 * privacy_policy.md (comminno_phase2_copy.zip) once the legal review is back.
 */
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { PageHeader } from "@/components/layout/PageHeader";

const COPY = {
  th: {
    title: "นโยบายความเป็นส่วนตัว",
    lede:
      "นโยบายฉบับสมบูรณ์อยู่ระหว่างการตรวจทานทางกฎหมายและจะอัปโหลดทันทีหลังคณะนิเทศศาสตร์ลงนาม",
    crumbHome: "หน้าแรก",
    crumbSelf: "นโยบายความเป็นส่วนตัว",
    pendingTitle: "อยู่ระหว่างตรวจทาน",
    pendingBody:
      "เนื้อหานโยบายความเป็นส่วนตัวฉบับสมบูรณ์ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) อยู่ระหว่างการตรวจทานโดยฝ่ายกฎหมายของคณะนิเทศศาสตร์ จุฬาฯ และจะอัปโหลดทันทีที่ได้รับการรับรอง",
    placeholderHeading: "ข้อมูลทั่วไป",
    placeholderItems: [
      "ศูนย์ฯ เก็บข้อมูลที่จำเป็นเฉพาะเพื่อการติดต่อกลับและประสานงานเท่านั้น เช่น ชื่อ อีเมล และข้อความที่ส่งผ่านแบบฟอร์มติดต่อ",
      "เราไม่ใช้คุกกี้เพื่อการตลาดหรือการติดตามจากบุคคลที่สาม คุกกี้ของไซต์นี้ใช้สำหรับเก็บภาษาที่เลือก (TH/EN) เท่านั้น",
      "ข้อมูลส่งผ่าน HTTPS เสมอ และจัดเก็บภายใต้ระเบียบของจุฬาลงกรณ์มหาวิทยาลัย",
      "หากต้องการเข้าถึง แก้ไข หรือลบข้อมูลที่ส่งให้ศูนย์ฯ กรุณาติดต่อ comminno@chula.ac.th",
    ],
    metaDesc:
      "นโยบายความเป็นส่วนตัวของศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร — ข้อมูลทั่วไปก่อนการตรวจทานฉบับเต็มตาม PDPA",
  },
  en: {
    title: "Privacy notice",
    lede:
      "The full privacy policy is under legal review and will be published as soon as the Faculty of Communication Arts signs off.",
    crumbHome: "Home",
    crumbSelf: "Privacy notice",
    pendingTitle: "Under review",
    pendingBody:
      "The full PDPA-compliant privacy policy is being reviewed by the Faculty's legal team and will replace this placeholder once approved.",
    placeholderHeading: "What you can expect today",
    placeholderItems: [
      "We collect only the information needed to respond to your enquiry — name, email, and the message you send via the contact form.",
      "We do not use third-party marketing or tracking cookies. The only cookie set on this site stores your language preference (TH or EN).",
      "All form submissions are transmitted over HTTPS and handled under Chulalongkorn University's data-handling regulations.",
      "To access, correct, or delete information you have submitted, write to comminno@chula.ac.th.",
    ],
    metaDesc:
      "Comm.Inno privacy notice — what we collect, how we use it, and how to reach us. Full PDPA policy pending legal review.",
  },
} as const;

export default function Privacy() {
  const { locale } = useLocale();
  const t = COPY[locale];

  usePageMeta({
    title: t.title,
    description: t.metaDesc,
    path: `/${locale}/privacy`,
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

      <article className="container py-12 md:py-16 max-w-3xl">
        <div
          className="rounded-xl border p-6 md:p-7 mb-10"
          style={{
            borderColor: "color-mix(in srgb, var(--warning) 35%, #fff)",
            backgroundColor: "color-mix(in srgb, var(--warning) 8%, #fff)",
          }}
        >
          <h2
            className="font-display text-lg md:text-xl mb-2"
            style={{ color: "var(--ink)" }}
          >
            {t.pendingTitle}
          </h2>
          <p style={{ color: "var(--ink)", lineHeight: 1.55 }}>{t.pendingBody}</p>
        </div>

        <h2
          className="font-display text-xl md:text-2xl mb-4"
          style={{ color: "var(--ink)" }}
        >
          {t.placeholderHeading}
        </h2>
        <ul className="grid gap-4">
          {t.placeholderItems.map((item, i) => (
            <li
              key={i}
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--mist)",
                backgroundColor: "#fff",
                color: "var(--ink)",
                lineHeight: 1.6,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
