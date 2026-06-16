import Link from "next/link";
import type { SolaceEvent } from "@/lib/types";

const input =
  "mt-1 w-full rounded-lg border border-cool-13 px-3 py-2 text-sm text-deep-blue focus:border-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green/30";
const label = "block text-sm font-semibold text-deep-blue";

export function EventForm({
  event,
  action,
  backHref = "/admin/events",
}: {
  event?: SolaceEvent;
  action: (fd: FormData) => void;
  backHref?: string;
}) {
  const e = event;
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="source" value={e?.source ?? "manual"} />
      <div>
        <label className={label}>ID</label>
        <input name="id" defaultValue={e?.id} required className={input} placeholder="evt-my-event" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Type / Category</label>
          <input name="type" defaultValue={e?.type ?? "Webinar"} required className={input} placeholder="Webinar, Roundtable, Conference…" />
        </div>
        <div>
          <label className={label}>Date</label>
          <input type="date" name="date" defaultValue={e?.date} required className={input} />
        </div>
      </div>
      <div>
        <label className={label}>Title</label>
        <input name="title" defaultValue={e?.title} required className={input} />
      </div>
      <div>
        <label className={label}>Location</label>
        <input name="location" defaultValue={e?.location} required className={input} placeholder="Online / Virtual / City" />
      </div>
      <div>
        <label className={label}>Register URL</label>
        <input name="registerUrl" defaultValue={e?.registerUrl} required className={input} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-classic-green px-6 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105"
        >
          Save event
        </button>
        <Link href={backHref} className="text-sm text-deep-blue/60 hover:text-deep-blue">
          Cancel
        </Link>
      </div>
    </form>
  );
}
