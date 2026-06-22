import Link from "next/link";
import { getGroups } from "@/lib/data/groups";
import { removeGroup } from "../actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminGroups() {
  const groups = getGroups();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="overline text-deep-blue">Content</p>
          <h1 className="mt-1 text-3xl text-deep-blue">Reference Groups</h1>
          <p className="mt-1 text-sm text-deep-blue/60">
            Categories that focus-area references are organized under. Order controls how groups appear.
          </p>
        </div>
        <Link href="/admin/groups/new" className="inline-flex items-center gap-2 rounded-full bg-classic-green px-5 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105">
          <Plus size={16} /> New group
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-cool-13 bg-white">
        {groups.map((g, i) => (
          <div key={g.id} className={`flex flex-wrap items-center gap-4 p-4 ${i > 0 ? "border-t border-cool-13" : ""}`}>
            <span className="mono-label grid h-8 w-8 place-items-center rounded-lg bg-cool-12 text-deep-blue/50">{g.sortOrder}</span>
            <span className="text-xl">{g.icon}</span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-deep-blue">{g.label}</h2>
              <p className="mono-label truncate text-deep-blue/50">{g.id}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href={`/admin/groups/${g.id}/edit`} className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-cool-12 hover:text-classic-green" title="Edit">
                <Pencil size={16} />
              </Link>
              <form action={removeGroup.bind(null, g.id)}>
                <button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-orange/10 hover:text-orange" title="Delete">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
