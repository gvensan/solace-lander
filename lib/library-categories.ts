// Library resource categories. Blog only for now — sourced from solace.com's WordPress
// REST API (/wp/v2/posts), so a single Sync (button or cron) repopulates it with the
// latest posts. Videos + Resources/whitepapers are intentionally omitted for now.
// `moreUrl` is the "More" link target (canonical solace.com index for the type).
export interface LibraryCategory {
  id: string;
  label: string;
  icon: string; // lucide icon name (see components/Icon.tsx)
  moreUrl: string;
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: "blog", label: "Blog", icon: "FileText", moreUrl: "https://solace.com/blog/" },
];

export function libraryCategory(id: string): LibraryCategory | undefined {
  return LIBRARY_CATEGORIES.find((c) => c.id === id);
}

// The "More" link target for a category (canonical solace.com index).
export function categoryMoreUrl(cat: LibraryCategory): string {
  return cat.moreUrl;
}
