/**
 * Contact details — the one place the center's public contact points are defined.
 *
 * Two corrections from the center on 2026-09-03 live here:
 *
 * 1. The email was published as `comminno@chula.ac.th` (no dot) in 12 places
 *    across three files. The real mailbox is `comm.inno@chula.ac.th` WITH a
 *    dot. A wrong address fails silently in the worst way — the sender gets a
 *    bounce and the center never learns anyone tried to make contact.
 *
 * 2. The phone was published as +66 2 218 2215. The center's actual number is
 *    +66 2 218 2163 — the Department of Public Relations line, where
 *    department staff answer and pass enquiries on to the Center. That relay
 *    is why the number is never printed bare: a caller who expects the Center
 *    to pick up, and instead reaches a department office, wastes everyone's
 *    time. Every place this number appears in prose says who answers.
 *
 * scripts/check-content.mjs fails the build if either superseded value
 * reappears in shipped output.
 */

/** General enquiries — /contact, the form's states, the cookie banner, JSON-LD. */
export const CENTER_EMAIL = "comm.inno@chula.ac.th";

/** Data Protection Officer. The center routes privacy requests to the same inbox. */
export const DPO_EMAIL = CENTER_EMAIL;

/**
 * The center's phone, in the three forms the site needs.
 *
 * Thai readers expect the domestic grouping (0 2218 2163); everyone else gets
 * the international form. `E164` is for `tel:` hrefs and structured data,
 * which must not contain spaces or brackets.
 */
export const CENTER_PHONE_TH = "0 2218 2163";
export const CENTER_PHONE_EN = "+66 2 218 2163";
export const CENTER_PHONE_E164 = "+6622182163";
/** Hyphenated form for schema.org `telephone`. */
export const CENTER_PHONE_SCHEMA = "+66-2-218-2163";

/** Same line for privacy requests — see the note above about who answers. */
export const DPO_PHONE_TH = CENTER_PHONE_TH;
export const DPO_PHONE_EN = CENTER_PHONE_EN;
