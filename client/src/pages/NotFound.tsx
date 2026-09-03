import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { LocaleLink } from "@/i18n/LocaleLink";

/**
 * Tag the page noindex for as long as this view is mounted.
 *
 * vercel.json now returns a real 404 for unknown route *shapes*, but an unknown
 * *slug* under a valid shape (/th/insights/does-not-exist) still reaches the
 * SPA with HTTP 200 and lands here. Without this tag those are soft 404s: the
 * crawler sees a success status and indexes an error page (audit finding 4.1).
 * Removed on unmount so a client-side navigation away from the 404 does not
 * leave the next page noindexed.
 */
function useNoIndex() {
  useEffect(() => {
    const el = document.createElement("meta");
    el.name = "robots";
    el.content = "noindex, nofollow";
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
}

export default function NotFound() {
  useNoIndex();
  return (
    <div
      className="container py-24 md:py-32 text-center"
      style={{ color: "var(--ink)" }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
        style={{ color: "var(--brand-red)" }}
      >
        404
      </p>
      <h1
        className="font-display text-4xl md:text-6xl mb-4"
        style={{ color: "var(--ink)" }}
      >
        <FormattedMessage id="notfound.title" />
      </h1>
      <p
        className="max-w-xl mx-auto text-base mb-8"
        style={{ color: "var(--slate)" }}
      >
        <FormattedMessage id="notfound.body" />
      </p>
      <LocaleLink
        href="/"
        className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
        style={{
          backgroundColor: "var(--brand-red)",
          color: "#ffffff",
        }}
      >
        <FormattedMessage id="notfound.cta" />
      </LocaleLink>
    </div>
  );
}
