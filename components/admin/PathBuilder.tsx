"use client";

import { useState, useTransition } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus, Search, Award, ExternalLink, Layers } from "lucide-react";
import { Icon } from "../Icon";
import {
  pbAddCourse, pbRemoveStep, pbMoveStep, pbToggleElective,
  pbAddBand, pbRenameBand, pbMoveBand, pbDeleteBand,
} from "@/app/admin/actions";
import type { Role } from "@/lib/data/learning-paths";
import type { PathBand } from "@/lib/data/path-builder";
import type { AcademyItem } from "@/lib/data/academy";

const fmtDur = (sec: number) => {
  if (!sec) return "—";
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  return h && m ? `${h}h ${m}m` : h ? `${h}h` : `${m} min`;
};
// `stage` is the color tier; the displayed "Stage N" is derived from order.
const tierBg: Record<number, string> = { 1: "bg-classic-green", 2: "bg-deep-blue", 3: "bg-orange" };
const TIERS: Array<[number, string]> = [[1, "Green"], [2, "Blue"], [3, "Orange"]];

export function PathBuilder({ roles, rolePaths, catalog }: { roles: Role[]; rolePaths: Record<string, PathBand[]>; catalog: AcademyItem[] }) {
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [pending, start] = useTransition();
  const bands = rolePaths[roleId] ?? [];
  const [addBandId, setAddBandId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [stageTitle, setStageTitle] = useState("");
  const [stageTier, setStageTier] = useState(3);

  const q = query.trim().toLowerCase();
  const targetBand = addBandId ?? bands[bands.length - 1]?.id ?? null;
  const matches = q ? catalog.filter((c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)).slice(0, 25) : [];
  const act = (fn: () => Promise<void>) => start(() => { fn(); });

  return (
    <div className={pending ? "opacity-70 transition" : "transition"}>
      {/* Role selector */}
      <p className="overline text-classic-green">Choose a role to edit</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {roles.map((r) => {
          const active = r.id === roleId;
          return (
            <button
              key={r.id}
              onClick={() => { setRoleId(r.id); setAddBandId(null); }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-classic-green bg-classic-green text-dark-blue" : "border-cool-13 bg-white text-deep-blue/70 hover:border-classic-green hover:text-deep-blue"}`}
            >
              <Icon name={r.icon} size={15} /> {r.label}
            </button>
          );
        })}
      </div>

      {/* Bands (stages) + steps */}
      <div className="mt-8 space-y-8">
        {bands.map((band, bi) => (
          <div key={band.id}>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${tierBg[band.stage] ?? "bg-orange"}`}>{bi + 1}</span>
              <span className="mono-label text-deep-blue/40">Stage {bi + 1}</span>
              <input
                key={`${band.id}:${band.title}`}
                defaultValue={band.title}
                onBlur={(e) => { const v = e.currentTarget.value.trim(); if (v && v !== band.title) act(() => pbRenameBand(band.id, v)); }}
                className="min-w-[12rem] rounded border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-semibold text-deep-blue hover:border-cool-13 focus:border-classic-green focus:outline-none"
                aria-label="Stage title"
              />
              {band.totalTime && <span className="mono-label text-deep-blue/40">{band.totalTime}</span>}
              {band.pathUrl && (
                <a href={band.pathUrl} target="_blank" rel="noreferrer" className="mono-label inline-flex items-center gap-1 text-classic-green hover:underline">official path <ExternalLink size={11} /></a>
              )}
              <span className="ml-auto flex items-center gap-1">
                <button onClick={() => act(() => pbMoveBand(band.id, "up"))} disabled={bi === 0 || pending} className="grid h-7 w-7 place-items-center rounded-lg text-deep-blue/40 hover:bg-cool-12 hover:text-classic-green disabled:opacity-30" aria-label="Move stage up"><ChevronUp size={15} /></button>
                <button onClick={() => act(() => pbMoveBand(band.id, "down"))} disabled={bi === bands.length - 1 || pending} className="grid h-7 w-7 place-items-center rounded-lg text-deep-blue/40 hover:bg-cool-12 hover:text-classic-green disabled:opacity-30" aria-label="Move stage down"><ChevronDown size={15} /></button>
                <button onClick={() => { if (confirm(`Delete stage “${band.title}” and its courses?`)) act(() => pbDeleteBand(band.id)); }} disabled={pending} className="grid h-7 w-7 place-items-center rounded-lg text-deep-blue/40 hover:bg-orange/10 hover:text-orange" aria-label="Delete stage"><Trash2 size={15} /></button>
              </span>
            </div>
            <div className="divide-y divide-cool-13 overflow-hidden rounded-xl border border-cool-13 bg-white">
              {band.nodes.map((s, i) => (
                <div key={s.stepId} className={`flex flex-wrap items-center gap-3 p-3 ${s.missing ? "bg-orange/[0.06]" : ""}`}>
                  <div className="flex flex-col">
                    <button onClick={() => act(() => pbMoveStep(s.stepId, "up"))} disabled={i === 0 || pending} className="text-deep-blue/40 hover:text-classic-green disabled:opacity-30" aria-label="Move up"><ChevronUp size={15} /></button>
                    <button onClick={() => act(() => pbMoveStep(s.stepId, "down"))} disabled={i === band.nodes.length - 1 || pending} className="text-deep-blue/40 hover:text-classic-green disabled:opacity-30" aria-label="Move down"><ChevronDown size={15} /></button>
                  </div>
                  {s.cert && <Award size={15} className="text-classic-green" />}
                  <span className={`min-w-0 flex-1 truncate text-sm ${s.missing ? "text-orange" : "text-deep-blue"}`}>{s.title}</span>
                  {s.elective && <span className="mono-label rounded-full bg-deep-blue/5 px-2 py-0.5 text-xs text-deep-blue/55">Optional</span>}
                  <span className="mono-label text-xs text-deep-blue/45">{s.duration}</span>
                  <span className={`mono-label rounded-full px-2 py-0.5 text-xs ${s.price !== "FREE" ? "bg-orange/15 text-orange" : "bg-classic-green/15 text-dark-green"}`}>{s.price !== "FREE" ? "$$" : "FREE"}</span>
                  {!s.cert && (
                    <button onClick={() => act(() => pbToggleElective(s.stepId))} disabled={pending} className="mono-label rounded-full border border-cool-13 px-2.5 py-0.5 text-xs text-deep-blue/50 transition hover:border-classic-green hover:text-classic-green">
                      {s.elective ? "Make required" : "Make optional"}
                    </button>
                  )}
                  <button onClick={() => act(() => pbRemoveStep(s.stepId))} disabled={pending} className="grid h-8 w-8 place-items-center rounded-lg text-deep-blue/50 transition hover:bg-orange/10 hover:text-orange" aria-label="Remove"><Trash2 size={15} /></button>
                </div>
              ))}
              {band.nodes.length === 0 && <p className="p-3 text-sm text-deep-blue/45">No courses in this stage yet — add some below.</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Add a stage */}
      <div className="mt-8 rounded-2xl border border-cool-13 bg-white p-5">
        <p className="overline flex items-center gap-2 text-classic-green"><Layers size={14} /> Add a stage</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={stageTitle}
            onChange={(e) => setStageTitle(e.target.value)}
            placeholder="Stage title (e.g. Specializations)"
            className="w-64 rounded-full border border-cool-13 bg-white px-4 py-1.5 text-sm text-deep-blue placeholder:text-deep-blue/40 focus:border-classic-green focus:outline-none"
          />
          <label className="mono-label text-deep-blue/50">color</label>
          <select value={stageTier} onChange={(e) => setStageTier(Number(e.target.value))} className="rounded-full border border-cool-13 bg-white px-3 py-1.5 text-sm text-deep-blue focus:border-classic-green focus:outline-none">
            {TIERS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <button
            onClick={() => { if (stageTitle.trim()) { act(() => pbAddBand(roleId, stageTitle.trim(), stageTier)); setStageTitle(""); } }}
            disabled={pending || !stageTitle.trim()}
            className="inline-flex items-center gap-1 rounded-full bg-classic-green px-4 py-1.5 text-sm font-semibold text-dark-blue transition hover:brightness-105 disabled:opacity-60"
          >
            <Plus size={14} /> Add stage
          </button>
        </div>
        <p className="mt-2 text-xs text-deep-blue/50">New stages append at the end; reorder with the ▲▼ on each stage header, then add courses into it.</p>
      </div>

      {/* Add a course */}
      <div className="mt-6 rounded-2xl border border-classic-green/40 bg-classic-green/[0.05] p-5">
        <p className="overline flex items-center gap-2 text-classic-green"><Plus size={14} /> Add a course</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="mono-label text-deep-blue/50">to stage</label>
          <select
            value={targetBand ?? ""}
            onChange={(e) => setAddBandId(Number(e.target.value))}
            className="rounded-full border border-cool-13 bg-white px-3 py-1.5 text-sm text-deep-blue focus:border-classic-green focus:outline-none"
          >
            {bands.map((b, i) => <option key={b.id} value={b.id}>Stage {i + 1} · {b.title}</option>)}
          </select>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue/40" />
            <input
              type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the catalog…"
              className="w-64 rounded-full border border-cool-13 bg-white py-1.5 pl-9 pr-3 text-sm text-deep-blue placeholder:text-deep-blue/40 focus:border-classic-green focus:outline-none"
            />
          </div>
        </div>
        {q && (
          <div className="mt-3 divide-y divide-cool-13 overflow-hidden rounded-xl border border-cool-13 bg-white">
            {matches.length === 0 && <p className="p-3 text-sm text-deep-blue/45">No courses match “{query}”.</p>}
            {matches.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-2.5">
                <span className="min-w-0 flex-1 truncate text-sm text-deep-blue">{c.title}</span>
                <span className="mono-label hidden text-xs text-deep-blue/40 sm:inline">{c.category}</span>
                <span className="mono-label text-xs text-deep-blue/45">{fmtDur(c.durationSec)}</span>
                <span className={`mono-label rounded-full px-2 py-0.5 text-xs ${c.priceUsd > 0 ? "bg-orange/15 text-orange" : "bg-classic-green/15 text-dark-green"}`}>{c.priceUsd > 0 ? "$$" : "FREE"}</span>
                <button
                  onClick={() => { if (targetBand) act(() => pbAddCourse(targetBand, c.id)); }}
                  disabled={pending || !targetBand}
                  className="inline-flex items-center gap-1 rounded-full bg-classic-green px-3 py-1 text-xs font-semibold text-dark-blue transition hover:brightness-105 disabled:opacity-60"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-deep-blue/50">Added courses start as <strong>Optional</strong>; use “Make required” to change. Changes save immediately and reflect on the Find Your Learning Path page.</p>
      </div>
    </div>
  );
}
