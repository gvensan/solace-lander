// Thin wrapper over GA4 gtag. No-ops if GA isn't loaded (no consent / no ID),
// so callers can fire events unconditionally.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
