import Link from "next/link";
import { getWorkshops } from "@/lib/data/workshops";
import { removeWorkshop } from "../actions";
import { SyncButton } from "@/components/admin/SyncButton";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminWorkshops() {
  const workshops = getWorkshops();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="overline text-deep-blue">Content</p>
          <h1 className="mt-1 text-3xl text-deep-blue">Workshops</h1>
          <p className="mt-1 max-w-xl text-sm text-deep-blue/60">
            Synced from the events.solace.com feed on each cron / Sync. Editing a synced
            workshop (e.g. adding a replay) claims it as manual, so future syncs won&apos;t overwrite it.
          </p>
        </div>
        <SyncButton />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-cool-13 bg-white">
        {workshops.map((w, i) => (
          <div
            key={w.slug}
            className={`flex flex-wrap items-center gap-4 p-4 ${i > 0 ? "border-t border-cool-13" : ""}`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`mono-label rounded-full px-2 py-0.5 text-xs ${
                    w.status === "upcoming" ? "bg-bright-green/30 text-dark-green" : "bg-cool-13 text-deep-blue/60"
                  }`}
                >
                  {w.status}
                </span>
                <span
                  className={`mono-label rounded-full px-2 py-0.5 text-xs ${
                    w.source === "auto" ? "bg-sky-blue/40 text-deep-blue/70" : "bg-classic-green/15 text-dark-green"
                  }`}
                >
                  {w.source === "auto" ? "synced" : "manual"}
                </span>
                <span className="text-xs text-deep-blue/50">{w.date}</span>
                <span className="text-xs text-deep-blue/50">· {w.attendees.length} attendees</span>
              </div>
              <h2 className="mt-1 truncate text-deep-blue">{w.title}</h2>
              <p className="mono-label truncate text-deep-blue/50">/{w.slug}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/${w.slug}`}
                target="_blank"
                className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-cool-12 hover:text-deep-blue"
                title="View live"
              >
                <ExternalLink size={16} />
              </Link>
              <Link
                href={`/admin/workshops/${w.slug}/edit`}
                className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-cool-12 hover:text-classic-green"
                title="Edit"
              >
                <Pencil size={16} />
              </Link>
              <form action={removeWorkshop.bind(null, w.slug)}>
                <button
                  type="submit"
                  className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-orange/10 hover:text-orange"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {workshops.length === 0 && (
          <p className="p-6 text-deep-blue/60">No workshops yet.</p>
        )}
      </div>
    </div>
  );
}
