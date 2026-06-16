import "server-only";
import { getDb } from "../db";
import type { SolaceEvent } from "../types";

export function getEvents(): SolaceEvent[] {
  return getDb().prepare("SELECT * FROM events ORDER BY date ASC").all() as SolaceEvent[];
}

// Upcoming only (today or later) — used by the public render + sidebar.
export function getUpcomingEvents(limit?: number): SolaceEvent[] {
  const sql =
    "SELECT * FROM events WHERE date >= date('now') ORDER BY date ASC" +
    (limit ? " LIMIT ?" : "");
  const stmt = getDb().prepare(sql);
  return (limit ? stmt.all(limit) : stmt.all()) as SolaceEvent[];
}

export function getEvent(id: string): SolaceEvent | undefined {
  return getDb().prepare("SELECT * FROM events WHERE id = ?").get(id) as SolaceEvent | undefined;
}

export function createEvent(e: SolaceEvent): void {
  getDb()
    .prepare(
      `INSERT INTO events (id, type, title, date, location, registerUrl, source)
       VALUES (@id, @type, @title, @date, @location, @registerUrl, @source)`,
    )
    .run(e);
}

export function updateEvent(id: string, e: SolaceEvent): void {
  getDb()
    .prepare(
      `UPDATE events SET type=@type, title=@title, date=@date, location=@location,
       registerUrl=@registerUrl, source=@source WHERE id=@origId`,
    )
    .run({ ...e, origId: id });
}

export function deleteEvent(id: string): void {
  getDb().prepare("DELETE FROM events WHERE id = ?").run(id);
}

// Ingest: replace synced events with the fresh upcoming set, and prune anything expired
// (past-dated) regardless of source. Manual upcoming events are preserved.
export function replaceAutoEvents(events: SolaceEvent[]): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM events WHERE source = 'auto'").run();
    db.prepare("DELETE FROM events WHERE date < date('now')").run();
    const insert = db.prepare(
      `INSERT OR REPLACE INTO events (id, type, title, date, location, registerUrl, source)
       VALUES (@id, @type, @title, @date, @location, @registerUrl, @source)`,
    );
    for (const e of events) if (e.date >= new Date().toISOString().slice(0, 10)) insert.run(e);
  });
  tx();
}
