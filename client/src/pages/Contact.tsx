/**
 * Contact — /th/contact & /en/contact
 *
 * Renders the center's address (Mongkut Sammitr Building) plus a contact
 * form that posts to mailto: as a placeholder. The Resend integration
 * lives in a server route added later via webdev_add_feature.
 */
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";

const COPY = {
  th: {
    title: "ติดต่อศูนย์ฯ",
    lede:
      "อยากร่วมงานวิจัย จัดอบรม ผลิตสื่อ หรือจัดอีเวนต์เพื่อสร้างผลกระทบทางสังคม ส่งโจทย์มาทางฟอร์มหรืออีเมลด้านล่าง ทีมเราจะตอบกลับภายใน 5 วันทำการ",
    crumbHome: "หน้าแรก",
    crumbSelf: "ติดต่อ",
    addrTitle: "ที่ตั้งสำนักงาน",
    addr1: "ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร",
    addr2: "อาคารมงกุฎสมมติ ชั้น 2 คณะนิเทศศาสตร์",
    addr3: "จุฬาลงกรณ์มหาวิทยาลัย แขวงวังใหม่ เขตปทุมวัน",
    addr4: "กรุงเทพฯ 10330",
    emailLabel: "อีเมล",
    phoneLabel: "โทรศัพท์",
    formTitle: "ส่งข้อความ",
    nameLabel: "ชื่อ-นามสกุล",
    emailFieldLabel: "อีเมล",
    orgLabel: "องค์กร (ไม่จำเป็น)",
    messageLabel: "เรื่องที่ต้องการปรึกษา",
    pdpaConsent:
      "ฉันยินยอมให้ศูนย์ฯ เก็บและใช้ข้อมูลที่ส่งผ่านฟอร์มนี้เพื่อตอบกลับและประสานงานเท่านั้น",
    submit: "ส่งข้อความ",
    placeholderNotice:
      "ฟอร์มยังเป็นเวอร์ชันชั่วคราว — เมื่อกด \"ส่ง\" ระบบจะเปิดอีเมลพร้อมเนื้อหาที่กรอก หลัง MVP เปิดใช้งานจะเชื่อมกับ Resend",
    metaDesc:
      "ติดต่อศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร จุฬาลงกรณ์มหาวิทยาลัย — อาคารมงกุฎสมมติ คณะนิเทศศาสตร์ ปทุมวัน กรุงเทพฯ 10330",
  },
  en: {
    title: "Contact us",
    lede:
      "Have a research question, a training need, a communication brief, or a campaign idea? Send us a message — we reply within five working days.",
    crumbHome: "Home",
    crumbSelf: "Contact",
    addrTitle: "Where to find us",
    addr1: "Center of Excellence in Communication Innovation",
    addr2: "Mongkut Sammitr Building, 2nd floor",
    addr3: "Faculty of Communication Arts, Chulalongkorn University",
    addr4: "Pathumwan, Bangkok 10330, Thailand",
    emailLabel: "Email",
    phoneLabel: "Phone",
    formTitle: "Send a message",
    nameLabel: "Full name",
    emailFieldLabel: "Email",
    orgLabel: "Organization (optional)",
    messageLabel: "Your message",
    pdpaConsent:
      "I consent to the center storing my submitted details for the sole purpose of responding to this enquiry.",
    submit: "Send message",
    placeholderNotice:
      "The contact form is in placeholder mode — clicking \"Send\" opens your email client with the message pre-filled. A Resend-backed handler will replace this after MVP launch.",
    metaDesc:
      "Reach the Center of Excellence in Communication Innovation, Faculty of Communication Arts, Chulalongkorn University. Mongkut Sammitr Building, Pathumwan, Bangkok 10330.",
  },
} as const;

const CENTER_EMAIL = "comminno@chula.ac.th";

export default function Contact() {
  const { locale } = useLocale();
  const t = COPY[locale];

  usePageMeta({
    title: t.title,
    description: t.metaDesc,
    path: `/${locale}/contact`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Comm.Inno",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Mongkut Sammitr Building, Faculty of Communication Arts, Chulalongkorn University",
        addressLocality: "Pathumwan",
        addressRegion: "Bangkok",
        postalCode: "10330",
        addressCountry: "TH",
      },
      email: CENTER_EMAIL,
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    message: "",
    consent: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    const subject = encodeURIComponent(`[Comm.Inno] Enquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.org}\n\n${form.message}`,
    );
    window.location.href = `mailto:${CENTER_EMAIL}?subject=${subject}&body=${body}`;
  };

  const inputStyle: React.CSSProperties = {
    borderColor: "var(--mist)",
    backgroundColor: "#fff",
    color: "var(--ink)",
  };

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
        <div className="grid gap-10 md:grid-cols-12">
          {/* Address card */}
          <aside className="md:col-span-5">
            <div
              className="rounded-xl p-6 md:p-7"
              style={{
                backgroundColor: "var(--brand-paper)",
                border: "1px solid var(--mist)",
              }}
            >
              <h2
                className="font-display text-xl mb-4"
                style={{ color: "var(--ink)" }}
              >
                {t.addrTitle}
              </h2>
              <p className="flex gap-3 mb-4" style={{ color: "var(--ink)" }}>
                <MapPin
                  size={18}
                  className="flex-shrink-0 mt-1"
                  style={{ color: "var(--brand-red)" }}
                  aria-hidden="true"
                />
                <span>
                  {t.addr1}<br />
                  {t.addr2}<br />
                  {t.addr3}<br />
                  {t.addr4}
                </span>
              </p>
              <p className="flex items-center gap-3 mb-3" style={{ color: "var(--ink)" }}>
                <Mail
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: "var(--brand-red)" }}
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${CENTER_EMAIL}`}
                  style={{ color: "var(--ink)" }}
                  className="hover:underline"
                >
                  {CENTER_EMAIL}
                </a>
              </p>
              <p className="flex items-center gap-3" style={{ color: "var(--ink-muted)" }}>
                <Phone
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: "var(--brand-red)" }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: "0.875rem" }}>
                  {t.phoneLabel}: +66 (0)2 218 2215
                </span>
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="md:col-span-7">
            <h2
              className="font-display text-xl mb-4"
              style={{ color: "var(--ink)" }}
            >
              {t.formTitle}
            </h2>
            <p
              className="mb-6 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, var(--warning) 35%, #fff)",
                backgroundColor: "color-mix(in srgb, var(--warning) 8%, #fff)",
                color: "var(--ink)",
              }}
            >
              {t.placeholderNotice}
            </p>

            <form onSubmit={onSubmit} className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {t.nameLabel}
                </span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-lg border px-3 py-2"
                  style={inputStyle}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {t.emailFieldLabel}
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="rounded-lg border px-3 py-2"
                  style={inputStyle}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {t.orgLabel}
                </span>
                <input
                  type="text"
                  value={form.org}
                  onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
                  className="rounded-lg border px-3 py-2"
                  style={inputStyle}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {t.messageLabel}
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="rounded-lg border px-3 py-2"
                  style={inputStyle}
                />
              </label>

              <label className="flex items-start gap-2 text-sm" style={{ color: "var(--ink)" }}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  className="mt-1 flex-shrink-0"
                  required
                />
                <span style={{ lineHeight: 1.5 }}>{t.pdpaConsent}</span>
              </label>

              <div>
                <button
                  type="submit"
                  disabled={!form.consent}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-red)" }}
                >
                  {t.submit} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
