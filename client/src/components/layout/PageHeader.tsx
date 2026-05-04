/**
 * PageHeader — shared kicker/breadcrumbs/title block for every non-home page.
 *
 * Renders an accessible breadcrumb trail (BreadcrumbList JSON-LD is emitted
 * separately by usePageMeta), a sentence-case h1, and an optional lede.
 */
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";

export interface Crumb {
  /** Path relative to locale root, e.g. "/services" — pass undefined for the current page. */
  href?: string;
  label: string;
}

interface Props {
  crumbs: Crumb[];
  title: string;
  lede?: string;
  /** Tone tint for the kicker bar — defaults to brand-red. */
  accent?: string;
  /** Optional right-side element (e.g. a category chip on /insights). */
  meta?: ReactNode;
}

export function PageHeader({
  crumbs,
  title,
  lede,
  accent = "var(--brand-red)",
  meta,
}: Props) {
  return (
    <header
      className="border-b"
      style={{
        borderBottomColor: "var(--mist)",
        backgroundColor: "var(--brand-paper)",
      }}
    >
      <div className="container py-10 md:py-14">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 text-sm">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={i} className="inline-flex items-center gap-1">
                  {c.href && !last ? (
                    <LocaleLink
                      href={c.href}
                      className="rounded-sm hover:underline"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {c.label}
                    </LocaleLink>
                  ) : (
                    <span
                      aria-current={last ? "page" : undefined}
                      style={{ color: last ? "var(--ink)" : "var(--ink-muted)" }}
                    >
                      {c.label}
                    </span>
                  )}
                  {!last && (
                    <ChevronRight
                      size={14}
                      aria-hidden="true"
                      style={{ color: "var(--ink-muted)" }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-3xl">
            {/* Accent rule */}
            <div
              aria-hidden="true"
              className="mb-3 h-1 w-12 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <h1
              className="font-display text-balance"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                lineHeight: 1.1,
                color: "var(--ink)",
              }}
            >
              {title}
            </h1>
            {lede && (
              <p
                className="mt-4 text-pretty"
                style={{
                  fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                  lineHeight: 1.55,
                  color: "var(--ink-muted)",
                }}
              >
                {lede}
              </p>
            )}
          </div>
          {meta}
        </div>
      </div>
    </header>
  );
}
