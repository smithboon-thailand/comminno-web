/**
 * Contact — /th/contact & /en/contact
 *
 * MVP form posts to Formspree (free tier). Endpoint comes from
 * VITE_CONTACT_ENDPOINT so the production form ID can be swapped without
 * a code change. The placeholder default keeps the form testable in dev:
 * Formspree returns a 404 for the placeholder, which the inline error
 * state surfaces naturally.
 *
 * Required fields (per brief):
 *   - name, email, organization, service interest (9-option dropdown),
 *     message, PDPA consent checkbox.
 *
 * Spam protection:
 *   - Honeypot field "company_url" — display:none + aria-hidden. Bots
 *     fill anything visible; humans never touch it. Filled value → silent
 *     success (we don't tell the bot it was caught).
 *   - Client-side rate limit via localStorage:
 *       30-second cooldown between submissions
 *       max 5 submissions per rolling 60-minute window
 *     Both rules return an inline error WITHOUT contacting Formspree.
 *
 * UX:
 *   - Inline success state (replaces the form) — no toast.
 *   - Inline error state above the submit button.
 *   - aria-live="polite" status for screen-reader announcements.
 *   - Submit button disabled while pending and while consent is unchecked.
 */
import { useState, useId } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocaleLink } from "@/i18n/LocaleLink";
import { services as serviceCatalog } from "@/content/services";
import { ArrowRight, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react";

const ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT ?? "https://formspree.io/f/PLACEHOLDER";
const RATE_LIMIT_KEY = "comminno_contact_submissions";
const COOLDOWN_MS = 30_000;
const HOUR_MS = 60 * 60 * 1000;
const HOUR_CAP = 5;

type SubmissionLog = number[];

function readLog(): SubmissionLog {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((n): n is number => typeof n === "number");
  } catch {
    return [];
  }
}

function writeLog(log: SubmissionLog) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(log));
  } catch {
    /* private mode / quota — fail open. */
  }
}

/** Returns null if OK, otherwise an error key. */
function checkRateLimit(): "cooldown" | "hourly" | null {
  const now = Date.now();
  const log = readLog().filter((t) => now - t < HOUR_MS);
  if (log.length > 0 && now - log[log.length - 1] < COOLDOWN_MS) {
    return "cooldown";
  }
  if (log.length >= HOUR_CAP) return "hourly";
  return null;
}

function recordSubmission() {
  const now = Date.now();
  const log = readLog().filter((t) => now - t < HOUR_MS);
  log.push(now);
  writeLog(log);
}

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
    orgLabel: "องค์กร / สังกัด",
    serviceLabel: "บริการที่สนใจ",
    servicePlaceholder: "เลือกบริการ —",
    messageLabel: "เรื่องที่ต้องการปรึกษา",
    pdpaConsent:
      "ฉันยินยอมให้ศูนย์ฯ เก็บและใช้ข้อมูลที่ส่งผ่านฟอร์มนี้เพื่อตอบกลับและประสานงานเท่านั้น ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    pdpaLink: "อ่านนโยบายความเป็นส่วนตัว",
    submit: "ส่งข้อความ",
    submitting: "กำลังส่ง…",
    successTitle: "ขอบคุณครับ/ค่ะ — ส่งข้อความเรียบร้อย",
    successBody:
      "ทีมศูนย์ฯ จะตอบกลับภายใน 5 วันทำการ หากเรื่องเร่งด่วน ติดต่อได้ที่ comminno@chula.ac.th",
    successAgain: "ส่งข้อความเพิ่มเติม",
    errorGeneric:
      "ส่งข้อความไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่ หรืออีเมลตรงไปที่ comminno@chula.ac.th",
    errorCooldown: "กรุณารอสักครู่ก่อนส่งข้อความถัดไป",
    errorHourly: "ส่งข้อความได้สูงสุด 5 ครั้งต่อชั่วโมง โปรดลองใหม่ภายหลัง",
    errorPlaceholder:
      "ปลายทางฟอร์ม (Formspree) ยังไม่ถูกตั้งค่า — ฝ่ายเทคนิคกำลังเชื่อมต่อ ในระหว่างนี้กรุณาส่งอีเมลถึง comminno@chula.ac.th",
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
    orgLabel: "Organization / affiliation",
    serviceLabel: "Service of interest",
    servicePlaceholder: "Select a service —",
    messageLabel: "Your message",
    pdpaConsent:
      "I consent to Comm.Inno storing my submitted details solely to respond to this enquiry, in line with Thailand's Personal Data Protection Act (PDPA).",
    pdpaLink: "Read the privacy notice",
    submit: "Send message",
    submitting: "Sending…",
    successTitle: "Thanks — your message is on its way",
    successBody:
      "We'll reply within five working days. For anything urgent, email comminno@chula.ac.th directly.",
    successAgain: "Send another message",
    errorGeneric:
      "We couldn't send your message. Check your connection and try again, or email comminno@chula.ac.th.",
    errorCooldown: "Please wait a few seconds before sending another message.",
    errorHourly: "You can send up to 5 messages per hour. Please try again later.",
    errorPlaceholder:
      "The form endpoint (Formspree) hasn't been wired up yet — engineering is on it. Meanwhile please email comminno@chula.ac.th.",
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
        streetAddress:
          "Mongkut Sammitr Building, Faculty of Communication Arts, Chulalongkorn University",
        addressLocality: "Pathumwan",
        addressRegion: "Bangkok",
        postalCode: "10330",
        addressCountry: "TH",
      },
      email: CENTER_EMAIL,
    },
  });

  const formId = useId();
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    service: "",
    message: "",
    consent: false,
    company_url: "", // honeypot
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorKey, setErrorKey] = useState<keyof typeof t | null>(null);

  const placeholderEndpoint = ENDPOINT.endsWith("PLACEHOLDER");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent || status === "submitting") return;

    // Honeypot — silently swallow as success so bots can't probe.
    if (form.company_url.trim().length > 0) {
      setStatus("success");
      return;
    }

    const limit = checkRateLimit();
    if (limit) {
      setStatus("error");
      setErrorKey(limit === "cooldown" ? "errorCooldown" : "errorHourly");
      return;
    }

    if (placeholderEndpoint) {
      setStatus("error");
      setErrorKey("errorPlaceholder");
      return;
    }

    setStatus("submitting");
    setErrorKey(null);

    const serviceMeta = serviceCatalog.find((s) => s.slug === form.service);
    const serviceLabel = serviceMeta
      ? locale === "th"
        ? serviceMeta.titleTh ?? serviceMeta.titleEn
        : serviceMeta.titleEn
      : form.service;

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("organization", form.org);
      payload.append("service", serviceLabel);
      payload.append("service_slug", form.service);
      payload.append("message", form.message);
      payload.append("locale", locale);
      payload.append(
        "_subject",
        `[Comm.Inno] ${serviceLabel} enquiry from ${form.name}`,
      );

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!res.ok) {
        throw new Error(`Formspree responded ${res.status}`);
      }

      recordSubmission();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorKey("errorGeneric");
    }
  };

  const inputStyle: React.CSSProperties = {
    borderColor: "var(--mist)",
    backgroundColor: "#fff",
    color: "var(--ink)",
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      org: "",
      service: "",
      message: "",
      consent: false,
      company_url: "",
    });
    setStatus("idle");
    setErrorKey(null);
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
              <p
                className="flex items-center gap-3"
                style={{ color: "var(--ink-muted)" }}
              >
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

          {/* Form (or success card) */}
          <div className="md:col-span-7">
            <h2
              className="font-display text-xl mb-4"
              style={{ color: "var(--ink)" }}
            >
              {t.formTitle}
            </h2>

            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border p-6"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--brand-green) 35%, #fff)",
                  backgroundColor:
                    "color-mix(in srgb, var(--brand-green) 8%, #fff)",
                  color: "var(--ink)",
                }}
              >
                <h3 className="flex items-center gap-2 font-display text-lg mb-2">
                  <CheckCircle2
                    size={20}
                    style={{ color: "var(--brand-green)" }}
                    aria-hidden="true"
                  />
                  {t.successTitle}
                </h3>
                <p style={{ lineHeight: 1.55 }}>{t.successBody}</p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                  style={{ color: "var(--brand-red)" }}
                >
                  {t.successAgain} <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4" noValidate>
                {/* Honeypot — visually hidden, never tab-stop */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-10000px",
                    top: "auto",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                  }}
                >
                  <label>
                    Company URL (leave blank)
                    <input
                      type="text"
                      name="company_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company_url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, company_url: e.target.value }))
                      }
                    />
                  </label>
                </div>

                <label className="grid gap-1.5" htmlFor={`${formId}-name`}>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {t.nameLabel}
                  </span>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="rounded-lg border px-3 py-2"
                    style={inputStyle}
                  />
                </label>

                <label className="grid gap-1.5" htmlFor={`${formId}-email`}>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {t.emailFieldLabel}
                  </span>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="rounded-lg border px-3 py-2"
                    style={inputStyle}
                  />
                </label>

                <label className="grid gap-1.5" htmlFor={`${formId}-org`}>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {t.orgLabel}
                  </span>
                  <input
                    id={`${formId}-org`}
                    name="organization"
                    required
                    type="text"
                    autoComplete="organization"
                    value={form.org}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, org: e.target.value }))
                    }
                    className="rounded-lg border px-3 py-2"
                    style={inputStyle}
                  />
                </label>

                <label className="grid gap-1.5" htmlFor={`${formId}-service`}>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {t.serviceLabel}
                  </span>
                  <select
                    id={`${formId}-service`}
                    name="service"
                    required
                    value={form.service}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, service: e.target.value }))
                    }
                    className="rounded-lg border px-3 py-2"
                    style={inputStyle}
                  >
                    <option value="" disabled>
                      {t.servicePlaceholder}
                    </option>
                    {serviceCatalog.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {locale === "th"
                          ? s.titleTh ?? s.titleEn
                          : s.titleEn}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5" htmlFor={`${formId}-message`}>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {t.messageLabel}
                  </span>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="rounded-lg border px-3 py-2"
                    style={inputStyle}
                  />
                </label>

                <label
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--ink)" }}
                >
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, consent: e.target.checked }))
                    }
                    className="mt-1 flex-shrink-0"
                    required
                  />
                  <span style={{ lineHeight: 1.5 }}>
                    {t.pdpaConsent}{" "}
                    <LocaleLink
                      href="/privacy"
                      className="hover:underline"
                      style={{ color: "var(--brand-red)" }}
                    >
                      {t.pdpaLink}
                    </LocaleLink>
                    .
                  </span>
                </label>

                {/* Inline error state — above submit, aria-live for SR */}
                {status === "error" && errorKey && (
                  <p
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg border px-4 py-3 text-sm"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--brand-red) 35%, #fff)",
                      backgroundColor:
                        "color-mix(in srgb, var(--brand-red) 8%, #fff)",
                      color: "var(--ink)",
                    }}
                  >
                    {t[errorKey] as string}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={!form.consent || status === "submitting"}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand-red)" }}
                  >
                    {status === "submitting" ? t.submitting : t.submit}{" "}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>

                {/* Polite live region for "submitting" state */}
                <span className="sr-only" aria-live="polite">
                  {status === "submitting" ? t.submitting : ""}
                </span>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
