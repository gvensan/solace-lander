// One-time migration: add workshops.source + drop legacy dummy seed workshops.
// Safe to run against the live DB while the dev server is up — schema changes are
// visible to the server's connection on its next prepare(). Idempotent.
const Database = require("better-sqlite3");
const { join } = require("node:path");

const db = new Database(join(process.cwd(), "data", "lander.db"));
const hasSource = db.prepare("PRAGMA table_info(workshops)").all().some((c) => c.name === "source");
if (!hasSource) {
  db.exec("ALTER TABLE workshops ADD COLUMN source TEXT NOT NULL DEFAULT 'manual'");
  console.log("added workshops.source column");
} else {
  console.log("workshops.source already present");
}
const del = db.prepare(`DELETE FROM workshops WHERE slug IN (
  'distributed-agentic-systems-sam-a2a-mcp',
  'observability-distributed-tracing',
  'event-driven-integration-fundamentals',
  'design-govern-event-portal'
)`).run();
console.log(`removed ${del.changes} dummy seed workshop(s)`);
db.pragma("user_version = 1");
console.log("user_version =", db.pragma("user_version", { simple: true }));
console.log("remaining workshops:", db.prepare("SELECT slug, status, source FROM workshops").all());
db.close();
