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
      `INSERT INTO workshops (slug, title, date, status, summary, pillars, repoUrl, slidesUrl, videoId, attendees)
       VALUES (@slug, @title, @date, @status, @summary, @pillars, @repoUrl, @slidesUrl, @videoId, @attendees)`,
    )
    .run(serialize(w));
}

export function updateWorkshop(slug: string, w: Workshop): void {
  getDb()
    .prepare(
      `UPDATE workshops SET title=@title, date=@date, status=@status, summary=@summary,
       pillars=@pillars, repoUrl=@repoUrl, slidesUrl=@slidesUrl, videoId=@videoId, attendees=@attendees
       WHERE slug=@origSlug`,
    )
    .run({ ...serialize(w), origSlug: slug });
}

export function deleteWorkshop(slug: string): void {
  getDb().prepare("DELETE FROM workshops WHERE slug = ?").run(slug);
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
  };
}
