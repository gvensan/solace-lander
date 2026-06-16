import Link from "next/link";
import { getMarketingEvents } from "@/lib/data/marketing-events";
import { removeMarketingEvent } from "../actions";
import { SyncButton } from "@/components/admin/SyncButton";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminMarketingEvents() {
  const events = getMarketingEvents();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="overline text-classic-green">Content</p>
          <h1 className="mt-1 text-3xl text-deep-blue">Events</h1>
          <p className="mt-1 text-sm text-deep-blue/60">
            Corporate events synced from solace.com (shown in the homepage sidebar); expired ones are pruned.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncButton />
          <Link
            href="/admin/marketing-events/new"
            className="inline-flex items-center gap-2 rounded-full bg-classic-green px-5 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105"
          >
            <Plus size={16} /> New event
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-cool-13 bg-white">
        {events.map((e, i) => (
          <div
            key={e.id}
            className={`flex flex-wrap items-center gap-4 p-4 ${i > 0 ? "border-t border-cool-13" : ""}`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="mono-label rounded-full bg-deep-blue/5 px-2 py-0.5 text-xs text-deep-blue/70">
                  {e.type}
                </span>
                <span className={`mono-label rounded-full px-2 py-0.5 text-xs ${e.source === "auto" ? "bg-bright-green/30 text-dark-green" : "bg-cool-13 text-deep-blue/60"}`}>
                  {e.source}
                </span>
                <span className="text-xs text-deep-blue/50">{e.date} · {e.location}</span>
              </div>
              <h2 className="mt-1 truncate text-deep-blue">{e.title}</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href={`/admin/marketing-events/${e.id}/edit`} className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-cool-12 hover:text-classic-green" title="Edit">
                <Pencil size={16} />
              </Link>
              <form action={removeMarketingEvent.bind(null, e.id)}>
                <button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-orange/10 hover:text-orange" title="Delete">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="p-6 text-deep-blue/60">No events yet — run Sync.</p>}
      </div>
    </div>
  );
}
