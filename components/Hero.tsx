"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import type { Workshop } from "@/lib/types";
import {
  PlayCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* Dark full-bleed hero shell — used for the logged-in attendee replay states. */
function HeroShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-solace-blue relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-classic-green/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/* Concentric-ring "bubble" motif from solace.com, recreated as SVG (no external asset). */
function BubbleCluster({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" aria-hidden className={className}>
      <circle cx="62" cy="52" r="30" stroke={color} strokeWidth="2" />
      <circle cx="98" cy="68" r="17" stroke={color} strokeWidth="2" />
      <circle cx="46" cy="90" r="13" stroke={color} strokeWidth="2" />
      <circle cx="86" cy="98" r="9" stroke={color} strokeWidth="2" />
      <circle cx="28" cy="60" r="7" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* Poster card for an attended workshop's recording — links into the per-workshop recap. */
function RecordingCard({ workshop }: { workshop: Workshop }) {
  const poster = workshop.videoId
    ? `https://img.youtube.com/vi/${workshop.videoId}/hqdefault.jpg`
    : null;

  return (
    <Link
      href={`/${workshop.slug}#recap`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-bright-green/50"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-dark-blue">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
          />
        ) : (
          <div className="bg-solace-teal h-full w-full" />
        )}
        <div className="absolute inset-0 grid place-items-center bg-dark-blue/30">
          <PlayCircle size={56} className="text-white drop-shadow transition group-hover:scale-110" />
        </div>
        <span className="mono-label absolute left-3 top-3 rounded-full bg-bright-green/90 px-2.5 py-0.5 text-xs text-dark-blue">
          Your Replay
        </span>
      </div>
      <div className="p-5">
        <p className="flex items-center gap-1.5 text-sm text-white/60">
          <Calendar size={13} /> {formatDate(workshop.date)}
        </p>
        <h3 className="mt-1 text-xl text-white">{workshop.title}</h3>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
          Watch replay <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/* Light, solace.com-style brand hero for anonymous / non-attendee visitors. */
function GenericHero({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Ring "bubble" motif, like solace.com */}
      <BubbleCluster color="#00C895" className="absolute right-6 top-10 h-40 w-40 opacity-90 sm:h-56 sm:w-56" />
      <BubbleCluster color="#093B5F" className="absolute -left-8 top-1/2 h-44 w-44 -translate-y-1/2 opacity-80" />
      <BubbleCluster color="#00C895" className="absolute bottom-8 left-1/3 h-24 w-24 opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
        <p className="overline text-deep-blue">Solace Lander</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl leading-[1.05] text-deep-blue sm:text-5xl lg:text-6xl">
          Everything From the Workshop, in One Place
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-deep-blue/70 sm:text-lg">
          Replays, topic deep-dives, hands-on labs, and the resources to keep building on the
          real-time data and agentic AI platform — through the power of events.
        </p>
        {loggedIn && (
          <p className="mx-auto mt-4 max-w-xl rounded-lg border border-cool-13 bg-cool-12 px-4 py-2 text-sm text-deep-blue/70">
            You&apos;re signed in, but no workshop replays are linked to your SolaceID yet. Explore the
            platform below, or check upcoming workshops.
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="https://console.solace.cloud/login/new-account"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-solace-green px-7 py-3 font-semibold text-dark-blue transition hover:brightness-105"
          >
            Try It Free <Sparkles size={17} />
          </a>
          <Link
            href="/#topics"
            className="inline-flex items-center gap-2 rounded-full border-2 border-deep-blue px-7 py-3 font-semibold text-deep-blue transition hover:bg-deep-blue hover:text-white"
          >
            Explore Topics <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Hero({ workshops }: { workshops: Workshop[] }) {
  const { user, hasAttended } = useAuth();
  const [index, setIndex] = useState(0);

  const attended = user ? workshops.filter((w) => hasAttended(w.attendees)) : [];

  // Anonymous OR attended none → light, solace.com-style brand hero.
  if (attended.length === 0) {
    return <GenericHero loggedIn={!!user} />;
  }

  const heading = (
    <div className="mb-8">
      <p className="overline text-eyebrow">
        Welcome Back{user ? `, ${user.name.split(" ")[0]}` : ""}
      </p>
      <h1 className="mt-2 text-3xl leading-tight sm:text-4xl lg:text-5xl">
        {attended.length === 1 ? "Your Workshop Replay" : "Your Workshop Replays"}
      </h1>
    </div>
  );

  // Single attended → one poster card.
  if (attended.length === 1) {
    return (
      <HeroShell>
        {heading}
        <div className="mx-auto max-w-2xl">
          <RecordingCard workshop={attended[0]} />
        </div>
      </HeroShell>
    );
  }

  // Multiple attended → carousel.
  const current = attended[index];
  const prev = () => setIndex((i) => (i - 1 + attended.length) % attended.length);
  const next = () => setIndex((i) => (i + 1) % attended.length);

  return (
    <HeroShell>
      <div className="mb-8 flex items-end justify-between">
        {heading}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={prev}
            aria-label="Previous replay"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next replay"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <RecordingCard workshop={current} />
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {attended.map((w, i) => (
          <button
            key={w.slug}
            onClick={() => setIndex(i)}
            aria-label={`Show replay ${i + 1}: ${w.title}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-bright-green" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
        <span className="mono-label ml-2 text-white/50">
          {index + 1} / {attended.length}
        </span>
      </div>
    </HeroShell>
  );
}
