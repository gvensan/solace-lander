import "server-only";
import { getDb } from "../db";

// Solace Academy catalog mirrored from the public training.solace.com catalog API.
// This module is the DB access layer; the fetch/sync lives in lib/academy-sync.ts.

export interface AcademyItem {
  id: number;
  type: "course" | "learning_plan";
  title: string;
  url: string;
  priceUsd: number; // 0 = free
  durationSec: number;
  category: string;
  planCourses: { idCourse: number; name: string }[] | null; // for learning plans
  firstSeenAt: string;
  lastSyncedAt: string;
  reviewed: boolean;
  removed: boolean;
}

interface Row {
  id: number;
  type: "course" | "learning_plan";
  title: string;
  url: string;
  price_usd: number;
  duration_sec: number;
  category: string;
  plan_courses: string | null;
  first_seen_at: string;
  last_synced_at: string;
  reviewed: number;
  removed: number;
}

function toItem(r: Row): AcademyItem {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    url: r.url,
    priceUsd: r.price_usd,
    durationSec: r.duration_sec,
    category: r.category,
    planCourses: r.plan_courses ? JSON.parse(r.plan_courses) : null,
    firstSeenAt: r.first_seen_at,
    lastSyncedAt: r.last_synced_at,
    reviewed: !!r.reviewed,
    removed: !!r.removed,
  };
}

// One normalized item produced by the sync, before it's written to the DB.
export interface SyncedItem {
  id: number;
  type: "course" | "learning_plan";
  title: string;
  url: string;
  priceUsd: number;
  durationSec: number;
  category: string;
  planCourses?: { idCourse: number; name: string }[] | null;
}

export interface SyncResult {
  courses: number;
  paths: number;
  added: number; // brand-new ids this run
  removed: number; // ids that dropped out of the catalog
  at: string;
}

// Upsert a full sync batch. "New" is decided by PRESENCE: an item is flagged for review
// (reviewed = 0) only if its id wasn't already in the DB. Existing rows keep their
// reviewed flag (a re-sync never re-flags them). The very first import (empty DB) is a
// baseline, so everything comes in already-reviewed rather than 50+ "new" rows. Items no
// longer in the catalog are marked removed. Runs in one transaction.
export function upsertAcademy(items: SyncedItem[]): SyncResult {
  const db = getDb();
  const now = new Date().toISOString();

  const existing = new Set(
    (db.prepare("SELECT id FROM academy_courses").all() as { id: number }[]).map((r) => r.id),
  );
  const isFirstImport = existing.size === 0;
  const newReviewed = isFirstImport ? 1 : 0; // baseline first import; flag genuine additions after

  const insert = db.prepare(`
    INSERT INTO academy_courses
      (id, type, title, url, price_usd, duration_sec, category, plan_courses, first_seen_at, last_synced_at, reviewed, removed)
    VALUES (@id, @type, @title, @url, @price_usd, @duration_sec, @category, @plan_courses, @now, @now, @reviewed, 0)
    ON CONFLICT(id) DO UPDATE SET
      type=@type, title=@title, url=@url, price_usd=@price_usd, duration_sec=@duration_sec,
      category=@category, plan_courses=@plan_courses, last_synced_at=@now, removed=0
  `);
  const markRemoved = db.prepare(
    "UPDATE academy_courses SET removed = 1, last_synced_at = @now WHERE id NOT IN (SELECT value FROM json_each(@ids)) AND removed = 0",
  );

  let added = 0;
  const tx = db.transaction(() => {
    for (const it of items) {
      if (!existing.has(it.id)) added += 1;
      insert.run({
        id: it.id,
        type: it.type,
        title: it.title,
        url: it.url,
        price_usd: it.priceUsd,
        duration_sec: it.durationSec,
        category: it.category,
        plan_courses: it.planCourses ? JSON.stringify(it.planCourses) : null,
        reviewed: newReviewed,
        now,
      });
    }
    const removedInfo = markRemoved.run({ now, ids: JSON.stringify(items.map((i) => i.id)) });
    return removedInfo.changes;
  });
  const removed = tx() as number;

  return {
    courses: items.filter((i) => i.type === "course").length,
    paths: items.filter((i) => i.type === "learning_plan").length,
    added,
    removed,
    at: now,
  };
}

export function getCourses(): AcademyItem[] {
  return (getDb()
    .prepare("SELECT * FROM academy_courses WHERE type = 'course' AND removed = 0 ORDER BY category, title")
    .all() as Row[]).map(toItem);
}

export function getCertPaths(): AcademyItem[] {
  return (getDb()
    .prepare("SELECT * FROM academy_courses WHERE type = 'learning_plan' AND removed = 0 ORDER BY title")
    .all() as Row[]).map(toItem);
}

// Newly-synced items not yet acknowledged — surfaced separately for follow-up.
export function getNewItems(): AcademyItem[] {
  return (getDb()
    .prepare("SELECT * FROM academy_courses WHERE reviewed = 0 AND removed = 0 ORDER BY first_seen_at DESC, title")
    .all() as Row[]).map(toItem);
}

export function getRemovedItems(): AcademyItem[] {
  return (getDb()
    .prepare("SELECT * FROM academy_courses WHERE removed = 1 ORDER BY title")
    .all() as Row[]).map(toItem);
}

export function markReviewed(id: number): void {
  getDb().prepare("UPDATE academy_courses SET reviewed = 1 WHERE id = ?").run(id);
}

export function markAllReviewed(): void {
  getDb().prepare("UPDATE academy_courses SET reviewed = 1 WHERE reviewed = 0").run();
}

export function academyCounts(): { courses: number; paths: number; newItems: number; lastSyncedAt: string | null } {
  const db = getDb();
  const courses = (db.prepare("SELECT COUNT(*) AS n FROM academy_courses WHERE type='course' AND removed=0").get() as { n: number }).n;
  const paths = (db.prepare("SELECT COUNT(*) AS n FROM academy_courses WHERE type='learning_plan' AND removed=0").get() as { n: number }).n;
  const newItems = (db.prepare("SELECT COUNT(*) AS n FROM academy_courses WHERE reviewed=0 AND removed=0").get() as { n: number }).n;
  const last = db.prepare("SELECT MAX(last_synced_at) AS t FROM academy_courses").get() as { t: string | null };
  return { courses, paths, newItems, lastSyncedAt: last.t };
}

// Display helpers.
export function formatDuration(sec: number): string {
  if (!sec) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m} min`;
}

export function formatPrice(usd: number): string {
  return usd > 0 ? "$$" : "Free";
}
