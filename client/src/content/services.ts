/**
 * services.ts — Canonical service catalog (9 services).
 *
 * Source of truth for body copy: comminno_phase2_copy/services_copy.md
 * (delivered 2026-05-04). Spliced in from canonical TH+EN copy. Do not
 * regenerate from build-content.mjs without merging this file's
 * descriptions/deliverables/audience back in first.
 *
 * Field conventions:
 *   • titleEn / titleTh         — short noun phrase used in nav, cards, hero.
 *   • subtitleEn / subtitleTh   — single-line tagline shown under the title
 *                                 on the service card and detail page.
 *   • descriptionEn / Th        — long-form body copy (markdown-safe; we
 *                                 render as plain paragraphs split on
 *                                 "\n\n").
 *   • deliverablesEn / Th       — bullet list of concrete outputs.
 *   • audienceEn / Th           — left null for now; the brief frames each
 *                                 service through deliverables, not audience.
 *   • sdgNumber                 — primary UN SDG goal (1–17). Drives the
 *                                 colour chip on cards.
 *   • relatedSlugs              — Insight-post slugs to surface as related
 *                                 case studies on the detail page.
 *   • ctaEn / ctaTh             — service-specific CTA copy.
 */
import type { Service } from "./types";

/**
 * Backward-compat alias — historically `ServiceWithCopy` carried subtitle /
 * relatedSlugs / cta / hero* fields that were missing from the base `Service`
 * interface. As of commit #5a these fields live on `Service` itself, so this
 * alias is purely for source compatibility with older imports. Callers may
 * migrate to `Service` directly.
 */
export type ServiceWithCopy = Required<
  Pick<
    Service,
    | "subtitleEn"
    | "subtitleTh"
    | "relatedSlugs"
    | "ctaEn"
    | "ctaTh"
    | "heroImage"
    | "heroImageFallback"
    | "heroAltEn"
    | "heroAltTh"
  >
> &
  Service;

export const services: readonly ServiceWithCopy[] = [
  {
    slug: "book-and-printing",
    titleEn: "Books and printed media",
    titleTh: "หนังสือและสื่อสิ่งพิมพ์",
    subtitleEn: "Research-grade publications, designed to be read.",
    subtitleTh: "งานวิจัยที่ออกแบบให้คนอยากอ่าน",
    sdgNumber: 4,
    descriptionEn:
      "We synthesise academic research, source visual material, and produce books and printed materials that meet both editorial and design standards. From textbook chapters to public-information booklets, we handle the full pipeline — review, write, design, print, distribute. Each project starts with a literature review and ends with a printed deliverable that organisations and educators actually use. We've produced encyclopaedic volumes for regulators, training handbooks for ministries, and university press editions for academic markets.",
    descriptionTh:
      "เราสังเคราะห์งานวิจัยทางวิชาการ รวบรวมภาพประกอบ และผลิตหนังสือกับสื่อสิ่งพิมพ์ที่ผ่านมาตรฐานทั้งด้านบรรณาธิการและการออกแบบ ตั้งแต่บทในตำราเรียน คู่มือเพื่อการสื่อสารสาธารณะ ไปจนถึงเอกสารวิจัยฉบับเต็ม เราดูแลทั้งกระบวนการตั้งแต่ทบทวนวรรณกรรม เขียน ออกแบบ พิมพ์ ไปจนถึงส่งมอบ",
    deliverablesEn: [
      "Academic book chapters",
      "Public information booklets",
      "Annual reports",
      "Conference proceedings",
      "Educational textbooks",
      "Field manuals",
    ],
    deliverablesTh: [
      "บทในตำราเรียน",
      "คู่มือสื่อสารสาธารณะ",
      "รายงานประจำปี",
      "เอกสารสรุปการประชุมวิชาการ",
      "ตำราเพื่อการศึกษา",
      "คู่มือปฏิบัติงานภาคสนาม",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "nbtc-encyclopedia",
      "seeds-for-cu-sustainability",
      "department-of-disease-control",
    ],
    ctaEn: "Request a publishing consultation",
    ctaTh: "ขอคำปรึกษาด้านสิ่งพิมพ์",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/book-and-printing",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/book-and-printing",
    heroAltEn: "Open book on a desk with research notes and pens — books and printed media service",
    heroAltTh: "หนังสือเปิดบนโต๊ะทำงานพร้อมบันทึกงานวิจัย — บริการหนังสือและสิ่งพิมพ์",
  },
  {
    slug: "motion-effect-ar",
    titleEn: "Motion graphics & AR",
    titleTh: "โมชันกราฟิกและ AR",
    subtitleEn: "Make books move. Make packaging speak.",
    subtitleTh: "ทำให้หนังสือเคลื่อนไหว ทำให้บรรจุภัณฑ์พูดได้",
    sdgNumber: 9,
    descriptionEn:
      "Augmented reality turns flat paper into interactive experiences. Scan a textbook page and watch a chemistry reaction play. Point your camera at a public-health poster and a doctor explains it in your language. We design these experiences end-to-end — concept, 3D modelling, animation, and the AR framework that delivers them. Our AR work covers four contexts: AR-on-books for education, AR-on-packaging for product narratives, AR for marketing campaigns, and AR for classroom learning. Every experience runs in the browser — no app install required.",
    descriptionTh:
      "เทคโนโลยี Augmented Reality เปลี่ยนกระดาษให้กลายเป็นประสบการณ์โต้ตอบ — สแกนหน้าตำราเรียนแล้วเห็นปฏิกิริยาเคมีเคลื่อนไหว ส่องกล้องไปที่โปสเตอร์สาธารณสุขแล้วได้ฟังหมออธิบายเป็นภาษาของคุณ เราออกแบบประสบการณ์เหล่านี้ครบวงจร ตั้งแต่แนวคิด การสร้างโมเดล 3 มิติ การทำอนิเมชัน ไปจนถึงเฟรมเวิร์ก AR ที่ทำให้ผู้ใช้เข้าถึง งาน AR ของเราครอบคลุม 4 บริบท: AR บนหนังสือเพื่อการศึกษา · AR บนบรรจุภัณฑ์ · AR สำหรับการตลาด · และ AR ในห้องเรียน ทุกประสบการณ์ทำงานผ่านเบราว์เซอร์ ไม่ต้องดาวน์โหลดแอป",
    deliverablesEn: [
      "AR experiences for printed materials",
      "AR product packaging",
      "AR marketing activations",
      "Classroom AR modules",
      "Motion graphics videos",
      "3D explainer animations",
    ],
    deliverablesTh: [
      "AR บนสิ่งพิมพ์",
      "AR บนบรรจุภัณฑ์",
      "AR สำหรับการตลาด",
      "AR ประกอบการสอน",
      "วิดีโอโมชันกราฟิก",
      "อนิเมชันอธิบายแบบ 3 มิติ",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: ["nia-media-innovation"],
    ctaEn: "Bring my asset to life",
    ctaTh: "ขอเริ่มโปรเจกต์ AR",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/motion-effect-ar",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/motion-effect-ar",
    heroAltEn: "Phone scanning a printed page with augmented reality content layered above it",
    heroAltTh: "โทรศัพท์สแกนหน้าหนังสือและแสดงเนื้อหา AR ซ้อนขึ้นมา",
  },
  {
    slug: "video-production",
    titleEn: "Video production",
    titleTh: "ผลิตวีดิทัศน์",
    subtitleEn: "Research findings, made watchable.",
    subtitleTh: "เปลี่ยนงานวิจัยให้กลายเป็นวิดีโอที่คนอยากดู",
    sdgNumber: 9,
    descriptionEn:
      "We produce video content that organisations actually need: introduction films, work-summary reels, educational explainers, and research-dissemination pieces that translate journal-grade findings into 90 seconds a layperson can follow. Every project starts with a script written by someone who understands the source material — usually a researcher on our team. Production runs through our in-house team of editors, motion designers, and Thai/English voice talent.",
    descriptionTh:
      "เราผลิตวิดีโอที่องค์กรต้องใช้จริง — วีดิทัศน์แนะนำองค์กร, วีดิทัศน์สรุปผลงาน, วีดิทัศน์การศึกษา และวีดิทัศน์เผยแพร่งานวิจัยที่แปลผลการศึกษาระดับวารสารวิชาการให้กลายเป็น 90 วินาทีที่คนทั่วไปดูเข้าใจ ทุกโปรเจกต์เริ่มจากบทที่เขียนโดยคนเข้าใจเนื้อหา ส่วนใหญ่เป็นนักวิจัยในทีมของเราเอง การผลิตทำโดยทีมในองค์กร ทั้งบรรณาธิการ ผู้ออกแบบโมชัน และพากย์เสียงภาษาไทย-อังกฤษ",
    deliverablesEn: [
      "Organisation introduction videos",
      "Company profile videos",
      "Work-summary reels",
      "Educational videos",
      "Research dissemination",
      "Subtitled bilingual versions",
    ],
    deliverablesTh: [
      "วีดิทัศน์แนะนำองค์กร",
      "วีดิทัศน์โปรไฟล์บริษัท",
      "วีดิทัศน์สรุปผลงาน",
      "วีดิทัศน์เพื่อการศึกษา",
      "วีดิทัศน์เผยแพร่งานวิจัย",
      "ฉบับซับไตเติลสองภาษา",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "center-of-excellence-in-communication-innovation-launches-groundbreaking-online-course-for-digital-n",
      "comm-art-chula-ce-drives-national-drug-safety-awareness-at-fda-summit",
    ],
    ctaEn: "Brief your video project",
    ctaTh: "เล่าโปรเจกต์วิดีโอของคุณ",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/video-production",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/video-production",
    heroAltEn: "Cinema camera and lighting on a video production set",
    heroAltTh: "กล้องถ่ายและไฟถ่ายบนกองถ่ายผลิตวิดีโอ",
  },
  {
    slug: "training",
    titleEn: "Training programs",
    titleTh: "หลักสูตรอบรม",
    subtitleEn: "One day. Twelve case studies. Skills your team can use Monday.",
    subtitleTh: "หนึ่งวัน · 12 กรณีศึกษา · ทักษะที่ทีมคุณใช้ได้ทันทีวันจันทร์",
    sdgNumber: 4,
    descriptionEn:
      "Our training programs treat learning as a system, not a one-off event. Every program starts with a needs assessment with the client, builds a custom curriculum tied to measurable outcomes, ships a participant manual, runs the sessions, and ends with an evaluation report comparing pre- and post-training competencies. We've designed programs for executive crisis communication, public-health communication, leadership for state enterprises, and youth empowerment. Programs run from one-day intensives to multi-month cohorts.",
    descriptionTh:
      "หลักสูตรอบรมของเรามองการเรียนรู้เป็นระบบ ไม่ใช่งานครั้งเดียว ทุกหลักสูตรเริ่มต้นด้วยการประเมินความต้องการกับลูกค้า สร้างหลักสูตรที่ตอบโจทย์เฉพาะพร้อมตัวชี้วัดที่วัดได้ ผลิตคู่มือสำหรับผู้เข้าอบรม จัดอบรม และจบด้วยรายงานประเมินผลที่เปรียบเทียบสมรรถนะก่อน-หลังอบรม เราเคยออกแบบหลักสูตรการสื่อสารวิกฤตให้ผู้บริหาร การสื่อสารด้านสาธารณสุข ภาวะผู้นำสำหรับรัฐวิสาหกิจ และเยาวชนผู้นำการเปลี่ยนแปลง หลักสูตรมีตั้งแต่ 1 วันไปจนถึงหลายเดือน",
    deliverablesEn: [
      "Training-needs assessment",
      "Custom curriculum design",
      "Participant manuals",
      "Live training delivery",
      "Pre/post-training evaluation",
      "Certificate program",
    ],
    deliverablesTh: [
      "ประเมินความต้องการอบรม",
      "ออกแบบหลักสูตรเฉพาะ",
      "คู่มือผู้เข้าอบรม",
      "การอบรมภาคบรรยายและปฏิบัติ",
      "ประเมินก่อน-หลัง",
      "ใบประกาศนียบัตร",
    ],
    audienceEn: null,
    audienceTh: null,
    // The fourth slug here had "Boonchotima" in the legacy URL — the
    // build-redirects pass already maps it to the corrected slug.
    relatedSlugs: [
      "center-of-excellence-head-invited-to-lead-executive-crisis-communication-training",
      "the-training-program-for-driving-public-and-social-communication-care-d-plus",
      "empowering-youth-leaders",
      "associate-professor-dr-smith-boonchutima-delivers-leadership-training-at-krungthai-bank",
    ],
    ctaEn: "Discuss a custom program",
    ctaTh: "ปรึกษาออกแบบหลักสูตร",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/training",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/training",
    heroAltEn: "Trainer at a whiteboard leading a workshop with engaged participants",
    heroAltTh: "วิทยากรบรรยายหน้ากระดาน มีผู้เข้าร่วมอบรมตั้งใจฟัง",
  },
  {
    slug: "research-and-evaluation",
    titleEn: "Research & evaluation",
    titleTh: "วิจัยและประเมินผล",
    subtitleEn: "Frameworks, instruments, and reports that hold up to peer review.",
    subtitleTh: "กรอบ เครื่องมือ และรายงานที่ผ่านการทบทวนโดยผู้เชี่ยวชาญ",
    // SDG override per services_copy.md → 17 (Partnerships) for this service.
    sdgNumber: 17,
    descriptionEn:
      "We design research and evaluation projects that work as evidence — defensible methodology, validated instruments, transparent analysis, and reports written so that decision-makers can act on them. Our team holds doctorates in communication, sport science, and political science, and publishes regularly in peer-reviewed journals. Whether you need a baseline survey before a public-health campaign, a process evaluation halfway through a multi-year program, or an impact assessment for a funder, we scope the right design for your question and budget.",
    descriptionTh:
      "เราออกแบบโครงการวิจัยและประเมินผลที่ทำงานในฐานะหลักฐาน — มีระเบียบวิธีที่ยืนยันได้ เครื่องมือที่ผ่านการทดสอบความเที่ยง การวิเคราะห์ที่โปร่งใส และรายงานที่เขียนให้ผู้ตัดสินใจนำไปใช้ได้จริง ทีมของเราจบเอกด้านการสื่อสาร วิทยาศาสตร์การกีฬา และรัฐศาสตร์ และตีพิมพ์งานในวารสารที่ผ่านการทบทวนเป็นประจำ ไม่ว่าคุณต้องการสำรวจฐานก่อนเริ่มแคมเปญสาธารณสุข ประเมินกระบวนการกลางทาง หรือประเมินผลกระทบเพื่อรายงานต่อผู้ให้ทุน เราออกแบบให้เหมาะกับคำถามและงบประมาณของคุณ",
    deliverablesEn: [
      "Research framework",
      "Evaluation framework",
      "Survey & interview instruments",
      "Quantitative & qualitative analysis",
      "Project outcome evaluation",
      "Evaluation reports",
    ],
    deliverablesTh: [
      "กรอบวิจัย",
      "กรอบประเมินผล",
      "เครื่องมือสำรวจ",
      "การวิเคราะห์เชิงปริมาณและคุณภาพ",
      "ประเมินผลลัพธ์โครงการ",
      "รายงานประเมินผล",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "nia-satisfaction-survey-2020",
      "asean-university-network",
      "international-labour-organization",
    ],
    ctaEn: "Scope a research project",
    ctaTh: "ปรึกษาออกแบบงานวิจัย",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/research-and-evaluation",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/research-and-evaluation",
    heroAltEn: "Notebook with charts and a laptop showing data analysis — research and evaluation",
    heroAltTh: "สมุดบันทึกข้อมูลพร้อมแล็ปทอปแสดงผลวิเคราะห์ข้อมูล — งานวิจัยและประเมินผล",
  },
  {
    slug: "communication-design",
    titleEn: "Communication design",
    titleTh: "ออกแบบการสื่อสาร",
    subtitleEn: "Information designed for the people who need it most.",
    subtitleTh: "สื่อที่ออกแบบเพื่อคนที่ควรเข้าถึงข้อมูลก่อนใคร",
    // SDG override per services_copy.md → 10 (Reduced Inequalities).
    sdgNumber: 10,
    descriptionEn:
      "Most \"communication design\" stops at making things look nice. We start by asking: who fails to understand the current version, and why? Then we redesign to remove those barriers — through infographics, posters, social posts, 3D maps, and printed visuals — for audiences whose first language may not be Thai, whose literacy level varies, and whose attention is contested.\n\nThis service maps to SDG 10 because reducing inequality often starts with making information accessible to everyone, not just the already-informed.",
    descriptionTh:
      "งาน \"ออกแบบการสื่อสาร\" โดยทั่วไปมักหยุดที่ความสวยงาม แต่เราเริ่มจากคำถามอีกแบบ — \"ใครคือคนที่ยังไม่เข้าใจเวอร์ชันปัจจุบัน และเพราะเหตุใด\" จากนั้นจึงออกแบบใหม่เพื่อปลดอุปสรรคเหล่านั้นออก ผ่านอินโฟกราฟิก โปสเตอร์ โพสต์โซเชียล แผนที่สามมิติ และสื่อสิ่งพิมพ์ — สำหรับกลุ่มผู้ชมที่ภาษาไทยอาจไม่ใช่ภาษาแรก ระดับการอ่านต่างกัน และความสนใจถูกแย่งจากทุกหน้าจอ\n\nบริการนี้สอดคล้องกับ SDG 10 เพราะการลดความเหลื่อมล้ำในสังคมมักเริ่มจากเรื่องพื้นฐาน — ทำให้ข้อมูลที่จำเป็นถึงมือทุกคนได้เท่าเทียมกัน ไม่ใช่เฉพาะคนที่เข้าถึงได้อยู่แล้ว",
    deliverablesEn: [
      "Infographics",
      "Visual storytelling",
      "Posters & wall graphics",
      "Printed media design",
      "Social media post systems",
      "3D maps & wayfinding",
    ],
    deliverablesTh: [
      "อินโฟกราฟิก",
      "การสื่อสารผ่านภาพ",
      "โปสเตอร์และสื่อติดผนัง",
      "การออกแบบสื่อสิ่งพิมพ์",
      "ระบบโพสต์โซเชียลมีเดีย",
      "แผนที่สามมิติและป้ายบอกทาง",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "chula-zero-waste",
      "ministry-of-natural-resources-and-environment",
      "pid-thong-lang-phra-foundation",
    ],
    ctaEn: "Get a design review",
    ctaTh: "ขอรีวิวงานออกแบบ",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/communication-design",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/communication-design",
    heroAltEn: "Designer's desk with sketches, swatches, and posters — communication design",
    heroAltTh: "โต๊ะนักออกแบบมีภาพร่าง ตัวอย่างสี และโปสเตอร์ — การออกแบบการสื่อสาร",
  },
  {
    slug: "campaign-manage",
    titleEn: "Campaign management",
    titleTh: "บริหารแคมเปญ",
    subtitleEn: "Behaviour change, not just brand awareness.",
    subtitleTh: "เปลี่ยนพฤติกรรมจริง ไม่ใช่แค่ทำให้คนรู้จัก",
    // SDG override per services_copy.md → 13 (Climate Action).
    sdgNumber: 13,
    descriptionEn:
      "A campaign isn't a poster series. It's a sustained intervention with a stated behavioural goal, a target audience theory, channel selection, message strategy, and evaluation. We've run campaigns on waste reduction, drug-resistance education, environmental protection, and tourism revival in Nan Province.\n\nOur process is nine stages: situation analysis → audience profiling → channel selection → core content → key messages → promotional materials → activity design → execution → results synthesis. Every stage produces a document the client owns.",
    descriptionTh:
      "แคมเปญไม่ใช่โปสเตอร์ที่ทำเป็นชุด แต่คือการสื่อสารต่อเนื่องที่มีเป้าหมายเชิงพฤติกรรมชัดเจน มีทฤษฎีกลุ่มเป้าหมาย กลยุทธ์ช่องทาง กลยุทธ์ข้อความ และระบบประเมินผลรองรับ ที่ผ่านมาเราเคยจัดแคมเปญลดขยะในมหาวิทยาลัย ให้ความรู้เรื่องเชื้อดื้อยาในระดับชาติ ปกป้องสิ่งแวดล้อมร่วมกับภาครัฐ และฟื้นการท่องเที่ยวเชิงสร้างสรรค์ในจังหวัดน่าน\n\nเราทำงานเป็น 9 ขั้นที่ชัดเจน — วิเคราะห์สถานการณ์ ศึกษากลุ่มเป้าหมาย เลือกช่องทาง สร้างเนื้อหาหลัก กำหนดคีย์เมสเสจ ผลิตสื่อประชาสัมพันธ์ ออกแบบกิจกรรม ดำเนินงาน และสรุปผล — โดยแต่ละขั้นผลิตเอกสารที่ลูกค้าเป็นเจ้าของลิขสิทธิ์เต็มทุกฉบับ",
    deliverablesEn: [
      "Situation analysis",
      "Audience study & segmentation",
      "Channel strategy",
      "Core content & key messages",
      "Promotional materials",
      "Activity design",
      "Campaign execution",
      "Results synthesis report",
    ],
    deliverablesTh: [
      "การวิเคราะห์สถานการณ์",
      "การศึกษาและแบ่งกลุ่มเป้าหมาย",
      "กลยุทธ์ช่องทาง",
      "เนื้อหาหลักและคีย์เมสเสจ",
      "สื่อประชาสัมพันธ์",
      "การออกแบบกิจกรรม",
      "การดำเนินแคมเปญ",
      "รายงานสรุปผล",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "chula-zero-waste",
      "creative-tourism-development-project-in-nan-province",
      "nia-100-faces",
      "thai-health-promotion-foundation-organises-simple-drug-communication-as-daily-routine-training-by",
    ],
    ctaEn: "Plan your campaign",
    ctaTh: "เริ่มวางแผนแคมเปญ",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/campaign-manage",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/campaign-manage",
    heroAltEn: "Strategy whiteboard with sticky notes and team collaborating on a campaign",
    heroAltTh: "กระดานวางแผนกลยุทธ์พร้อมโปสตอิตและทีมงานร่วมระดมสมอง",
  },
  {
    slug: "seminar",
    titleEn: "Seminars & forums",
    titleTh: "สัมมนาและประชุม",
    subtitleEn: "Convening that produces something — not just a photo opportunity.",
    subtitleTh: "การประชุมที่ได้ผลลัพธ์เป็นชิ้นเป็นอัน ไม่ใช่แค่ภาพหมู่",
    sdgNumber: 17,
    descriptionEn:
      "We run seminars, expert forums, and stakeholder consultations end-to-end: agenda design, speaker invitations, venue logistics, equipment, live moderation, real-time synthesis, and a written report that captures what the room actually decided.\n\nThe brief usually comes from clients who have hosted events before and got back nothing but feedback forms. Our differentiator is the synthesis — we treat every seminar as a research event with a discussable output, not a content delivery vehicle.",
    descriptionTh:
      "เราจัดสัมมนา การประชุมผู้เชี่ยวชาญ และเวทีรับฟังผู้มีส่วนได้เสียครบวงจร — ตั้งแต่ออกแบบกำหนดการ เชิญวิทยากร จัดสถานที่และอุปกรณ์ ดำเนินรายการสด สังเคราะห์ข้อมูลขณะประชุม จนถึงเขียนรายงานบันทึกข้อสรุปที่ห้องประชุมเห็นพ้อง\n\nลูกค้าที่มาหาเรามักเคยจัดงานแบบเดิม ๆ แล้วได้กลับไปแค่แบบประเมินผู้เข้าร่วม จุดที่เราต่างคือเรามองทุกสัมมนาเป็นกิจกรรมวิจัยที่มีผลผลิตให้นำไปอภิปรายต่อ ไม่ใช่แค่เวทีส่งสาร",
    deliverablesEn: [
      "Agenda design",
      "Speaker coordination",
      "Participant invitation",
      "Venue & equipment management",
      "Live moderation & discussion",
      "Real-time synthesis",
      "Meeting reports",
    ],
    deliverablesTh: [
      "การออกแบบกำหนดการ",
      "การประสานงานวิทยากร",
      "การเชิญผู้เข้าร่วม",
      "จัดสถานที่และอุปกรณ์",
      "ดำเนินรายการและอภิปราย",
      "สังเคราะห์ข้อมูลขณะประชุม",
      "รายงานการประชุม",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "chula-communication-arts-strengthens-academic-collaboration-with-keio-university-and-bunkyo-universi",
      "associate-professor-dr-smith-boonchutima-delivers-special-lecture-at-professional-treasury-officer",
      "dr-teerada-of-chulalongkorn-university-leads-workshop-preparing-thai-students-in-türkiye-for-the-wo",
    ],
    ctaEn: "Plan a seminar",
    ctaTh: "วางแผนการประชุม",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/seminar",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/seminar",
    heroAltEn: "Audience listening to a panel of speakers at a seminar",
    heroAltTh: "ผู้เข้าร่วมฟังวิทยากรบนเวทีสัมมนา",
  },
  {
    slug: "marketing-event",
    titleEn: "Marketing events",
    titleTh: "งานการตลาดและกิจกรรม",
    subtitleEn: "Launches, activations, and public-facing programs that move audiences in person.",
    subtitleTh: "งานเปิดตัว กิจกรรมแบรนด์ และโปรแกรมสาธารณะที่สื่อสารใจถึงใจ ในพื้นที่จริง",
    // SDG override per services_copy.md → 11 (Sustainable Cities).
    sdgNumber: 11,
    descriptionEn:
      "When you need an audience to feel something, not just read it — that's a marketing event. We design and produce launches, public campaigns, awareness activations, and sustainability-themed community events that bring online communication into physical reality. Stage, lighting, broadcasting, speaker line-up, evaluation — we handle the entire production.\n\nOur events have driven national drug-safety awareness, community engagement around environmental themes, and academic-industry partnerships visible in mainstream media.",
    descriptionTh:
      "เมื่องานต้องการให้ผู้ชม \"รู้สึก\" ไม่ใช่แค่ \"รับรู้\" — นั่นคือบทบาทของอีเวนต์ เราออกแบบและผลิตงานเปิดตัว แคมเปญสาธารณะ กิจกรรมสร้างความตระหนัก และอีเวนต์ชุมชนธีมความยั่งยืน ที่ดึงการสื่อสารออนไลน์ให้กลายเป็นประสบการณ์จริงในพื้นที่จริง — ตั้งแต่เวที แสง การถ่ายทอดสด รายชื่อวิทยากร ไปจนถึงการประเมินผล เราดูแลทั้งโปรดักชัน\n\nอีเวนต์ที่เราเคยจัดขับเคลื่อนการรณรงค์ความปลอดภัยทางยาในระดับประเทศ สร้างการมีส่วนร่วมของชุมชนรอบประเด็นสิ่งแวดล้อม และเปิดความร่วมมือวิชาการ-อุตสาหกรรมที่ปรากฏในสื่อกระแสหลัก",
    deliverablesEn: [
      "Event design & creative direction",
      "Venue planning & logistics",
      "Speaker & guest coordination",
      "Stage, lighting & decoration",
      "Launch & activation production",
      "Live broadcast (TV & online)",
      "Event outcome evaluation",
    ],
    deliverablesTh: [
      "ออกแบบงานและทิศทางครีเอทีฟ",
      "จัดสถานที่และโลจิสติกส์",
      "ประสานงานวิทยากรและแขก",
      "เวที แสง และการตกแต่ง",
      "จัดงานเปิดตัวและกิจกรรม",
      "ถ่ายทอดสดผ่านทีวีและออนไลน์",
      "ประเมินผลกิจกรรม",
    ],
    audienceEn: null,
    audienceTh: null,
    relatedSlugs: [
      "comm-art-chula-ce-drives-national-drug-safety-awareness-at-fda-summit",
      "sri-trang-agro-industry",
      "ministry-of-natural-resources-and-environment",
    ],
    ctaEn: "Design my event",
    ctaTh: "ออกแบบอีเวนต์ของคุณ",
    heroImage: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/marketing-event",
    heroImageFallback: "https://res.cloudinary.com/dpzdw1bkr/image/upload/f_auto,q_auto/comminno/services/marketing-event",
    heroAltEn: "Stage lights and crowd at a public-facing marketing event",
    heroAltTh: "ไฟเวทีและผู้ชมในงานการตลาดแบบพบผู้ชมจริง",
  },
];

export const servicesBySlug = new Map<string, ServiceWithCopy>(
  services.map((s) => [s.slug, s]),
);

/** Stable display order — mirrors services_copy.md (1 → 9). */
export const serviceOrder: readonly string[] = services.map((s) => s.slug);
