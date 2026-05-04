/**
 * CookieConsentProvider
 *
 * Wraps vanilla-cookieconsent v3 (open-source, MIT) to deliver the consent
 * UX the brief requires:
 *
 *   • Two categories ONLY:
 *       - necessary  → always on, no toggle (locale cookie, consent state,
 *                      Wouter session)
 *       - analytics  → default OFF, user opts in to enable Plausible page
 *                      view ping. NOTHING ELSE loads on opt-in.
 *
 *   • Consent persists in localStorage with a 12-month expiry
 *     (vanilla-cookieconsent persists in cookie+storage; cookie.expiresAfterDays
 *     controls the lifetime).
 *
 *   • Bilingual TH+EN banner copy. Long-form copy mirrors the privacy
 *     notice (TODO: swap to verbatim privacy_policy.md text once spliced).
 *
 *   • Plausible <script> is injected ONLY after analytics === true. If the
 *     user revokes analytics consent, the script tag is removed and the
 *     window.plausible queue is unset so no further pings fire.
 *
 *   • A document-level event ("comminno:consent-change") is dispatched on
 *     every change so the rest of the app can react without coupling to
 *     vanilla-cookieconsent's internals.
 *
 * Mount this once at the App root, AFTER LocaleProvider so we can reuse
 * the active locale for the banner.
 */
import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { useLocale } from "@/i18n/LocaleProvider";

const PLAUSIBLE_DOMAIN = "comminno-go6lmsuy.manus.space";
const PLAUSIBLE_SCRIPT_ID = "plausible-script";

/** Inject Plausible's script tag once. Idempotent. */
function loadPlausible() {
  if (document.getElementById(PLAUSIBLE_SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = PLAUSIBLE_SCRIPT_ID;
  s.defer = true;
  s.src = "https://plausible.io/js/script.js";
  s.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
  document.head.appendChild(s);
}

/** Remove the Plausible script tag and reset the queue so no new pings fire. */
function unloadPlausible() {
  const tag = document.getElementById(PLAUSIBLE_SCRIPT_ID);
  if (tag) tag.remove();
  // vanilla-cookieconsent v3 also strips matching cookies (see config below);
  // here we just defang the runtime.
  // @ts-expect-error - plausible.q is added by their script
  if (window.plausible) delete window.plausible;
}

/** Apply the current consent state. Called on init AND on every change. */
function syncAnalyticsState() {
  if (CookieConsent.acceptedCategory("analytics")) {
    loadPlausible();
  } else {
    unloadPlausible();
  }
  document.dispatchEvent(
    new CustomEvent("comminno:consent-change", {
      detail: {
        analytics: CookieConsent.acceptedCategory("analytics"),
      },
    }),
  );
}

/** Imperatively re-open the preferences modal (used by the footer link). */
export function openCookieSettings() {
  CookieConsent.showPreferences();
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useLocale();

  useEffect(() => {
    let cancelled = false;

    CookieConsent.run({
      // Force the modal language to track the SPA locale so the banner is
      // never out of step with <html lang>.
      language: {
        default: locale === "th" ? "th" : "en",
        autoDetect: "document",
        translations: {
          en: {
            consentModal: {
              title: "We value your privacy",
              description:
                "Comm.Inno uses only the cookies needed to remember your language choice. With your consent we also load Plausible — a privacy-friendly analytics service that records page views without storing personal data. You can change your choice anytime via the footer link.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject non-essential",
              showPreferencesBtn: "Manage preferences",
              footer:
                '<a href="/en/privacy">Privacy notice</a>',
            },
            preferencesModal: {
              title: "Cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject non-essential",
              savePreferencesBtn: "Save my choices",
              closeIconLabel: "Close",
              sections: [
                {
                  title: "How we use cookies",
                  description:
                    "Comm.Inno is a Chulalongkorn University center and complies with Thailand's PDPA. We never load third-party marketing or advertising trackers. Below you can opt in to anonymous page-view analytics; everything else is strictly necessary.",
                },
                {
                  title: "Strictly necessary",
                  description:
                    "Required for the site to work — they remember your selected language and your cookie-consent choice. They do not identify you and cannot be disabled.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics (Plausible)",
                  description:
                    "Optional. If enabled, we load Plausible — a cookieless, privacy-friendly analytics service hosted in the EU — to count anonymous page views. No personal data is sent and no cross-site tracking occurs. Disabled by default.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Contact us",
                  description:
                    'For questions about this notice or to exercise your PDPA rights, write to <a href="mailto:comminno@chula.ac.th">comminno@chula.ac.th</a>. The full privacy policy is available <a href="/en/privacy">here</a>.',
                },
              ],
            },
          },
          th: {
            consentModal: {
              title: "เราเคารพความเป็นส่วนตัวของคุณ",
              description:
                "เว็บไซต์ Comm.Inno ใช้คุกกี้เฉพาะเท่าที่จำเป็น เช่น จดจำภาษาที่คุณเลือก หากคุณยินยอม เราจะโหลด Plausible ซึ่งเป็นบริการวิเคราะห์การเข้าชมแบบไม่เก็บข้อมูลส่วนบุคคลเพิ่มเติม คุณสามารถเปลี่ยนการตั้งค่าได้ตลอดเวลาผ่านลิงก์ที่ฟุตเตอร์",
              acceptAllBtn: "ยอมรับทั้งหมด",
              acceptNecessaryBtn: "ปฏิเสธคุกกี้ที่ไม่จำเป็น",
              showPreferencesBtn: "ตั้งค่าคุกกี้",
              footer:
                '<a href="/th/privacy">นโยบายความเป็นส่วนตัว</a>',
            },
            preferencesModal: {
              title: "ตั้งค่าคุกกี้",
              acceptAllBtn: "ยอมรับทั้งหมด",
              acceptNecessaryBtn: "ปฏิเสธคุกกี้ที่ไม่จำเป็น",
              savePreferencesBtn: "บันทึกการตั้งค่า",
              closeIconLabel: "ปิด",
              sections: [
                {
                  title: "เราใช้คุกกี้อย่างไร",
                  description:
                    "Comm.Inno เป็นศูนย์ความเป็นเลิศในจุฬาลงกรณ์มหาวิทยาลัย ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เราไม่โหลดเครื่องมือติดตามจากบุคคลที่สามเพื่อการตลาด ด้านล่างคุณเลือกได้ว่าจะอนุญาตการนับจำนวนผู้เข้าชมแบบไม่ระบุตัวตนหรือไม่ คุกกี้อื่น ๆ จำเป็นต่อการใช้งานเว็บไซต์",
                },
                {
                  title: "คุกกี้ที่จำเป็น",
                  description:
                    "จำเป็นต่อการทำงานของเว็บไซต์ — ใช้จดจำภาษาที่คุณเลือกและสถานะการยินยอมคุกกี้ ไม่สามารถปิดได้และไม่ใช้ระบุตัวตน",
                  linkedCategory: "necessary",
                },
                {
                  title: "การวิเคราะห์ (Plausible)",
                  description:
                    "ตัวเลือกเสริม หากเปิดใช้งาน เราจะโหลด Plausible ซึ่งเป็นบริการวิเคราะห์แบบไม่ใช้คุกกี้และโฮสต์ในยุโรป เพื่อนับจำนวนการเข้าชมแบบไม่ระบุตัวตน ไม่มีการส่งข้อมูลส่วนบุคคลและไม่มีการติดตามข้ามเว็บไซต์ — ปิดไว้เป็นค่าเริ่มต้น",
                  linkedCategory: "analytics",
                },
                {
                  title: "ติดต่อเรา",
                  description:
                    'หากมีคำถามเกี่ยวกับนโยบายนี้หรือต้องการใช้สิทธิตาม PDPA โปรดติดต่อ <a href="mailto:comminno@chula.ac.th">comminno@chula.ac.th</a> และดูนโยบายฉบับเต็มได้ <a href="/th/privacy">ที่นี่</a>',
                },
              ],
            },
          },
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              { name: /^plausible_/ },
              // Plausible is cookieless but defensive: also strip any
              // legacy GA cookie that survived the migration from Wix.
              { name: /^_ga/ },
              { name: "_gid" },
            ],
          },
          services: {
            plausible: {
              label: "Plausible page-view analytics",
              onAccept: () => loadPlausible(),
              onReject: () => unloadPlausible(),
            },
          },
        },
      },
      // Persist consent for ~12 months (per brief). cookie.expiresAfterDays
      // controls BOTH the cookie and the localStorage TTL surface.
      cookie: {
        name: "comminno_consent",
        expiresAfterDays: 365,
        sameSite: "Lax",
      },
      // Run our gate on every consent change so Plausible enable/disable is
      // immediate (no page reload required).
      onConsent: () => {
        if (cancelled) return;
        syncAnalyticsState();
      },
      onChange: () => {
        if (cancelled) return;
        syncAnalyticsState();
      },
      guiOptions: {
        consentModal: {
          layout: "box inline",
          position: "bottom right",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
    });

    return () => {
      cancelled = true;
    };
    // We intentionally re-init on locale change so banner copy updates
    // without a reload.
  }, [locale]);

  return <>{children}</>;
}
