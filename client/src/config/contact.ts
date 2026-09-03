/**
 * Contact details — the one place the center's public contact points are defined.
 *
 * The general address was published as `comminno@chula.ac.th` (no dot) in 12
 * places across three files: the contact page, both success and both error
 * states of the form, the cookie banner in both languages, and the
 * Organization JSON-LD served to Google. The real mailbox is
 * `comm.inno@chula.ac.th` WITH a dot, confirmed by the center on 2026-09-03.
 *
 * A wrong email fails silently in the worst possible way: the sender gets a
 * bounce, the center never learns that someone tried to reach them. Hence one
 * constant, and a guard in scripts/check-content.mjs that fails the build if
 * the no-dot form reappears in shipped output.
 */

/** General enquiries — shown on /contact, in the form's states, and in JSON-LD. */
export const CENTER_EMAIL = "comm.inno@chula.ac.th";

/** Data Protection Officer — cited throughout the privacy notice. */
export const DPO_EMAIL = "comm.inno@chula.ac.th";

/**
 * Switchboard number shown on /contact and in JSON-LD.
 *
 * NOT yet confirmed. The center gave +66 2 218 2163 as the DPO line, which
 * differs from this. Both may be right (different extensions) or this one may
 * be as stale as the email was — it has not been checked either way.
 */
export const CENTER_PHONE_DISPLAY = "+66 (0)2 218 2215";
export const CENTER_PHONE_E164 = "+6622182215";

/** DPO line, confirmed by the center on 2026-09-03. */
export const DPO_PHONE = "+66 2 218 2163";
