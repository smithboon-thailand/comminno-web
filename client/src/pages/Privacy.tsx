/**
 * Privacy — /th/privacy & /en/privacy
 *
 * Full bilingual PDPA notice spliced from comminno_phase2_copy/privacy_policy.md.
 * Sections 1–12 mirror the canonical document. Bracketed [...] tokens remain
 * in the prose until the center confirms the real values:
 *   • [dpo@comminno.center]      — DPO email
 *   • [+66 2 218 ____] / [02-218-____] — DPO phone
 *   • [DATE] / [วันที่]          — first publish + last-updated dates
 *
 * The "Pending PDPA review" banner stays visible while ANY of those tokens
 * is still in the body. Drop the banner when all four tokens are filled.
 */
import { useLocale } from "@/i18n/LocaleProvider";
import { usePageMeta } from "@/i18n/PageMeta";
import { PageHeader } from "@/components/layout/PageHeader";
import { openCookieSettings } from "@/components/consent/CookieConsentProvider";

type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

type Section = {
  id: string;
  heading: string;
  blocks: Block[];
};

const EN_SECTIONS: Section[] = [
  {
    id: "1",
    heading: "Who we are",
    blocks: [
      {
        kind: "p",
        text: 'The Center is a research unit within the Faculty of Communication Arts, Chulalongkorn University. Office: Mongkut Sammitr Building, Faculty of Communication Arts, Chulalongkorn University, 254 Phaya Thai Road, Wang Mai, Pathum Wan, Bangkok 10330. For privacy inquiries: [dpo@comminno.center].',
      },
    ],
  },
  {
    id: "2",
    heading: "What we collect",
    blocks: [
      {
        kind: "table",
        head: ["Category", "Examples", "Source"],
        rows: [
          ["Contact data", "Name, email, phone, organization", "Forms"],
          [
            "Communication content",
            "Form messages, training inquiries, speaker requests",
            "You provide",
          ],
          ["Newsletter", "Email address", "You subscribe"],
          ["Technical", "IP (anonymized), device, browser, language", "Auto"],
          [
            "Usage",
            "Pageviews, time on site, referrer",
            "Privacy-friendly analytics",
          ],
          ["Cookies", "Session, preference cookies", "Browser"],
        ],
      },
      {
        kind: "p",
        text: "We do NOT collect: government IDs, passport numbers, financial accounts, biometric data, precise location, or sensitive data unless you voluntarily disclose it through a research study you have consented to.",
      },
    ],
  },
  {
    id: "3",
    heading: "Legal basis (PDPA)",
    blocks: [
      {
        kind: "ul",
        items: [
          "Contact / communication — Section 24(3) contractual necessity",
          "Newsletter — Section 19 explicit consent (withdrawable anytime)",
          "Technical & usage — Section 24(5) legitimate interest",
          "Essential cookies — strictly necessary",
          "Analytics cookies — Section 19 consent via banner",
        ],
      },
    ],
  },
  {
    id: "4",
    heading: "Who sees your data",
    blocks: [
      {
        kind: "p",
        text: "Limited to: Chulalongkorn IT and Faculty staff (need-to-know); Resend (US, transactional email); Vercel/Cloudflare (US, hosting logs); Plausible (EU) and Vercel Speed Insights (US) for anonymous analytics; auditors and legal counsel when required by law. We never sell data, never share with advertisers or data brokers.",
      },
    ],
  },
  {
    id: "5",
    heading: "Retention",
    blocks: [
      {
        kind: "ul",
        items: [
          "Contact form submissions: 24 months from last contact",
          "Newsletter list: until unsubscribe + 30 days",
          "Training inquiries: 36 months",
          "Server access logs: 90 days",
          "Anonymized analytics: 24 months",
        ],
      },
    ],
  },
  {
    id: "6",
    heading: "Your rights under PDPA",
    blocks: [
      {
        kind: "p",
        text: 'By emailing [dpo@comminno.center] you can: be informed, access, rectify, erase ("right to be forgotten"), restrict processing, port your data, object to processing, withdraw consent, and lodge a complaint with the PDPC at https://www.pdpc.or.th/. We respond to all requests within 30 days.',
      },
    ],
  },
  {
    id: "7",
    heading: "How we protect your data",
    blocks: [
      {
        kind: "p",
        text: "TLS 1.3 in transit; encrypted at rest; role-based access; annual security audit by university IT; breach notification to PDPC within 72 hours.",
      },
    ],
  },
  {
    id: "8",
    heading: "Cookies",
    blocks: [
      {
        kind: "p",
        text: 'Strictly necessary (no consent needed): session, language, consent state. Analytics (opt-in via banner): Plausible pageviews and Vercel Speed Insights. No tracking, advertising, or fingerprinting cookies. Manage anytime via "Cookie Settings" footer link.',
      },
    ],
  },
  {
    id: "9",
    heading: "International transfers",
    blocks: [
      {
        kind: "p",
        text: "Resend, Vercel, Cloudflare operate outside Thailand under PDPA-compliant standard contractual clauses with protection equivalent to PDPA standards.",
      },
    ],
  },
  {
    id: "10",
    heading: "Children",
    blocks: [
      {
        kind: "p",
        text: "Not directed at children under 13. We do not knowingly collect children's data. Contact [dpo@comminno.center] to delete inadvertently collected data.",
      },
    ],
  },
  {
    id: "11",
    heading: "Changes",
    blocks: [
      {
        kind: "p",
        text: 'Material changes notified via homepage banner and to newsletter subscribers. "Last updated" reflects most recent change.',
      },
    ],
  },
  {
    id: "12",
    heading: "Contact",
    blocks: [
      {
        kind: "p",
        text: "Data Protection Officer, Comm.Inno (Center of Excellence in Communication Innovation for the Development of Quality of Life and Sustainability). Email: [dpo@comminno.center]. Phone: [+66 2 218 ____].",
      },
    ],
  },
];

const TH_SECTIONS: Section[] = [
  {
    id: "1",
    heading: "ผู้ดูแลข้อมูล",
    blocks: [
      {
        kind: "p",
        text: "ศูนย์ฯ เป็นหน่วยงานวิจัยในสังกัดคณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย สำนักงานตั้งอยู่ที่ อาคารมงกุฎสมมติ คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย เลขที่ 254 ถนนพญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330 หากมีข้อสงสัยเกี่ยวกับข้อมูลส่วนบุคคล ติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO) ทางอีเมล [dpo@comminno.center]",
      },
    ],
  },
  {
    id: "2",
    heading: "ข้อมูลที่เราเก็บ",
    blocks: [
      {
        kind: "table",
        head: ["ประเภท", "ตัวอย่าง", "ที่มา"],
        rows: [
          ["ข้อมูลติดต่อ", "ชื่อ อีเมล โทรศัพท์ องค์กรต้นสังกัด", "กรอกผ่านฟอร์ม"],
          [
            "เนื้อหาการสื่อสาร",
            "ข้อความ คำขออบรม คำขอเชิญวิทยากร",
            "ท่านส่งให้",
          ],
          ["สมัครจดหมายข่าว", "อีเมล", "ท่านสมัครเอง"],
          [
            "ข้อมูลทางเทคนิค",
            "IP (ไม่ระบุตัวตน) อุปกรณ์ เบราว์เซอร์ ภาษา",
            "ระบบเก็บอัตโนมัติ",
          ],
          [
            "ข้อมูลการใช้งาน",
            "หน้าที่เข้าชม เวลาในไซต์ ที่มา",
            "ระบบวิเคราะห์ที่เคารพความเป็นส่วนตัว",
          ],
          ["คุกกี้", "คุกกี้เซสชัน คุกกี้การตั้งค่า", "จัดเก็บในเบราว์เซอร์ของท่าน"],
        ],
      },
      {
        kind: "p",
        text: "เราไม่เก็บ: เลขบัตรประชาชน เลขพาสปอร์ต รายละเอียดบัญชีการเงิน ข้อมูลชีวมิติ ตำแหน่งที่ตั้งระดับละเอียด หรือข้อมูลละเอียดอ่อน เว้นแต่ท่านสมัครใจเปิดเผยในงานวิจัยที่ได้ให้ความยินยอมแล้ว",
      },
    ],
  },
  {
    id: "3",
    heading: "ฐานทางกฎหมาย",
    blocks: [
      { kind: "p", text: "ข้อมูลแต่ละประเภทมีฐานทางกฎหมายตาม PDPA ดังนี้" },
      {
        kind: "ul",
        items: [
          "ข้อมูลติดต่อ / การสื่อสาร — มาตรา 24(3) จำเป็นต่อการปฏิบัติตามสัญญา",
          "จดหมายข่าว — มาตรา 19 ความยินยอมโดยชัดแจ้ง ที่ท่านถอนได้ทุกเมื่อ",
          "ข้อมูลทางเทคนิคและการใช้งาน — มาตรา 24(5) ประโยชน์โดยชอบด้วยกฎหมาย",
          "คุกกี้ที่จำเป็น — จำเป็นอย่างยิ่งต่อการทำงานของเว็บไซต์",
          "คุกกี้วิเคราะห์ — มาตรา 19 ความยินยอมผ่านแบนเนอร์",
        ],
      },
    ],
  },
  {
    id: "4",
    heading: "ผู้ที่เข้าถึงข้อมูลของท่าน",
    blocks: [
      {
        kind: "p",
        text: "ข้อมูลส่วนบุคคลอยู่ภายในศูนย์ฯ และเปิดเผยต่อบุคคลภายนอกเฉพาะรายการต่อไปนี้",
      },
      {
        kind: "ul",
        items: [
          "เจ้าหน้าที่ฝ่ายไอทีของจุฬาฯ และคณะนิเทศศาสตร์ เฉพาะที่จำเป็นต่อหน้าที่",
          "Resend (สหรัฐอเมริกา) ผู้ให้บริการอีเมลธุรกรรม โอนข้อมูลภายใต้ข้อสัญญามาตรฐาน",
          "Vercel หรือ Cloudflare (สหรัฐอเมริกา) ผู้ให้บริการโฮสต์ เฉพาะ server logs",
          "Plausible (สหภาพยุโรป) และ Vercel Speed Insights (สหรัฐอเมริกา) ผู้ให้บริการวิเคราะห์ เฉพาะ pageview และประสิทธิภาพเว็บที่ไม่ระบุตัวตน",
          "ผู้ตรวจสอบและที่ปรึกษากฎหมาย เมื่อมีกฎหมายกำหนด หรือเพื่อปกป้องสิทธิอันชอบด้วยกฎหมายของศูนย์ฯ",
        ],
      },
      {
        kind: "p",
        text: "เราไม่ขายข้อมูล และไม่แชร์ข้อมูลกับผู้ลงโฆษณาหรือนายหน้าข้อมูลในทุกกรณี",
      },
    ],
  },
  {
    id: "5",
    heading: "ระยะเวลาเก็บรักษา",
    blocks: [
      {
        kind: "ul",
        items: [
          "ข้อมูลผ่านฟอร์มติดต่อ — 24 เดือน นับจากการติดต่อครั้งสุดท้าย",
          "รายชื่อจดหมายข่าว — จนกว่าท่านจะยกเลิก แล้วเก็บต่ออีก 30 วัน",
          "คำขออบรม — 36 เดือน เพื่อใช้ติดตามรุ่นถัดไป",
          "Server access logs — 90 วัน",
          "ข้อมูลวิเคราะห์ที่ไม่ระบุตัวตน — 24 เดือน",
        ],
      },
      {
        kind: "p",
        text: "เมื่อครบกำหนด ข้อมูลจะถูกลบหรือทำให้ไม่สามารถระบุตัวตนได้อย่างถาวร",
      },
    ],
  },
  {
    id: "6",
    heading: "สิทธิของท่านตาม PDPA",
    blocks: [
      {
        kind: "p",
        text: "ท่านสามารถใช้สิทธิต่อไปนี้โดยไม่มีค่าใช้จ่าย ผ่านการส่งอีเมลถึง [dpo@comminno.center]",
      },
      {
        kind: "ul",
        items: [
          "สิทธิในการรับทราบ ว่าเราเก็บข้อมูลใดและด้วยเหตุใด",
          "สิทธิในการเข้าถึง ขอสำเนาข้อมูลของท่าน",
          "สิทธิในการแก้ไข ข้อมูลที่ไม่ถูกต้อง",
          'สิทธิในการให้ลบ ("สิทธิที่จะถูกลืม") เมื่อข้อมูลไม่จำเป็นอีกต่อไป',
          "สิทธิในการระงับการประมวลผล ระหว่างการพิจารณาข้อพิพาท",
          "สิทธิในการให้โอน ข้อมูลในรูปแบบที่เครื่องอ่านได้",
          "สิทธิในการคัดค้าน การประมวลผล รวมถึงการตลาดทางตรง",
          "สิทธิในการถอนความยินยอม ทุกเมื่อ โดยไม่มีผลย้อนหลัง",
          "สิทธิในการร้องเรียน ต่อคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) ที่ https://www.pdpc.or.th/",
        ],
      },
      { kind: "p", text: "เราตอบทุกคำขอภายใน 30 วัน" },
    ],
  },
  {
    id: "7",
    heading: "การคุ้มครองข้อมูล",
    blocks: [
      {
        kind: "ul",
        items: [
          "เข้ารหัสระหว่างส่งด้วย HTTPS / TLS 1.3 ในทุกฟอร์ม",
          "เข้ารหัสฟิลด์ที่ละเอียดอ่อนในระดับฐานข้อมูล",
          "ควบคุมการเข้าถึงตามบทบาท เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต",
          "ทบทวนความปลอดภัยประจำปีโดยฝ่ายไอทีของมหาวิทยาลัย",
          "หากเกิดเหตุละเมิดข้อมูล เราจะแจ้ง สคส. ภายใน 72 ชั่วโมง และแจ้งผู้ใช้ที่ได้รับผลกระทบโดยไม่ชักช้า",
        ],
      },
    ],
  },
  {
    id: "8",
    heading: "คุกกี้",
    blocks: [
      { kind: "p", text: "เราใช้คุกกี้สามประเภท" },
      {
        kind: "ul",
        items: [
          "คุกกี้ที่จำเป็นอย่างยิ่ง — เซสชัน ภาษาที่เลือก สถานะการยอมรับคุกกี้ (ได้รับยกเว้นทางกฎหมาย ไม่ต้องขอความยินยอม)",
          "คุกกี้วิเคราะห์ — Plausible และ Vercel Speed Insights สำหรับการนับ pageview และวัดประสิทธิภาพเว็บแบบเคารพความเป็นส่วนตัว (ต้องเลือกผ่านแบนเนอร์)",
          "ไม่มีคุกกี้ติดตาม โฆษณา หรือ fingerprinting ใด ๆ",
        ],
      },
      {
        kind: "p",
        text: 'ท่านสามารถจัดการการตั้งค่าคุกกี้ได้ทุกเมื่อผ่านลิงก์ "ตั้งค่าคุกกี้" ในส่วน Footer',
      },
    ],
  },
  {
    id: "9",
    heading: "การโอนข้อมูลข้ามประเทศ",
    blocks: [
      {
        kind: "p",
        text: "ผู้ให้บริการบางราย (Resend, Vercel, Cloudflare) ประกอบกิจการนอกประเทศไทย เรายึดหลักประกันที่สอดคล้องกับ PDPA รวมถึงข้อสัญญามาตรฐาน และเลือกผู้ให้บริการที่มีระดับการคุ้มครองข้อมูลเทียบเท่ามาตรฐานของ PDPA",
      },
    ],
  },
  {
    id: "10",
    heading: "เด็กและเยาวชน",
    blocks: [
      {
        kind: "p",
        text: "เว็บไซต์นี้ไม่ได้มุ่งเป้าหมายไปที่เด็กอายุต่ำกว่า 13 ปี เราไม่ได้มีเจตนาเก็บข้อมูลจากเด็ก หากท่านพบว่าเราเก็บข้อมูลของเด็กโดยไม่ตั้งใจ กรุณาแจ้งที่ [dpo@comminno.center] เพื่อให้เราดำเนินการลบทันที",
      },
    ],
  },
  {
    id: "11",
    heading: "การเปลี่ยนแปลงนโยบาย",
    blocks: [
      {
        kind: "p",
        text: 'หากมีการเปลี่ยนแปลงสำคัญ เราจะแจ้งผ่านแบนเนอร์หน้าแรกและส่งให้ผู้สมัครรับจดหมายข่าว วันที่ "อัปเดตล่าสุด" ด้านบนสะท้อนการเปลี่ยนแปลงครั้งล่าสุด',
      },
    ],
  },
  {
    id: "12",
    heading: "ติดต่อ",
    blocks: [
      {
        kind: "p",
        text: "สำหรับคำถาม คำขอ และข้อร้องเรียนเกี่ยวกับความเป็นส่วนตัว ติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) Comm.Inno (ศูนย์เชี่ยวชาญเฉพาะทางด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน) อีเมล: [dpo@comminno.center] โทรศัพท์: [02-218-____]",
      },
    ],
  },
];

const COPY = {
  th: {
    title: "นโยบายความเป็นส่วนตัว",
    lede: "นโยบายฉบับเต็มตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) พ.ศ. 2562",
    crumbHome: "หน้าแรก",
    crumbSelf: "นโยบายความเป็นส่วนตัว",
    pendingTitle: "อยู่ระหว่างทบทวนทางกฎหมาย",
    pendingBody:
      "นโยบายฉบับนี้เป็นร่างที่ใช้ได้ทั่วไป ระหว่างรอยืนยันอีเมล DPO เบอร์โทร และวันที่มีผลบังคับจากศูนย์ฯ ส่วนที่อยู่ในวงเล็บ [...] จะถูกแทนที่ด้วยข้อมูลจริงเมื่อได้รับการรับรองจากฝ่ายกฎหมาย",
    intro:
      'ศูนย์เชี่ยวชาญเฉพาะทางด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน (Comm.Inno) (ต่อไปนี้เรียกว่า "ศูนย์ฯ" หรือ "เรา") ให้ความสำคัญกับความเป็นส่วนตัวของท่าน และมุ่งคุ้มครองข้อมูลส่วนบุคคลของท่านอย่างเคร่งครัด นโยบายฉบับนี้ชี้แจงวิธีที่เราเก็บรวบรวม ใช้ จัดเก็บ เปิดเผย และปกป้องข้อมูล พร้อมระบุสิทธิของท่านตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (ต่อไปนี้เรียกว่า "PDPA")',
    effective: "วันที่มีผลบังคับ",
    updated: "อัปเดตล่าสุด",
    cookieSettings: "เปิดการตั้งค่าคุกกี้",
    metaDesc:
      "นโยบายความเป็นส่วนตัวของ Comm.Inno (ศูนย์เชี่ยวชาญเฉพาะทางด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน) — เก็บอะไร ใช้ทำอะไร เก็บนานเท่าใด สิทธิของท่านตาม PDPA และวิธีติดต่อเจ้าหน้าที่คุ้มครองข้อมูล",
  },
  en: {
    title: "Privacy policy",
    lede: "Full PDPA-compliant notice for Comm.Inno — the Center of Excellence in Communication Innovation for the Development of Quality of Life and Sustainability.",
    crumbHome: "Home",
    crumbSelf: "Privacy policy",
    pendingTitle: "Pending PDPA review",
    pendingBody:
      "This is the bilingual policy in active use. The bracketed [...] tokens (DPO email, phone number, effective dates) are pending final confirmation from the center's legal team and will be replaced with real values shortly.",
    intro:
      'The Center of Excellence in Communication Innovation for the Development of Quality of Life and Sustainability (the "Center", "we", "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, store, share, and protect personal data, and the rights you have under Thailand\'s Personal Data Protection Act B.E. 2562 (2019) ("PDPA").',
    effective: "Effective date",
    updated: "Last updated",
    cookieSettings: "Open cookie settings",
    metaDesc:
      "Comm.Inno privacy policy — what we collect, why we collect it, how long we keep it, your rights under Thailand's PDPA, and how to contact our Data Protection Officer.",
  },
} as const;

function BlockView({ block, locale }: { block: Block; locale: "th" | "en" }) {
  if (block.kind === "p") {
    return (
      <p
        style={{
          color: "var(--ink)",
          lineHeight: 1.7,
          fontSize: locale === "th" ? "1rem" : "1.0625rem",
        }}
      >
        {block.text}
      </p>
    );
  }
  if (block.kind === "ul") {
    return (
      <ul className="ml-5 list-disc space-y-1.5">
        {block.items.map((item, i) => (
          <li key={i} style={{ color: "var(--ink)", lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        style={{ borderCollapse: "collapse", color: "var(--ink)" }}
      >
        <thead>
          <tr>
            {block.head.map((h) => (
              <th
                key={h}
                scope="col"
                className="text-left p-3 font-semibold"
                style={{
                  borderBottom: "2px solid var(--mist)",
                  backgroundColor: "color-mix(in srgb, var(--mist) 50%, #fff)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="p-3 align-top"
                  style={{
                    borderBottom: "1px solid var(--mist)",
                    lineHeight: 1.55,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Privacy() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const sections = locale === "th" ? TH_SECTIONS : EN_SECTIONS;

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
        {/* Pending PDPA review banner — kept until bracketed tokens are replaced. */}
        <div
          role="note"
          className="rounded-xl border p-5 md:p-6 mb-10"
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
          <p style={{ color: "var(--ink)", lineHeight: 1.6 }}>
            {t.pendingBody}
          </p>
        </div>

        {/* Effective + Last-updated metadata. Real values come from the center. */}
        <dl
          className="mb-8 grid gap-2 text-sm"
          style={{ color: "var(--ink-muted)" }}
        >
          <div className="flex gap-2">
            <dt className="font-semibold">{t.effective}:</dt>
            <dd>{locale === "th" ? "[วันที่]" : "[DATE]"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">{t.updated}:</dt>
            <dd>{locale === "th" ? "[วันที่]" : "[DATE]"}</dd>
          </div>
        </dl>

        {/* Lede paragraph mirrors the canonical privacy_policy.md preamble. */}
        <p
          className="mb-10"
          style={{
            color: "var(--ink)",
            lineHeight: 1.7,
            fontSize: locale === "th" ? "1rem" : "1.0625rem",
          }}
        >
          {t.intro}
        </p>

        {/* Sections 1–12. */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={section.id} id={`section-${section.id}`}>
              <h2
                className="font-display text-xl md:text-2xl mb-4"
                style={{ color: "var(--ink)" }}
              >
                <span
                  aria-hidden="true"
                  className="mr-2"
                  style={{ color: "var(--brand-red)" }}
                >
                  {idx + 1}
                </span>
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.blocks.map((b, i) => (
                  <BlockView key={i} block={b} locale={locale} />
                ))}
              </div>

              {/* Section 8 (Cookies) gets a "Open cookie settings" button so
                  users can act on the section content immediately. */}
              {section.id === "8" && (
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="mt-4 inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--brand-red)_8%,#fff)]"
                  style={{
                    borderColor: "var(--ink)",
                    color: "var(--ink)",
                    backgroundColor: "transparent",
                  }}
                >
                  {t.cookieSettings}
                </button>
              )}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
