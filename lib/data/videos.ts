import "server-only";

// Latest videos for the sidebar are pulled live from the Solace YouTube channel's
// public RSS feed (no API key needed). The feed is newest-first. Results are cached
// in-memory with a TTL so we hit YouTube at most once per TTL window regardless of
// traffic, and we degrade gracefully (serve stale, or nothing) if the feed is down —
// videos must never break the page.

export type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
};

const CHANNEL_ID = "UCTrQXiDja9ORRofjdbHuM0A"; // @Solacedotcom
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
export const CHANNEL_VIDEOS_URL = "https://www.youtube.com/@Solacedotcom/videos";

const TTL_MS = 60 * 60 * 1000; // 1 hour
let cache: { at: number; videos: Video[] } | null = null;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function parseFeed(xml: string): Video[] {
  const videos: Video[] = [];
  // Parse per <entry> so the channel-level <title> (outside entries) is ignored.
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const rawTitle = entry.match(/<title>([^<]*)<\/title>/)?.[1];
    if (!id || !rawTitle) continue;
    videos.push({
      id,
      title: decodeEntities(rawTitle),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  return videos;
}

export async function getLatestVideos(count = 2): Promise<Video[]> {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return cache.videos.slice(0, count);
  }
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`YouTube feed responded ${res.status}`);
    const videos = parseFeed(await res.text());
    if (videos.length > 0) cache = { at: Date.now(), videos };
    return (cache?.videos ?? videos).slice(0, count);
  } catch {
    // Serve stale cache if we have it; otherwise the sidebar simply omits the tile.
    return cache?.videos.slice(0, count) ?? [];
  }
}
