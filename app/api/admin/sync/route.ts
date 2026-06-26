import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/session";
import { ingestAll } from "@/lib/ingest";
import { checkpointDb } from "@/lib/db";

// Triggers a clean-and-update ingest. Allowed for: an admin session (the Sync button),
// or a request carrying the CRON_SECRET (a platform scheduler calling this endpoint).
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const headerKey = req.headers.get("x-cron-key");
  const authorized = (secret && headerKey === secret) || (await isAdmin());
  if (!authorized) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const result = await ingestAll();
  checkpointDb(); // fold the WAL into lander.db so the committed/deployed file is complete
  revalidatePath("/", "layout"); // home + every /[slug] page (Hero replays, events)
  revalidatePath("/admin/library");
  revalidatePath("/admin/workshops");
  revalidatePath("/admin/events");
  return NextResponse.json({ ok: true, ...result });
}
