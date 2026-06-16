// Shared content types for Solace Lander.
// Content is GLOBAL (shared across all workshop pages) per v1 decisions.
// Mock data now; SQLite-backed later behind the same shapes.

// A reference group (managed via /admin/groups) — the category references are
// organized under (e.g. Concept, Try It, Code). Replaces the old hard-coded taxonomy.
export interface Group {
  id: string;
  label: string;
  icon: string; // emoji (editable in admin)
  sortOrder: number;
}

export interface Reference {
  group: string; // Group id
  title: string;
  url: string;
}

export interface PillarPost {
  title: string;
  url: string;
  date: string;
}

export interface Pillar {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string; // lucide icon name
  references: Reference[];
  topicCategoryId?: number; // solace.com WP category id for auto "latest posts"
  latestPosts?: PillarPost[]; // computed at read time from ingested posts
}

export interface Workshop {
  slug: string;
  title: string;
  date: string; // ISO date
  status: "upcoming" | "past";
  summary: string;
  pillars: string[]; // pillar ids this workshop emphasized (for filter/search)
  repoUrl?: string;
  slidesUrl?: string;
  videoId?: string; // YouTube id for the (gated) replay
  attendees: string[]; // emails matched to SolaceID at login (mock)
}

export interface LibraryItem {
  id: string;
  category: string; // library category id (blog, video, webinar, whitepaper, analyst-report)
  title: string;
  description: string;
  url: string;
  date: string; // ISO date for "latest" ordering
  source: "auto" | "manual"; // auto = ingested from solace.com; manual = curated in admin
  topics: number[]; // solace.com WP category ids (for pillar-aligned matching)
  videoId?: string;
}

export interface SolaceEvent {
  id: string;
  type: string; // category label (e.g. "Webinar", "Roundtable", "Conference")
  title: string;
  date: string; // ISO date (start)
  location: string;
  registerUrl: string;
  source: "auto" | "manual"; // auto = synced from solace.com Events Calendar
}

export interface CommunityLink {
  id: string;
  label: string;
  description: string;
  url: string;
  icon: string; // lucide icon name
}
