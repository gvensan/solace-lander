import "server-only";
import { getDb } from "../db";
import type { SolaceEvent } from "../types";

// Corporate/marketing events from solace.com's Events Calendar (rendered in the sidebar).
// Separate from the events.solace.com "Webinars & Workshops" (lib/data/events.ts).

export function getMarketingEvents(): SolaceEvent[] {
  return getDb().prepare("SELECT * FROM marketing_events ORDER BY date ASC").all() as SolaceEvent[];
}

export function getUpcomingMarketingEvents(limit?: number): SolaceEvent[] {
  const sql =
    "SELECT * FROM marketing_events WHERE date >= date('now') ORDER BY date ASC" +
    (limit ? " LIMIT ?" : "");
  const stmt = getDb().prepare(sql);
  return (limit ? stmt.all(limit) : stmt.all()) as SolaceEvent[];
}

export function getMarketingEvent(id: string): SolaceEvent | undefined {
  return getDb().prepare("SELECT * FROM marketing_events WHERE id = ?").get(id) as
    | SolaceEvent
    | undefined;
}

export function createMarketingEvent(e: SolaceEvent): void {
  getDb()
    .prepare(
      `INSERT INTO marketing_events (id, type, title, date, location, registerUrl, source)
       VALUES (@id, @type, @title, @date, @location, @registerUrl, @source)`,
    )
    .run(e);
}

export function updateMarketingEvent(id: string, e: SolaceEvent): void {
  getDb()
    .prepare(
      `UPDATE marketing_events SET type=@type, title=@title, date=@date, location=@location,
       registerUrl=@registerUrl, source=@source WHERE id=@origId`,
    )
    .run({ ...e, origId: id });
}

export function deleteMarketingEvent(id: string): void {
  getDb().prepare("DELETE FROM marketing_events WHERE id = ?").run(id);
}

export function replaceAutoMarketingEvents(events: SolaceEvent[]): void {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM marketing_events WHERE source = 'auto'").run();
    db.prepare("DELETE FROM marketing_events WHERE date < date('now')").run();
    const insert = db.prepare(
      `INSERT OR REPLACE INTO marketing_events (id, type, title, date, location, registerUrl, source)
       VALUES (@id, @type, @title, @date, @location, @registerUrl, @source)`,
    );
    for (const e of events) if (e.date >= today) insert.run(e);
  });
  tx();
}
