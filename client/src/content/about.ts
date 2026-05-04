/**
 * About — canonical team data
 *
 * Source of truth: comminno_faculty_data/CIC_Faculty_for_Manus.md
 * (verified May 4 2026, update #3 — every entry cross-checked against
 * Springer / Wiley / SAGE / PLOS / PubMed / ResearchGate / Kudos /
 * ORCID / Faculty Directory / TCI ThaiJO).
 *
 * Name corrections applied per §2 of the source document:
 *   "Wassayut Kongjan"   → "Watsayut Kongchan" (วรรษยุต คงจันทร์)
 *   "Wai Phan Chansem"   → moved to Partners as "Waiphot Chansem"
 *   "Atchara Boonchum"   → "Achara Bunchum"   (อัจฉรา บุญชุ่ม)
 *   "Ekasit Sumana"      → "Akasit Sumana"    (เอกสิทธิ์ สุมานะ)
 *   "Boonchotima"        → "Boonchutima"      (any occurrence)
 */
import type { About } from "./types";

export const about: About = {
  missionEn:
    "We, the Center of Excellence in Communication Innovation for Development of Quality of Life and Sustainability at the Faculty of Communication Arts, Chulalongkorn University, are a research center dedicated to creating knowledge and developing communication innovations that enhance quality of life and sustainability.",
  missionTh:
    "ศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสารเพื่อการพัฒนาคุณภาพชีวิตและความยั่งยืน คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย เป็นศูนย์วิจัยที่มุ่งสร้างองค์ความรู้และนวัตกรรมการสื่อสารเพื่อยกระดับคุณภาพชีวิตและความยั่งยืนของสังคม",
  pillarsEn: [
    "Developing communication innovation for the improvement of quality of life and sustainability through teaching, learning, and training management.",
    "Coming together as a group or community to advocate for communication aimed at collectively developing the quality of life and sustainability within society.",
    "Developing innovative tools and equipment to help society understand and perceive the guidelines for developing quality of life and sustainability.",
  ],
  pillarsTh: [
    "พัฒนานวัตกรรมการสื่อสารเพื่อยกระดับคุณภาพชีวิตและความยั่งยืน ผ่านการจัดการเรียนการสอนและการฝึกอบรม",
    "รวมตัวเป็นกลุ่ม/ชุมชน เพื่อขับเคลื่อนการสื่อสารที่มุ่งพัฒนาคุณภาพชีวิตและความยั่งยืนของสังคมร่วมกัน",
    "พัฒนาเครื่องมือและอุปกรณ์เชิงนวัตกรรม เพื่อช่วยให้สังคมเข้าใจและรับรู้แนวทางการพัฒนาคุณภาพชีวิตและความยั่งยืน",
  ],

  // ─────────────────────────────────────────────────────────────
  // Tier 1 — Center Leadership (3 hero cards)
  // ─────────────────────────────────────────────────────────────
  leadership: [
    {
      slug: "smith",
      nameTh: "รศ. ดร. สมิทธิ์ บุญชุติมา",
      nameEn: "Assoc. Prof. Smith Boonchutima, Ph.D.",
      centerRoleTh: "หัวหน้าศูนย์ / หัวหน้าหน่วยปฏิบัติการวิจัย",
      centerRoleEn: "Head of Center · Head of Research Operations Unit",
      facultyRoleTh:
        "รองศาสตราจารย์ ภาควิชาการประชาสัมพันธ์ คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
      facultyRoleEn:
        "Associate Professor, Department of Public Relations, Faculty of Communication Arts, Chulalongkorn University",
      internationalRoleTh:
        "ประธาน Asian Congress for Media and Communication (ACMC) วาระ 2024–2026 และคณะบรรณาธิการวารสาร BMC Public Health (Springer Nature)",
      internationalRoleEn:
        "President of Asian Congress for Media and Communication (ACMC) 2024–2026 · Editorial Board Member, BMC Public Health (Springer Nature)",
      email: "smith.b@chula.ac.th",
      bioTh:
        "รศ. ดร. สมิทธิ์ บุญชุติมา เป็นผู้ก่อตั้งและหัวหน้าศูนย์ความเป็นเลิศด้านนวัตกรรมการสื่อสาร โดยมีความเชี่ยวชาญด้านการสื่อสารสุขภาพ การสื่อสารความเสี่ยง และการสื่อสารเชิงกลยุทธ์ ผลงานวิจัยของท่านครอบคลุมประเด็นสุขภาพแรงงานข้ามชาติเมียนมา การป้องกัน HIV/AIDS การประชาสัมพันธ์ยุค AI และการสื่อสารกีฬา ปัจจุบันดำรงตำแหน่งประธาน ACMC วาระ 2024–2026 และเป็นกองบรรณาธิการวารสาร BMC Public Health (Springer Nature) อีกทั้งยังเป็นที่ปรึกษาด้านการสื่อสารให้กับกรมควบคุมโรคและสำนักงานนวัตกรรมแห่งชาติ (NIA)",
      bioEn:
        "Assoc. Prof. Smith Boonchutima is the founding head of the Center of Excellence in Communication Innovation. His research spans health communication, risk communication, migrant-worker health (Myanmar communities), HIV/AIDS prevention, AI in public relations, and sport communication. He currently serves as President of the Asian Congress for Media and Communication (ACMC) 2024–2026, as Editorial Board Member of BMC Public Health (Springer Nature), and as communication consultant to Thailand's Department of Disease Control and National Innovation Agency (NIA).",
      expertiseTh:
        "การสื่อสารสุขภาพ · การสื่อสารความเสี่ยง · สุขภาพแรงงานข้ามชาติ · การป้องกัน HIV/AIDS · ประชาสัมพันธ์เชิงกลยุทธ์ · AI ในการประชาสัมพันธ์ · การสื่อสารกีฬา · Augmented Reality Marketing",
      expertiseEn:
        "Health Communication · Risk Communication · Migrant Health · HIV/AIDS Prevention · Strategic PR · AI in Public Relations · Sport Communication · Augmented Reality Marketing",
      publications: [
        {
          year: 2026,
          venue: "Research Involvement and Engagement, Springer",
          citationEn:
            "Boonchutima, S. et al. (2026). Myanmar migrant workers co-designed a health study for their workplace pain. Research Involvement and Engagement (Springer).",
          doi: "https://doi.org/10.1186/s40900-026-00891-8",
        },
        {
          year: 2026,
          venue: "Cogent Arts and Humanities (Taylor & Francis)",
          citationEn:
            "Boonchutima, S. et al. (2026). How Thai Gen Z turned anime from a stigma into a mainstream identity and cultural force. Cogent Arts and Humanities.",
          doi: "https://doi.org/10.1080/23311983.2026.2647143",
        },
        {
          year: 2026,
          venue: "Wellcome Open Research",
          citationEn:
            "Boonchutima, S. et al. (2026). Measuring disease stigma in Thailand: adapting new tools for MSM and Myanmar migrant communities. Wellcome Open Research.",
          doi: "https://doi.org/10.12688/wellcomeopenres.26014.1",
        },
        {
          year: 2025,
          venue: "Cogent Social Sciences (Taylor & Francis)",
          citationEn:
            "Boonchutima, S. et al. (2025). How advertising can fight back against negative online reviews. Cogent Social Sciences.",
          doi: "https://doi.org/10.1080/23311886.2025.2526800",
        },
        {
          year: 2025,
          venue: "PLOS ONE",
          citationEn:
            "Mazahir, I., Boonchutima, S. (Corresponding author), & Yaseen, S. (2025). From tradition to progressiveness: Analyzing Thailand's image on YouTube amid post-cannabis legalization. PLOS ONE, 20(2): e0317506.",
          doi: "https://doi.org/10.1371/journal.pone.0317506",
        },
      ],
      links: {
        orcid: "https://orcid.org/0000-0001-7412-4506",
        scholar: "https://scholar.google.com/citations?user=LKEmLP0AAAAJ&hl=en",
        scopus: "https://www.scopus.com/authid/detail.uri?authorId=56167805200",
        researchgate: "https://www.researchgate.net/profile/Smith-Boonchutima",
        webOfScience: "https://www.webofscience.com/wos/author/record/X-3252-2019",
        linkedin: "https://www.linkedin.com/in/smith-boonchutima-77202733/",
      },
    },
    {
      slug: "teerada",
      nameTh: "ผศ. ดร. ธีรดา จงกลรัตนาภรณ์",
      nameEn: "Asst. Prof. Teerada Chongkolrattanaporn, Ph.D.",
      centerRoleTh: "รองหัวหน้าศูนย์คนที่ 1 / รองหัวหน้าหน่วยปฏิบัติการวิจัย",
      centerRoleEn: "Deputy Head of Center · Deputy Head of Research Operations Unit",
      facultyRoleTh:
        "หัวหน้าภาควิชาการประชาสัมพันธ์ คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
      facultyRoleEn:
        "Head of Department of Public Relations, Faculty of Communication Arts, Chulalongkorn University",
      email: "teerada.c@chula.ac.th",
      bioTh:
        "ผศ. ดร. ธีรดา จงกลรัตนาภรณ์ เป็นผู้เชี่ยวชาญด้านการสื่อสารภาวะวิกฤต การสื่อสารสภาพภูมิอากาศ และการสื่อสารความเสี่ยงด้านสุขภาพ (ความปลอดภัยในการใช้ยาและการดื้อยา) งานวิจัยของท่านครอบคลุมแนวคิด framing theory การสื่อสารวัฒนธรรมในการประชาสัมพันธ์ พฤติกรรม Gen Z ต่อสินค้าปลอดการทดลองในสัตว์ และการสื่อสารความขัดแย้งชายแดนใต้ ผลงานล่าสุดประกอบด้วยบทในหนังสือ Routledge ปี 2024 จำนวน 2 บทเกี่ยวกับการสื่อสารสิ่งแวดล้อมในเอเชีย",
      bioEn:
        "Asst. Prof. Teerada Chongkolrattanaporn specializes in crisis PR, climate communication & framing theory, and health-risk communication (drug safety, antimicrobial resistance). Her research covers cultural context in PR, Gen Z attitudes toward cruelty-free brands, and southern-border conflict communication. Recent outputs include two 2024 Routledge book chapters on environmental communication in Asia, and she is a 2025 guest on the international podcast \"Women in PR with Ana Adi\".",
      expertiseTh:
        "การสื่อสารสภาพภูมิอากาศและทฤษฎี framing · การสื่อสารภาวะวิกฤตและประชาสัมพันธ์ในวิกฤต · การสื่อสารความเสี่ยงสุขภาพ · บริบทวัฒนธรรมในการประชาสัมพันธ์ · พฤติกรรมผู้บริโภค Gen Z · brand activism · การสื่อสารความขัดแย้ง",
      expertiseEn:
        "Climate Communication & Framing Theory · Crisis PR · Health Risk Communication (Drug Safety · AMR) · Cultural Context in PR · Gen Z Consumer Behavior · Brand Activism · Conflict Communication",
      publications: [
        {
          year: 2025,
          venue: "Journal of Communication Arts (TCI ThaiJO)",
          citationEn:
            "Chongkolrattanaporn, T., Kleechaya, P., Serisamran, T., & Kijrungpaisarn, K. (2025). Reframing Thailand's Southern Border Conflict through a Self-transcendental Narrative Paradigm. Journal of Communication Arts, 43(1).",
          url: "https://so02.tci-thaijo.org/index.php/jcomm/article/view/275202",
        },
        {
          year: 2024,
          venue: "Routledge — Multi-Stakeholder Contribution in Asian Environmental Communication",
          citationEn:
            "Chongkolrattanaporn, T. (2024). Roles of Universities and Academic Researchers in Environmental Communication in Thailand. Chapter 2 in Mohamad Saleh, Adi Kasuma & Huang (Eds.). Routledge.",
          doi: "https://doi.org/10.4324/9781032670508-4",
        },
        {
          year: 2024,
          venue: "Routledge — Multi-Stakeholder Contribution in Asian Environmental Communication",
          citationEn:
            "Chongkolrattanaporn, T. (2024). Challenging Gender Roles in the Environmental Issues: The Role of Brand Activism in Thai Media and Communication Strategies. Chapter 8. Routledge.",
        },
        {
          year: 2024,
          venue: "Communication and Media in Asia Pacific (CMAP)",
          citationEn:
            "Chongkolrattanaporn, T. Segmenting Thai Generation Z Consumers on Cruelty-free Products: Their Value, Attitude, Brand Loyalty, and Purchase Intention. CMAP.",
          url: "https://so01.tci-thaijo.org/index.php/CMAP/article/view/261917",
        },
        {
          year: 2012,
          venue: "International Journal of Climate Change: Impacts and Responses",
          citationEn:
            "Chongkolrattanaporn, T. (2012). Global Warming Campaigns in Bangkok: Framing Analysis and Campaign Effectiveness. 3(4), 53–70.",
          doi: "https://doi.org/10.18848/1835-7156/CGP/v03i04/37139",
        },
      ],
      links: {
        orcidPending: true,
        scholarPending: true,
        linkedin:
          "https://www.linkedin.com/in/teerada-chongkolrattanaporn-058588b2",
      },
    },
    {
      slug: "pavel",
      nameTh: "รศ. ดร. ปาเวล สลุตสกี้",
      nameEn: "Assoc. Prof. Pavel Slutskiy, Ph.D.",
      centerRoleTh: "รองหัวหน้าศูนย์คนที่ 2 / รองหัวหน้าหน่วยปฏิบัติการวิจัย",
      centerRoleEn: "Deputy Head of Center · Deputy Head of Research Operations Unit",
      facultyRoleTh:
        "รองศาสตราจารย์ด้านการจัดการการสื่อสาร สำนักงานหลักสูตรนานาชาติ คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
      facultyRoleEn:
        "Associate Professor in Communication Management, International Programs Office, Faculty of Communication Arts, Chulalongkorn University",
      internationalRoleTh:
        "ตำแหน่งคู่ขนาน: รองศาสตราจารย์ด้านประชาสัมพันธ์ Saint-Petersburg State Electrotechnical University (LETI)",
      internationalRoleEn:
        "Concurrent appointment: Associate Professor in Public Relations, Saint-Petersburg State Electrotechnical University (LETI)",
      email: "pavel.a@chula.ac.th",
      bioTh:
        "รศ. ดร. ปาเวล สลุตสกี้ เป็นนักวิจัยและนักทฤษฎีด้านการสื่อสารระดับนานาชาติ ผู้เขียนหนังสือ monograph ภาษาอังกฤษ 3 เล่มกับสำนักพิมพ์ Springer ในปี 2021, 2024 และ 2025 งานวิจัยของท่านครอบคลุมปรัชญาการสื่อสารเชิงปฏิบัติ (praxeological approach) ทฤษฎีการพูด (speech act theory) และการสื่อสารข้ามวัฒนธรรม ปัจจุบันเป็นอาจารย์ประจำคณะนิเทศฯ จุฬาฯ ตั้งแต่ตุลาคม 2014 และเป็นผู้นำหลักสูตร Global Communication Project (GlobCom)",
      bioEn:
        "Assoc. Prof. Pavel Slutskiy is an international communication scholar with three English-language monographs published by Springer in 2021, 2024 and 2025. His research spans the praxeological philosophy of communication, speech act theory, cross-cultural and strategic communication, and Russian media studies. He has been with the Faculty of Communication Arts since October 2014 and leads the Global Communication Project (GlobCom) curriculum.",
      expertiseTh:
        "ปรัชญาการสื่อสาร · ทฤษฎีการสื่อสารและการพูด · การสื่อสารข้ามวัฒนธรรม · การสื่อสารเชิงกลยุทธ์ · การสื่อสารองค์กรระดับโลก · การสื่อสารความยั่งยืน · ประชาสัมพันธ์ระดับโลก",
      expertiseEn:
        "Philosophy of Communication · Communication & Speech Act Theory · Cross-cultural Communication · Strategic Communication · Global Organisational Communication · Sustainability Communication · Global PR",
      publications: [
        {
          year: 2025,
          venue: "Springer Singapore (book)",
          citationEn:
            "Slutskiy, P. (2025). Global Communication: Planning Global PR Campaigns. Springer Singapore. Companion text for the Global Communication Project (GlobCom).",
          doi: "https://doi.org/10.1007/978-981-96-7583-8",
        },
        {
          year: 2025,
          venue: "American Behavioral Scientist (SAGE)",
          citationEn:
            "Slutskiy, P. & Gavra, D. (2025). Trump in Russian Pro-Government Media: Analyzing Narratives and Metaphors in 2024 U.S. Presidential Election Coverage. American Behavioral Scientist.",
          doi: "https://doi.org/10.1177/00027642251405617",
        },
        {
          year: 2024,
          venue: "Springer Nature Singapore (book)",
          citationEn:
            "Slutskiy, P. (2024). Philosophical Foundations of Communication Studies: A Praxeological Approach. Springer Nature Singapore.",
          doi: "https://doi.org/10.1007/978-981-97-1013-3",
        },
        {
          year: 2024,
          venue: "Journal for the Theory of Social Behaviour (Wiley)",
          citationEn:
            "Slutskiy, P. (2024). Praxeological Status of Unintentional Speech Acts. Journal for the Theory of Social Behaviour, 54(4), 591–606.",
          doi: "https://doi.org/10.1111/jtsb.12433",
        },
        {
          year: 2022,
          venue: "American Behavioral Scientist (SAGE)",
          citationEn:
            "Slutskiy, P. & Boonchutima, S. (2022). Public Trust in Thailand's COVID-19 Communication: A Shift in Belief. American Behavioral Scientist.",
          doi: "https://doi.org/10.1177/00027642221118297",
        },
        {
          year: 2021,
          venue: "Springer Singapore (book)",
          citationEn:
            "Slutskiy, P. (2021). Communication and Libertarianism. Springer Singapore. Translated editions in Chinese and Russian.",
          doi: "https://doi.org/10.1007/978-981-33-6664-0",
        },
      ],
      links: {
        orcid: "https://orcid.org/0000-0002-0208-9278",
        scholar: "https://scholar.google.com/citations?user=1v6dmxQAAAAJ&hl=en",
        researchgate: "https://www.researchgate.net/profile/Pavel-Slutskiy",
        linkedin: "https://www.linkedin.com/in/pavel-slutsky-44416a28/",
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // Tier 2 — Center Faculty (1 secondary card)
  // ─────────────────────────────────────────────────────────────
  faculty2: [
    {
      slug: "watsayut",
      nameTh: "อ. ดร. วรรษยุต คงจันทร์",
      nameEn: "Watsayut Kongchan, Ph.D.",
      centerRoleTh: "อาจารย์/นักวิจัยประจำศูนย์",
      centerRoleEn: "Center Faculty · Research Affiliate",
      facultyRoleTh:
        "อาจารย์ภาควิชาการประชาสัมพันธ์ และรองคณบดีฝ่ายบริการวิชาการและเชื่อมโยงสังคม คณะนิเทศศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
      facultyRoleEn:
        "Lecturer, Department of Public Relations · Assistant Dean for Academic Services and Social Engagement, Faculty of Communication Arts, Chulalongkorn University",
      email: "watsayut.k@chula.ac.th",
      bioTh:
        "อ. ดร. วรรษยุต คงจันทร์ เชี่ยวชาญด้านการประชาสัมพันธ์เพื่อสุขภาพ การสื่อสารความขัดแย้ง การออกแบบบอร์ดเกมเพื่อเปลี่ยนพฤติกรรม และการสื่อสารสุขภาพในกลุ่ม LGBTQ+ ผลงานเด่นรวมถึงหลักสูตร \"Public Relations for Public Health\" ของคณะนิเทศฯ ที่ใช้บอร์ดเกมเป็นเครื่องมือเรียนรู้ และเป็นผู้ออกแบบเกมสนทนาประเด็นสังคมร่วมกับ ThaiPBS The Active",
      bioEn:
        "Dr. Watsayut Kongchan focuses on public relations for public health, conflict communication, behavior-change board-game design, and LGBTQ+ health communication. He created the flagship course \"Public Relations for Public Health\" which integrates board-game design as a behavior-change tool, and designs games for sensitive-topic dialogue with ThaiPBS The Active.",
      expertiseTh:
        "ประชาสัมพันธ์เพื่อสุขภาพสาธารณะ · การสื่อสารความขัดแย้ง · การออกแบบบอร์ดเกมเพื่อเปลี่ยนพฤติกรรม · การสื่อสาร LGBTQ+ · การสื่อสารเรื่องการใช้สาร · Game-based Learning · การสื่อสาร SDG · Data Storytelling · สื่อใหม่ AR/VR/XR",
      expertiseEn:
        "PR for Public Health · Conflict Communication · Board Game Design for Behavior Change · LGBTQ+ Health Communication · Substance Use Communication · Game-based Learning · SDG Communication · Data Storytelling · AR/VR/XR for PR",
      publications: [
        {
          year: 2017,
          venue: "Psychology Research and Behavior Management (Dove Medical Press)",
          citationEn:
            "Boonchutima, S. & Kongchan, W. (2017). Utilization of dating apps by men who have sex with men for persuading other men toward substance use. Psychology Research and Behavior Management, 10, 31–38.",
          doi: "https://doi.org/10.2147/PRBM.S121480",
        },
      ],
      links: {
        orcid: "https://orcid.org/0000-0002-7868-3249",
        scholarPending: true,
        linkedin: "https://th.linkedin.com/in/watsayut-kongchan-681b5113a",
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // Tier 3 — Research team & staff (grid of 8)
  // ─────────────────────────────────────────────────────────────
  researchTeam: [
    {
      slug: "achara",
      nameTh: "อัจฉรา บุญชุ่ม",
      nameEn: "Achara Bunchum",
      roleTh: "นักวิจัยร่วม",
      roleEn: "Researcher",
    },
    {
      slug: "wanwisa",
      nameTh: "วรรณวิสา เวชประสิทธิ์",
      nameEn: "Wanwisa Wetchprasit",
      roleTh: "ผู้ช่วยนักวิจัย",
      roleEn: "Research Assistant",
      thaiSpellingPending: true,
    },
    {
      slug: "chanapa",
      nameTh: "ชนาภา อิทธิอมรกุลชัย",
      nameEn: "Chanapa Itthiamornkulchai",
      roleTh: "ผู้ช่วยนักวิจัย",
      roleEn: "Research Assistant",
      thaiSpellingPending: true,
    },
    {
      slug: "supatra",
      nameTh: "สุภัทรา เพชรรี",
      nameEn: "Supatra Petchree",
      roleTh: "ผู้ช่วยนักวิจัย",
      roleEn: "Research Assistant",
      thaiSpellingPending: true,
    },
    {
      slug: "akasit",
      nameTh: "เอกสิทธิ์ สุมานะ",
      nameEn: "Akasit Sumana",
      roleTh: "ผู้ช่วยนักวิจัย",
      roleEn: "Research Assistant",
    },
    {
      slug: "hrut",
      nameTh: "ฤทธิ์ สิทธิภูวบุญ",
      nameEn: "Hrut Sitthipuwabun",
      roleTh: "ผู้ช่วยนักวิจัย",
      roleEn: "Research Assistant",
      thaiSpellingPending: true,
    },
    {
      slug: "thavin",
      nameTh: "ธวินทร์ แช่มแช้ง",
      nameEn: "Thavin Chaemchaeng",
      roleTh: "ผู้ช่วยนักวิจัย",
      roleEn: "Research Assistant",
      thaiSpellingPending: true,
    },
    {
      slug: "pornpavee",
      nameTh: "พรปวีณ์ ฐิติทิพย์สกุล",
      nameEn: "Pornpavee Thiuthipsakul",
      roleTh: "นักออกแบบมัลติมีเดีย",
      roleEn: "Multimedia Designer",
      thaiSpellingPending: true,
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // Strategic / institutional partners
  // ─────────────────────────────────────────────────────────────
  partners: [
    {
      slug: "tnsu-samut-sakhon",
      organizationTh:
        "วิทยาเขตสมุทรสาคร มหาวิทยาลัยการกีฬาแห่งชาติ",
      organizationEn:
        "Samut Sakhon Campus, Thailand National Sports University (TNSU)",
      contactNameTh: "ผศ. ดร. ไวพจน์ จันทร์เสม",
      contactNameEn: "Asst. Prof. Waiphot Chansem, Ph.D.",
      contactRoleTh:
        "รองอธิการบดี ประจำวิทยาเขตสมุทรสาคร มหาวิทยาลัยการกีฬาแห่งชาติ",
      contactRoleEn:
        "Vice President, Samut Sakhon Campus, Thailand National Sports University",
      synergyTh:
        "วิทยาเขตสมุทรสาครมีสาขาสื่อสารการกีฬา (Sport Communication) และ ดร. สมิทธิ์ จบ Ph.D. ด้านวิทยาศาสตร์การกีฬา ทำให้ทั้งสองหน่วยงานทำงานร่วมกันในด้านการสื่อสารสุขภาพและกีฬา",
      synergyEn:
        "TNSU Samut Sakhon hosts a Sport Communication programme; combined with Dr. Smith's Ph.D. in Sport Sciences, the two institutions collaborate on sport-health communication research and training.",
      websiteUrl: "https://tnsuskn.ac.th/",
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // Legacy compatibility (kept so JSON-LD and any remaining
  // consumer of `about.faculty` / `about.widerTeam` keeps working).
  // Mirrors leadership[] with EN names, plus Tier-3 EN names.
  // ─────────────────────────────────────────────────────────────
  faculty: [
    {
      slug: "smith",
      name: "Assoc. Prof. Smith Boonchutima, Ph.D.",
      role: "Head of Center · Head of Research Operations Unit",
    },
    {
      slug: "teerada",
      name: "Asst. Prof. Teerada Chongkolrattanaporn, Ph.D.",
      role: "Deputy Head of Center · Head of Department of Public Relations",
    },
    {
      slug: "pavel",
      name: "Assoc. Prof. Pavel Slutskiy, Ph.D.",
      role: "Deputy Head of Center",
    },
    {
      slug: "watsayut",
      name: "Watsayut Kongchan, Ph.D.",
      role: "Center Faculty · Asst. Dean for Academic Services and Social Engagement",
    },
  ],
  widerTeam: [
    "Achara Bunchum",
    "Wanwisa Wetchprasit",
    "Chanapa Itthiamornkulchai",
    "Supatra Petchree",
    "Akasit Sumana",
    "Hrut Sitthipuwabun",
    "Thavin Chaemchaeng",
    "Pornpavee Thiuthipsakul",
  ],
};
