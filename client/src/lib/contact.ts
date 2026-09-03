/**
 * The centre's contact address — one value, imported everywhere it appears.
 *
 * The address has a dot in the local part: `comm.inno@`, not `comminno@`.
 *
 * Why this file exists. The address was previously typed out in ten separate
 * places — six copy strings on the contact page, two in the cookie-consent
 * notice, the constant below, and the Organization JSON-LD in the static
 * `client/index.html` shell — and every one of them had it wrong. A wrong email
 * address fails silently in the worst possible way: mail sent to it bounces
 * back to the sender, so the centre never learns that someone tried to reach it
 * and could not. Ten copies means ten chances to fix nine and miss one.
 *
 * The same bug, with the same address, was found and fixed on the centre's live
 * site (a different repository) on 3 Sep 2026; the fix there was likewise to
 * collapse the value to a single exported constant. Do not re-inline it.
 *
 * `client/index.html` is the one unavoidable exception: it is a static document
 * that cannot import a module, so the address is written out there and carries
 * a comment pointing back here. If it ever changes, that file changes too.
 */
export const CENTER_EMAIL = "comm.inno@chula.ac.th";

/** `mailto:` target for links and buttons. */
export const CENTER_EMAIL_HREF = `mailto:${CENTER_EMAIL}` as const;

/**
 * The centre's telephone number — same single-source rule as the address above.
 *
 * Confirmed as +66 2 218 2163. The number previously written here and on the
 * contact page was +66 (0)2 218 2215, which does not match the number the
 * centre publishes on its live site. Both were hand-typed in two places, which
 * is the same failure mode that put a wrong email in ten places.
 *
 * Formatted from one digit string so a future change cannot update one
 * rendering and miss another.
 */
const PHONE_DIGITS = "022182163";

/** `+66 2 218 2163` — the display form used on the page. */
export const CENTER_PHONE_DISPLAY =
  `+66 ${PHONE_DIGITS.slice(1, 2)} ${PHONE_DIGITS.slice(2, 5)} ${PHONE_DIGITS.slice(5)}` as const;

/**
 * `+66-2-218-2163` — the machine-readable form for schema.org `telephone`,
 * written with hyphens as the schema.org examples show.
 */
export const CENTER_PHONE_SCHEMA =
  `+66-${PHONE_DIGITS.slice(1, 2)}-${PHONE_DIGITS.slice(2, 5)}-${PHONE_DIGITS.slice(5)}` as const;
