import "server-only";
import { getDb } from "../db";
import type { LibraryItem, PillarPost } from "../types";

interface LibraryRow {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
  date: string;
  source: "auto" | "manual";
  topics: string; // comma-wrapped ',857,790,'
  videoId: string | null;
}

function toItem(row: LibraryRow): LibraryItem {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    url: row.url,
    date: row.date,
    source: row.source,
    topics: row.topics.split(",").map((s) => Number(s)).filter((n) => !Number.isNaN(n)),
    videoId: row.videoId ?? undefined,
  };
}

function serialize(i: LibraryItem) {
  return {
    id: i.id,
    category: i.category,
    title: i.title,
    description: i.description,
    url: i.url,
    date: i.date,
    source: i.source,
    topics: `,${i.topics.join(",")},`,
    videoId: i.videoId ?? null,
  };
}

export function getLibraryItems(): LibraryItem[] {
  const rows = getDb().prepare("SELECT * FROM library_items ORDER BY date DESC").all() as LibraryRow[];
  return rows.map(toItem);
}

// Latest N items in a library category (for the format-based Library sections).
export function getLibraryByCategory(category: string, limit = 2): LibraryItem[] {
  // date DESC, then rowid ASC so scraped items (same ingest date) keep page order.
  const rows = getDb()
    .prepare("SELECT * FROM library_items WHERE category = ? ORDER BY date DESC, rowid ASC LIMIT ?")
    .all(category, limit) as LibraryRow[];
  return rows.map(toItem);
}

// Latest blog/video posts tagged with a solace.com topic category id (for pillar panels).
export function getLatestPostsByTopic(topicCategoryId: number, limit = 2): PillarPost[] {
  const rows = getDb()
    .prepare(
      `SELECT title, url, date FROM library_items
       WHERE category IN ('blog','video') AND topics LIKE '%,' || ? || ',%'
       ORDER BY date DESC LIMIT ?`,
    )
    .all(String(topicCategoryId), limit) as PillarPost[];
  return rows;
}

export function getLibraryItem(id: string): LibraryItem | undefined {
  const row = getDb().prepare("SELECT * FROM library_items WHERE id = ?").get(id) as
    | LibraryRow
    | undefined;
  return row ? toItem(row) : undefined;
}

export function createLibraryItem(i: LibraryItem): void {
  getDb()
    .prepare(
      `INSERT INTO library_items (id, category, title, description, url, date, source, topics, videoId)
       VALUES (@id, @category, @title, @description, @url, @date, @source, @topics, @videoId)`,
    )
    .run(serialize(i));
}

export function updateLibraryItem(id: string, i: LibraryItem): void {
  getDb()
    .prepare(
      `UPDATE library_items SET category=@category, title=@title, description=@description,
       url=@url, date=@date, source=@source, topics=@topics, videoId=@videoId WHERE id=@origId`,
    )
    .run({ ...serialize(i), origId: id });
}

export function deleteLibraryItem(id: string): void {
  getDb().prepare("DELETE FROM library_items WHERE id = ?").run(id);
}

// Ingest: clean + update — replace all auto items in a category with a fresh set.
// Manual (curated) items are left untouched.
export function replaceAutoCategory(category: string, items: LibraryItem[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM library_items WHERE category = ? AND source = 'auto'").run(category);
    const insert = db.prepare(
      `INSERT OR REPLACE INTO library_items (id, category, title, description, url, date, source, topics, videoId)
       VALUES (@id, @category, @title, @description, @url, @date, @source, @topics, @videoId)`,
    );
    for (const i of items) insert.run(serialize(i));
  });
  tx();
}
