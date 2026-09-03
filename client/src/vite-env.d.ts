/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Formspree endpoint for the /contact form.
   *
   * Default (placeholder) is "https://formspree.io/f/PLACEHOLDER" — the real
   * endpoint will be supplied via Vercel project env once Formspree confirms
   * the form ID. Override locally with a `.env.local` file.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;

  /**
   * Public origin of the deployed site, e.g. "https://comminno-web.vercel.app".
   *
   * Consumed by client/src/config/site.ts, which every canonical URL, OG url,
   * JSON-LD url and the Plausible data-domain derives from. Set this in the
   * Vercel project environment at the cominnocenter.com DNS cutover; the
   * build scripts read the matching SITE_ORIGIN variable.
   */
  readonly VITE_SITE_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
