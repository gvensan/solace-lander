import {
  getCourses,
  getCertPaths,
  getNewItems,
  academyCounts,
} from "@/lib/data/academy";
import { reviewAllCourses } from "../actions";
import { AcademySyncButton } from "@/components/admin/AcademySyncButton";
import { AcademyRows } from "@/components/admin/AcademyRows";
import { AcademyBrowser } from "@/components/admin/AcademyBrowser";
import { Sparkles, BookMarked, Route } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminCourses() {
  const counts = academyCounts();
  const newItems = getNewItems();
  const paths = getCertPaths();
  const courses = getCourses();
  const lastSynced = counts.lastSyncedAt ? new Date(counts.lastSyncedAt).toLocaleString() : "never";
  const newAsOf = counts.lastSyncedAt ? new Date(counts.lastSyncedAt).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="overline text-classic-green">Solace Academy</p>
          <h1 className="mt-1 text-3xl text-deep-blue">Courses & Cert Paths</h1>
          <p className="mt-1 text-sm text-deep-blue/60">
            Read-only mirror of the public training.solace.com catalog · synced daily · last sync {lastSynced}
          </p>
        </div>
        <AcademySyncButton />
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: BookMarked, label: "Courses", value: counts.courses },
          { icon: Route, label: "Cert paths", value: counts.paths },
          { icon: Sparkles, label: "New · needs review", value: counts.newItems },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-cool-13 bg-white p-5">
            <div>
              <p className="text-3xl font-semibold text-deep-blue">{value}</p>
              <p className="mono-label text-deep-blue/50">{label}</p>
            </div>
            <Icon size={22} className="text-classic-green" />
          </div>
        ))}
      </div>

      {courses.length === 0 && paths.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-cool-14 bg-cool-12/50 p-8 text-center text-sm text-deep-blue/60">
          Nothing synced yet. Click <strong>Sync catalog</strong> to pull courses &amp; cert paths from training.solace.com.
        </div>
      )}

      {/* New / unreviewed items — always shown, at the top, before the listings */}
      <div className="mt-8 rounded-2xl border border-classic-green/40 bg-classic-green/[0.05] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="overline flex items-center gap-2 text-classic-green">
            <Sparkles size={14} /> New &amp; unreviewed{newItems.length > 0 ? ` · ${newItems.length}` : ""}
          </p>
          {newItems.length > 0 && (
            <form action={reviewAllCourses}>
              <button type="submit" className="mono-label rounded-full border border-classic-green/50 px-3 py-1 text-classic-green transition hover:bg-classic-green/10">
                Mark all reviewed
              </button>
            </form>
          )}
        </div>
        {newItems.length > 0 ? (
          <>
            <p className="mt-1 mb-3 text-sm text-deep-blue/60">
              Courses that appeared in the latest sync and aren&apos;t in the DB yet — click a row for details, then decide if they belong in a learning path.
            </p>
            <AcademyRows items={newItems} kind="new" />
          </>
        ) : (
          <p className="mt-2 text-sm text-deep-blue/60">No new courses as of {newAsOf}. The catalog is up to date.</p>
        )}
      </div>

      {/* Cert paths */}
      {/* Searchable catalog (paths + courses) */}
      {(courses.length > 0 || paths.length > 0) && <AcademyBrowser courses={courses} paths={paths} />}
    </div>
  );
}
