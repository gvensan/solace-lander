// Periodic content ingest (cron). Runs in the Node.js server runtime: an initial
// sync shortly after startup, then every INGEST_INTERVAL_MINUTES (default 6h).
// For serverless/edge hosting, point a platform scheduler at POST /api/admin/sync
// with the CRON_SECRET header instead — this in-process timer is for self-hosted/dev.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const g = globalThis as typeof globalThis & { __landerCron?: boolean };
  if (g.__landerCron) return; // avoid double-scheduling on dev HMR
  g.__landerCron = true;

  const minutes = Number(process.env.INGEST_INTERVAL_MINUTES ?? 360);
  const { ingestAll } = await import("./lib/ingest");

  const run = async () => {
    try {
      const r = await ingestAll();
      console.log(`[cron] ingest ok — blog:${r.blog} video:${r.video} resources:${r.resources} wws:${r.events} workshops:${r.workshops} events:${r.marketingEvents} academy:${r.academy}`);
    } catch (e) {
      console.error("[cron] ingest failed:", e);
    }
  };

  setTimeout(run, 5000); // initial populate after startup
  if (minutes > 0) setInterval(run, minutes * 60_000);
}
