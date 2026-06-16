import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { PILLARS_SEED, LIBRARY_SEED, GROUPS_SEED } from "./seed-data";

// Single shared connection. Stash on globalThis so Next.js dev HMR doesn't open many.
declare global {
  var __landerDb: Database.Database | undefined;
}

function create(): Database.Database {
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const db = new Database(join(dir, "lander.db"));
  db.pragma("journal_mode = WAL");
  init(db);
  seed(db);
  return db;
}

function init(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name  TEXT NOT NULL,
      role  TEXT NOT NULL DEFAULT 'member'   -- 'member' | 'admin'
    );

    CREATE TABLE IF NOT EXISTS workshops (
      slug      TEXT PRIMARY KEY,
      title     TEXT NOT NULL,
      date      TEXT NOT NULL,
      status    TEXT NOT NULL,                -- 'upcoming' | 'past'
      summary   TEXT NOT NULL,
      pillars   TEXT NOT NULL DEFAULT '[]',   -- JSON array of pillar ids
      repoUrl   TEXT,
      slidesUrl TEXT,
      videoId   TEXT,
      attendees TEXT NOT NULL DEFAULT '[]'    -- JSON array of emails
    );

    CREATE TABLE IF NOT EXISTS events (
      id          TEXT PRIMARY KEY,
      type        TEXT NOT NULL,              -- category label (Webinar, Roundtable, …)
      title       TEXT NOT NULL,
      date        TEXT NOT NULL,              -- ISO start date
      location    TEXT NOT NULL,
      registerUrl TEXT NOT NULL,
      source      TEXT NOT NULL DEFAULT 'manual' -- 'auto' (synced) | 'manual'
    );

    -- Corporate/marketing events from solace.com's Events Calendar (sidebar). Same shape.
    CREATE TABLE IF NOT EXISTS marketing_events (
      id          TEXT PRIMARY KEY,
      type        TEXT NOT NULL,
      title       TEXT NOT NULL,
      date        TEXT NOT NULL,
      location    TEXT NOT NULL,
      registerUrl TEXT NOT NULL,
      source      TEXT NOT NULL DEFAULT 'manual'
    );

    CREATE TABLE IF NOT EXISTS groups (
      id        TEXT PRIMARY KEY,
      label     TEXT NOT NULL,
      icon      TEXT NOT NULL,
      sortOrder INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS pillars (
      id              TEXT PRIMARY KEY,
      number          INTEGER NOT NULL,
      title           TEXT NOT NULL,
      description     TEXT NOT NULL,
      icon            TEXT NOT NULL,
      refs            TEXT NOT NULL DEFAULT '[]', -- JSON array of {group,title,url}
      topicCategoryId INTEGER                     -- solace.com WP category id for latest posts
    );

    CREATE TABLE IF NOT EXISTS library_items (
      id          TEXT PRIMARY KEY,
      category    TEXT NOT NULL,              -- blog | video | webinar | whitepaper | analyst-report
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      url         TEXT NOT NULL,
      date        TEXT NOT NULL,              -- ISO date
      source      TEXT NOT NULL DEFAULT 'manual', -- 'auto' | 'manual'
      topics      TEXT NOT NULL DEFAULT ',',  -- comma-wrapped WP category ids, e.g. ',857,790,'
      videoId     TEXT
    );
  `);
}

function seed(db: Database.Database) {
  const seeded = db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
  if (seeded.n > 0) return;

  const insertUser = db.prepare("INSERT INTO users (email, name, role) VALUES (?, ?, ?)");
  const users: Array<[string, string, string]> = [
    ["attendee@solace.com", "Attendee (Dana)", "member"],
    ["gvensan21@gmail.com", "You (Giri)", "member"],
    ["guest@example.com", "Guest (no workshops)", "member"],
    ["admin@solace.com", "DevRel Admin", "admin"],
  ];

  const insertWorkshop = db.prepare(`
    INSERT INTO workshops (slug, title, date, status, summary, pillars, repoUrl, slidesUrl, videoId, attendees)
    VALUES (@slug, @title, @date, @status, @summary, @pillars, @repoUrl, @slidesUrl, @videoId, @attendees)
  `);
  const workshops = [
    {
      slug: "distributed-agentic-systems-sam-a2a-mcp",
      title: "Building Distributed Agentic Systems with Solace Agent Mesh, A2A & MCP",
      date: "2026-06-10",
      status: "past",
      summary:
        "A hands-on build of a multi-agent system on Solace Agent Mesh, wiring agents over A2A and MCP with an event-driven backbone.",
      pillars: JSON.stringify(["agentic-ai", "apis-dev-tools", "event-mesh"]),
      repoUrl: "https://github.com/SolaceLabs/solace-agent-mesh",
      slidesUrl: "https://solace.com/",
      videoId: "dQw4w9WgXcQ",
      attendees: JSON.stringify(["attendee@solace.com", "gvensan21@gmail.com"]),
    },
    {
      slug: "observability-distributed-tracing",
      title: "Observability Deep Dive: Distributed Tracing on Solace",
      date: "2026-07-08",
      status: "upcoming",
      summary:
        "Instrument an event mesh end-to-end with OpenTelemetry, then trace a message across send, enqueue, and receive spans into your own backend.",
      pillars: JSON.stringify(["operate-observe", "event-mesh"]),
      repoUrl: "https://github.com/SolaceLabs",
      slidesUrl: null,
      videoId: null,
      attendees: JSON.stringify([]),
    },
    {
      slug: "event-driven-integration-fundamentals",
      title: "Event-Driven Integration Fundamentals",
      date: "2026-05-20",
      status: "past",
      summary:
        "From your first event broker to pub/sub, request-reply, and consumer scaling — the core patterns of an event mesh, hands-on.",
      pillars: JSON.stringify(["event-mesh", "integrations"]),
      repoUrl: "https://github.com/SolaceLabs",
      slidesUrl: "https://solace.com/",
      videoId: "dQw4w9WgXcQ",
      attendees: JSON.stringify(["attendee@solace.com"]),
    },
    {
      slug: "design-govern-event-portal",
      title: "Designing & Governing with Event Portal",
      date: "2026-04-15",
      status: "past",
      summary:
        "Model an application domain, bind schemas to events, and catalog a runtime mesh using Event Portal Designer and the AI Design Assistant.",
      pillars: JSON.stringify(["design-govern", "apis-dev-tools"]),
      repoUrl: "https://github.com/SolaceLabs",
      slidesUrl: "https://solace.com/",
      videoId: "dQw4w9WgXcQ",
      attendees: JSON.stringify(["someoneelse@solace.com"]),
    },
  ];

  const insertEvent = db.prepare(`
    INSERT INTO events (id, type, title, date, location, registerUrl, source)
    VALUES (@id, @type, @title, @date, @location, @registerUrl, @source)
  `);
  // Events are synced from solace.com's Events Calendar (cron / Sync); start empty.
  const events: Array<Record<string, string>> = [];

  const insertGroup = db.prepare(`
    INSERT INTO groups (id, label, icon, sortOrder)
    VALUES (@id, @label, @icon, @sortOrder)
  `);
  const insertPillar = db.prepare(`
    INSERT INTO pillars (id, number, title, description, icon, refs, topicCategoryId)
    VALUES (@id, @number, @title, @description, @icon, @refs, @topicCategoryId)
  `);
  const insertLibrary = db.prepare(`
    INSERT INTO library_items (id, category, title, description, url, date, source, topics, videoId)
    VALUES (@id, @category, @title, @description, @url, @date, @source, @topics, @videoId)
  `);

  const seedAll = db.transaction(() => {
    for (const u of users) insertUser.run(...u);
    for (const w of workshops) insertWorkshop.run(w);
    for (const e of events) insertEvent.run(e);
    for (const g of GROUPS_SEED) insertGroup.run(g);
    for (const p of PILLARS_SEED)
      insertPillar.run({
        id: p.id,
        number: p.number,
        title: p.title,
        description: p.description,
        icon: p.icon,
        refs: JSON.stringify(p.references),
        topicCategoryId: p.topicCategoryId ?? null,
      });
    for (const li of LIBRARY_SEED)
      insertLibrary.run({
        ...li,
        topics: `,${li.topics.join(",")},`,
        videoId: li.videoId ?? null,
      });
  });
  seedAll();
}

export function getDb(): Database.Database {
  if (!globalThis.__landerDb) globalThis.__landerDb = create();
  return globalThis.__landerDb;
}
