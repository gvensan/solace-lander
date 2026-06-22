import { replaceAutoCategory } from "./data/library";
import { replaceAutoEvents } from "./data/events";
import { replaceAutoMarketingEvents } from "./data/marketing-events";
import { replaceAutoWorkshops } from "./data/workshops";
import type { LibraryItem, SolaceEvent, Workshop } from "./types";

// The events.solace.com "Webinars & Workshops" feed is the source of truth for the
// admin Workshops list too: each event becomes an auto workshop entry (no replay/attendees
// until an admin enriches it, which promotes it to source='manual').
function eventToWorkshop(e: SolaceEvent): Workshop {
  const today = new Date().toISOString().slice(0, 10);
  const loc = e.location && e.location !== "Online" ? ` · ${e.location}` : "";
  return {
    slug: e.id.replace(/^wws-/, "") || e.id,
    title: e.title,
    date: e.date,
    status: e.date >= today ? "upcoming" : "past",
    summary: `${e.type}${loc}. Register on events.solace.com — the replay lands here for attendees afterward.`,
    pillars: [],
    attendees: [],
    source: "auto",
  };
}

// Pulls fresh Blog + Videos from solace.com's WordPress API and clean-updates the DB.
// Used by the /admin "Sync now" button and the periodic cron (instrumentation.ts).

const WP = "https://solace.com/wp-json/wp/v2";
const VIDEOS_CATEGORY = 115;

function clean(html: string, max = 180): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/\[&hellip;\]|\[…\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

interface WpPost {
  id: number;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
}

async function fetchPosts(params: string): Promise<WpPost[]> {
  const url = `${WP}/posts?${params}&_fields=id,link,date,title,excerpt,categories`;
  const res = await fetch(url, {
    headers: { "User-Agent": "SolaceLander/1.0" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`WP fetch ${res.status} for ${url}`);
  return (await res.json()) as WpPost[];
}

function toItem(p: WpPost, category: string): LibraryItem {
  return {
    id: `wp-${p.id}`,
    category,
    title: clean(p.title?.rendered ?? "", 120),
    description: clean(p.excerpt?.rendered ?? ""),
    url: p.link,
    date: (p.date ?? "").slice(0, 10),
    source: "auto",
    topics: p.categories ?? [],
  };
}

// Resources (whitepapers/guides) come from the WP RSS feed for the `resource` post type
// (it has no REST endpoint). Parse the RSS without an XML dependency.
function rssTag(item: string, tag: string): string {
  const m = item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function rfcToISO(d: string): string {
  const t = Date.parse(d);
  return Number.isNaN(t) ? "" : new Date(t).toISOString().slice(0, 10);
}

async function fetchResources(limit: number): Promise<LibraryItem[]> {
  const res = await fetch("https://solace.com/feed/?post_type=resource", {
    headers: { "User-Agent": "SolaceLander/1.0" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`resource feed ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit);
  return items.map((m) => {
    const it = m[1];
    const url = rssTag(it, "link");
    return {
      id: `res-${(url.replace(/\/+$/, "").split("/").pop() || "item").slice(0, 60)}`,
      category: "resources",
      title: clean(rssTag(it, "title"), 120),
      description: "",
      url,
      date: rfcToISO(rssTag(it, "pubDate")),
      source: "auto" as const,
      topics: [],
    };
  });
}

interface WwsEvent {
  id: string;
  title: string;
  urlStub?: string;
  isPublic?: boolean;
  eventType?: string;
  typeMetadata?: { name?: string };
  schedule?: { date?: string }[];
  venue?: string | { name?: string; address?: string; isVirtual?: boolean; virtualPlatform?: string };
}

// Collapse the feed's verbose/branded event types (e.g. "Academy Workshop") into a
// clean, generic category for the badge — while keeping the Webinar/Workshop distinction.
function normalizeEventType(raw?: string): string {
  const s = (raw ?? "").toLowerCase();
  if (s.includes("webinar")) return "Webinar";
  if (s.includes("workshop")) return "Workshop";
  if (s.includes("roundtable")) return "Roundtable";
  if (s.includes("meetup")) return "Meetup";
  // Otherwise strip brand words and fall back to a sensible default.
  const cleaned = (raw ?? "").replace(/\b(solace|academy)\b/gi, "").replace(/\s+/g, " ").trim();
  return cleaned || "Workshop";
}

// Upcoming webinars & workshops from events.solace.com (Azure Functions backend).
async function fetchWebinarsWorkshops(): Promise<SolaceEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch("https://solace-erp-functions.azurewebsites.net/api/events", {
    headers: { "User-Agent": "SolaceLander/1.0" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`events.solace.com api ${res.status}`);
  const data = (await res.json()) as WwsEvent[];

  const out: SolaceEvent[] = [];
  for (const e of data) {
    if (e.isPublic === false) continue;
    const dates = (e.schedule ?? [])
      .map((s) => s?.date)
      .filter((d): d is string => !!d)
      .sort();
    if (!dates.length || dates[dates.length - 1] < today) continue; // skip fully-past
    const nextDate = dates.find((d) => d >= today) ?? dates[0];

    let location = "Online";
    const v = e.venue;
    if (typeof v === "string") location = v || "Online";
    else if (v) location = v.isVirtual ? v.virtualPlatform || "Online" : v.name || v.address || "Online";

    out.push({
      id: `wws-${e.urlStub || e.id}`,
      type: normalizeEventType(e.typeMetadata?.name || e.eventType),
      title: clean(e.title ?? "", 120),
      date: nextDate,
      location: clean(String(location), 60),
      registerUrl: e.urlStub ? `https://events.solace.com/${e.urlStub}` : "https://events.solace.com/",
      source: "auto" as const,
    });
  }
  return out;
}

interface TribeEvent {
  id: number;
  title: string;
  url: string;
  start_date: string;
  is_virtual?: boolean;
  venue?: { venue?: string; city?: string } | { venue?: string; city?: string }[];
  categories?: { name: string }[];
}

// Corporate/marketing events from solace.com's Events Calendar (The Events Calendar plugin).
async function fetchTribeEvents(limit: number): Promise<SolaceEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const url = `https://solace.com/wp-json/tribe/events/v1/events?per_page=${limit}&start_date=${today}`;
  const res = await fetch(url, { headers: { "User-Agent": "SolaceLander/1.0" }, cache: "no-store" });
  if (!res.ok) throw new Error(`tribe events ${res.status}`);
  const data = (await res.json()) as { events?: TribeEvent[] };
  return (data.events ?? []).map((e) => {
    const cats = (e.categories ?? []).map((c) => c.name);
    const isWebinar = /webinar/i.test(e.title ?? "") || cats.some((c) => /webinar/i.test(c));
    const v = Array.isArray(e.venue) ? e.venue[0] : e.venue;
    const location = v?.venue || v?.city || (e.is_virtual ? "Online" : "—");
    return {
      id: `evt-${e.id}`,
      type: isWebinar ? "Webinar" : cats[0] || "Event",
      title: clean(e.title ?? "", 120),
      date: (e.start_date ?? "").slice(0, 10),
      location: clean(String(location), 60),
      registerUrl: e.url,
      source: "auto" as const,
    };
  });
}

export async function ingestAll(): Promise<{
  blog: number;
  video: number;
  resources: number;
  events: number;
  workshops: number;
  marketingEvents: number;
  academy: number;
  at: string;
}> {
  let blog = 0;
  let video = 0;
  let resources = 0;
  let events = 0;
  let workshops = 0;
  let marketingEvents = 0;
  let academy = 0;

  // Blog + Videos via the WordPress API (fast, dated; powers pillar "latest posts").
  try {
    const posts = await fetchPosts("per_page=6&orderby=date&order=desc");
    const items = posts.map((p) => toItem(p, "blog"));
    replaceAutoCategory("blog", items);
    blog = items.length;
  } catch (e) {
    console.error("[ingest] blog failed:", e);
  }

  try {
    const posts = await fetchPosts(`categories=${VIDEOS_CATEGORY}&per_page=4&orderby=date&order=desc`);
    const items = posts.map((p) => toItem(p, "video"));
    replaceAutoCategory("video", items);
    video = items.length;
  } catch (e) {
    console.error("[ingest] video failed:", e);
  }

  // Resources (whitepapers/guides) via the WP RSS feed for the `resource` post type.
  try {
    const items = await fetchResources(6);
    replaceAutoCategory("resources", items);
    resources = items.length;
  } catch (e) {
    console.error("[ingest] resources failed:", e);
  }

  // Upcoming webinars & workshops from events.solace.com; prunes expired.
  // The same feed drives both the sidebar events list AND the admin Workshops list.
  try {
    const evs = await fetchWebinarsWorkshops();
    replaceAutoEvents(evs);
    events = evs.length;
    const wss = evs.map(eventToWorkshop);
    replaceAutoWorkshops(wss);
    workshops = wss.length;
  } catch (e) {
    console.error("[ingest] webinars/workshops failed:", e);
  }

  // Corporate/marketing events from solace.com Events Calendar (sidebar); prunes expired.
  try {
    const evs = await fetchTribeEvents(20);
    replaceAutoMarketingEvents(evs);
    marketingEvents = evs.length;
  } catch (e) {
    console.error("[ingest] marketing events failed:", e);
  }

  // Solace Academy catalog (courses + cert paths) from the public training.solace.com API.
  try {
    const { syncAcademy } = await import("./academy-sync");
    const r = await syncAcademy();
    academy = r.courses + r.paths;
  } catch (e) {
    console.error("[ingest] academy failed:", e);
  }

  return { blog, video, resources, events, workshops, marketingEvents, academy, at: new Date().toISOString() };
}
