/**
 * Toaster wrapper — Comm.Inno
 *
 * The scaffold's original wrapper imported `useTheme` from `next-themes`, which
 * we don't ship. Hard-code the light brand theme so toasts always read against
 * the cream/paper palette.
 */
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--brand-paper)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--mist)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
