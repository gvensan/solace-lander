"use client";

import Image from "next/image";
import type { Pillar, SolaceEvent, Group } from "@/lib/types";
import type { Video } from "@/lib/data/videos";
import { PillarDetail } from "./PillarDetail";
import { CustomerCarousel } from "./CustomerCarousel";
import { Icon } from "./Icon";
import { Headset, CalendarDays, Calendar, ArrowUpRight, ArrowLeft, Play, Video as VideoIcon } from "lucide-react";

// Public channel URL for the "More Videos" link. Duplicated here (rather than imported
// from the server-only videos module) to keep this client component out of that bundle.
const CHANNEL_VIDEOS_URL = "https://www.youtube.com/@Solacedotcom/videos";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const ADVOCATE_URL = "https://solace.com/engage-developer-advocate/";

function VideoTiles({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;
  return (
    <div className="rounded-2xl border border-cool-13 bg-white p-5">
      <p className="overline flex items-center gap-2 text-deep-blue">
        <VideoIcon size={14} /> Latest Videos
      </p>
      <div className="mt-3 space-y-4">
        {videos.map((v) => (
          <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="group block">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-deep-blue/5">
              <Image
                src={v.thumbnail}
                alt={v.title}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover transition group-hover:scale-105"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-dark-blue/70 text-white backdrop-blur-sm transition group-hover:bg-classic-green group-hover:text-dark-blue">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </span>
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-deep-blue group-hover:text-classic-green">
              {v.title}
            </p>
          </a>
        ))}
      </div>
      <a
        href={CHANNEL_VIDEOS_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-deep-blue hover:underline"
      >
        More Videos <ArrowUpRight size={14} />
      </a>
    </div>
  );
}

function DefaultTiles({ events, videos }: { events: SolaceEvent[]; videos: Video[] }) {
  return (
    <div className="space-y-4">
      {/* Talk to Your Advocate */}
      <a
        href={ADVOCATE_URL}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden rounded-2xl bg-solace-blue p-5 text-white transition hover:brightness-110"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
          <Headset size={20} className="text-bright-green" />
        </span>
        <p className="overline mt-3 text-eyebrow">Looking to jumpstart your learning?</p>
        <h3 className="mt-1 text-lg text-white">Engage with an Advocate</h3>
        <p className="mt-1 text-sm text-white/75">
          Talk to a Solace Developer Advocate to sharpen your understanding of event-driven
          architecture, event brokers, event mesh, and integration.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
          Engage now <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5" />
        </span>
      </a>

      {/* Upcoming events */}
      {events.map((evt) => (
        <a
          key={evt.id}
          href={evt.registerUrl}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-2xl border border-cool-13 bg-white p-5 transition hover:border-classic-green hover:shadow-md"
        >
          <p className="overline flex items-center gap-2 text-deep-blue">
            <CalendarDays size={14} /> {evt.type}
          </p>
          <h3 className="mt-2 text-base leading-snug text-deep-blue group-hover:text-classic-green">
            {evt.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-deep-blue/60">
            <Calendar size={13} /> {formatDate(evt.date)} · {evt.location}
          </p>
        </a>
      ))}

      {/* Newest Solace customers — auto-looping showcase */}
      <CustomerCarousel />

      {/* Latest videos from the Solace YouTube channel */}
      <VideoTiles videos={videos} />
    </div>
  );
}

export function HubSidebar({
  selectedPillar,
  onClear,
  events,
  videos,
  groups,
}: {
  selectedPillar: Pillar | null;
  onClear: () => void;
  events: SolaceEvent[];
  videos: Video[];
  groups: Group[];
}) {
  if (!selectedPillar) return <DefaultTiles events={events} videos={videos} />;

  return (
    <div className="rounded-2xl border border-classic-green/40 bg-cool-12 p-5">
      <button
        onClick={onClear}
        className="mono-label inline-flex items-center gap-1 text-deep-blue/60 transition hover:text-classic-green"
      >
        <ArrowLeft size={14} /> Back
      </button>
      <div className="mt-3 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-solace-green">
          <Icon name={selectedPillar.icon} size={20} className="text-dark-blue" />
        </div>
        <div>
          <p className="overline text-deep-blue">Focus Area {selectedPillar.number}</p>
          <h3 className="text-xl leading-tight text-deep-blue">{selectedPillar.title}</h3>
        </div>
      </div>
      <div className="mt-5">
        <PillarDetail pillar={selectedPillar} groups={groups} columns={1} />
      </div>
    </div>
  );
}
