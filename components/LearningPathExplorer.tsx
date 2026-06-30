"use client";

import { useState } from "react";
import { ACADEMY_URL, type Role, type Stage, type CatalogCourse } from "@/lib/data/learning-paths";
import type { PathBand, PathCourse } from "@/lib/data/path-builder";
import { Icon } from "./Icon";
import { Clock, ArrowUpRight, Award, ExternalLink, Search } from "lucide-react";

type Course = PathCourse;

// Stage → accent classes (matches the 🟢🔵🟠 coding in the source).
const STAGE = {
  1: { dot: "bg-classic-green", line: "border-classic-green", label: "text-deep-blue" },
  2: { dot: "bg-deep-blue", line: "border-deep-blue/50", label: "text-deep-blue" },
  3: { dot: "bg-orange", line: "border-orange/60", label: "text-deep-blue" },
} as const;

const isPaid = (price: string) => price !== "FREE";
// Show paid courses as "$$" rather than a specific amount.
const priceLabel = (price: string) => (isPaid(price) ? "$$" : "FREE");

// Category display order for the catalog (unknown categories sort to the end).
const CAT_ORDER = [
  "Foundations", "Getting Started", "EDA", "Architecture", "APIs & Integration",
  "Integration", "Event Streaming", "Event Management", "Insights", "Cloud",
  "Admin", "Admin / APIs", "Developer Cert Prep",
];

function Chip({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`mono-label inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${className}`}>
      {children}
    </span>
  );
}

function PriceChip({ price }: { price: string }) {
  return (
    <Chip className={isPaid(price) ? "bg-orange/15 text-deep-blue" : "bg-classic-green/15 text-deep-blue"}>
      {priceLabel(price)}
    </Chip>
  );
}

function StepNode({ node, stage, pathUrl }: { node: Course; stage: Stage; pathUrl?: string }) {
  const href = node.url ?? pathUrl ?? ACADEMY_URL;
  const within = !node.url;
  const s = STAGE[stage];

  if (node.cert) {
    return (
      <li className="relative">
        <span className="absolute -left-[2.1rem] top-3 grid h-7 w-7 place-items-center rounded-full bg-bright-green text-dark-blue ring-4 ring-white">
          <Award size={15} />
        </span>
        <a href={href} target="_blank" rel="noreferrer" className="group block rounded-xl border-2 border-classic-green bg-classic-green/[0.07] p-4 transition hover:bg-classic-green/[0.12]">
          <p className="overline text-deep-blue">Certification</p>
          <h4 className="mt-0.5 text-base text-deep-blue group-hover:underline decoration-classic-green decoration-2 underline-offset-2">{node.title}</h4>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Chip className="bg-white text-deep-blue/70"><Clock size={11} /> {node.duration}</Chip>
            <PriceChip price={node.price} />
            {node.note && <Chip className="bg-deep-blue/5 text-deep-blue/60">{node.note}</Chip>}
          </div>
        </a>
      </li>
    );
  }

  const elective = node.elective;
  return (
    <li className="relative">
      <span
        className={`absolute -left-[1.85rem] top-4 h-3 w-3 rounded-full ring-4 ring-white ${
          elective ? "border-2 border-deep-blue/25 bg-white" : s.dot
        }`}
      />
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`group flex items-start justify-between gap-3 rounded-xl p-4 transition hover:border-classic-green hover:shadow-sm ${
          elective ? "border border-dashed border-cool-14 bg-cool-12/50" : "border border-cool-13 bg-white"
        }`}
      >
        <div className="min-w-0">
          <h4 className="text-[0.95rem] leading-snug text-deep-blue group-hover:underline decoration-classic-green decoration-2 underline-offset-2">{node.title}</h4>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {elective && <Chip className="bg-deep-blue/5 text-deep-blue/55">Optional</Chip>}
            <Chip className="bg-cool-12 text-deep-blue/60"><Clock size={11} /> {node.duration}</Chip>
            <PriceChip price={node.price} />
            {node.note && <Chip className="bg-deep-blue/5 text-deep-blue/60">{node.note}</Chip>}
            {within && <Chip className="bg-deep-blue/5 text-deep-blue/50">in path</Chip>}
          </div>
        </div>
        <ArrowUpRight size={16} className="mt-1 shrink-0 text-deep-blue/30 transition group-hover:text-deep-blue" />
      </a>
    </li>
  );
}

function Catalog({ catalog }: { catalog: CatalogCourse[] }) {
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const items = catalog.filter((c) => {
    const matchesFilter = filter === "all" ? true : filter === "free" ? !isPaid(c.price) : isPaid(c.price);
    const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });
  const categories = [...new Set(items.map((c) => c.category))].sort(
    (a, b) => (CAT_ORDER.indexOf(a) + 1 || 99) - (CAT_ORDER.indexOf(b) + 1 || 99),
  );
  const filters: Array<["all" | "free" | "paid", string]> = [["all", "All"], ["free", "Free"], ["paid", "Paid"]];

  return (
    <div className="mt-14 border-t border-cool-13 pt-10">
      <p className="overline text-deep-blue">Course catalog</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl text-deep-blue">Explore every course</h3>
          <p className="mt-1 text-sm text-deep-blue/60">The full Solace Academy catalog, grouped by category. Paid courses shown as “$$”.</p>
        </div>
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

      {items.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-cool-14 bg-cool-12/50 px-4 py-6 text-center text-sm text-deep-blue/55">
          No courses match “{query}”.
        </p>
      )}

      <div className="mt-6 space-y-7">
        {categories.map((cat) => {
          const rows = items.filter((c) => c.category === cat);
          return (
            <div key={cat}>
              <p className="mono-label mb-2 text-deep-blue/40">{cat} · {rows.length}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {rows.map((c) => (
                  <a key={c.url} href={c.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 rounded-lg border border-cool-13 bg-white px-4 py-2.5 transition hover:border-classic-green hover:shadow-sm">
                    <span className="min-w-0 truncate text-sm text-deep-blue group-hover:underline decoration-classic-green decoration-2 underline-offset-2">{c.title}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Chip className="bg-cool-12 text-deep-blue/55"><Clock size={11} /> {c.duration}</Chip>
                      <PriceChip price={c.price} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LearningPathExplorer({
  roles,
  rolePaths,
  catalog,
}: {
  roles: Role[];
  rolePaths: Record<string, PathBand[]>;
  catalog: CatalogCourse[];
}) {
  const [roleId, setRoleId] = useState(roles[0].id);
  const role = roles.find((r) => r.id === roleId)!;
  const bands = rolePaths[roleId] ?? [];
  const certCount = bands.flatMap((b) => b.nodes).filter((n) => n.cert).length;

  return (
    <div>
      {/* Role selector */}
      <p className="overline text-deep-blue">Choose your role</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {roles.map((r) => {
          const active = r.id === roleId;
          return (
            <button
              key={r.id}
              onClick={() => setRoleId(r.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active ? "border-classic-green bg-classic-green text-dark-blue" : "border-cool-13 bg-white text-deep-blue/70 hover:border-classic-green hover:text-deep-blue"
              }`}
            >
              <Icon name={r.icon} size={15} /> {r.label}
            </button>
          );
        })}
      </div>

      {/* Path summary */}
      <div className="bg-solace-blue mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6 text-white">
        <div className="max-w-2xl">
          <p className="overline text-eyebrow">Your path</p>
          <h3 className="mt-1 text-2xl text-white">{role.label}</h3>
          <p className="mt-1 text-sm text-white/75">{role.blurb}</p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-semibold text-white">{role.time}</p>
            <p className="mono-label text-white/60">total time</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{priceLabel(role.cost)}</p>
            <p className="mono-label text-white/60">cost</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{certCount}</p>
            <p className="mono-label text-white/60">{certCount === 1 ? "certification" : "certifications"}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-8 space-y-8">
        {bands.map((band, idx) => {
          const s = STAGE[band.stage];
          // The displayed "Stage N" is the band's ordinal position in the timeline
          // (1-based), derived from render order — NOT band.stage (which is the
          // color tier 1🟢/2🔵/3🟠 and may repeat or run out of order across bands).
          const stageNo = idx + 1;
          return (
            <div key={band.key}>
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={`grid h-7 w-7 place-items-center rounded-full ${s.dot} text-xs font-bold text-white`}>{stageNo}</span>
                <p className={`overline ${s.label}`}>Stage {stageNo} · {band.title}</p>
                {band.totalTime && <span className="mono-label text-deep-blue/40">{band.totalTime} · {priceLabel(band.cost ?? "FREE")}</span>}
                {band.pathUrl && (
                  <a href={band.pathUrl} target="_blank" rel="noreferrer" className="mono-label inline-flex items-center gap-1 text-deep-blue hover:underline">
                    full path <ExternalLink size={11} />
                  </a>
                )}
              </div>
              {band.certification && (
                <p className="mb-3 ml-10 flex items-center gap-1.5 text-sm text-deep-blue/60">
                  <Award size={14} className="text-classic-green" /> Earns: <span className="font-semibold text-deep-blue">{band.certification}</span>
                </p>
              )}
              <ol className={`ml-3 space-y-3 border-l-2 ${s.line} pl-7`}>
                {band.nodes.map((node, i) => (
                  <StepNode key={`${band.key}-${i}`} node={node} stage={band.stage} pathUrl={band.pathUrl} />
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      {/* Full catalog */}
      <Catalog catalog={catalog} />

      {/* Footer CTA */}
      <div className="mt-12 text-center">
        <a href={ACADEMY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-solace-green px-7 py-3 font-semibold text-dark-blue transition hover:brightness-105">
          Browse the full Solace Academy catalog <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
