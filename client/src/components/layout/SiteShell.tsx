/**
 * SiteShell — the chrome that wraps every page (header + main + footer).
 * Includes a WCAG-required "skip to main content" link as the very first
 * focusable element.
 */

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";

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
      <Footer />
    </div>
  );
}
