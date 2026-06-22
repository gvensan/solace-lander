"use client";

import { useState } from "react";
import { Search, Route, BookMarked } from "lucide-react";
import { AcademyRows } from "./AcademyRows";
import type { AcademyItem } from "@/lib/data/academy";

// Search + Free/Paid filter over the synced catalog (paths + courses), mirroring the
// public "Course Catalog" controls. Filtering is client-side over the props.
export function AcademyBrowser({ courses, paths }: { courses: AcademyItem[]; paths: AcademyItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const q = query.trim().toLowerCase();

  const match = (i: AcademyItem) => {
    const byPrice = filter === "all" ? true : filter === "free" ? i.priceUsd === 0 : i.priceUsd > 0;
    const byText = !q || i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
    return byPrice && byText;
  };
  const fPaths = paths.filter(match);
  const fCourses = courses.filter(match);
  const cats = [...new Set(fCourses.map((c) => c.category))]; // courses arrive sorted by category
  const filters: Array<["all" | "free" | "paid", string]> = [["all", "All"], ["free", "Free"], ["paid", "Paid"]];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg text-deep-blue">Browse the catalog</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses…"
              aria-label="Search courses"
              className="w-56 rounded-full border border-cool-13 bg-white py-1.5 pl-9 pr-3 text-sm text-deep-blue placeholder:text-deep-blue/40 focus:border-classic-green focus:outline-none"
            />
          </div>
          <div className="flex gap-1.5">
            {filters.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  filter === key ? "border-classic-green bg-classic-green text-dark-blue" : "border-cool-13 bg-white text-deep-blue/60 hover:text-deep-blue"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {fPaths.length === 0 && fCourses.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed border-cool-14 bg-cool-12/50 px-4 py-6 text-center text-sm text-deep-blue/55">
          No courses match “{query}”.
        </p>
      )}

      {fPaths.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-base text-deep-blue">
            <Route size={17} className="text-classic-green" /> Certification paths · {fPaths.length}
          </h3>
          <AcademyRows items={fPaths} kind="path" />
        </section>
      )}

      {fCourses.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 text-base text-deep-blue">
            <BookMarked size={17} className="text-classic-green" /> Courses · {fCourses.length}
          </h3>
          <div className="space-y-6">
            {cats.map((cat) => {
              const list = fCourses.filter((c) => c.category === cat);
              return (
                <div key={cat}>
                  <p className="mono-label mb-2 text-deep-blue/40">{cat} · {list.length}</p>
                  <AcademyRows items={list} kind="course" />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
