"use client";

import { useState } from "react";
import type { Pillar, Group } from "@/lib/types";
import { PillarCard } from "./PillarCard";
import { PillarDetail } from "./PillarDetail";
import { Icon } from "./Icon";

// Per-workshop "Explore by Topic": grid + inline expand panel (one open at a time).
export function PillarGrid({ pillars, groups }: { pillars: Pillar[]; groups: Group[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = pillars.find((p) => p.id === openId) ?? null;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            active={pillar.id === openId}
            onClick={() => setOpenId(openId === pillar.id ? null : pillar.id)}
          />
        ))}
      </div>

      {open && (
        <div className="mt-4 rounded-2xl border border-classic-green/40 bg-cool-12 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-solace-green">
              <Icon name={open.icon} size={20} className="text-dark-blue" />
            </div>
            <div>
              <p className="overline text-deep-blue">Focus Area {open.number}</p>
              <h3 className="text-2xl text-deep-blue">{open.title}</h3>
            </div>
          </div>
          <div className="mt-6">
            <PillarDetail pillar={open} groups={groups} columns={2} />
          </div>
        </div>
      )}
    </div>
  );
}
