/**
 * SpeedInsightsGated — Comm.Inno
 *
 * Wraps Vercel Speed Insights so it ONLY mounts after the visitor opts in to
 * the "analytics" cookie category. Per Vercel's Speed Insights privacy notice
 * (https://vercel.com/docs/speed-insights/privacy-policy), the package is
 * cookie-less, IP-less and stores no cross-page session — but PDPA Section 19
 * still requires explicit consent for any first-party performance telemetry
 * that is not "strictly necessary" to the service. We therefore couple it to
 * the same consent gate that controls Plausible (see CookieConsentProvider).
 *
 * Behaviour
 * ─────────
 *   • Reads vanilla-cookieconsent's "comminno_consent" cookie on mount and
 *     subscribes to the bespoke "comminno:consent-change" event the provider
 *     dispatches whenever the user updates their preferences.
 *   • When analytics === true → renders <SpeedInsights /> (Vercel's React
 *     component, which lazily injects the intake script).
 *   • When analytics === false (default state, or after revocation) → renders
 *     nothing. React's normal unmount path lets the SpeedInsights component
 *     remove its script and event listeners.
 *   • A `beforeSend` filter strips any URL containing the "/admin/" prefix
 *     (Sveltia CMS) so editor sessions are never reported as page views.
 *
 * This component is a leaf — mount it ONCE inside CookieConsentProvider so it
 * can read the freshly initialised consent state.
 */
import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

type ConsentChangeDetail = {
  analytics: boolean;
};

/** Best-effort initial read so we don't render → unmount on first paint. */
function readInitialAnalyticsConsent(): boolean {
  if (typeof document === "undefined") return false;
  // vanilla-cookieconsent v3 stores its decision as a JSON string under
  // "comminno_consent". We parse defensively — any failure means "no consent".
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith("comminno_consent="))
    ?.split("=")[1];
  if (!raw) return false;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(parsed?.categories) &&
      parsed.categories.includes("analytics");
  } catch {
    return false;
  }
}

export function SpeedInsightsGated() {
  const [enabled, setEnabled] = useState<boolean>(() =>
    readInitialAnalyticsConsent(),
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ConsentChangeDetail>).detail;
      setEnabled(Boolean(detail?.analytics));
    };
    document.addEventListener(
      "comminno:consent-change",
      handler as EventListener,
    );
    return () => {
      document.removeEventListener(
        "comminno:consent-change",
        handler as EventListener,
      );
    };
  }, []);

  if (!enabled) return null;

  return (
    <SpeedInsights
      // Skip CMS editor sessions — they are operational, not user-facing.
      beforeSend={(data) => {
        if (data.url.includes("/admin/")) return null;
        return data;
      }}
    />
  );
}
