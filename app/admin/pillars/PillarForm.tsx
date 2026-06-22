import Link from "next/link";
import type { Pillar } from "@/lib/types";
import { PillarReferencesEditor } from "@/components/admin/PillarReferencesEditor";
import { getGroups } from "@/lib/data/groups";

const input =
  "mt-1 w-full rounded-lg border border-cool-13 px-3 py-2 text-sm text-deep-blue focus:border-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green/30";
const label = "block text-sm font-semibold text-deep-blue";
const ICON_OPTIONS = ["Network", "Cable", "Code2", "PenTool", "Activity", "Bot"];

export function PillarForm({
  pillar,
  action,
}: {
  pillar?: Pillar;
  action: (fd: FormData) => void;
}) {
  const p = pillar;
  const groups = getGroups();
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className={label}>ID</label>
          <input name="id" defaultValue={p?.id} required className={input} placeholder="event-mesh" />
        </div>
        <div>
          <label className={label}>Number</label>
          <input type="number" name="number" defaultValue={p?.number} required className={input} />
        </div>
      </div>
      <div>
        <label className={label}>Title</label>
        <input name="title" defaultValue={p?.title} required className={input} />
      </div>
      <div>
        <label className={label}>Description</label>
        <input name="description" defaultValue={p?.description} required className={input} />
      </div>
      <div>
        <label className={label}>Icon</label>
        <select name="icon" defaultValue={p?.icon ?? "Network"} className={input}>
          {ICON_OPTIONS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Topic category id (auto blog posts)</label>
        <input
          type="number"
          name="topicCategoryId"
          defaultValue={p?.topicCategoryId ?? ""}
          className={input}
          placeholder="e.g. 857 (Solace Agent Mesh)"
        />
        <p className="mt-1 text-xs text-deep-blue/50">
          solace.com WP category id — latest posts in it auto-surface in this focus area.
        </p>
      </div>

      <PillarReferencesEditor initialReferences={p?.references ?? []} groups={groups} pillarId={p?.id} />

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="rounded-full bg-classic-green px-6 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105">
          Save focus area
        </button>
        <Link href="/admin/pillars" className="text-sm text-deep-blue/60 hover:text-deep-blue">
          Cancel
        </Link>
      </div>
    </form>
  );
}
