"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";
import { Cookie } from "lucide-react";

type Consent = "granted" | "denied";
const KEY = "lander_consent";

// localStorage-backed store read via useSyncExternalStore — avoids setState-in-effect
// and stays hydration-safe (the server snapshot is always null/false).
const listeners = new Set<() => void>();
function subscribeConsent(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function readConsent(): Consent | null {
  const v = localStorage.getItem(KEY);
  return v === "granted" || v === "denied" ? v : null;
}
function setConsent(value: Consent) {
  localStorage.setItem(KEY, value);
  listeners.forEach((l) => l());
}
const serverConsent = () => null;

// Stable "have we mounted on the client?" flag, also via a store (no effect needed).
const subscribeNoop = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

// GA4 loads only after the visitor accepts (consent banner). Honors an env-configured
// Measurement ID (NEXT_PUBLIC_GA_ID); if unset, GA never loads and the banner still works.
export function ConsentAnalytics() {
  const consent = useSyncExternalStore<Consent | null>(subscribeConsent, readConsent, serverConsent);
  const ready = useSyncExternalStore(subscribeNoop, clientTrue, serverFalse);

  return (
    <>
      {GA_ID && consent === "granted" && <GoogleAnalytics gaId={GA_ID} />}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-white/10 bg-dark-blue p-5 text-white shadow-2xl sm:flex-row sm:items-center">
            <Cookie size={22} className="shrink-0 text-bright-green" />
            <p className="flex-1 text-sm text-white/85">
              We use Google Analytics to understand how the hub is used. No analytics cookies are set
              until you accept.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setConsent("denied")}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Decline
              </button>
              <button
                onClick={() => setConsent("granted")}
                className="rounded-full bg-solace-green px-4 py-2 text-sm font-semibold text-dark-blue transition hover:brightness-105"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
