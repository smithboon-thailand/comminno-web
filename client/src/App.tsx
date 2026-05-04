/**
 * App — Comm.Inno
 *
 * Lean by design: this static MVP renders one page in two locales, so we strip
 * the template's Toaster / TooltipProvider / ErrorBoundary trees that would
 * otherwise drag ~50 KB of unused Radix/Sonner code into the main bundle.
 *
 * Routing model:
 *   /            → LocaleProvider redirects to /<detected-locale>
 *   /th, /en     → Home page (localized)
 *   anything else → localized NotFound
 *
 * The LocaleProvider sits inside the Router so it can read & update the URL,
 * but outside the Switch so message catalogs are mounted before children render.
 */

import { Route, Switch } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { SiteShell } from "./components/layout/SiteShell";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/th" component={Home} />
      <Route path="/en" component={Home} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LocaleProvider>
        <SiteShell>
          <Router />
        </SiteShell>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
