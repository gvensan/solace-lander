"use client";

import { DEMO_ACCOUNTS, useAuth, type SolaceUser } from "@/lib/auth";
import { X, LogIn } from "lucide-react";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();

  if (!open) return null;

  function pick(u: SolaceUser) {
    login(u);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-blue/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Log in with SolaceID"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="overline text-classic-green">SolaceID</p>
            <h2 className="mt-1 text-2xl text-deep-blue">Log In to Unlock</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-deep-blue/60 hover:bg-cool-12 hover:text-deep-blue"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-3 text-sm text-deep-blue/70">
          Workshop replays are available to attendees. Log in with your SolaceID to unlock the
          recording, slides, and code.
        </p>

        <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-deep-blue/50">
          Demo accounts
        </p>
        <div className="flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((acct) => (
            <button
              key={acct.email}
              onClick={() => pick(acct)}
              className="flex items-center justify-between rounded-lg border border-cool-13 px-4 py-3 text-left transition hover:border-classic-green hover:bg-classic-green/5"
            >
              <span>
                <span className="block font-semibold text-deep-blue">{acct.name}</span>
                <span className="mono-label block text-deep-blue/60">{acct.email}</span>
              </span>
              <LogIn size={18} className="text-classic-green" />
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-deep-blue/50">
          Demo only — production wires real SolaceID sign-in.
        </p>
      </div>
    </div>
  );
}
