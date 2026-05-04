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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
