import "server-only";
import { getDb } from "../db";
import type { Group } from "../types";

export function getGroups(): Group[] {
  return getDb().prepare("SELECT * FROM groups ORDER BY sortOrder ASC, label ASC").all() as Group[];
}

export function getGroup(id: string): Group | undefined {
  return getDb().prepare("SELECT * FROM groups WHERE id = ?").get(id) as Group | undefined;
}

export function createGroup(g: Group): void {
  getDb()
    .prepare("INSERT INTO groups (id, label, icon, sortOrder) VALUES (@id, @label, @icon, @sortOrder)")
    .run(g);
}

export function updateGroup(id: string, g: Group): void {
  getDb()
    .prepare("UPDATE groups SET label=@label, icon=@icon, sortOrder=@sortOrder WHERE id=@origId")
    .run({ ...g, origId: id });
}

export function deleteGroup(id: string): void {
  getDb().prepare("DELETE FROM groups WHERE id = ?").run(id);
}
