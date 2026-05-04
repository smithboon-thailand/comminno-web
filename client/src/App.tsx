/**
 * App — Comm.Inno
 *
 * Routing model:
 *   /            → LocaleProvider redirects to /<detected-locale>
 *   /th, /en     → Home page (localized)
 *   anything else → localized NotFound
 *
 * The LocaleProvider sits inside the Router so it can read & update the URL,
 * but outside the Switch so message catalogs are mounted before children render.
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { SiteShell } from "./components/layout/SiteShell";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      {/* Locale-prefixed home routes */}
      <Route path="/th" component={Home} />
      <Route path="/en" component={Home} />

      {/* Bare root → LocaleProvider redirects (still needs a route to render) */}
      <Route path="/" component={Home} />

      {/* Localized 404 catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LocaleProvider>
          <TooltipProvider>
            <Toaster />
            <SiteShell>
              <Router />
            </SiteShell>
          </TooltipProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
