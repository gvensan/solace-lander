import "server-only";
import { upsertAcademy, type SyncedItem, type SyncResult } from "./data/academy";

// Syncs the Solace Academy catalog (courses + cert/learning-plan paths) from the public
// training.solace.com catalog API. No credentials required — this is the same data an
// anonymous visitor sees on "Search the Catalog". Only published items are returned by
// the API; we additionally keep only access_status === 1 with no past end date.

const BASE = "https://training.solace.com";
const UA = "SolaceLander/1.0 (+catalog-sync)";

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

type RawItem = {
  item_id: number;
  item_type: string; // 'learning_course_type' | 'learning_plan'
  item_name: string;
  item_slug?: string;
  item_price?: number; // dollars
  duration?: number; // seconds
  access_status?: number | string;
  item_date_end?: string | null;
};

function isLive(it: RawItem): boolean {
  if (Number(it.access_status) !== 1) return false;
  const end = it.item_date_end;
  if (end && end !== "0000-00-00 00:00:00") {
    const t = Date.parse(end.replace(" ", "T"));
    if (!Number.isNaN(t) && t < Date.now()) return false;
  }
  return true;
}

export async function syncAcademy(): Promise<SyncResult> {
  // 1) catalog list
  const catalogData = (await getJson("/learn/v1/catalog")) as { data?: { items?: { catalogue_id: number; catalogue_name: string }[] } };
  const catalogs = catalogData.data?.items ?? [];

  // 2) items per catalog → dedupe by id (first catalog wins for `category`)
  const byId = new Map<number, SyncedItem>();
  for (const cat of catalogs) {
    let page: { data?: { items?: RawItem[] } };
    try {
      page = (await getJson(`/learn/v1/catalog/${cat.catalogue_id}?page=1&page_size=300`)) as typeof page;
    } catch (e) {
      console.error(`[academy] catalog ${cat.catalogue_id} failed:`, e);
      continue;
    }
    for (const it of page.data?.items ?? []) {
      if (!isLive(it) || byId.has(it.item_id)) continue;
      const isPlan = it.item_type === "learning_plan";
      const slug = it.item_slug ?? "";
      byId.set(it.item_id, {
        id: it.item_id,
        type: isPlan ? "learning_plan" : "course",
        title: it.item_name,
        url: isPlan
          ? `${BASE}/learn/learning-plans/${it.item_id}/${slug}`
          : `${BASE}/learn/courses/${it.item_id}/${slug}`,
        priceUsd: Number(it.item_price) || 0,
        durationSec: Number(it.duration) || 0,
        category: cat.catalogue_name,
        planCourses: isPlan ? null : undefined,
      });
    }
  }

  // 3) for each learning plan, pull its member courses (in order) + total duration
  for (const item of byId.values()) {
    if (item.type !== "learning_plan") continue;
    try {
      const lp = (await getJson(`/learn/v1/lp/${item.id}`)) as {
        data?: { total_duration?: number; courses?: { idCourse: number; name: string }[] };
      };
      const courses = lp.data?.courses ?? [];
      item.planCourses = courses.map((c) => ({ idCourse: c.idCourse, name: c.name }));
      if (lp.data?.total_duration) item.durationSec = lp.data.total_duration;
    } catch (e) {
      console.error(`[academy] learning plan ${item.id} detail failed:`, e);
    }
  }

  return upsertAcademy([...byId.values()]);
}
