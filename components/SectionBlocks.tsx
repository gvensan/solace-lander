import Image from "next/image";
import Link from "next/link";
import { COMMUNITY_LINKS } from "@/lib/data/content";
import { TRAINING_TILES, LEARNING_PATHS_URL } from "@/lib/data/courses";
import { getUpcomingEvents } from "@/lib/data/events";
import { getLibraryByCategory } from "@/lib/data/library";
import { LIBRARY_CATEGORIES, categoryMoreUrl } from "@/lib/library-categories";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";

export { SectionHeading };
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Sparkles,
  Check,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Library — Blog only for now: shows the latest 4 posts + a "More" link to the blog.
// Empty categories are skipped.
export function LibraryBlock() {
  const sections = LIBRARY_CATEGORIES.map((cat) => ({
    cat,
    items: getLibraryByCategory(cat.id, 4),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="space-y-8">
      {sections.map(({ cat, items }) => (
        <div key={cat.id}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg text-deep-blue">
              <Icon name={cat.icon} size={18} className="text-classic-green" />
              {cat.label}
            </h3>
            <a
              href={categoryMoreUrl(cat)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-deep-blue hover:underline"
            >
              More <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group flex gap-4 rounded-2xl border border-cool-13 bg-white p-5 transition hover:border-classic-green hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-deep-blue/5 text-deep-blue group-hover:bg-classic-green/10">
                  <Icon name={cat.icon} size={20} />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-base text-deep-blue group-hover:underline decoration-classic-green decoration-2 underline-offset-2">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 line-clamp-2 text-sm text-deep-blue/70">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Resource Library CTA */}
      <div className="pt-2 text-center">
        <a
          href="https://solace.com/resources/home/?page=1"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-solace-green px-7 py-3 font-semibold text-dark-blue transition hover:brightness-105"
        >
          Explore Resources Library <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}

export function TrainingBlock() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {TRAINING_TILES.map((tile) => (
          <div
            key={tile.title}
            className="flex flex-col rounded-2xl border border-cool-13 bg-white p-5"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-deep-blue/5 text-deep-blue">
              <Icon name={tile.icon} size={22} />
            </span>
            <h3 className="mt-3 text-lg leading-snug text-deep-blue">{tile.title}</h3>
            <ul className="mt-2.5 space-y-2">
              {tile.points.map((point) => (
                <li key={point} className="flex gap-2 text-sm text-deep-blue/70">
                  <Check size={15} className="mt-0.5 shrink-0 text-classic-green" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Role-based learning paths CTA (replaces "See All Courses") — in-app page */}
      <div className="pt-2 text-center">
        <Link
          href={LEARNING_PATHS_URL}
          className="inline-flex items-center gap-2 rounded-full bg-solace-green px-7 py-3 font-semibold text-dark-blue transition hover:brightness-105"
        >
          Find Your Learning Path <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export function CommunityBlock() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COMMUNITY_LINKS.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl border border-cool-13 bg-white p-5 transition hover:border-classic-green hover:shadow-md"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-deep-blue/5 text-deep-blue group-hover:bg-classic-green/10">
            <Icon name={link.icon} size={22} />
          </span>
          <h3 className="mt-3 text-lg text-deep-blue group-hover:underline decoration-classic-green decoration-2 underline-offset-2">{link.label}</h3>
          <p className="mt-1 text-sm text-deep-blue/70">{link.description}</p>
        </a>
      ))}
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-classic-green/50 bg-classic-green/5 p-6 sm:col-span-2 lg:col-span-4">
        <Image
          src="/solly.png"
          alt="Solly, the Solace otter mascot"
          width={240}
          height={240}
          className="pointer-events-none absolute -bottom-4 right-6 hidden w-36 select-none lg:block xl:w-44"
        />
        <div className="flex flex-wrap items-start justify-between gap-5 lg:pr-48">
          <div className="max-w-2xl">
            <p className="overline text-deep-blue">Solace Community</p>
            <h3 className="mt-1 text-xl text-deep-blue">Have a Question? The Community Has Answers</h3>
            <p className="mt-2 text-sm text-deep-blue/75">
              The Solace Community is where thousands of developers and architects ask questions,
              share event-driven patterns, and get answers — often straight from Solace engineers and
              MVPs. Search a deep knowledge base, follow product announcements, and connect with people
              building the same things you are.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-deep-blue/70">
              <li className="flex items-center gap-1.5"><Check size={14} className="text-classic-green" /> Q&amp;A with Solace engineers &amp; MVPs</li>
              <li className="flex items-center gap-1.5"><Check size={14} className="text-classic-green" /> Searchable knowledge base</li>
              <li className="flex items-center gap-1.5"><Check size={14} className="text-classic-green" /> Patterns, tips &amp; best practices</li>
            </ul>
          </div>
          <a
            href="https://solace.community"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full bg-classic-green px-5 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105"
          >
            Visit the Community
          </a>
        </div>
      </div>
    </div>
  );
}

export function DocsChatBlock() {
  return (
    <div className="bg-solace-teal relative overflow-hidden rounded-3xl p-8 text-white sm:p-10">
      <Sparkles className="pointer-events-none absolute -right-6 -top-6 text-bright-green/20" size={150} />
      <div className="relative max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
          <Sparkles size={22} className="text-bright-green" />
        </span>
        <p className="overline mt-4 text-eyebrow">Ask AI</p>
        <h2 className="mt-1 text-3xl text-white">Instant Answers from the Solace Docs</h2>
        <p className="mt-3 text-white/85">
          DocsChat is Solace&apos;s AI documentation assistant. Ask a question in plain English and get
          an answer grounded in the official Solace docs — with links to the sources so you can dig
          deeper.
        </p>
        <a
          href="https://docschat.solace.com/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-solace-green px-6 py-3 font-semibold text-dark-blue transition hover:brightness-105"
        >
          Ask DocsChat <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}

export function EventsBlock() {
  const events = getUpcomingEvents();
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-cool-13 bg-white p-6 text-deep-blue/60">
        No upcoming events right now — check back soon.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-cool-13 bg-white">
      {events.map((evt, i) => (
        <div
          key={evt.id}
          className={`flex flex-wrap items-center gap-4 p-5 ${i > 0 ? "border-t border-cool-13" : ""}`}
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-deep-blue/5 text-deep-blue">
            <Calendar size={22} />
          </div>
          <div className="flex-1">
            <span
              className={`mono-label rounded-full px-2.5 py-0.5 text-xs ${
                /webinar/i.test(evt.type)
                  ? "bg-sky-blue/50 text-deep-blue"
                  : "bg-bright-green/30 text-deep-blue"
              }`}
            >
              {evt.type}
            </span>
            <h3 className="mt-1.5 text-lg text-deep-blue">{evt.title}</h3>
            <p className="flex items-center gap-3 text-sm text-deep-blue/60">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {formatDate(evt.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {evt.location}
              </span>
            </p>
          </div>
          <a
            href={evt.registerUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-deep-blue px-4 py-2 text-sm font-semibold text-deep-blue transition hover:bg-deep-blue hover:text-white"
          >
            Register
          </a>
        </div>
      ))}
      </div>

      {/* All Events CTA */}
      <div className="pt-2 text-center">
        <a
          href="https://events.solace.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-solace-green px-7 py-3 font-semibold text-dark-blue transition hover:brightness-105"
        >
          More Events <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}

export function TryItFreeBlock() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-solace-blue p-8 text-white sm:p-12">
      <Sparkles className="pointer-events-none absolute -right-6 -top-6 text-bright-green/20" size={160} />
      <div className="relative max-w-xl">
        <p className="overline text-eyebrow">Try It Free</p>
        <h2 className="mt-2 text-3xl text-white sm:text-4xl">Spin Up a Free Solace Cloud Broker</h2>
        <p className="mt-3 text-white/80">
          No credit card. Stand up an event broker in minutes and start building on the digital
          nervous system for the real-time, agentic world.
        </p>
        <a
          href="https://console.solace.cloud/login/new-account"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-solace-green px-6 py-3 font-semibold text-dark-blue transition hover:brightness-105"
        >
          Start free <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
