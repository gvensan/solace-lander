# Solace Lander

A post-workshop landing hub for Solace events: a single place where attendees pick up
session replays, topic deep-dives, labs, and curated learning resources after a workshop —
and where DevRel curates that content through a built-in, role-gated admin CMS.

## Scope & Purpose

**Purpose.** After a Solace workshop or webinar, attendees get one URL that gathers everything
relevant to them — their gated session replay, slides, code repos, focus-area deep dives,
upcoming events, the latest blog posts, and self-paced Academy training — instead of a scatter
of follow-up emails and links.

**What it does:**

- **Personalized hero** — logged-in attendees see the replay(s) for workshops they attended;
  everyone else sees a generic brand hero. Replays are gated to the workshop's attendee list.
- **Per-workshop replay hubs** (`/[slug]`) — the recording (attendee-gated), slides, repo, and
  recap for a single workshop.
- **Content sections** on the home page — Focus Areas (pillars), Upcoming Webinars & Workshops,
  Library (latest blog), Training (Solace Academy), and Community.
- **Role-gated admin CMS** (`/admin`) — DevRel can edit workshops, events, pillars, library
  items, groups, marketing events, Academy courses, and learning paths from the browser.
- **Scheduled content sync** — pulls fresh data from public Solace feeds (blog, events,
  webinars/workshops, Academy catalog) on a timer and via a manual "Sync now" button.

**What it is _not_ (yet):** authentication is a **mock login** for demo purposes (pick a demo
SolaceID account; the cookie is the session). Real SolaceID OIDC is planned but not wired up.

## Tech Stack

- **Next.js 16** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4**
- **SQLite** via `better-sqlite3` (the content store; read at request time)
- **Fuse.js** for client-side search
- **lucide-react** icons
- Deployed on **Netlify** (`@netlify/plugin-nextjs`)

> ⚠️ **This is not stock Next.js.** This version has breaking changes from older Next.js
> conventions. Before writing code, read the relevant guide in `node_modules/next/dist/docs/`.

## Project Structure

```
app/
  page.tsx            Home page (hero + content sections)
  [slug]/             Per-workshop replay hub
  admin/              Role-gated CMS (workshops, events, pillars, library, …)
  api/admin/sync/     Content ingest endpoint (admin session or CRON_SECRET)
  login/
components/           UI (TopNav, Hero, ReplayGate, SectionBlocks, admin/…)
lib/
  db.ts               SQLite connection, schema, migrations, seed
  data/               Per-entity data access (workshops, events, pillars, library, …)
  ingest.ts           Sync pipeline from public Solace feeds
  session.ts          Server-side session/role resolution (cookie → DB role)
  auth.tsx            Client auth context + demo accounts
instrumentation.ts    In-process cron that runs the ingest on a timer
data/lander.db        Bundled SQLite database
```

## Running Locally

### Prerequisites

- **Node.js 20+** (developed on Node 20)
- npm

### Setup

```bash
# 1. Install dependencies (compiles better-sqlite3 native bindings)
npm install

# 2. (Optional) configure environment
cp .env.local.example .env.local
#   then edit .env.local — see Environment Variables below

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database at `data/lander.db` is created/seeded automatically on first run if missing,
and migrated to the latest schema on startup.

### Logging in (mock auth)

Use the **Log in** action in the top nav and pick a demo SolaceID account. Roles come from the
seeded `users` table:

| Account | Email | Role |
|---|---|---|
| Attendee (Dana) | `attendee@solace.com` | member |
| You (Giri) | `gvensan21@gmail.com` | member |
| Guest (no workshops) | `guest@example.com` | member |
| DevRel Admin | `admin@solace.com` | **admin** |

Sign in as **DevRel Admin** to reach `/admin`. The session is a `lander_uid` cookie; the
authoritative role is read from the DB server-side (`lib/session.ts`).

### Syncing content

Content is pulled from public Solace feeds (blog, events, webinars/workshops, Academy catalog):

- **Automatically** by the in-process cron (`instrumentation.ts`), controlled by
  `INGEST_INTERVAL_MINUTES`.
- **Manually** via the **Sync now** button in the admin, or by POSTing to the endpoint:

  ```bash
  # As an external scheduler (no admin session):
  curl -X POST http://localhost:3000/api/admin/sync -H "x-cron-key: $CRON_SECRET"
  ```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server at `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment Variables

Copy `.env.local.example` → `.env.local`. All are optional for local dev.

| Variable | Default | Purpose |
|---|---|---|
| `INGEST_INTERVAL_MINUTES` | `360` | How often the in-process cron re-ingests. `0` disables the timer. |
| `CRON_SECRET` | — | Shared secret so an external scheduler can `POST /api/admin/sync` via the `x-cron-key` header. |
| `LANDER_DB_PATH` | — | Override the SQLite file location (otherwise `./data/lander.db`, or `/tmp` on serverless). |

## Deployment

Deployed on Netlify via `@netlify/plugin-nextjs` (see `netlify.toml`). The build bundles
`data/lander.db` as the baseline content store.

> ⚠️ **Production storage caveat.** On Netlify's serverless runtime the DB is staged into a
> per-instance, ephemeral `/tmp`, so content written through the deployed admin is **not shared
> across function instances and does not survive redeploys**. Durable production content needs a
> shared persistent store (e.g. hosted libSQL/Turso or Postgres). Treat the deployed admin as
> non-durable until that's in place.
