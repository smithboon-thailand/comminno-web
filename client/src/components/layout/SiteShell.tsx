/**
 * SiteShell — the chrome that wraps every page (header + main + footer).
 * Includes a WCAG-required "skip to main content" link as the very first
 * focusable element.
 */

import { lazy, Suspense, type ReactNode } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Header } from "./Header";
import { AnnouncerHost } from "@/components/InlineAnnouncer";

/* Footer is below the fold on every page — ship it as a separate chunk
 * so it doesn't block initial paint or compete with the hero font for
 * download bandwidth. */
const Footer = lazy(() =>
  import("./Footer").then((m) => ({ default: m.Footer })),
);

interface Props {
  children: ReactNode;
}

export function SiteShell({ children }: Props) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--brand-paper)" }}>
      <a className="skip-link" href="#main">
        {t("nav.skip")}
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <AnnouncerHost />
    </div>
  );
}
