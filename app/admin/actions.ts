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
import { createPillar, updatePillar, deletePillar } from "@/lib/data/pillars";
import { createLibraryItem, updateLibraryItem, deleteLibraryItem } from "@/lib/data/library";
import { createGroup, updateGroup, deleteGroup } from "@/lib/data/groups";
import type { Workshop, SolaceEvent, Pillar, LibraryItem, Group } from "@/lib/types";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Forbidden: admin role required");
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
        const [group, title, url] = l.split("|").map((s) => s.trim());
        return { group: group ?? "", title: title ?? "", url: url ?? "" };
      })
      .filter((r) => r.title && r.url),
  };
}

export async function savePillar(origId: string | null, fd: FormData) {
  await requireAdmin();
  const p = parsePillar(fd);
  if (origId) updatePillar(origId, p);
  else createPillar(p);
  revalidatePath("/");
  revalidatePath("/admin/pillars");
  redirect("/admin/pillars");
}

export async function removePillar(id: string) {
  await requireAdmin();
  deletePillar(id);
  revalidatePath("/");
  revalidatePath("/admin/pillars");
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
