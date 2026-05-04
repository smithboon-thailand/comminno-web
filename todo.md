# Task 1 — Bootstrap Comm.Inno MVP

## Setup
- [ ] Install `react-intl` for i18n (lightweight, declarative messages)
- [ ] Install `@fontsource/dm-serif-display`, `@fontsource/inter`, `@fontsource/ibm-plex-sans-thai-looped`, `@fontsource/jetbrains-mono`
- [ ] Drop `tokens.css` into `client/src/styles/tokens.css`, import in `index.css`
- [ ] Upload `logo-official.svg` via `manus-upload-file --webdev` and use returned URL

## i18n
- [ ] Wouter routes: `/`, `/th`, `/en`, `/404`; root `/` redirects to `/th`
- [ ] `LocaleProvider` wrapping `IntlProvider`, persists choice in `localStorage` + cookie
- [ ] EN + TH message catalogs in `client/src/i18n/messages.{en,th}.ts`
- [ ] `useLocale()` hook, `<LocaleLink>` helper

## Layout
- [ ] Sticky header: logo (40px, link to current locale root) + 5 nav placeholders + EN/TH switcher
- [ ] Footer: smaller logo + Mongkut Sammitr address (TH/EN) + copyright
- [ ] `<html lang>` syncs with active locale; body font swaps per locale

## Homepage
- [ ] Eyebrow text in `--brand-red`
- [ ] DM Serif Display tagline (EN/TH variants)
- [ ] Two CTAs: primary red filled, secondary outline
- [ ] 4 brand-color verification blocks

## Quality
- [ ] Top-level README.md documents stack
- [ ] Lighthouse mobile + desktop ≥ 90 on /th and /en (all 4 categories)
- [ ] WCAG AA contrast verified
- [ ] Logo renders sharp (vector)
- [ ] Save checkpoint after delivery
