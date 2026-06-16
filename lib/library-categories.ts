// Library resource categories — all sourced from solace.com's WordPress feeds, so a
// single Sync (button or cron) repopulates every category with the latest items.
//   blog      → /wp/v2/posts
//   video     → /wp/v2/posts?categories=115
//   resources → /feed/?post_type=resource  (whitepapers/guides; mixed — solace.com
//               exposes no per-type API/feed, so these can't be split by type)
// `contentType` builds the "More" link (type-filtered solace.com URL; "" = all).
export interface LibraryCategory {
  id: string;
  label: string;
  icon: string; // lucide icon name (see components/Icon.tsx)
  contentType: string;
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: "blog", label: "Blog", icon: "FileText", contentType: "Blog Post" },
  { id: "video", label: "Videos", icon: "PlayCircle", contentType: "Video" },
  { id: "resources", label: "Whitepapers & Guides", icon: "ScrollText", contentType: "" },
];

export function libraryCategory(id: string): LibraryCategory | undefined {
  return LIBRARY_CATEGORIES.find((c) => c.id === id);
}

// Constructed solace.com Resource Library URL (the "More" link), type-filtered when set.
export function categoryMoreUrl(cat: LibraryCategory): string {
  const base = "https://solace.com/resources/home/?page=1";
  return cat.contentType ? `${base}&content_types=${cat.contentType.replace(/ /g, "+")}` : base;
}
