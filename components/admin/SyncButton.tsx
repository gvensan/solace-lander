"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function SyncButton() {
  const [state, setState] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function sync() {
    setState("syncing");
    setMsg("");
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Sync failed");
      setMsg(`Pulled ${j.blog} blog · ${j.video} video · ${j.resources} resources · ${j.events} W&W · ${j.marketingEvents} events`);
      setState("done");
      setTimeout(() => location.reload(), 1200);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed");
      setState("error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      {msg && (
        <span className={`text-sm ${state === "error" ? "text-orange" : "text-deep-blue/60"}`}>
          {msg}
        </span>
      )}
      <button
        onClick={sync}
        disabled={state === "syncing"}
        className="inline-flex items-center gap-2 rounded-full border border-cool-13 px-4 py-2 text-sm font-medium text-deep-blue transition hover:border-classic-green disabled:opacity-60"
      >
        <RefreshCw size={15} className={state === "syncing" ? "animate-spin" : ""} />
        {state === "syncing" ? "Syncing…" : "Sync now"}
      </button>
    </div>
  );
}
