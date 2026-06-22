import "server-only";
import { getDb } from "../db";
import type { Workshop } from "../types";

interface WorkshopRow {
  slug: string;
  title: string;
  date: string;
  status: "upcoming" | "past";
  summary: string;
  pillars: string;
  repoUrl: string | null;
  slidesUrl: string | null;
  videoId: string | null;
  attendees: string;
  source: "auto" | "manual" | null;
}

function toWorkshop(row: WorkshopRow): Workshop {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    status: row.status,
    summary: row.summary,
    pillars: JSON.parse(row.pillars),
    repoUrl: row.repoUrl ?? undefined,
    slidesUrl: row.slidesUrl ?? undefined,
    videoId: row.videoId ?? undefined,
    attendees: JSON.parse(row.attendees),
    source: row.source ?? "manual",
  };
}

export function getWorkshops(): Workshop[] {
  const rows = getDb()
    .prepare("SELECT * FROM workshops ORDER BY date DESC")
    .all() as WorkshopRow[];
  return rows.map(toWorkshop);
}

export function getWorkshop(slug: string): Workshop | undefined {
  const row = getDb().prepare("SELECT * FROM workshops WHERE slug = ?").get(slug) as
    | WorkshopRow
    | undefined;
  return row ? toWorkshop(row) : undefined;
}

// Featured = next upcoming, else most recent past.
export function getFeaturedWorkshop(): Workshop {
  const upcoming = getDb()
    .prepare("SELECT * FROM workshops WHERE status = 'upcoming' ORDER BY date ASC LIMIT 1")
    .get() as WorkshopRow | undefined;
  if (upcoming) return toWorkshop(upcoming);
  const latest = getDb()
    .prepare("SELECT * FROM workshops ORDER BY date DESC LIMIT 1")
    .get() as WorkshopRow;
  return toWorkshop(latest);
}

export function createWorkshop(w: Workshop): void {
  getDb()
    .prepare(
      `INSERT INTO workshops (slug, title, date, status, summary, pillars, repoUrl, slidesUrl, videoId, attendees, source)
       VALUES (@slug, @title, @date, @status, @summary, @pillars, @repoUrl, @slidesUrl, @videoId, @attendees, @source)`,
    )
    .run(serialize(w));
}

export function updateWorkshop(slug: string, w: Workshop): void {
  getDb()
    .prepare(
      `UPDATE workshops SET title=@title, date=@date, status=@status, summary=@summary,
       pillars=@pillars, repoUrl=@repoUrl, slidesUrl=@slidesUrl, videoId=@videoId, attendees=@attendees, source=@source
       WHERE slug=@origSlug`,
    )
    .run({ ...serialize(w), origSlug: slug });
}

export function deleteWorkshop(slug: string): void {
  getDb().prepare("DELETE FROM workshops WHERE slug = ?").run(slug);
}

// Ingest: refresh the feed-synced workshops from the events.solace.com "Webinars &
// Workshops" feed (upcoming-only). Rules:
//   • manual replay hubs are never touched (and never clobbered by a same-slug feed entry);
//   • a synced row that drops out of the feed while still upcoming = cancelled → removed;
//   • a synced row whose date has passed is KEPT (it's a replay-hub candidate to enrich later)
//     and flipped to status 'past'.
export function replaceAutoWorkshops(feed: Workshop[]): void {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const feedSlugs = new Set(feed.map((w) => w.slug));
  const tx = db.transaction(() => {
    // Drop only the still-upcoming synced rows that vanished from the feed.
    const autoRows = db
      .prepare("SELECT slug, date FROM workshops WHERE source = 'auto'")
      .all() as { slug: string; date: string }[];
    const del = db.prepare("DELETE FROM workshops WHERE slug = ? AND source = 'auto'");
    for (const r of autoRows) if (!feedSlugs.has(r.slug) && r.date >= today) del.run(r.slug);

    // Upsert feed rows as 'auto', but never overwrite a manual row that owns the slug.
    const getSrc = db.prepare("SELECT source FROM workshops WHERE slug = ?");
    const upsert = db.prepare(
      `INSERT INTO workshops (slug, title, date, status, summary, pillars, repoUrl, slidesUrl, videoId, attendees, source)
       VALUES (@slug, @title, @date, @status, @summary, @pillars, @repoUrl, @slidesUrl, @videoId, @attendees, 'auto')
       ON CONFLICT(slug) DO UPDATE SET
         title=excluded.title, date=excluded.date, status=excluded.status, summary=excluded.summary`,
    );
    for (const w of feed) {
      const row = getSrc.get(w.slug) as { source: string } | undefined;
      if (row?.source === "manual") continue;
      upsert.run(serialize({ ...w, source: "auto" }));
    }

    // Age past synced rows so they render as replays, not upcoming.
    db.prepare("UPDATE workshops SET status = 'past' WHERE source = 'auto' AND date < ?").run(today);
  });
  tx();
}

function serialize(w: Workshop) {
  return {
    slug: w.slug,
    title: w.title,
    date: w.date,
    status: w.status,
    summary: w.summary,
    pillars: JSON.stringify(w.pillars),
    repoUrl: w.repoUrl ?? null,
    slidesUrl: w.slidesUrl ?? null,
    videoId: w.videoId ?? null,
    attendees: JSON.stringify(w.attendees),
    source: w.source ?? "manual",
  };
}
