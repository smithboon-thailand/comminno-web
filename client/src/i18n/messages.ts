/**
 * Comm.Inno · i18n message catalogs
 *
 * Single source of truth for every UI string. Keep keys flat & dotted by section.
 * When adding a new key, write the EN copy first, then have the Thai team review
 * the TH copy. Never auto-translate.
 *
 * Naming: <section>.<element>.<state?> — e.g. "nav.about", "hero.cta.primary".
 */

export type Locale = "th" | "en";

export const SUPPORTED_LOCALES: readonly Locale[] = ["th", "en"] as const;
export const DEFAULT_LOCALE: Locale = "th";

export type Messages = Record<string, string>;

export const messages: Record<Locale, Messages> = {
  en: {
    "site.name": "Comm.Inno",
    "site.tagline": "Communication that listens. Innovation that improves life.",

    "nav.skip": "Skip to main content",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.insights": "Insights",
    "nav.team": "Team",
    "nav.contact": "Contact",
    "nav.menu.open": "Open navigation menu",
    "nav.menu.close": "Close navigation menu",
    "nav.placeholder.toast": "This section is coming in the next sprint.",

    "lang.switch.label": "Language",
    "lang.switch.toEN": "English",
    "lang.switch.toTH": "ภาษาไทย",
    "lang.switch.shortEN": "EN",
    "lang.switch.shortTH": "TH",

    "hero.eyebrow": "Center of Excellence · Chulalongkorn University",
    "hero.headline": "Communication that listens. Innovation that improves life.",
    "hero.lede":
      "Comm.Inno is the Center of Excellence in Communication Innovation at the Faculty of Communication Arts, Chulalongkorn University. We turn communication research into tools, training, and campaigns that improve quality of life and advance sustainability.",
    "hero.cta.primary": "Explore our work",
    "hero.cta.secondary": "Book a training",

    "tokens.heading": "Brand colour system",
    "tokens.lede":
      "The four primary colours come straight from the official logo. They drive every accent, button, and tag across the site.",
    "tokens.brand.yellow": "Brand yellow",
    "tokens.brand.red": "Brand red — primary",
    "tokens.brand.blue": "Brand blue",
    "tokens.brand.green": "Brand green",

    "footer.address.line1": "Mongkut Sammitr Building, Faculty of Communication Arts",
    "footer.address.line2": "Chulalongkorn University, 254 Phaya Thai Road",
    "footer.address.line3": "Wang Mai, Pathum Wan, Bangkok 10330",
    "footer.copyright":
      "© {year} Center of Excellence in Communication Innovation, Chulalongkorn University. All rights reserved.",
    "footer.legacy": "Replacing the legacy site at cominnocenter.com.",
    "footer.privacy": "Privacy notice",
    "footer.cookieSettings": "Cookie settings",
    "footer.utility.label": "Site utility links",

    "notfound.title": "Page not found",
    "notfound.body": "Sorry, the page you are looking for doesn't exist or has moved.",
    "notfound.cta": "Back to home",
  },

  th: {
    "site.name": "Comm.Inno",
    "site.tagline": "นวัตกรรมการสื่อสารเพื่อชีวิตที่ดีกว่า",

    "nav.skip": "ข้ามไปยังเนื้อหาหลัก",
    "nav.about": "เกี่ยวกับเรา",
    "nav.services": "บริการ",
    "nav.insights": "บทความ",
    "nav.team": "ทีมงาน",
    "nav.contact": "ติดต่อ",
    "nav.menu.open": "เปิดเมนู",
    "nav.menu.close": "ปิดเมนู",
    "nav.placeholder.toast": "ส่วนนี้จะเปิดให้ใช้งานในเฟสถัดไป",

    "lang.switch.label": "ภาษา",
    "lang.switch.toEN": "English",
    "lang.switch.toTH": "ภาษาไทย",
    "lang.switch.shortEN": "EN",
    "lang.switch.shortTH": "TH",

    "hero.eyebrow": "ศูนย์ความเป็นเลิศ · จุฬาลงกรณ์มหาวิทยาลัย",
    "hero.headline": "นวัตกรรมการสื่อสารเพื่อชีวิตที่ดีกว่า",
    "hero.lede":
      "Comm.Inno คือศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ที่เปลี่ยนงานวิจัยการสื่อสารให้กลายเป็นเครื่องมือ หลักสูตรอบรม และแคมเปญที่ยกระดับคุณภาพชีวิตและขับเคลื่อนความยั่งยืน",
    "hero.cta.primary": "ดูผลงาน",
    "hero.cta.secondary": "อบรมกับเรา",

    "tokens.heading": "ระบบสีหลักของแบรนด์",
    "tokens.lede":
      "สีหลักทั้งสี่สีมาจากโลโก้อย่างเป็นทางการของศูนย์ฯ และเป็นแกนกลางของทุกองค์ประกอบสีบนเว็บไซต์",
    "tokens.brand.yellow": "เหลืองแบรนด์",
    "tokens.brand.red": "แดงแบรนด์ — สีหลัก",
    "tokens.brand.blue": "น้ำเงินแบรนด์",
    "tokens.brand.green": "เขียวแบรนด์",

    "footer.address.line1": "อาคารมงกุฎสมมติ คณะนิเทศศาสตร์",
    "footer.address.line2": "จุฬาลงกรณ์มหาวิทยาลัย 254 ถนนพญาไท",
    "footer.address.line3": "แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330",
    "footer.copyright":
      "© {year} ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร จุฬาลงกรณ์มหาวิทยาลัย สงวนลิขสิทธิ์",
    "footer.legacy": "เว็บไซต์ใหม่ทดแทน cominnocenter.com",
    "footer.privacy": "นโยบายความเป็นส่วนตัว",
    "footer.cookieSettings": "ตั้งค่าคุกกี้",
    "footer.utility.label": "ลิงก์เสริมของเว็บไซต์",

    "notfound.title": "ไม่พบหน้าที่คุณค้นหา",
    "notfound.body": "ขออภัย หน้าที่คุณกำลังมองหาไม่มีอยู่หรืออาจถูกย้ายไปแล้ว",
    "notfound.cta": "กลับสู่หน้าแรก",
  },
};

/** Per-locale ISO tag for <html lang> & Intl.DateTimeFormat. */
export const localeTag: Record<Locale, string> = {
  th: "th-TH",
  en: "en-US",
};

/** Per-locale meta description (manually written — never auto-generated). */
export const metaDescription: Record<Locale, string> = {
  en: "Comm.Inno is the Center of Excellence in Communication Innovation at Chulalongkorn University's Faculty of Communication Arts — communication research turned into tools, training, and campaigns that improve quality of life and sustainability.",
  th: "Comm.Inno คือศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ที่เปลี่ยนงานวิจัยให้กลายเป็นเครื่องมือ หลักสูตรอบรม และแคมเปญที่ยกระดับคุณภาพชีวิตและความยั่งยืน",
};
