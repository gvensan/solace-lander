import "server-only";
import { getDb } from "../db";
import { FOUNDATIONS, TRACKS, ROLES, type Role } from "./learning-paths";
import { formatDuration } from "./academy";

// Per-role learning paths, stored in the DB (path_bands + path_steps) and editable in the
// admin path-builder. Seeded once from the curated defaults in learning-paths.ts so the
// content matches what the page shows today; course metadata (title/url/price/duration)
// is resolved live from the synced academy_courses catalog.

export { ROLES };
export type { Role };

export interface PathCourse {
  stepId: number;
  courseId: number | null; // null = custom node (exam/overview/in-path)
  title: string;
  url: string | null; // null ⇒ "in path" — UI falls back to the band's pathUrl
  duration: string;
  price: string; // "FREE" | "$50" | "$ (in $500 path)" (UI renders paid as "$$")
  elective: boolean;
  cert: boolean;
  note?: string;
  missing?: boolean; // referenced course no longer in the synced catalog
}

export interface PathBand {
  id: number;
  key: string;
  stage: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  pathUrl?: string;
  certification?: string;
  cost?: string;
  totalTime?: string;
  nodes: PathCourse[];
}

const priceFromUsd = (usd: number) => (usd > 0 ? `$${usd}` : "FREE");
const courseIdFromUrl = (url?: string | null) => {
  const m = url?.match(/\/courses\/(\d+)\//);
  return m ? Number(m[1]) : null;
};

// ── Seed (idempotent): build each role's bands from the curated defaults ──────
function seedFromDefaults() {
  const db = getDb();
  const insertBand = db.prepare(
    "INSERT INTO path_bands (role_id, position, stage, title, subtitle, path_url, certification, cost, total_time) VALUES (@role_id,@position,@stage,@title,@subtitle,@path_url,@certification,@cost,@total_time)",
  );
  const insertStep = db.prepare(
    "INSERT INTO path_steps (band_id, position, course_id, custom_title, custom_url, custom_duration, custom_price, elective, cert, note) VALUES (@band_id,@position,@course_id,@custom_title,@custom_url,@custom_duration,@custom_price,@elective,@cert,@note)",
  );

  const tx = db.transaction(() => {
    for (const role of ROLES) {
      const seen = new Set<string>();
      let bandPos = 0;

      // Stage 1 · Foundations (shared)
      const fBand = insertBand.run({
        role_id: role.id, position: bandPos++, stage: 1, title: "Foundations",
        subtitle: "Universal — all roles start here", path_url: null, certification: null, cost: null, total_time: null,
      });
      let stepPos = 0;
      for (const c of FOUNDATIONS) {
        if (c.url) seen.add(c.url);
        const cid = courseIdFromUrl(c.url);
        insertStep.run({
          band_id: fBand.lastInsertRowid, position: stepPos++, course_id: cid,
          custom_title: cid ? null : c.title, custom_url: cid ? null : c.url ?? null,
          custom_duration: cid ? null : c.duration, custom_price: cid ? null : c.price,
          elective: c.elective ? 1 : 0, cert: c.cert ? 1 : 0, note: c.note ?? null,
        });
      }

      // Stage 2/3 · one band per track (deduped like the page does today)
      for (const tid of role.trackIds) {
        const t = TRACKS.find((x) => x.id === tid);
        if (!t) continue;
        const band = insertBand.run({
          role_id: role.id, position: bandPos++, stage: t.stage, title: t.title,
          subtitle: t.audience, path_url: t.pathUrl, certification: t.certification, cost: t.cost, total_time: t.totalTime,
        });
        let sp = 0;
        for (const s of t.steps) {
          const keep = s.cert || !s.url || !seen.has(s.url);
          if (!keep) continue;
          if (s.url && !s.cert) seen.add(s.url);
          const cid = courseIdFromUrl(s.url);
          insertStep.run({
            band_id: band.lastInsertRowid, position: sp++, course_id: cid,
            custom_title: cid ? null : s.title, custom_url: cid ? null : s.url ?? null,
            custom_duration: cid ? null : s.duration, custom_price: cid ? null : s.price,
            elective: s.elective ? 1 : 0, cert: s.cert ? 1 : 0, note: s.note ?? null,
          });
        }
      }
    }
  });
  tx();
}

export function ensurePathsSeeded() {
  const db = getDb();
  const n = (db.prepare("SELECT COUNT(*) AS n FROM path_bands").get() as { n: number }).n;
  if (n === 0) seedFromDefaults();
}

// ── Read ─────────────────────────────────────────────────────────────────────
interface BandRow {
  id: number; role_id: string; position: number; stage: number; title: string;
  subtitle: string | null; path_url: string | null; certification: string | null; cost: string | null; total_time: string | null;
}
interface StepRow {
  id: number; band_id: number; position: number; course_id: number | null;
  custom_title: string | null; custom_url: string | null; custom_duration: string | null; custom_price: string | null;
  elective: number; cert: number; note: string | null;
}
interface CourseRow { id: number; title: string; url: string; price_usd: number; duration_sec: number; }

function resolveStep(s: StepRow, courses: Map<number, CourseRow>): PathCourse {
  if (s.course_id != null) {
    const c = courses.get(s.course_id);
    if (!c) {
      return { stepId: s.id, courseId: s.course_id, title: `(course ${s.course_id} not in catalog)`, url: "#", duration: "—", price: "FREE", elective: !!s.elective, cert: !!s.cert, note: s.note ?? undefined, missing: true };
    }
    return {
      stepId: s.id, courseId: s.course_id, title: c.title, url: c.url,
      duration: formatDuration(c.duration_sec), price: priceFromUsd(c.price_usd),
      elective: !!s.elective, cert: !!s.cert, note: s.note ?? undefined,
    };
  }
  return {
    stepId: s.id, courseId: null, title: s.custom_title ?? "Untitled", url: s.custom_url ?? null,
    duration: s.custom_duration ?? "—", price: s.custom_price ?? "FREE",
    elective: !!s.elective, cert: !!s.cert, note: s.note ?? undefined,
  };
}

function bandsForRole(roleId: string): PathBand[] {
  const db = getDb();
  const bands = db.prepare("SELECT * FROM path_bands WHERE role_id = ? ORDER BY position").all(roleId) as BandRow[];
  if (bands.length === 0) return [];
  const bandIds = bands.map((b) => b.id);
  const steps = db
    .prepare(`SELECT * FROM path_steps WHERE band_id IN (${bandIds.map(() => "?").join(",")}) ORDER BY position`)
    .all(...bandIds) as StepRow[];
  const courses = new Map(
    (db.prepare("SELECT id, title, url, price_usd, duration_sec FROM academy_courses WHERE removed = 0").all() as CourseRow[]).map((c) => [c.id, c]),
  );
  return bands.map((b) => ({
    id: b.id,
    key: `${b.role_id}-${b.id}`,
    stage: b.stage as 1 | 2 | 3,
    title: b.title,
    subtitle: b.subtitle ?? undefined,
    pathUrl: b.path_url ?? undefined,
    certification: b.certification ?? undefined,
    cost: b.cost ?? undefined,
    totalTime: b.total_time ?? undefined,
    nodes: steps.filter((s) => s.band_id === b.id).map((s) => resolveStep(s, courses)),
  }));
}

export function getRolePath(roleId: string): PathBand[] {
  ensurePathsSeeded();
  return bandsForRole(roleId);
}

export function getAllRolePaths(): Record<string, PathBand[]> {
  ensurePathsSeeded();
  const out: Record<string, PathBand[]> = {};
  for (const r of ROLES) out[r.id] = bandsForRole(r.id);
  return out;
}

// ── Write (admin) ─────────────────────────────────────────────────────────────
export function addCourseToBand(bandId: number, courseId: number): void {
  const db = getDb();
  const max = (db.prepare("SELECT COALESCE(MAX(position), -1) AS p FROM path_steps WHERE band_id = ?").get(bandId) as { p: number }).p;
  db.prepare(
    "INSERT INTO path_steps (band_id, position, course_id, elective, cert) VALUES (?, ?, ?, 1, 0)",
  ).run(bandId, max + 1, courseId);
}

export function removeStep(stepId: number): void {
  getDb().prepare("DELETE FROM path_steps WHERE id = ?").run(stepId);
}

export function toggleStepElective(stepId: number): void {
  getDb().prepare("UPDATE path_steps SET elective = CASE elective WHEN 1 THEN 0 ELSE 1 END WHERE id = ?").run(stepId);
}

// Move a step up/down within its band by swapping positions with the neighbour.
export function moveStep(stepId: number, dir: "up" | "down"): void {
  const db = getDb();
  const step = db.prepare("SELECT id, band_id, position FROM path_steps WHERE id = ?").get(stepId) as
    | { id: number; band_id: number; position: number }
    | undefined;
  if (!step) return;
  const neighbour = db
    .prepare(
      dir === "up"
        ? "SELECT id, position FROM path_steps WHERE band_id = ? AND position < ? ORDER BY position DESC LIMIT 1"
        : "SELECT id, position FROM path_steps WHERE band_id = ? AND position > ? ORDER BY position ASC LIMIT 1",
    )
    .get(step.band_id, step.position) as { id: number; position: number } | undefined;
  if (!neighbour) return;
  const swap = db.transaction(() => {
    db.prepare("UPDATE path_steps SET position = ? WHERE id = ?").run(neighbour.position, step.id);
    db.prepare("UPDATE path_steps SET position = ? WHERE id = ?").run(step.position, neighbour.id);
  });
  swap();
}

// ── Band (stage) operations ───────────────────────────────────────────────────
// A "stage" is a band. `stage` (1|2|3) is the color tier; the displayed "Stage N" is
// derived from order at render time, so bands can be added/reordered freely.
export function addBand(roleId: string, title: string, tier = 3): void {
  const db = getDb();
  const max = (db.prepare("SELECT COALESCE(MAX(position), -1) AS p FROM path_bands WHERE role_id = ?").get(roleId) as { p: number }).p;
  db.prepare(
    "INSERT INTO path_bands (role_id, position, stage, title, subtitle) VALUES (?, ?, ?, ?, NULL)",
  ).run(roleId, max + 1, tier, title.trim() || "New stage");
}

export function renameBand(bandId: number, title: string): void {
  getDb().prepare("UPDATE path_bands SET title = ? WHERE id = ?").run(title.trim() || "Untitled stage", bandId);
}

export function deleteBand(bandId: number): void {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM path_steps WHERE band_id = ?").run(bandId);
    db.prepare("DELETE FROM path_bands WHERE id = ?").run(bandId);
  });
  tx();
}

export function moveBand(bandId: number, dir: "up" | "down"): void {
  const db = getDb();
  const band = db.prepare("SELECT id, role_id, position FROM path_bands WHERE id = ?").get(bandId) as
    | { id: number; role_id: string; position: number }
    | undefined;
  if (!band) return;
  const neighbour = db
    .prepare(
      dir === "up"
        ? "SELECT id, position FROM path_bands WHERE role_id = ? AND position < ? ORDER BY position DESC LIMIT 1"
        : "SELECT id, position FROM path_bands WHERE role_id = ? AND position > ? ORDER BY position ASC LIMIT 1",
    )
    .get(band.role_id, band.position) as { id: number; position: number } | undefined;
  if (!neighbour) return;
  const swap = db.transaction(() => {
    db.prepare("UPDATE path_bands SET position = ? WHERE id = ?").run(neighbour.position, band.id);
    db.prepare("UPDATE path_bands SET position = ? WHERE id = ?").run(band.position, neighbour.id);
  });
  swap();
}

// Bands of a role, for the admin picker (which catalog courses can be added where).
export function getRoleBandsMeta(roleId: string): { id: number; title: string; stage: number }[] {
  ensurePathsSeeded();
  return getDb().prepare("SELECT id, title, stage FROM path_bands WHERE role_id = ? ORDER BY position").all(roleId) as {
    id: number; title: string; stage: number;
  }[];
}
