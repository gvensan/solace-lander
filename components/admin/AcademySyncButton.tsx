"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { syncAcademyCatalog } from "@/app/admin/actions";

// Syncs only the Academy catalog (courses + cert paths) via a server action, then the
// action revalidates /admin/courses so the list refreshes.
export function AcademySyncButton() {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => syncAcademyCatalog())}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-classic-green px-5 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105 disabled:opacity-60"
    >
      <RefreshCw size={15} className={pending ? "animate-spin" : ""} />
      {pending ? "Syncing…" : "Sync catalog"}
    </button>
  );
}
