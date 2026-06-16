import Link from "next/link";
import type { Workshop } from "@/lib/types";
import { getPillars } from "@/lib/data/pillars";

const input =
  "mt-1 w-full rounded-lg border border-cool-13 px-3 py-2 text-sm text-deep-blue focus:border-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green/30";
const label = "block text-sm font-semibold text-deep-blue";

export function WorkshopForm({
  workshop,
  action,
}: {
  workshop?: Workshop;
  action: (fd: FormData) => void;
}) {
  const w = workshop;
  const pillarIds = getPillars().map((p) => p.id);
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div>
        <label className={label}>Slug</label>
        <input name="slug" defaultValue={w?.slug} required className={input} placeholder="my-workshop" />
        <p className="mt-1 text-xs text-deep-blue/50">URL: lander.solace.com/&lt;slug&gt;</p>
      </div>
      <div>
        <label className={label}>Title</label>
        <input name="title" defaultValue={w?.title} required className={input} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Date</label>
          <input type="date" name="date" defaultValue={w?.date} required className={input} />
        </div>
        <div>
          <label className={label}>Status</label>
          <select name="status" defaultValue={w?.status ?? "past"} className={input}>
            <option value="upcoming">upcoming</option>
            <option value="past">past</option>
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Summary</label>
        <textarea name="summary" defaultValue={w?.summary} rows={3} required className={input} />
      </div>
      <div>
        <label className={label}>Pillars</label>
        <input name="pillars" defaultValue={w?.pillars.join(", ")} className={input} placeholder="event-mesh, agentic-ai" />
        <p className="mt-1 text-xs text-deep-blue/50">Comma-separated ids: {pillarIds.join(", ")}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Repo URL</label>
          <input name="repoUrl" defaultValue={w?.repoUrl} className={input} />
        </div>
        <div>
          <label className={label}>Slides URL</label>
          <input name="slidesUrl" defaultValue={w?.slidesUrl} className={input} />
        </div>
      </div>
      <div>
        <label className={label}>YouTube Video ID</label>
        <input name="videoId" defaultValue={w?.videoId} className={input} placeholder="dQw4w9WgXcQ" />
      </div>
      <div>
        <label className={label}>Attendees (SolaceID emails)</label>
        <textarea
          name="attendees"
          defaultValue={w?.attendees.join("\n")}
          rows={4}
          className={input}
          placeholder="one email per line — these unlock the replay"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-classic-green px-6 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105"
        >
          Save workshop
        </button>
        <Link href="/admin/workshops" className="text-sm text-deep-blue/60 hover:text-deep-blue">
          Cancel
        </Link>
      </div>
    </form>
  );
}
