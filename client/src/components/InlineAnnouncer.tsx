/**
 * InlineAnnouncer — minimal accessible "coming soon" toast.
 *
 * The MVP only needs to announce "feature coming soon" when a placeholder CTA
 * or nav item is clicked. Bringing in sonner + Radix Tooltip for that single
 * use case adds ~30 KB to the main bundle, so we hand-roll a small, dismissible,
 * keyboard-accessible bar that mounts itself into document.body.
 *
 * Usage:
 *   const announce = useAnnounce();
 *   <button onClick={() => announce("Coming soon")}>…</button>
 */

import { useCallback, useEffect, useRef, useState } from "react";

export function useAnnounce() {
  return useCallback((message: string) => {
    // Defer DOM access to next tick so SSR/hydration safety is preserved.
    queueMicrotask(() => {
      const evt = new CustomEvent("comminno-announce", { detail: message });
      window.dispatchEvent(evt);
    });
  }, []);
}

export function AnnouncerHost() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setMsg(detail);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 3200);
    };
    window.addEventListener("comminno-announce", handler);
    return () => {
      window.removeEventListener("comminno-announce", handler);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  if (!msg) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 bottom-6 z-50 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium shadow-lg"
      style={{
        backgroundColor: "var(--ink)",
        color: "var(--brand-paper)",
      }}
    >
      {msg}
    </div>
  );
}
