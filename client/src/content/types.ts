// Team types extended manually for Task 2.5 (faculty data import).
// Other types remain compatible with scripts/build-content.mjs output.

export type Locale = "th" | "en";

/** Post metadata (no body) — safe to import on every page. */
export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  /** ISO date YYYY-MM-DD, or null if source was missing it. */
  date: string | null;
  /** Category slugs from the original Wix taxonomy. */
  tags: string[];
  /** Original Wix-side image filename (binaries arrive in comminno_images.zip). */
  coverFilename: string | null;
  /**
   * Curated cover image for posts that originally lacked one. WebP preferred;
   * paired with `coverJpg` for fallback and `coverAltEn`/`coverAltTh` for a11y.
   * When set, takes precedence over `coverFilename` at render time.
   */
  coverWebp?: string | null;
  coverJpg?: string | null;
  coverAltEn?: string | null;
  coverAltTh?: string | null;
  /** Long-form OG description from the original site, sentence-cased. */
  ogDescription: string;
}

/** Full post = metadata + body. Import only on InsightDetail. */
export interface Post extends PostMeta {
  body: string;
}

export interface Category {
  slug: string;
  titleEn: string;
  titleTh: string | null;
  isService: boolean;
}

export interface Service {
  slug: string;
  titleEn: string;
  titleTh: string | null;
  /** UN SDG goal number (1-17) — matches --sdg-{n} in tokens.css. */
  sdgNumber: number | null;
  subtitleEn?: string | null;
  subtitleTh?: string | null;
  descriptionEn: string | null;
  descriptionTh: string | null;
  deliverablesEn: string[] | null;
  deliverablesTh: string[] | null;
  audienceEn: string | null;
  audienceTh: string | null;
  ctaEn?: string | null;
  ctaTh?: string | null;
  relatedSlugs?: string[] | null;
}

/** A single peer-reviewed publication with DOI link. */
export interface Publication {
  /** APA-ish citation as displayed (already TH/EN aware). */
  citationEn: string;
  citationTh?: string | null;
  /** Year — used for sort + display badge. */
  year: number;
  /** Venue (journal / publisher / book series) — short, used as secondary line. */
  venue: string;
  /** Full DOI URL (https://doi.org/...) — opens publisher landing page. */
  doi?: string | null;
  /** Optional alternative open-access URL when no DOI is available. */
  url?: string | null;
}

/** External research / scholar profile (rendered as icon-button under name). */
export interface TeamProfileLinks {
  orcid?: string | null;
  scholar?: string | null;
  researchgate?: string | null;
  scopus?: string | null;
  linkedin?: string | null;
  webOfScience?: string | null;
  /** True when the person has explicitly told us "ORCID coming soon" — page renders a placeholder pill instead of hiding the slot. */
  orcidPending?: boolean;
  scholarPending?: boolean;
}

/** Tier 1 / Tier 2 — full bilingual profile card. */
export interface TeamMember {
  slug: string;
  /** Full Thai name with academic title prefix, e.g. "รศ. ดร. สมิทธิ์ บุญชุติมา". */
  nameTh: string;
  /** Full English name with academic title prefix, e.g. "Assoc. Prof. Smith Boonchutima, Ph.D.". */
  nameEn: string;
  /** Center role (Tier 1/2 label), bilingual. */
  centerRoleTh: string;
  centerRoleEn: string;
  /**
   * Square portrait URL (preferred format — webp, ≥ 800×800). When omitted,
   * the card renders a brand-gradient placeholder. Use absolute
   * manus-storage paths.
   */
  photo?: string | null;
  /** Fallback portrait URL for browsers without webp (jpg, ≥ 800×800). */
  photoFallback?: string | null;
  /** Alt text for the portrait — short, descriptive, no "Photo of" prefix. */
  photoAlt?: string | null;
  /** Faculty / departmental role, bilingual; nullable. */
  facultyRoleTh?: string | null;
  facultyRoleEn?: string | null;
  /** International / editorial role line (only Tier 1 typically uses this). */
  internationalRoleTh?: string | null;
  internationalRoleEn?: string | null;
  email?: string | null;
  /** Bio paragraphs (long form) — rendered as multi-paragraph blocks. */
  bioTh: string;
  bioEn: string;
  /** Comma-separated expertise list (already locale-formatted). */
  expertiseTh?: string | null;
  expertiseEn?: string | null;
  /** Publications — most-recent first. Tier 1 should carry 5+. */
  publications?: Publication[];
  links: TeamProfileLinks;
}

/** Tier 3 — research / staff grid card. Lightweight shape. */
export interface ResearchStaff {
  slug: string;
  nameTh: string;
  nameEn: string;
  roleTh: string;
  roleEn: string;
  /** Square portrait URL (webp). */
  photo?: string | null;
  /** Fallback portrait URL (jpg). */
  photoFallback?: string | null;
  photoAlt?: string | null;
  /** True when the Thai spelling is auto-transliterated and pending verification by the center. */
  thaiSpellingPending?: boolean;
}

/** Strategic / institutional partner. */
export interface Partner {
  slug: string;
  organizationTh: string;
  organizationEn: string;
  /** Bridge contact at the partner organization (a person), bilingual. */
  contactNameTh?: string | null;
  contactNameEn?: string | null;
  contactRoleTh?: string | null;
  contactRoleEn?: string | null;
  /** Square portrait of the bridge contact (webp). */
  contactPhoto?: string | null;
  /** JPG fallback for the contact portrait. */
  contactPhotoFallback?: string | null;
  contactPhotoAlt?: string | null;
  /** What links us — short bilingual paragraph. */
  synergyTh: string;
  synergyEn: string;
  websiteUrl?: string | null;
}

/**
 * About-page content.
 *
 * The legacy `faculty` + `widerTeam` keys remain (they back JSON-LD members
 * and the older /about renderer) but the new three-tier UI is driven by
 * `leadership` + `faculty2` + `researchTeam` + `partners`.
 */
export interface About {
  missionEn: string;
  missionTh?: string | null;
  pillarsEn: string[];
  pillarsTh?: string[] | null;
  /** Tier 1 — Center Leadership (3 hero cards w/ full bios + pubs). */
  leadership: TeamMember[];
  /** Tier 2 — Center Faculty (currently 1 secondary card). */
  faculty2: TeamMember[];
  /** Tier 3 — Research team & staff (grid). */
  researchTeam: ResearchStaff[];
  /** Strategic / institutional partners. */
  partners: Partner[];
  /** Legacy fields kept for JSON-LD compatibility. */
  faculty: { slug: string; name: string; role: string }[];
  widerTeam: string[];
}

export interface Redirect {
  /** Wix path (e.g. "/post/chula-zero-waste"). */
  from: string;
  /** New path (e.g. "/insights/chula-zero-waste"). */
  to: string;
}
