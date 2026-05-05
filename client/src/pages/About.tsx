/**
 * About — /th/about & /en/about
 *
 * Renders the canonical Comm.Inno team architecture:
 *   - Mission + three pillars (bilingual)
 *   - Tier 1 — Center Leadership (3 hero cards, bilingual bios, ORCID +
 *     Google Scholar icon-buttons, 5 most-recent peer-reviewed pubs)
 *   - Tier 2 — Center Faculty (1 secondary card)
 *   - Tier 3 — Research team & staff (grid of 8)
 *   - Strategic Partners (TNSU Samut Sakhon Campus + bridge contact)
 *
 * Locale rules per CIC_Faculty_for_Manus.md §4:
 *   - On /th, Thai name is primary; English name is secondary line.
 *   - On /en, English name is primary; Thai name is secondary line.
 *   - ORCID / Google Scholar render as icon-buttons under each name.
 *     For people without these IDs, a small "ORCID coming soon" /
 *     "Scholar coming soon" placeholder pill is shown in their slot.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { about } from "@/content/about";
import type { TeamMember, ResearchStaff, Partner } from "@/content/types";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocaleLink } from "@/i18n/LocaleLink";

type AboutCopy = {
  title: string;
  lede: string;
  crumbHome: string;
  crumbSelf: string;
  missionTitle: string;
  pillarsTitle: string;
  leadershipTitle: string;
  leadershipLede: string;
  facultyTitle: string;
  facultyLede: string;
  researchTeamTitle: string;
  researchTeamLede: string;
  partnersTitle: string;
  partnersLede: string;
  bioLabel: string;
  expertiseLabel: string;
  publicationsLabel: string;
  emailLabel: string;
  contactLabel: string;
  synergyLabel: string;
  websiteLabel: string;
  orcidPending: string;
  scholarPending: string;
  spellingPending: string;
  metaDesc: string;
};

const COPY: Record<"th" | "en", AboutCopy> = {
  th: {
    title: "เกี่ยวกับเรา",
    lede: "ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    crumbHome: "หน้าแรก",
    crumbSelf: "เกี่ยวกับเรา",
    missionTitle: "พันธกิจ",
    pillarsTitle: "พื้นที่ดำเนินงานหลัก 3 ด้าน",
    leadershipTitle: "ผู้บริหารศูนย์",
    leadershipLede:
      "ทีมผู้บริหารและนักวิจัยหลักสามท่านที่ขับเคลื่อนงานวิจัยและนวัตกรรมการสื่อสารของศูนย์ฯ",
    facultyTitle: "อาจารย์ประจำศูนย์",
    facultyLede: "อาจารย์และนักวิจัยที่เป็นกำลังสำคัญของศูนย์ฯ",
    researchTeamTitle: "ทีมวิจัยและเจ้าหน้าที่",
    researchTeamLede:
      "ทีมนักวิจัยและเจ้าหน้าที่สนับสนุนที่ทำงานร่วมกับศูนย์ในโครงการวิจัยและการออกแบบสื่อ",
    partnersTitle: "พันธมิตรเชิงยุทธศาสตร์",
    partnersLede:
      "องค์กรและสถาบันที่ร่วมขับเคลื่อนงานวิจัยและพัฒนาการสื่อสารกับศูนย์ฯ",
    bioLabel: "ประวัติโดยย่อ",
    expertiseLabel: "ความเชี่ยวชาญ",
    publicationsLabel: "ผลงานตีพิมพ์ล่าสุด",
    emailLabel: "อีเมล",
    contactLabel: "ผู้ประสานงาน",
    synergyLabel: "จุดเชื่อมโยงกับศูนย์",
    websiteLabel: "เว็บไซต์",
    orcidPending: "ORCID เร็วๆ นี้",
    scholarPending: "Google Scholar เร็วๆ นี้",
    spellingPending: "การสะกดภาษาไทยอยู่ระหว่างยืนยัน",
    metaDesc:
      "Comm.Inno คือศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย พบทีมผู้บริหาร 3 ท่าน อาจารย์ประจำศูนย์ ทีมวิจัย 8 ท่าน และพันธมิตรเชิงยุทธศาสตร์",
  },
  en: {
    title: "About Comm.Inno",
    lede: "Center of Excellence in Communication Innovation, Faculty of Communication Arts, Chulalongkorn University.",
    crumbHome: "Home",
    crumbSelf: "About",
    missionTitle: "Mission",
    pillarsTitle: "Three pillars of work",
    leadershipTitle: "Center leadership",
    leadershipLede:
      "Three principal investigators steering Comm.Inno's research and communication-innovation programmes.",
    facultyTitle: "Center faculty",
    facultyLede:
      "Faculty and research affiliates who anchor specific research lines.",
    researchTeamTitle: "Research team & staff",
    researchTeamLede:
      "Researchers and staff who collaborate on Comm.Inno projects, designs, and training programmes.",
    partnersTitle: "Strategic partners",
    partnersLede:
      "Institutions and organisations co-driving Comm.Inno's research and capacity building.",
    bioLabel: "Biography",
    expertiseLabel: "Expertise",
    publicationsLabel: "Recent publications",
    emailLabel: "Email",
    contactLabel: "Bridge contact",
    synergyLabel: "Synergy with the center",
    websiteLabel: "Website",
    orcidPending: "ORCID coming soon",
    scholarPending: "Scholar coming soon",
    spellingPending: "Thai spelling pending verification",
    metaDesc:
      "Comm.Inno is the Center of Excellence in Communication Innovation at the Faculty of Communication Arts, Chulalongkorn University — meet the three center leaders, faculty, an eight-person research team, and strategic partners.",
  },
} as const;

/** Tiny inline SVG icon — keeps page bundle free of icon library overhead for these 4 marks. */
function ProfileIcon({ kind }: { kind: "orcid" | "scholar" | "rg" | "linkedin" | "scopus" | "wos" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (kind) {
    case "orcid":
      // Stylised "iD" — ORCID brand mark approximation (single-color, accessible).
      return (
        <svg {...common} fill="currentColor">
          <circle cx="12" cy="12" r="11" opacity=".15" />
          <path d="M8 7.2h1.7v9.6H8zm.85-2.55a1 1 0 110 2 1 1 0 010-2zM11.4 7.2h4.05c2.6 0 4.45 1.95 4.45 4.8 0 2.85-1.85 4.8-4.45 4.8H11.4zm1.7 1.55v6.5h2.25c1.7 0 2.85-1.3 2.85-3.25S17.05 8.75 15.35 8.75z" />
        </svg>
      );
    case "scholar":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2L1 9l11 7 9-5.73V17h2V9zM5 13.18v3.91L12 22l7-4.91v-3.91l-7 4.5z" />
        </svg>
      );
    case "rg":
      return (
        <svg {...common} fill="currentColor">
          <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 18H6.7v-7.1h1.8zm-.9-7.9a1 1 0 110-2 1 1 0 010 2zM18 18h-1.8v-3.5c0-.83-.02-1.9-1.16-1.9s-1.34.9-1.34 1.84V18h-1.8v-7.1h1.73v.97h.02c.24-.45.83-.93 1.71-.93 1.83 0 2.17 1.2 2.17 2.77z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.34 17.34H5.67V9.67h2.67zM7 8.36a1.55 1.55 0 110-3.1 1.55 1.55 0 010 3.1zm11.34 8.98h-2.67v-3.74c0-.89-.02-2.04-1.24-2.04s-1.43.97-1.43 1.97v3.81h-2.67V9.67h2.56v1.05h.04c.36-.68 1.23-1.4 2.54-1.4 2.72 0 3.22 1.79 3.22 4.13z" />
        </svg>
      );
    case "scopus":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 14.5h-3v-1.6h3v1.6zm0-3.4h-3v-1.6h3v1.6zm0-3.4h-3V8.1h3v1.6zm6 6.8h-4.8v-1.6h4.8v1.6zm0-3.4h-4.8v-1.6h4.8v1.6zm0-3.4h-4.8V8.1h4.8v1.6z" />
        </svg>
      );
    case "wos":
      return (
        <svg {...common} fill="currentColor">
          <path d="M3 4l3 16h2l1.5-9 1.5 9h2l3-16h-2L12 14 10.5 5h-1L8 14 6.5 4z" />
          <circle cx="18.5" cy="6.5" r="2" />
        </svg>
      );
  }
}

/** ORCID / Scholar / etc. icon-buttons under a person's name. */
function ProfileLinks({
  links,
  pendingOrcidLabel,
  pendingScholarLabel,
}: {
  links: TeamMember["links"];
  pendingOrcidLabel: string;
  pendingScholarLabel: string;
}) {
  const items: Array<{ kind: Parameters<typeof ProfileIcon>[0]["kind"]; href: string; label: string }> = [];
  if (links.orcid) items.push({ kind: "orcid", href: links.orcid, label: "ORCID" });
  if (links.scholar) items.push({ kind: "scholar", href: links.scholar, label: "Google Scholar" });
  if (links.scopus) items.push({ kind: "scopus", href: links.scopus, label: "Scopus" });
  if (links.researchgate) items.push({ kind: "rg", href: links.researchgate, label: "ResearchGate" });
  if (links.webOfScience) items.push({ kind: "wos", href: links.webOfScience, label: "Web of Science" });
  if (links.linkedin) items.push({ kind: "linkedin", href: links.linkedin, label: "LinkedIn" });
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Research profiles">
      {items.map((it) => (
        <li key={it.kind}>
          <a
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={it.label}
            title={it.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-105"
            style={{
              borderColor: "var(--mist)",
              color: "var(--brand-red)",
              backgroundColor: "#fff",
            }}
          >
            <ProfileIcon kind={it.kind} />
          </a>
        </li>
      ))}
      {links.orcidPending && (
        <li>
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs italic"
            style={{ borderColor: "var(--mist)", color: "var(--ink-muted)", backgroundColor: "var(--brand-paper)" }}
          >
            {pendingOrcidLabel}
          </span>
        </li>
      )}
      {links.scholarPending && (
        <li>
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs italic"
            style={{ borderColor: "var(--mist)", color: "var(--ink-muted)", backgroundColor: "var(--brand-paper)" }}
          >
            {pendingScholarLabel}
          </span>
        </li>
      )}
    </ul>
  );
}

/** Multi-paragraph bio renderer (split on \n\n, render each as a <p>). */
function BioParagraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-3" : ""} style={{ color: "var(--ink)", lineHeight: 1.65 }}>
          {p.trim()}
        </p>
      ))}
    </>
  );
}

/** A leadership / faculty hero card. */
function PersonCard({
  member,
  locale,
  t,
  isHero,
}: {
  member: TeamMember;
  locale: "th" | "en";
  t: AboutCopy;
  isHero: boolean;
}) {
  const primaryName = locale === "th" ? member.nameTh : member.nameEn;
  const secondaryName = locale === "th" ? member.nameEn : member.nameTh;
  const centerRole = locale === "th" ? member.centerRoleTh : member.centerRoleEn;
  const facultyRole = locale === "th" ? member.facultyRoleTh : member.facultyRoleEn;
  const internationalRole =
    locale === "th" ? member.internationalRoleTh : member.internationalRoleEn;
  const expertise = locale === "th" ? member.expertiseTh : member.expertiseEn;
  const bio = locale === "th" ? member.bioTh : member.bioEn;

  return (
    <article
      id={member.slug}
      className="scroll-mt-24 rounded-xl border bg-white p-6 md:p-7"
      style={{ borderColor: "var(--mist)" }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:gap-7">
        {/* Portrait — real photo when available, gradient placeholder otherwise. */}
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.photoAlt ?? member.nameEn}
            width={isHero ? 480 : 352}
            height={isHero ? 480 : 352}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full flex-none rounded-lg object-cover md:w-44"
            style={{ backgroundColor: "var(--brand-paper)" }}
          />
        ) : (
          <div
            role="img"
            aria-label={`Portrait of ${member.nameEn}`}
            className="aspect-[4/5] w-full flex-none rounded-lg md:w-44"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--brand-yellow) 22%, var(--brand-paper)), color-mix(in srgb, var(--brand-blue) 22%, var(--brand-paper)))",
            }}
          />
        )}
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display ${isHero ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
            style={{ color: "var(--ink)", lineHeight: 1.2 }}
          >
            {primaryName}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            {secondaryName}
          </p>
          <p className="mt-3 text-sm font-semibold" style={{ color: "var(--brand-red)" }}>
            {centerRole}
          </p>
          {facultyRole && (
            <p className="mt-1 text-sm" style={{ color: "var(--ink)" }}>
              {facultyRole}
            </p>
          )}
          {internationalRole && (
            <p
              className="mt-2 rounded-md border px-3 py-2 text-sm italic"
              style={{
                borderColor: "var(--mist)",
                color: "var(--ink)",
                backgroundColor: "var(--brand-paper)",
              }}
            >
              {internationalRole}
            </p>
          )}
          <ProfileLinks
            links={member.links}
            pendingOrcidLabel={t.orcidPending}
            pendingScholarLabel={t.scholarPending}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h4
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--ink-muted)" }}
          >
            {t.bioLabel}
          </h4>
          <div className="mt-2">
            <BioParagraphs text={bio} />
          </div>
          {member.email && (
            <p className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
              <strong style={{ color: "var(--ink)" }}>{t.emailLabel}:</strong>{" "}
              <a href={`mailto:${member.email}`} style={{ color: "var(--brand-red)" }}>
                {member.email}
              </a>
            </p>
          )}
        </div>
        <div>
          {expertise && (
            <>
              <h4
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--ink-muted)" }}
              >
                {t.expertiseLabel}
              </h4>
              <p className="mt-2 text-sm" style={{ color: "var(--ink)", lineHeight: 1.6 }}>
                {expertise}
              </p>
            </>
          )}
          {member.publications && member.publications.length > 0 && (
            <details className="mt-5 group" open={isHero}>
              <summary
                className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--brand-red)" }}
              >
                <span className="inline-flex items-center gap-1.5">
                  {t.publicationsLabel}
                  <span aria-hidden className="transition group-open:rotate-180">▾</span>
                </span>
              </summary>
              <ul className="mt-3 space-y-3">
                {member.publications.map((pub, i) => (
                  <li
                    key={i}
                    className="text-sm"
                    style={{ color: "var(--ink)", lineHeight: 1.55 }}
                  >
                    <span
                      className="mr-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: "var(--brand-paper)", color: "var(--brand-red)" }}
                    >
                      {pub.year}
                    </span>
                    {pub.citationEn}
                    {(pub.doi || pub.url) && (
                      <>
                        {" "}
                        <a
                          href={pub.doi ?? pub.url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline decoration-dotted underline-offset-2"
                          style={{ color: "var(--brand-red)" }}
                        >
                          {pub.doi ? "DOI" : "View"} ↗
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </article>
  );
}

function ResearchTeamCard({
  member,
  locale,
  pendingLabel,
}: {
  member: ResearchStaff;
  locale: "th" | "en";
  pendingLabel: string;
}) {
  const primary = locale === "th" ? member.nameTh : member.nameEn;
  const secondary = locale === "th" ? member.nameEn : member.nameTh;
  const role = locale === "th" ? member.roleTh : member.roleEn;
  return (
    <li
      className="rounded-lg border bg-white p-4"
      style={{ borderColor: "var(--mist)" }}
    >
      <div
        role="img"
        aria-label={`Portrait of ${member.nameEn}`}
        className="mb-3 aspect-square w-full rounded-md"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--brand-green) 18%, var(--brand-paper)), color-mix(in srgb, var(--brand-blue) 18%, var(--brand-paper)))",
        }}
      />
      <p className="font-semibold" style={{ color: "var(--ink)" }}>
        {primary}
      </p>
      <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
        {secondary}
      </p>
      <p
        className="mt-2 text-xs font-medium"
        style={{ color: "var(--brand-red)" }}
      >
        {role}
      </p>
      {member.thaiSpellingPending && locale === "th" && (
        <p className="mt-2 text-[11px] italic" style={{ color: "var(--ink-muted)" }}>
          {pendingLabel}
        </p>
      )}
    </li>
  );
}

function PartnerCard({
  partner,
  locale,
  t,
}: {
  partner: Partner;
  locale: "th" | "en";
  t: AboutCopy;
}) {
  const org = locale === "th" ? partner.organizationTh : partner.organizationEn;
  const altOrg = locale === "th" ? partner.organizationEn : partner.organizationTh;
  const contactName =
    locale === "th" ? partner.contactNameTh : partner.contactNameEn;
  const contactRole =
    locale === "th" ? partner.contactRoleTh : partner.contactRoleEn;
  const synergy = locale === "th" ? partner.synergyTh : partner.synergyEn;
  return (
    <article
      id={partner.slug}
      className="scroll-mt-24 rounded-xl border bg-white p-6 md:p-7"
      style={{ borderColor: "var(--mist)" }}
    >
      <h3 className="font-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
        {org}
      </h3>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
        {altOrg}
      </p>
      {contactName && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ink-muted)" }}>
            {t.contactLabel}
          </p>
          <p className="mt-1 font-semibold" style={{ color: "var(--ink)" }}>
            {contactName}
          </p>
          {contactRole && (
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
              {contactRole}
            </p>
          )}
        </div>
      )}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ink-muted)" }}>
          {t.synergyLabel}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--ink)", lineHeight: 1.6 }}>
          {synergy}
        </p>
      </div>
      {partner.websiteUrl && (
        <p className="mt-4 text-sm">
          <strong style={{ color: "var(--ink)" }}>{t.websiteLabel}:</strong>{" "}
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--brand-red)" }}
            className="underline decoration-dotted underline-offset-2"
          >
            {partner.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
          </a>
        </p>
      )}
    </article>
  );
}

export default function About() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const [path] = useLocation();

  // Smooth-scroll to in-page anchor (#leadership / #partners / #smith etc.) on mount and hash change.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [path]);

  const mission = locale === "th" && about.missionTh ? about.missionTh : about.missionEn;
  const pillars = locale === "th" && about.pillarsTh ? about.pillarsTh : about.pillarsEn;

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
        member: [...about.leadership, ...about.faculty2].map((m) => ({
          "@type": "Person",
          name: m.nameEn,
          jobTitle: m.centerRoleEn,
          ...(m.email ? { email: m.email } : {}),
          ...(m.links.orcid ? { identifier: m.links.orcid } : {}),
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
              {mission}
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
            {pillars.map((p, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-lg border p-5"
                style={{ borderColor: "var(--mist)", backgroundColor: "#fff" }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold"
                  style={{ backgroundColor: "var(--brand-red)", color: "#fff" }}
                >
                  {i + 1}
                </span>
                <p style={{ color: "var(--ink)", lineHeight: 1.55 }}>{p}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tier 1 — Leadership (anchor target #team and #leadership) */}
        <section id="team" className="mb-16 scroll-mt-24">
          <a id="leadership" className="block scroll-mt-24" />
          <header className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
              {t.leadershipTitle}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
              {t.leadershipLede}
            </p>
          </header>
          <div className="space-y-8">
            {about.leadership.map((m) => (
              <PersonCard key={m.slug} member={m} locale={locale} t={t} isHero />
            ))}
          </div>
        </section>

        {/* Tier 2 — Faculty */}
        {about.faculty2.length > 0 && (
          <section id="faculty" className="mb-16 scroll-mt-24">
            <header className="mb-6">
              <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
                {t.facultyTitle}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                {t.facultyLede}
              </p>
            </header>
            <div className="space-y-8">
              {about.faculty2.map((m) => (
                <PersonCard key={m.slug} member={m} locale={locale} t={t} isHero={false} />
              ))}
            </div>
          </section>
        )}

        {/* Tier 3 — Research team grid */}
        {about.researchTeam.length > 0 && (
          <section id="research-team" className="mb-16 scroll-mt-24">
            <header className="mb-6">
              <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
                {t.researchTeamTitle}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                {t.researchTeamLede}
              </p>
            </header>
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {about.researchTeam.map((m) => (
                <ResearchTeamCard
                  key={m.slug}
                  member={m}
                  locale={locale}
                  pendingLabel={t.spellingPending}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Strategic Partners */}
        {about.partners.length > 0 && (
          <section id="partners" className="mb-16 scroll-mt-24">
            <header className="mb-6">
              <h2 className="font-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>
                {t.partnersTitle}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                {t.partnersLede}
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
              {about.partners.map((p) => (
                <PartnerCard key={p.slug} partner={p} locale={locale} t={t} />
              ))}
            </div>
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
