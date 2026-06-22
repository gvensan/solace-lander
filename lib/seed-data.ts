// Pure seed data (no DB import — avoids a cycle with lib/db.ts).
// Used once to populate SQLite; thereafter the DB is the source of truth and
// content is edited via /admin.
import type { Pillar, LibraryItem, Group, Reference } from "./types";
import pillarReferences from "./data/pillar-references.json";

// Curated reference lists per focus area (a.k.a. "pillar"), kept in one JSON file so the
// seed and the one-time live updater (scripts/reseed-pillars.cjs) share a single source.
const REFS = pillarReferences as Record<string, Reference[]>;

// Reference groups (categories). Editable in /admin/groups after seeding.
export const GROUPS_SEED: Group[] = [
  { id: "concept", label: "Concept", icon: "📖", sortOrder: 0 },
  { id: "deep-dive", label: "Deep Dive", icon: "📚", sortOrder: 1 },
  { id: "try", label: "Try It", icon: "🛠️", sortOrder: 2 },
  { id: "cloud-trial", label: "Try in Cloud", icon: "🚀", sortOrder: 3 },
  { id: "code", label: "Code", icon: "🔧", sortOrder: 4 },
  { id: "tool", label: "Tool", icon: "⚙️", sortOrder: 5 },
  { id: "watch", label: "Watch", icon: "🎥", sortOrder: 6 },
  { id: "explore", label: "Explore", icon: "🔍", sortOrder: 7 },
  { id: "dashboard", label: "Dashboard", icon: "📊", sortOrder: 8 },
];

export const PILLARS_SEED: Pillar[] = [
  {
    id: "event-mesh",
    number: 1,
    title: "The Event Mesh",
    description: "Events, brokers, topics, and the mesh that moves them in real time.",
    icon: "Network",
    topicCategoryId: 53, // Products & Technology
    references: REFS["event-mesh"],
  },
  {
    id: "integrations",
    number: 2,
    title: "Integrations",
    description: "Connect legacy apps, SaaS, Kafka, and clouds with Micro-Integrations.",
    icon: "Cable",
    topicCategoryId: 792, // Event-Driven Integration
    references: REFS["integrations"],
  },
  {
    id: "apis-dev-tools",
    number: 3,
    title: "APIs & Developer Tools",
    description: "SDKs, open protocols, schema registry, and the tools to build fast.",
    icon: "Code2",
    topicCategoryId: 794, // API Management
    references: REFS["apis-dev-tools"],
  },
  {
    id: "design-govern",
    number: 4,
    title: "Design & Govern",
    description: "Model, catalog, and govern your event-driven architecture in Event Portal.",
    icon: "PenTool",
    topicCategoryId: 790, // Event Portal
    references: REFS["design-govern"],
  },
  {
    id: "operate-observe",
    number: 5,
    title: "Operate & Observe",
    description: "Monitoring, distributed tracing, and observability for production meshes.",
    icon: "Activity",
    topicCategoryId: 64, // DevOps
    references: REFS["operate-observe"],
  },
  {
    id: "agentic-ai",
    number: 6,
    title: "Agentic AI",
    description: "Solace Agent Mesh — orchestrate AI agents on an event-driven backbone.",
    icon: "Bot",
    topicCategoryId: 857, // Solace Agent Mesh
    references: REFS["agentic-ai"],
  },
];

// Library starts empty — every category is populated from solace.com via Sync/cron.
export const LIBRARY_SEED: LibraryItem[] = [
];
