import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { SectionNav, type SectionItem } from "@/components/SectionNav";
import { PillarGrid } from "@/components/PillarGrid";
import { ReplayGate } from "@/components/ReplayGate";
import {
  SectionHeading,
  LibraryBlock,
  CommunityBlock,
  EventsBlock,
  TryItFreeBlock,
} from "@/components/SectionBlocks";
import { getWorkshop } from "@/lib/data/workshops";
import { getPillars } from "@/lib/data/pillars";
import { getGroups } from "@/lib/data/groups";
import { Calendar, FolderGit2, FileText, ArrowDown } from "lucide-react";

// Content is DB-backed and editable via /admin — render per request.
export const dynamic = "force-dynamic";

// Per-workshop metadata + social cards — these pages get shared with attendees.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = getWorkshop(slug);
  if (!workshop) return { title: "Workshop Not Found — Solace Lander" };

  const image = workshop.videoId
    ? `https://img.youtube.com/vi/${workshop.videoId}/maxresdefault.jpg`
    : undefined;

  return {
    title: `${workshop.title} — Solace Lander`,
    description: workshop.summary,
    openGraph: {
      title: workshop.title,
      description: workshop.summary,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: workshop.title,
      description: workshop.summary,
      images: image ? [image] : undefined,
    },
  };
}

const SECTIONS: SectionItem[] = [
  { id: "recap", label: "Workshop Recap", gated: true },
  { id: "explore", label: "Explore by Topic" },
  { id: "library", label: "Library" },
  { id: "community", label: "Community" },
  { id: "events", label: "Upcoming Events" },
  { id: "try-free", label: "Try It Free" },
];

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = getWorkshop(slug);
  if (!workshop) notFound();
  const pillars = getPillars();
  const groups = getGroups();

  return (
    <>
      <TopNav />

      {/* Workshop header strip */}
      <div className="bg-solace-blue text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#catalog" className="mono-label text-bright-green hover:underline">
            ← All workshops
          </Link>
          <h1 className="mt-2 max-w-3xl text-3xl sm:text-4xl">{workshop.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-white/70">
            <Calendar size={15} /> {formatDate(workshop.date)}
          </p>
        </div>
      </div>

      {/* Content sits on the brand section background (pale mint) */}
      <div className="bg-section flex-1">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left sticky section navigator */}
          <aside className="hidden lg:col-span-3 lg:block">
            <SectionNav sections={SECTIONS} />
          </aside>

          {/* Main content */}
          <div className="col-span-12 space-y-20 lg:col-span-9 xl:col-span-6">
            <section id="recap">
              <SectionHeading
                overline="Section 1 · Gated"
                title="Workshop Recap"
                subtitle="The recording, slides, and code — available to attendees with a SolaceID."
              />
              <ReplayGate workshop={workshop} />
            </section>

            <section id="explore">
              <SectionHeading
                overline="Section 2"
                title="Explore by Topic"
                subtitle="The six focus areas of the Solace platform. Open a card to see key concepts and curated references."
              />
              <PillarGrid pillars={pillars} groups={groups} />
            </section>

            <section id="library">
              <SectionHeading overline="Section 3" title="Library" />
              <LibraryBlock />
            </section>

            <section id="community">
              <SectionHeading overline="Section 4" title="Community" />
              <CommunityBlock />
            </section>

            <section id="events">
              <SectionHeading overline="Section 5" title="Upcoming Events" />
              <EventsBlock />
            </section>

            <section id="try-free">
              <TryItFreeBlock />
            </section>
          </div>

          {/* Right panel */}
          <aside className="hidden xl:col-span-3 xl:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-cool-13 bg-white p-5">
                <p className="overline text-classic-green">This Workshop</p>
                <h3 className="mt-1 text-lg leading-snug text-deep-blue">{workshop.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-deep-blue/60">
                  <Calendar size={14} /> {formatDate(workshop.date)}
                </p>

                <p className="overline mt-5 text-deep-blue/40">Quick Links</p>
                <div className="mt-2 space-y-2">
                  {workshop.repoUrl && (
                    <a
                      href={workshop.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-deep-blue/80 hover:text-classic-green"
                    >
                      <FolderGit2 size={15} /> Code repository
                    </a>
                  )}
                  {workshop.slidesUrl && (
                    <a
                      href={workshop.slidesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-deep-blue/80 hover:text-classic-green"
                    >
                      <FileText size={15} /> Slide deck
                    </a>
                  )}
                </div>

                <a
                  href="#recap"
                  className="mt-5 flex items-center justify-center gap-2 rounded-full bg-solace-green px-4 py-2.5 text-sm font-semibold text-dark-blue transition hover:brightness-105"
                >
                  <ArrowDown size={15} /> Unlock replay
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
      </div>

      <Footer />
    </>
  );
}
