import Link from "next/link";
import { getLibraryItems } from "@/lib/data/library";
import { libraryCategory } from "@/lib/library-categories";
import { removeLibraryItem } from "../actions";
import { SyncButton } from "@/components/admin/SyncButton";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLibrary() {
  const items = getLibraryItems();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="overline text-classic-green">Content</p>
          <h1 className="mt-1 text-3xl text-deep-blue">Library</h1>
          <p className="mt-1 text-sm text-deep-blue/60">
            Blog & Videos auto-sync from solace.com; the rest are curated here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncButton />
          <Link href="/admin/library/new" className="inline-flex items-center gap-2 rounded-full bg-classic-green px-5 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105">
            <Plus size={16} /> New item
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-cool-13 bg-white">
        {items.map((it, i) => (
          <div key={it.id} className={`flex flex-wrap items-center gap-3 p-4 ${i > 0 ? "border-t border-cool-13" : ""}`}>
            <span className="mono-label rounded-full bg-deep-blue/5 px-2 py-0.5 text-xs text-deep-blue/70">
              {libraryCategory(it.category)?.label ?? it.category}
            </span>
            <span className={`mono-label rounded-full px-2 py-0.5 text-xs ${it.source === "auto" ? "bg-bright-green/30 text-dark-green" : "bg-cool-13 text-deep-blue/60"}`}>
              {it.source}
            </span>
            <span className="text-xs text-deep-blue/50">{it.date}</span>
            <h2 className="min-w-0 flex-1 truncate text-deep-blue">{it.title}</h2>
            <div className="flex items-center gap-1.5">
              <Link href={`/admin/library/${it.id}/edit`} className="grid h-9 w-9 place-items-center rounded-lg text-deep-blue/60 hover:bg-cool-12 hover:text-classic-green" title="Edit">
                <Pencil size={16} />
              </Link>
              <form action={removeLibraryItem.bind(null, it.id)}>
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
