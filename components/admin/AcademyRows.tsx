"use client";

import { useState } from "react";
import { ChevronDown, X, ExternalLink } from "lucide-react";
import { reviewCourse } from "@/app/admin/actions";
import type { AcademyItem } from "@/lib/data/academy";

type Kind = "new" | "path" | "course";

function fmtDur(sec: number): string {
  if (!sec) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m} min`;
}
const chipLabel = (usd: number) => (usd > 0 ? "$$" : "Free");
const realPrice = (usd: number) => (usd > 0 ? `$${usd}` : "Free");

function PriceChip({ usd }: { usd: number }) {
  return (
    <span className={`mono-label rounded-full px-2 py-0.5 text-xs ${usd > 0 ? "bg-orange/15 text-orange" : "bg-classic-green/15 text-dark-green"}`}>
      {chipLabel(usd)}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="mono-label text-deep-blue/40">{label}</p>
      <p className="mt-0.5 text-sm text-deep-blue">{value}</p>
    </div>
  );
}

function Detail({ item, onClose }: { item: AcademyItem; onClose: () => void }) {
  return (
    <div className="border-t border-classic-green/30 bg-cool-12/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="overline text-deep-blue">{item.type === "learning_plan" ? "Path details" : "Course details"}</p>
        <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-lg text-deep-blue/50 transition hover:bg-cool-13 hover:text-deep-blue" aria-label="Close details">
          <X size={15} />
        </button>
      </div>
      <h3 className="mt-1 text-lg text-deep-blue">{item.title}</h3>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Type" value={item.type === "learning_plan" ? "Learning plan" : "Course"} />
        <Field label="Category" value={item.category || "—"} />
        <Field label="Price" value={realPrice(item.priceUsd)} />
        <Field label="Duration" value={fmtDur(item.durationSec)} />
        <Field label="Docebo ID" value={item.id} />
        <Field label="First seen" value={new Date(item.firstSeenAt).toLocaleDateString()} />
        <Field label="Last synced" value={new Date(item.lastSyncedAt).toLocaleDateString()} />
        <Field label="Status" value={item.reviewed ? "Reviewed" : "New · needs review"} />
      </div>

      {item.type === "learning_plan" && item.planCourses && item.planCourses.length > 0 && (
        <div className="mt-4">
          <p className="mono-label text-deep-blue/40">Member courses · {item.planCourses.length}</p>
          <ol className="mt-1.5 space-y-1">
            {item.planCourses.map((c, i) => (
              <li key={`${c.idCourse}-${i}`} className="flex items-start gap-2 text-sm text-deep-blue/80">
                <span className="mono-label mt-0.5 w-5 shrink-0 text-deep-blue/35">{i + 1}.</span>
                <span>{c.name}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-deep-blue hover:underline">
        Open in Solace Academy <ExternalLink size={14} />
      </a>
    </div>
  );
}

export function AcademyRows({ items, kind }: { items: AcademyItem[]; kind: Kind }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="divide-y divide-cool-13 overflow-hidden rounded-2xl border border-cool-13 bg-white">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setOpenId(open ? null : item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenId(open ? null : item.id);
                }
              }}
              className={`flex cursor-pointer flex-wrap items-center gap-3 p-3.5 transition hover:bg-cool-12/50 ${open ? "bg-cool-12/50" : ""}`}
            >
              {kind !== "course" && (
                <span className={`mono-label rounded-full px-2 py-0.5 text-xs ${item.type === "learning_plan" ? "bg-deep-blue/10 text-deep-blue" : "bg-cool-12 text-deep-blue/60"}`}>
                  {item.type === "learning_plan" ? "path" : "course"}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-sm text-deep-blue">{item.title}</span>
              {kind === "course" && <span className="mono-label hidden text-xs text-deep-blue/40 sm:inline">{item.category}</span>}
              {kind === "path" && <span className="mono-label text-xs text-deep-blue/45">{item.planCourses?.length ?? 0} courses</span>}
              <span className="mono-label text-xs text-deep-blue/50">{fmtDur(item.durationSec)}</span>
              <PriceChip usd={item.priceUsd} />
              {kind === "new" && (
                <form action={reviewCourse.bind(null, item.id)} onClick={(e) => e.stopPropagation()}>
                  <button type="submit" className="mono-label rounded-full border border-cool-13 px-3 py-1 text-deep-blue/60 transition hover:border-classic-green hover:text-classic-green">
                    Mark reviewed
                  </button>
                </form>
              )}
              <ChevronDown size={16} className={`shrink-0 text-deep-blue/30 transition ${open ? "rotate-180" : ""}`} />
            </div>
            {open && <Detail item={item} onClose={() => setOpenId(null)} />}
          </div>
        );
      })}
    </div>
  );
}
