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
  migrate(db);
  seed(db);
  return db;
}

// Versioned schema migrations for already-created DBs (init() only adds new tables,
// never alters existing ones). Bump user_version + add a block for each change.
function migrate(db: Database.Database) {
  const version = db.pragma("user_version", { simple: true }) as number;

  // v1: workshops become feed-synced. Add a `source` column and drop the legacy
  // dummy seed replay hubs (the live page's "Workshops & Webinars" now comes from
  // the events.solace.com sync; real replay hubs are added manually as source='manual').
  if (version < 1) {
    const cols = db.prepare("PRAGMA table_info(workshops)").all() as { name: string }[];
    if (!cols.some((c) => c.name === "source")) {
      db.exec("ALTER TABLE workshops ADD COLUMN source TEXT NOT NULL DEFAULT 'manual'");
    }
    db.prepare(
      `DELETE FROM workshops WHERE slug IN (
        'distributed-agentic-systems-sam-a2a-mcp',
        'observability-distributed-tracing',
        'event-driven-integration-fundamentals',
        'design-govern-event-portal'
      )`,
    ).run();
    db.pragma("user_version = 1");
  }
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
      attendees TEXT NOT NULL DEFAULT '[]',   -- JSON array of emails
      source    TEXT NOT NULL DEFAULT 'manual' -- 'auto' (synced from events feed) | 'manual' (replay hub)
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

    -- Per-role learning paths (admin-curated). A role's timeline = ordered bands, each
    -- band = ordered steps. A step references a synced course (course_id) or is a custom
    -- node (exam/overview/in-path) with inline fields. Seeded from the curated defaults.
    CREATE TABLE IF NOT EXISTS path_bands (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id       TEXT NOT NULL,
      position      INTEGER NOT NULL,
      stage         INTEGER NOT NULL DEFAULT 1,   -- 1|2|3 (timeline banding)
      title         TEXT NOT NULL,
      subtitle      TEXT,
      path_url      TEXT,
      certification TEXT,
      cost          TEXT,
      total_time    TEXT
    );
    CREATE TABLE IF NOT EXISTS path_steps (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      band_id         INTEGER NOT NULL,
      position        INTEGER NOT NULL,
      course_id       INTEGER,                     -- → academy_courses.id (null for custom)
      custom_title    TEXT,
      custom_url      TEXT,
      custom_duration TEXT,
      custom_price    TEXT,
      elective        INTEGER NOT NULL DEFAULT 0,
      cert            INTEGER NOT NULL DEFAULT 0,
      note            TEXT
    );

    -- Solace Academy catalog (courses + cert/learning-plan paths), synced from the
    -- public training.solace.com catalog API. Read-only mirror; refreshed by sync/cron.
    CREATE TABLE IF NOT EXISTS academy_courses (
      id            INTEGER PRIMARY KEY,        -- Docebo item_id
      type          TEXT NOT NULL,              -- 'course' | 'learning_plan'
      title         TEXT NOT NULL,
      url           TEXT NOT NULL,
      price_usd     INTEGER NOT NULL DEFAULT 0, -- 0 = free
      duration_sec  INTEGER NOT NULL DEFAULT 0,
      category      TEXT NOT NULL DEFAULT '',   -- catalog (catalogue_name)
      plan_courses  TEXT,                        -- JSON [{idCourse,name}] for learning plans
      first_seen_at TEXT NOT NULL,
      last_synced_at TEXT NOT NULL,
      reviewed      INTEGER NOT NULL DEFAULT 0, -- 0 = newly added, needs review
      removed       INTEGER NOT NULL DEFAULT 0  -- 1 = no longer in the catalog
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

  // Workshops are synced from the events.solace.com "Webinars & Workshops" feed
  // (cron / Sync) as source='auto'; real replay hubs are added manually in admin. Start empty.
  const insertWorkshop = db.prepare(`
    INSERT INTO workshops (slug, title, date, status, summary, pillars, repoUrl, slidesUrl, videoId, attendees, source)
    VALUES (@slug, @title, @date, @status, @summary, @pillars, @repoUrl, @slidesUrl, @videoId, @attendees, @source)
  `);
  const workshops: Array<Record<string, string | null>> = [];

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
