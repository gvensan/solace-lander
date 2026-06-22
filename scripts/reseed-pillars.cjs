#!/usr/bin/env node
// One-time, non-destructive updater: pushes the curated reference lists in
// lib/data/pillar-references.json into the live `pillars` table without touching
// workshops/events/library. Safe to run against a running dev server (SQLite WAL
// allows a concurrent writer). Usage: node scripts/reseed-pillars.cjs
const path = require("node:path");
const Database = require("better-sqlite3");
const refs = require("../lib/data/pillar-references.json");

const dbPath = path.join(process.cwd(), "data", "lander.db");
const db = new Database(dbPath);

const update = db.prepare("UPDATE pillars SET refs = @refs WHERE id = @id");
let updated = 0;
const tx = db.transaction(() => {
  for (const [id, references] of Object.entries(refs)) {
    const res = update.run({ id, refs: JSON.stringify(references) });
    if (res.changes > 0) updated += 1;
    console.log(`  ${id}: ${references.length} references${res.changes ? "" : "  (no matching pillar row)"}`);
  }
});
tx();

console.log(`\nUpdated ${updated} focus area(s) in ${dbPath}`);
db.close();
