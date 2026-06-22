"use client";

import { Fragment, useState } from "react";
import type { Pillar, SolaceEvent, Group } from "@/lib/types";
import type { Video } from "@/lib/data/videos";
import { PillarCard } from "./PillarCard";
import { HubSidebar } from "./HubSidebar";
import { SectionHeading } from "./SectionHeading";

// Two-column content panel below the hero: main content (left) + sticky sidebar (right).
// Desktop: clicking a pillar renders its detail in the sticky sidebar.
// Mobile/tablet: the sidebar stacks below everything, so the detail renders inline
// directly under the tapped tile instead; the default tiles show at the bottom.
export function HubExplore({
  pillars,
  groups,
  events,
  videos,
  children,
}: {
  pillars: Pillar[];
  groups: Group[];
  events: SolaceEvent[];
  videos: Video[];
  children: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = pillars.find((p) => p.id === selectedId) ?? null;
  const clear = () => setSelectedId(null);
  const toggle = (id: string) => setSelectedId((cur) => (cur === id ? null : id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main content column */}
        <div className="space-y-20 lg:col-span-8">
          <section id="topics">
            <SectionHeading
              overline="Explore by Topic"
              title="The Six Focus Areas of the Solace Platform"
              subtitle="Open a focus area to see its key concepts and curated references in the panel on the right."
            />
            {/* Single column below lg so the inline detail sits flush under the tapped
                tile (no grid gap); two columns only at lg, where detail uses the sidebar. */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {pillars.map((pillar) => (
                <Fragment key={pillar.id}>
                  <PillarCard
                    pillar={pillar}
                    active={pillar.id === selectedId}
                    onClick={() => toggle(pillar.id)}
                  />
                  {/* Inline detail, directly under the tapped tile — mobile/tablet only */}
                  {pillar.id === selectedId && (
                    <div className="lg:hidden">
                      <HubSidebar
                        selectedPillar={pillar}
                        onClear={clear}
                        events={events}
                        videos={videos}
                        groups={groups}
                      />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </section>

          {children}
        </div>

        {/* Sticky right sidebar — desktop only (mobile uses inline detail + bottom tiles).
            Sticks to the top and rides along as the (taller) main column scrolls — no forced
            internal scrollbar. */}
        <aside className="hidden lg:col-span-4 lg:block lg:self-start">
          {/* Default tiles stick as the long left column scrolls; an open focus-area
              detail flows to its full height instead (no fixed-height scroll box). */}
          <div className={selected ? "" : "lg:sticky lg:top-24"}>
            <HubSidebar
              selectedPillar={selected}
              onClear={clear}
              events={events}
              videos={videos}
              groups={groups}
            />
          </div>
        </aside>
      </div>

      {/* Default tiles on mobile/tablet (advocate, webinar, workshop) */}
      <div className="mt-12 lg:hidden">
        <HubSidebar
          selectedPillar={null}
          onClear={clear}
          events={events}
          videos={videos}
          groups={groups}
        />
      </div>
    </div>
  );
}
