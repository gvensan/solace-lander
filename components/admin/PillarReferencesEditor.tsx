"use client";

import { useState, useTransition } from "react";
import type { Reference, Group } from "@/lib/types";
import { GripVertical, ChevronUp, ChevronDown, Trash2, Plus, Pencil, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { savePillarReferences } from "@/app/admin/actions";

const isSelected = (r: Reference) => r.selected !== false; // undefined ⇒ shown

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const rowBase =
  "flex items-center gap-2 rounded-lg border border-cool-13 bg-white px-2 py-1.5 transition";
const iconBtn =
  "grid h-7 w-7 shrink-0 place-items-center rounded text-deep-blue/50 hover:bg-cool-12 hover:text-deep-blue disabled:opacity-30 disabled:hover:bg-transparent";
const field =
  "w-full rounded border border-cool-13 px-2 py-1 text-sm text-deep-blue focus:border-classic-green focus:outline-none focus:ring-1 focus:ring-classic-green/40";

export function PillarReferencesEditor({
  initialReferences,
  groups,
  pillarId,
}: {
  initialReferences: Reference[];
  groups: Group[];
  pillarId?: string;
}) {
  const fallbackGroup = groups[0]?.id ?? "concept";
  const [refs, setRefs] = useState<Reference[]>(initialReferences);
  const [editR, setEditR] = useState<number | null>(null);
  const [dragR, setDragR] = useState<number | null>(null);
  const [saving, startSave] = useTransition();

  const byId = new Map(groups.map((g) => [g.id, g]));

  function setRef(i: number, patch: Partial<Reference>) {
    setRefs((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  // Show/hide toggle persists immediately (for an existing focus area), so
  // curation sticks even without pressing "Save focus area".
  function toggleShown(i: number) {
    const next = refs.map((x, idx) => (idx === i ? { ...x, selected: !isSelected(x) } : x));
    setRefs(next);
    if (pillarId) startSave(() => savePillarReferences(pillarId, next));
  }
  function addRef() {
    setRefs((r) => [...r, { group: fallbackGroup, title: "", url: "", selected: true }]);
    setEditR(refs.length);
  }

  const selectedCount = refs.filter(isSelected).length;

  return (
    <div>
      {/* Hidden input: group | title | url | selected(1/0), one per line */}
      <input
        type="hidden"
        name="references"
        value={refs.map((r) => `${r.group} | ${r.title} | ${r.url} | ${isSelected(r) ? "1" : "0"}`).join("\n")}
      />

      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-semibold text-deep-blue">References</label>
        <span className="mono-label flex items-center gap-1.5 text-deep-blue/40">
          {saving && <Loader2 size={12} className="animate-spin text-classic-green" />}
          {selectedCount} of {refs.length} shown
        </span>
      </div>

      <div className="space-y-1.5">
        {refs.map((r, i) => {
          const g = byId.get(r.group);
          const editing = editR === i;
          return (
            <div
              key={i}
              draggable={!editing}
              onDragStart={() => setDragR(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragR !== null) setRefs(move(refs, dragR, i));
                setDragR(null);
              }}
              onDragEnd={() => setDragR(null)}
              className={`${rowBase} ${dragR === i ? "opacity-40" : ""} ${editing ? "items-start border-classic-green" : "cursor-grab"} ${!isSelected(r) && !editing ? "opacity-55" : ""}`}
            >
              <GripVertical size={15} className="mt-1 shrink-0 text-deep-blue/30" />
              {editing ? (
                <div className="flex-1 space-y-1.5">
                  <select value={r.group} onChange={(e) => setRef(i, { group: e.target.value })} className={field}>
                    {groups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.icon} {grp.label}
                      </option>
                    ))}
                  </select>
                  <input value={r.title} onChange={(e) => setRef(i, { title: e.target.value })} placeholder="Title" className={field} />
                  <input value={r.url} onChange={(e) => setRef(i, { url: e.target.value })} placeholder="https://…" className={`${field} font-mono text-xs`} />
                </div>
              ) : (
                <button type="button" onClick={() => setEditR(i)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <span className="mono-label shrink-0 rounded bg-cool-12 px-1.5 py-0.5 text-deep-blue/70">
                    {g ? `${g.icon} ${g.label}` : r.group}
                  </span>
                  <span className="truncate text-sm text-deep-blue">
                    {r.title || <span className="text-deep-blue/40">Untitled</span>}
                  </span>
                </button>
              )}
              <div className={`flex shrink-0 items-center ${editing ? "flex-col" : ""}`}>
                <button
                  type="button"
                  onClick={() => toggleShown(i)}
                  className={`${iconBtn} ${isSelected(r) ? "text-classic-green hover:text-classic-green" : ""}`}
                  title={isSelected(r) ? "Shown on site — click to hide" : "Hidden from site — click to show"}
                >
                  {isSelected(r) ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                {editing ? (
                  <button type="button" onClick={() => setEditR(null)} className={`${iconBtn} text-classic-green`} title="Done">
                    <Check size={15} />
                  </button>
                ) : (
                  <button type="button" onClick={() => setEditR(i)} className={iconBtn} title="Edit">
                    <Pencil size={13} />
                  </button>
                )}
                <button type="button" onClick={() => setRefs(move(refs, i, i - 1))} disabled={i === 0} className={iconBtn} title="Move up">
                  <ChevronUp size={15} />
                </button>
                <button type="button" onClick={() => setRefs(move(refs, i, i + 1))} disabled={i === refs.length - 1} className={iconBtn} title="Move down">
                  <ChevronDown size={15} />
                </button>
                <button type="button" onClick={() => { setRefs(refs.filter((_, idx) => idx !== i)); setEditR(null); }} className={`${iconBtn} hover:bg-orange/10 hover:text-orange`} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={addRef} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-cool-14 px-3 py-1.5 text-sm text-deep-blue/70 hover:border-classic-green hover:text-classic-green">
        <Plus size={14} /> Add reference
      </button>
    </div>
  );
}
