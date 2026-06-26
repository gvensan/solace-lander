// Periodic content ingest (cron) — LOCAL/SELF-HOSTED ONLY. Runs an initial sync shortly
// after startup, then every INGEST_INTERVAL_MINUTES (default 6h).
//
// Deliberately inert on serverless (Netlify/Lambda): there is no long-lived process, so
// the interval never fires, and the opportunistic cold-start run would only mutate that
// instance's ephemeral /tmp DB — producing per-instance content divergence. Production
// content is refreshed manually: run the dev server locally, hit the admin "Sync now"
// button (which checkpoints the DB), commit data/lander.db, and redeploy.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const serverless = !!(
    process.env.NETLIFY ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );
  if (serverless) return;

  const g = globalThis as typeof globalThis & { __landerCron?: boolean };
  if (g.__landerCron) return; // avoid double-scheduling on dev HMR
  g.__landerCron = true;

  const minutes = Number(process.env.INGEST_INTERVAL_MINUTES ?? 360);
  const { ingestAll } = await import("./lib/ingest");

  const run = async () => {
    try {
      const r = await ingestAll();
      console.log(`[cron] ingest ok — blog:${r.blog} wws:${r.events} workshops:${r.workshops} events:${r.marketingEvents} academy:${r.academy}`);
    } catch (e) {
      console.error("[cron] ingest failed:", e);
    }
  };

  setTimeout(run, 5000); // initial populate after startup
  if (minutes > 0) setInterval(run, minutes * 60_000);
}
