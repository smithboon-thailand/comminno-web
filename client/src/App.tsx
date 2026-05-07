/**
 * App — Comm.Inno
 *
 * Locale-prefixed routing model:
 *   /                → LocaleProvider → /<detected-locale>
 *   /:locale         → Home
 *   /:locale/about           → About
 *   /:locale/services        → Services hub
 *   /:locale/services/:slug  → ServiceDetail
 *   /:locale/insights        → Insights index (?category= optional)
 *   /:locale/insights/:slug  → InsightDetail
 *   /:locale/contact         → Contact
 *   /:locale/privacy         → Privacy
 *   /post/:slug etc. (legacy) → RedirectHandler → /:locale/insights/:slug
 *   anything else            → localized NotFound
 */
import { useEffect, lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider, useLocale, withLocale } from "./i18n/LocaleProvider";
import { SiteShell } from "./components/layout/SiteShell";
import { CookieConsentProvider } from "./components/consent/CookieConsentProvider";
import { SpeedInsightsGated } from "./components/analytics/SpeedInsightsGated";
import { DetailSkeleton } from "./components/layout/DetailSkeleton";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { redirects } from "./content/redirects";

// Most routes are eagerly imported. We previously code-split *every* route
// via lazy() + a min-h-60vh PageFallback, but on every navigation the
// fallback painted, then the route arrived and pushed the (eager) Footer
// down by thousands of pixels — scoring CLS ≈ 0.20 on every non-/th route.
// SiteShell now uses `<main flex-1>` inside a `min-h-screen` flex column
// so the Footer is pinned to the viewport bottom; that anchor lets us
// safely lazy-load the heaviest two routes (ServiceDetail, InsightDetail)
// behind <DetailSkeleton/>, which preserves layout (CLS stays ≈ 0).
// The split shaves ~120 KB off the main entry, which was the
// remaining-2-points blocker on detail-page Lighthouse Performance.
import About from "./pages/About";
import Services from "./pages/Services";
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
import Insights from "./pages/Insights";
const InsightDetail = lazy(() => import("./pages/InsightDetail"));
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";

const REDIRECT_MAP: Record<string, string> = Object.fromEntries(
  redirects.map((r) => [r.from.replace(/\/+$/, "") || "/", r.to]),
);

/** Catch legacy Wix paths (no locale prefix) and 301 to the new equivalent. */
function RedirectHandler() {
  const [path, navigate] = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    const stripped = path.replace(/\/+$/, "") || "/";
    const target = REDIRECT_MAP[stripped];
    if (target) {
      navigate(withLocale(target, locale), { replace: true });
    }
  }, [path, locale, navigate]);

  // If we have a known redirect we're navigating away — render nothing.
  // Otherwise, fall through to NotFound.
  const stripped = path.replace(/\/+$/, "") || "/";
  if (REDIRECT_MAP[stripped]) return null;
  return <NotFound />;
}

function Router() {
  return (
    <Switch>
        {/* Localized routes — TH and EN share the same component, locale comes from URL */}
        <Route path="/:locale/about">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? <About /> : <NotFound />
          }
        </Route>
        <Route path="/:locale/services">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? <Services /> : <NotFound />
          }
        </Route>
        <Route path="/:locale/services/:slug">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? (
              <Suspense fallback={<DetailSkeleton />}>
                <ServiceDetail />
              </Suspense>
            ) : (
              <NotFound />
            )
          }
        </Route>
        <Route path="/:locale/insights">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? <Insights /> : <NotFound />
          }
        </Route>
        <Route path="/:locale/insights/:slug">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? (
              <Suspense fallback={<DetailSkeleton />}>
                <InsightDetail />
              </Suspense>
            ) : (
              <NotFound />
            )
          }
        </Route>
        <Route path="/:locale/contact">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? <Contact /> : <NotFound />
          }
        </Route>
        <Route path="/:locale/privacy">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? <Privacy /> : <NotFound />
          }
        </Route>
        <Route path="/:locale">
          {(params) =>
            params.locale === "th" || params.locale === "en" ? <Home /> : <RedirectHandler />
          }
        </Route>
        {/* Root → LocaleProvider already redirects to /<locale> */}
        <Route path="/" component={Home} />
        {/* Anything else: try the redirect map first, fall through to NotFound */}
        <Route component={RedirectHandler} />
      </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LocaleProvider>
        <CookieConsentProvider>
          <SiteShell>
            <Router />
          </SiteShell>
          {/* Vercel Speed Insights — gated on analytics consent (PDPA §19). */}
          <SpeedInsightsGated />
        </CookieConsentProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
export default App;
