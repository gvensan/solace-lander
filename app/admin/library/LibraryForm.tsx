import Link from "next/link";
import type { LibraryItem } from "@/lib/types";
import { LIBRARY_CATEGORIES } from "@/lib/library-categories";

const input =
  "mt-1 w-full rounded-lg border border-cool-13 px-3 py-2 text-sm text-deep-blue focus:border-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green/30";
const label = "block text-sm font-semibold text-deep-blue";

export function LibraryForm({
  item,
  action,
}: {
  item?: LibraryItem;
  action: (fd: FormData) => void;
}) {
  const i = item;
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <input type="hidden" name="source" value={i?.source ?? "manual"} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>ID</label>
          <input name="id" defaultValue={i?.id} required className={input} placeholder="lib-my-item" />
        </div>
        <div>
          <label className={label}>Category</label>
          <select name="category" defaultValue={i?.category ?? "blog"} className={input}>
            {LIBRARY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Title</label>
        <input name="title" defaultValue={i?.title} required className={input} />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea name="description" defaultValue={i?.description} rows={2} required className={input} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>URL</label>
          <input name="url" defaultValue={i?.url} required className={input} />
        </div>
        <div>
          <label className={label}>Date</label>
          <input type="date" name="date" defaultValue={i?.date} required className={input} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Topic category ids</label>
          <input name="topics" defaultValue={i?.topics.join(", ")} className={input} placeholder="857, 790" />
          <p className="mt-1 text-xs text-deep-blue/50">Comma-separated solace.com category ids (maps to pillars).</p>
        </div>
        <div>
          <label className={label}>YouTube Video ID (videos)</label>
          <input name="videoId" defaultValue={i?.videoId} className={input} placeholder="dQw4w9WgXcQ" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="rounded-full bg-classic-green px-6 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105">
          Save item
        </button>
        <Link href="/admin/library" className="text-sm text-deep-blue/60 hover:text-deep-blue">
          Cancel
        </Link>
      </div>
    </form>
  );
}
