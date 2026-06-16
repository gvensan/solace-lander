import Link from "next/link";
import type { Group } from "@/lib/types";

const input =
  "mt-1 w-full rounded-lg border border-cool-13 px-3 py-2 text-sm text-deep-blue focus:border-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green/30";
const label = "block text-sm font-semibold text-deep-blue";

export function GroupForm({ group, action }: { group?: Group; action: (fd: FormData) => void }) {
  const g = group;
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className={label}>ID</label>
          <input name="id" defaultValue={g?.id} required className={input} placeholder="concept" />
          <p className="mt-1 text-xs text-deep-blue/50">Used to tag references. Avoid changing once in use.</p>
        </div>
        <div>
          <label className={label}>Order</label>
          <input type="number" name="sortOrder" defaultValue={g?.sortOrder ?? 0} className={input} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className={label}>Icon</label>
          <input name="icon" defaultValue={g?.icon ?? "🔗"} className={`${input} text-center text-lg`} placeholder="📖" />
        </div>
        <div className="col-span-3">
          <label className={label}>Label</label>
          <input name="label" defaultValue={g?.label} required className={input} placeholder="Concept" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="rounded-full bg-classic-green px-6 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105">
          Save group
        </button>
        <Link href="/admin/groups" className="text-sm text-deep-blue/60 hover:text-deep-blue">
          Cancel
        </Link>
      </div>
    </form>
  );
}
