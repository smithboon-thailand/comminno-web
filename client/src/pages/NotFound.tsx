import { FormattedMessage } from "react-intl";
import { LocaleLink } from "@/i18n/LocaleLink";

export default function NotFound() {
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
