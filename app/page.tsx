import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HubExplore } from "@/components/HubExplore";
import {
  SectionHeading,
  LibraryBlock,
  CommunityBlock,
  EventsBlock,
  TryItFreeBlock,
  DocsChatBlock,
  TrainingBlock,
} from "@/components/SectionBlocks";
import { getWorkshops } from "@/lib/data/workshops";
import { getUpcomingMarketingEvents } from "@/lib/data/marketing-events";
import { getPillars } from "@/lib/data/pillars";
import { getGroups } from "@/lib/data/groups";
import { getLatestVideos } from "@/lib/data/videos";

// Reads from SQLite (content changes at runtime via /admin).
export const dynamic = "force-dynamic";

export default async function Home() {
  const workshops = getWorkshops();
  const pillars = getPillars();
  const groups = getGroups();
  const upcomingEvents = getUpcomingMarketingEvents(2); // sidebar = solace.com events
  const videos = await getLatestVideos(2); // sidebar = latest @Solacedotcom YouTube videos

  return (
    <>
      <TopNav />

      <main className="flex-1">
        {/* Personalized hero (full width): attended replays or generic brand hero */}
        <Hero workshops={workshops} />

        {/* Content panel: main content (left) + sticky sidebar (right) */}
        <HubExplore pillars={pillars} groups={groups} events={upcomingEvents} videos={videos}>
          <section id="ask-ai">
            <DocsChatBlock />
          </section>

          <section id="events">
            <SectionHeading
              overline="Upcoming Webinars & Workshops"
              title="Join a Live Workshop or Webinar"
              subtitle="Register for upcoming sessions on events.solace.com — replays land here afterward for attendees."
            />
            <EventsBlock />
          </section>

          <section id="library">
            <SectionHeading
              overline="Library"
              title="Latest in Resource Library"
              subtitle="The newest from solace.com — by resource type."
            />
            <LibraryBlock />
          </section>

          <section id="training">
            <SectionHeading
              overline="Training"
              title="Get Ahead of the Curve"
              subtitle="Level up with self-paced courses and certifications from Solace Academy."
            />
            <TrainingBlock />
          </section>

          <section id="community">
            <SectionHeading
              overline="Community"
              title="Join the Conversation"
              subtitle="Connect with developers and Solace engineers building event-driven systems."
            />
            <CommunityBlock />
          </section>
        </HubExplore>

        {/* Try It Free — full-width closing CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <TryItFreeBlock />
        </section>
      </main>

      <Footer />
    </>
  );
}
