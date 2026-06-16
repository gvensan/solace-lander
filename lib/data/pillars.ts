import "server-only";
import { getDb } from "../db";
import { getLatestPostsByTopic } from "./library";
import type { Pillar } from "../types";

interface PillarRow {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  refs: string;
  topicCategoryId: number | null;
}

function toPillar(row: PillarRow): Pillar {
  const topicCategoryId = row.topicCategoryId ?? undefined;
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    description: row.description,
    icon: row.icon,
    references: JSON.parse(row.refs),
    topicCategoryId,
    latestPosts: topicCategoryId ? getLatestPostsByTopic(topicCategoryId, 2) : [],
  };
}

function serialize(p: Pillar) {
  return {
    id: p.id,
    number: p.number,
    title: p.title,
    description: p.description,
    icon: p.icon,
    refs: JSON.stringify(p.references),
    topicCategoryId: p.topicCategoryId ?? null,
  };
}

export function getPillars(): Pillar[] {
  const rows = getDb().prepare("SELECT * FROM pillars ORDER BY number ASC").all() as PillarRow[];
  return rows.map(toPillar);
}

export function getPillar(id: string): Pillar | undefined {
  const row = getDb().prepare("SELECT * FROM pillars WHERE id = ?").get(id) as PillarRow | undefined;
  return row ? toPillar(row) : undefined;
}

export function createPillar(p: Pillar): void {
  getDb()
    .prepare(
      `INSERT INTO pillars (id, number, title, description, icon, refs, topicCategoryId)
       VALUES (@id, @number, @title, @description, @icon, @refs, @topicCategoryId)`,
    )
    .run(serialize(p));
}

export function updatePillar(id: string, p: Pillar): void {
  getDb()
    .prepare(
      `UPDATE pillars SET number=@number, title=@title, description=@description,
       icon=@icon, refs=@refs, topicCategoryId=@topicCategoryId WHERE id=@origId`,
    )
    .run({ ...serialize(p), origId: id });
}

export function deletePillar(id: string): void {
  getDb().prepare("DELETE FROM pillars WHERE id = ?").run(id);
}
