/**
 * About — /th/about & /en/about
 *
 * Renders mission, three operating pillars, three faculty heads (with
 * anchor IDs so /about#smith / #teerada / #pavel land mid-page), and a
 * "Wider research team" list of 8 names.
 *
 * TH content for the mission and pillars is currently the same as EN
 * (source markdown was Thai-flagged but the body is English research
 * abstract style — the TH page therefore shows the same paragraphs with
 * a small "Thai translation in progress" notice, per Task 2 decision (a)).
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { about } from "@/content/about";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocaleLink } from "@/i18n/LocaleLink";

const COPY = {
  th: {
    title: "เกี่ยวกับเรา",
    lede: "ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    crumbHome: "หน้าแรก",
    crumbSelf: "เกี่ยวกับเรา",
    missionTitle: "พันธกิจ",
    pillarsTitle: "พื้นที่ดำเนินงานหลัก 3 ด้าน",
    facultyTitle: "ทีมหลัก",
    facultyEduLabel: "การศึกษา",
    facultyPositionLabel: "ตำแหน่งปัจจุบัน",
    widerTitle: "ทีมนักวิจัยและผู้ร่วมงาน",
    widerLede: "บุคลากรที่ร่วมงานกับศูนย์ในโครงการวิจัย การออกแบบสื่อ และงานฝึกอบรม",
    metaDesc:
      "Comm.Inno คือศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย รู้จักพันธกิจ พื้นที่ดำเนินงานสามด้าน และทีมนักวิจัยหลัก",
    bilingualNotice: "ส่วนหนึ่งของเนื้อหาในหน้านี้ยังเป็นภาษาอังกฤษ ฉบับแปลภาษาไทยอยู่ระหว่างจัดทำ",
    pavelNote: "ตำแหน่งของอาจารย์ปาเวลอยู่ระหว่างยืนยันจากศูนย์ฯ",
  },
  en: {
    title: "About Comm.Inno",
    lede: "Center of Excellence in Communication Innovation, Faculty of Communication Arts, Chulalongkorn University.",
    crumbHome: "Home",
    crumbSelf: "About",
    missionTitle: "Mission",
    pillarsTitle: "Three pillars of work",
    facultyTitle: "Leadership team",
    facultyEduLabel: "Education",
    facultyPositionLabel: "Current position",
    widerTitle: "Wider research team",
    widerLede: "Researchers and staff who collaborate on Comm.Inno projects, designs, and training programs.",
    metaDesc:
      "Comm.Inno is the Center of Excellence in Communication Innovation at the Faculty of Communication Arts, Chulalongkorn University — meet the mission, three pillars, and core research team.",
    bilingualNotice: "",
    pavelNote: "Pavel's title is pending confirmation from the center.",
  },
} as const;

const FACULTY_TH: Record<
  string,
  { name: string; role: string; positionLine?: string }
> = {
  smith: {
    name: "รศ. ดร. สมิทธิ์ บุญชุติมา",
    role: "หัวหน้าหน่วยปฏิบัติการวิจัย",
  },
  teerada: {
    name: "ผศ. ดร. ธีรดา จงกลรัตนาภรณ์",
    role: "รองหัวหน้าหน่วยปฏิบัติการวิจัย",
    positionLine:
      "ผู้ช่วยศาสตราจารย์ ภาควิชาการประชาสัมพันธ์ คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (พ.ศ. 2552 – ปัจจุบัน) และหัวหน้าภาควิชาการประชาสัมพันธ์",
  },
  pavel: {
    name: "รศ. ดร. ปาเวล สลุตสกี้",
    role: "อาจารย์ผู้ทำการวิจัย ภาควิชาการประชาสัมพันธ์",
    positionLine:
      "รองศาสตราจารย์ ภาควิชาการประชาสัมพันธ์ คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (พ.ศ. 2557 – ปัจจุบัน)",
  },
};

export default function About() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const [path] = useLocation();

  // Smooth-scroll to in-page anchor (#team / #smith / etc.) on mount and when the hash changes.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      // Slight delay so layout settles before scrolling.
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [path]);

  usePageMeta({
    title: t.title,
    description: t.metaDesc,
    path: `/${locale}/about`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t.title,
      mainEntity: {
        "@type": "Organization",
        name: "Center of Excellence in Communication Innovation",
        alternateName: "Comm.Inno",
        parentOrganization: {
          "@type": "EducationalOrganization",
          name: "Chulalongkorn University, Faculty of Communication Arts",
        },
        member: about.faculty.map((f) => ({
          "@type": "Person",
          name: f.name,
          jobTitle: f.role,
        })),
      },
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

      <article className="container py-12 md:py-16">
        {locale === "th" && (
          <p
            className="mb-10 rounded-lg border px-4 py-3 text-sm"
            style={{
              borderColor: "var(--mist)",
              color: "var(--ink-muted)",
              backgroundColor: "#fff",
            }}
          >
            {t.bilingualNotice}
          </p>
        )}

        {/* Mission */}
        <section className="grid gap-10 md:grid-cols-12 mb-16">
          <header className="md:col-span-4">
            <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
              {t.missionTitle}
            </h2>
          </header>
          <div className="md:col-span-8">
            <p
              className="text-pretty"
              style={{
                fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)",
                lineHeight: 1.6,
                color: "var(--ink)",
              }}
            >
              {about.missionEn}
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section className="grid gap-10 md:grid-cols-12 mb-16">
          <header className="md:col-span-4">
            <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
              {t.pillarsTitle}
            </h2>
          </header>
          <ol className="md:col-span-8 space-y-5">
            {about.pillarsEn.map((p, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-lg border p-5"
                style={{ borderColor: "var(--mist)", backgroundColor: "#fff" }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--brand-red)",
                    color: "#fff",
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ color: "var(--ink)", lineHeight: 1.55 }}>{p}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Faculty (anchor target #team for header link) */}
        <section id="team" className="mb-16 scroll-mt-24">
          <header className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
              {t.facultyTitle}
            </h2>
          </header>

          <div className="grid gap-8 md:grid-cols-3">
            {about.faculty.map((f) => {
              const localized = FACULTY_TH[f.slug];
              const displayName = locale === "th" && localized ? localized.name : f.name;
              const displayRole = locale === "th" && localized ? localized.role : f.role;
              const displayPosition =
                locale === "th" && localized?.positionLine
                  ? localized.positionLine
                  : f.position;
              return (
                <article
                  id={f.slug}
                  key={f.slug}
                  className="scroll-mt-24 flex flex-col gap-3 rounded-xl border p-5"
                  style={{ borderColor: "var(--mist)", backgroundColor: "#fff" }}
                >
                  {/* Portrait placeholder (1:1) — real images arrive in comminno_images.zip */}
                  <div
                    role="img"
                    aria-label={`Portrait of ${f.name}`}
                    className="aspect-square w-full rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--brand-yellow) 18%, var(--brand-paper)), color-mix(in srgb, var(--brand-blue) 18%, var(--brand-paper)))",
                    }}
                  />
                  <h3 className="font-display text-xl" style={{ color: "var(--ink)" }}>
                    {displayName}
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--brand-red)" }}
                  >
                    {displayRole}
                  </p>
                  {displayPosition && (
                    <p className="text-sm" style={{ color: "var(--ink-muted)", lineHeight: 1.55 }}>
                      <strong style={{ color: "var(--ink)" }}>{t.facultyPositionLabel}:</strong>{" "}
                      {displayPosition}
                    </p>
                  )}
                  {f.education.length > 0 && (
                    <details className="text-sm">
                      <summary
                        className="cursor-pointer font-medium"
                        style={{ color: "var(--ink)" }}
                      >
                        {t.facultyEduLabel}
                      </summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5" style={{ color: "var(--ink-muted)" }}>
                        {f.education.map((edu, i) => (
                          <li key={i}>{edu}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                  {f._note && (
                    <p
                      className="text-xs italic"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {t.pavelNote}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Wider team */}
        {about.widerTeam.length > 0 && (
          <section className="border-t pt-10" style={{ borderTopColor: "var(--mist)" }}>
            <header className="mb-4">
              <h2 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
                {t.widerTitle}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                {t.widerLede}
              </p>
            </header>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 md:grid-cols-3 text-sm" style={{ color: "var(--ink)" }}>
              {about.widerTeam.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Back nav */}
        <div className="mt-12">
          <LocaleLink
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: "var(--brand-red)" }}
          >
            ← {t.crumbHome}
          </LocaleLink>
        </div>
      </article>
    </>
  );
}
