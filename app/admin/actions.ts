"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/session";
import { createWorkshop, updateWorkshop, deleteWorkshop } from "@/lib/data/workshops";
import { createEvent, updateEvent, deleteEvent } from "@/lib/data/events";
import {
  createMarketingEvent,
  updateMarketingEvent,
  deleteMarketingEvent,
} from "@/lib/data/marketing-events";
import { createPillar, updatePillar, deletePillar, getPillar } from "@/lib/data/pillars";
import type { Reference } from "@/lib/types";
import { createLibraryItem, updateLibraryItem, deleteLibraryItem } from "@/lib/data/library";
import { createGroup, updateGroup, deleteGroup } from "@/lib/data/groups";
import { markReviewed, markAllReviewed } from "@/lib/data/academy";
import type { Workshop, SolaceEvent, Pillar, LibraryItem, Group } from "@/lib/types";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Forbidden: admin role required");
}

// ---- Academy catalog sync (courses + cert paths) ----
export async function syncAcademyCatalog() {
  await requireAdmin();
  const { syncAcademy } = await import("@/lib/academy-sync");
  await syncAcademy();
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
}

export async function reviewCourse(id: number) {
  await requireAdmin();
  markReviewed(id);
  revalidatePath("/admin/courses");
}

export async function reviewAllCourses() {
  await requireAdmin();
  markAllReviewed();
  revalidatePath("/admin/courses");
}

// ---- Learning-path builder (per-role course sequences) ----
function revalidatePaths() {
  revalidatePath("/admin/learning-paths");
  revalidatePath("/learning-path");
}

export async function pbAddCourse(bandId: number, courseId: number) {
  await requireAdmin();
  const { addCourseToBand } = await import("@/lib/data/path-builder");
  addCourseToBand(bandId, courseId);
  revalidatePaths();
}

export async function pbRemoveStep(stepId: number) {
  await requireAdmin();
  const { removeStep } = await import("@/lib/data/path-builder");
  removeStep(stepId);
  revalidatePaths();
}

export async function pbMoveStep(stepId: number, dir: "up" | "down") {
  await requireAdmin();
  const { moveStep } = await import("@/lib/data/path-builder");
  moveStep(stepId, dir);
  revalidatePaths();
}

export async function pbToggleElective(stepId: number) {
  await requireAdmin();
  const { toggleStepElective } = await import("@/lib/data/path-builder");
  toggleStepElective(stepId);
  revalidatePaths();
}

export async function pbAddBand(roleId: string, title: string, tier: number) {
  await requireAdmin();
  const { addBand } = await import("@/lib/data/path-builder");
  addBand(roleId, title, tier);
  revalidatePaths();
}

export async function pbRenameBand(bandId: number, title: string) {
  await requireAdmin();
  const { renameBand } = await import("@/lib/data/path-builder");
  renameBand(bandId, title);
  revalidatePaths();
}

export async function pbMoveBand(bandId: number, dir: "up" | "down") {
  await requireAdmin();
  const { moveBand } = await import("@/lib/data/path-builder");
  moveBand(bandId, dir);
  revalidatePaths();
}

export async function pbDeleteBand(bandId: number) {
  await requireAdmin();
  const { deleteBand } = await import("@/lib/data/path-builder");
  deleteBand(bandId);
  revalidatePaths();
}

function str(fd: FormData, key: string): string {
  return ((fd.get(key) as string) ?? "").trim();
}
function list(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
// Newline-only split (values may contain commas, e.g. key concepts / reference titles).
function lines(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseWorkshop(fd: FormData): Workshop {
  return {
    slug: str(fd, "slug"),
    title: str(fd, "title"),
    date: str(fd, "date"),
    status: (str(fd, "status") as Workshop["status"]) || "past",
    summary: str(fd, "summary"),
    pillars: list(fd, "pillars"),
    repoUrl: str(fd, "repoUrl") || undefined,
    slidesUrl: str(fd, "slidesUrl") || undefined,
    videoId: str(fd, "videoId") || undefined,
    attendees: list(fd, "attendees"),
    // Any admin edit claims the workshop as manual, so the next feed sync won't overwrite it.
    source: "manual",
  };
}

export async function saveWorkshop(origSlug: string | null, fd: FormData) {
  await requireAdmin();
  const w = parseWorkshop(fd);
  if (origSlug) updateWorkshop(origSlug, w);
  else createWorkshop(w);
  revalidatePath("/");
  revalidatePath(`/${w.slug}`);
  revalidatePath("/admin/workshops");
  redirect("/admin/workshops");
}

export async function removeWorkshop(slug: string) {
  await requireAdmin();
  deleteWorkshop(slug);
  revalidatePath("/");
  revalidatePath("/admin/workshops");
}

function parseEvent(fd: FormData): SolaceEvent {
  return {
    id: str(fd, "id"),
    type: str(fd, "type") || "Event",
    title: str(fd, "title"),
    date: str(fd, "date"),
    location: str(fd, "location"),
    registerUrl: str(fd, "registerUrl"),
    source: (str(fd, "source") as SolaceEvent["source"]) || "manual",
  };
}

export async function saveEvent(origId: string | null, fd: FormData) {
  await requireAdmin();
  const e = parseEvent(fd);
  if (origId) updateEvent(origId, e);
  else createEvent(e);
  revalidatePath("/");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function removeEvent(id: string) {
  await requireAdmin();
  deleteEvent(id);
  revalidatePath("/");
  revalidatePath("/admin/events");
}

// ---- Marketing / corporate Events (solace.com → sidebar) ----
export async function saveMarketingEvent(origId: string | null, fd: FormData) {
  await requireAdmin();
  const e = parseEvent(fd);
  if (origId) updateMarketingEvent(origId, e);
  else createMarketingEvent(e);
  revalidatePath("/");
  revalidatePath("/admin/marketing-events");
  redirect("/admin/marketing-events");
}

export async function removeMarketingEvent(id: string) {
  await requireAdmin();
  deleteMarketingEvent(id);
  revalidatePath("/");
  revalidatePath("/admin/marketing-events");
}

// ---- Pillars ----
function parsePillar(fd: FormData): Pillar {
  return {
    id: str(fd, "id"),
    number: parseInt(str(fd, "number") || "0", 10),
    title: str(fd, "title"),
    description: str(fd, "description"),
    icon: str(fd, "icon") || "Network",
    topicCategoryId: str(fd, "topicCategoryId") ? Number(str(fd, "topicCategoryId")) : undefined,
    references: lines(fd, "references")
      .map((l) => {
        const [group, title, url, sel] = l.split("|").map((s) => s.trim());
        return { group: group ?? "", title: title ?? "", url: url ?? "", selected: sel !== "0" };
      })
      .filter((r) => r.title && r.url),
  };
}

export async function savePillar(origId: string | null, fd: FormData) {
  await requireAdmin();
  const p = parsePillar(fd);
  if (origId) updatePillar(origId, p);
  else createPillar(p);
  // Layout-level: busts the client router cache for the home AND every workshop page
  // (both render focus-area references), so edits show without a manual refresh.
  revalidatePath("/", "layout");
  revalidatePath("/admin/pillars");
  redirect("/admin/pillars");
}

export async function removePillar(id: string) {
  await requireAdmin();
  deletePillar(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/pillars");
}

// Persist just the references array for an existing focus area, immediately
// (used by the show/hide eye toggle so curation sticks without a full Save).
export async function savePillarReferences(pillarId: string, references: Reference[]) {
  await requireAdmin();
  const existing = getPillar(pillarId);
  if (!existing) return;
  updatePillar(pillarId, { ...existing, references });
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pillars/${pillarId}/edit`);
}

// ---- Library ----
function parseLibrary(fd: FormData): LibraryItem {
  return {
    id: str(fd, "id"),
    category: str(fd, "category") || "blog",
    title: str(fd, "title"),
    description: str(fd, "description"),
    url: str(fd, "url"),
    date: str(fd, "date"),
    source: (str(fd, "source") as LibraryItem["source"]) || "manual",
    topics: list(fd, "topics")
      .map((s) => Number(s))
      .filter((n) => !Number.isNaN(n)),
    videoId: str(fd, "videoId") || undefined,
  };
}

export async function saveLibraryItem(origId: string | null, fd: FormData) {
  await requireAdmin();
  const i = parseLibrary(fd);
  if (origId) updateLibraryItem(origId, i);
  else createLibraryItem(i);
  revalidatePath("/");
  revalidatePath("/admin/library");
  redirect("/admin/library");
}

export async function removeLibraryItem(id: string) {
  await requireAdmin();
  deleteLibraryItem(id);
  revalidatePath("/");
  revalidatePath("/admin/library");
}

// ---- Groups (reference categories) ----
function parseGroup(fd: FormData): Group {
  return {
    id: str(fd, "id"),
    label: str(fd, "label"),
    icon: str(fd, "icon") || "🔗",
    sortOrder: parseInt(str(fd, "sortOrder") || "0", 10),
  };
}

export async function saveGroup(origId: string | null, fd: FormData) {
  await requireAdmin();
  const g = parseGroup(fd);
  if (origId) updateGroup(origId, g);
  else createGroup(g);
  revalidatePath("/");
  revalidatePath("/admin/groups");
  redirect("/admin/groups");
}

export async function removeGroup(id: string) {
  await requireAdmin();
  deleteGroup(id);
  revalidatePath("/");
  revalidatePath("/admin/groups");
}
