// Pure seed data (no DB import — avoids a cycle with lib/db.ts).
// Used once to populate SQLite; thereafter the DB is the source of truth and
// content is edited via /admin.
import type { Pillar, LibraryItem, Group } from "./types";

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
    references: [
      { group: "concept", title: "What Is Event-Driven Integration?", url: "https://solace.com/what-is-event-driven-integration/" },
      { group: "concept", title: "What Are Events? / What Is Messaging?", url: "https://docs.solace.com/Get-Started/what-are-events.htm" },
      { group: "concept", title: "Understanding Topics", url: "https://docs.solace.com/Get-Started/Topics.htm" },
      { group: "concept", title: "Understanding Event Meshes", url: "https://docs.solace.com/Get-Started/Event-Mesh.htm" },
      { group: "concept", title: "Message Exchange Patterns", url: "https://docs.solace.com/Get-Started/Message-Exchange-Patterns.htm" },
      { group: "try", title: "Set Up Your First Event Broker (Step 1 of 6)", url: "https://tutorials.solace.dev/" },
      { group: "try", title: "EDA Basics & Try-Me CLI Tool (Steps 2–3)", url: "https://tutorials.solace.dev/" },
      { group: "try", title: "Pub-Sub, Request-Reply & Consumer Scaling (Steps 4–6)", url: "https://tutorials.solace.dev/" },
      { group: "cloud-trial", title: "Free PubSub+ Cloud Broker", url: "https://console.solace.cloud/login/new-account" },
    ],
  },
  {
    id: "integrations",
    number: 2,
    title: "Integrations",
    description: "Connect legacy apps, SaaS, Kafka, and clouds with Micro-Integrations.",
    icon: "Cable",
    topicCategoryId: 792, // Event-Driven Integration
    references: [
      { group: "concept", title: "What Are Micro-Integrations?", url: "https://docs.solace.com/Cloud/Microintegrations/microintegrations-overview.htm" },
      { group: "concept", title: "How Micro-Integrations Enable Event-Driven Integration", url: "https://solace.com/products/micro-integrations/" },
      { group: "try", title: "Cloud-managed Micro-Integrations (Cloud Console)", url: "https://docs.solace.com/Cloud/Microintegrations/cloud-managed-microintegrations.htm" },
      { group: "try", title: "Self-Managed Micro-Integrations", url: "https://docs.solace.com/Cloud/Microintegrations/self-managed-microintegrations.htm" },
      { group: "explore", title: "Integration Hub (catalog of all integrations)", url: "https://solace.com/integration-hub/" },
      { group: "deep-dive", title: "Integration Guides", url: "https://docs.solace.com/Cloud/Microintegrations/microintegrations-overview.htm" },
    ],
  },
  {
    id: "apis-dev-tools",
    number: 3,
    title: "APIs & Developer Tools",
    description: "SDKs, open protocols, schema registry, and the tools to build fast.",
    icon: "Code2",
    topicCategoryId: 794, // API Management
    references: [
      { group: "concept", title: "How Applications Interact with Solace (Component Maps)", url: "https://docs.solace.com/API/Component-Maps.htm" },
      { group: "deep-dive", title: "Messaging API Developer Guide", url: "https://docs.solace.com/API/Messaging-APIs/Solace-APIs-Overview.htm" },
      { group: "try", title: "Messaging API Tutorials (language-specific)", url: "https://tutorials.solace.dev/" },
      { group: "try", title: "Codelabs (step-by-step guided labs)", url: "https://codelabs.solace.dev/" },
      { group: "code", title: "SDK docs by language (Java, Python, JS, Go, .NET, …)", url: "https://docs.solace.com/API/Messaging-APIs/Solace-APIs-Overview.htm" },
      { group: "code", title: "Schema Registry", url: "https://docs.solace.com/Schema-Registry/schema-registry-overview.htm" },
      { group: "code", title: "SEMP API reference", url: "https://docs.solace.com/Admin/SEMP/Using-SEMP.htm" },
      { group: "code", title: "Solace Cloud REST APIs", url: "https://docs.solace.com/Cloud/cloud-rest-api-overview.htm" },
      { group: "tool", title: "SDKPerf (performance testing)", url: "https://docs.solace.com/API/SDKPerf/SDKPerf.htm" },
    ],
  },
  {
    id: "design-govern",
    number: 4,
    title: "Design & Govern",
    description: "Model, catalog, and govern your event-driven architecture in Event Portal.",
    icon: "PenTool",
    topicCategoryId: 790, // Event Portal
    references: [
      { group: "concept", title: "Event Portal Overview", url: "https://docs.solace.com/Cloud/Event-Portal/event-portal-overview.htm" },
      { group: "cloud-trial", title: "Event Portal Quick Start", url: "https://docs.solace.com/Cloud/Event-Portal/event-portal-tutorials.htm" },
      { group: "try", title: "AI Design Assistant (generate an example domain)", url: "https://docs.solace.com/Cloud/Event-Portal/event-portal-overview.htm" },
      { group: "watch", title: "Event Portal How-to Videos", url: "https://www.youtube.com/@SolaceDotCom" },
      { group: "deep-dive", title: "Designer tool", url: "https://docs.solace.com/Cloud/Event-Portal/get-started-designer.htm" },
      { group: "deep-dive", title: "Catalog tool", url: "https://docs.solace.com/Cloud/Event-Portal/get-started-catalog.htm" },
      { group: "deep-dive", title: "Runtime Event Manager", url: "https://docs.solace.com/Cloud/Event-Portal/event-portal-rem.htm" },
      { group: "code", title: "Event Portal REST API", url: "https://docs.solace.com/Cloud/Event-Portal/event-portal-apis.htm" },
      { group: "dashboard", title: "KPI Dashboard", url: "https://docs.solace.com/Cloud/Event-Portal/event-portal-overview.htm" },
    ],
  },
  {
    id: "operate-observe",
    number: 5,
    title: "Operate & Observe",
    description: "Monitoring, distributed tracing, and observability for production meshes.",
    icon: "Activity",
    topicCategoryId: 64, // DevOps
    references: [
      { group: "concept", title: "Insights Overview", url: "https://docs.solace.com/Cloud/Insights/insights-overview.htm" },
      { group: "watch", title: "Insights walkthrough video", url: "https://www.youtube.com/@SolaceDotCom" },
      { group: "concept", title: "Distributed Tracing Overview", url: "https://docs.solace.com/Observability/Distributed-Tracing/Distributed-Tracing-Overview.htm" },
      { group: "try", title: "Distributed Tracing Codelab (7-day demo, no product key)", url: "https://codelabs.solace.dev/" },
      { group: "code", title: "OpenTelemetry Receiver setup", url: "https://docs.solace.com/Observability/Distributed-Tracing/Configuring-Telemetry-Profile.htm" },
      { group: "deep-dive", title: "Advanced Monitoring dashboards", url: "https://docs.solace.com/Cloud/Insights/insights-overview.htm" },
      { group: "deep-dive", title: "50+ Solace Insights Monitors for Datadog", url: "https://docs.solace.com/Cloud/Insights/insights-datadog.htm" },
      { group: "deep-dive", title: "Forwarding Insights data to your own Datadog account", url: "https://docs.solace.com/Cloud/Insights/insights-datadog.htm" },
    ],
  },
  {
    id: "agentic-ai",
    number: 6,
    title: "Agentic AI",
    description: "Solace Agent Mesh — orchestrate AI agents on an event-driven backbone.",
    icon: "Bot",
    topicCategoryId: 857, // Solace Agent Mesh
    references: [
      { group: "concept", title: "Solace Agent Mesh Overview", url: "https://solace.com/products/agent-mesh/" },
      { group: "code", title: "Open Source on GitHub (SolaceLabs/solace-agent-mesh)", url: "https://github.com/SolaceLabs/solace-agent-mesh" },
      { group: "deep-dive", title: "Orchestrator documentation", url: "https://solacelabs.github.io/solace-agent-mesh/" },
      { group: "deep-dive", title: "Gateways documentation", url: "https://solacelabs.github.io/solace-agent-mesh/" },
      { group: "deep-dive", title: "Data Analysis & Management Tools", url: "https://solacelabs.github.io/solace-agent-mesh/" },
      { group: "deep-dive", title: "Agent Mesh Enterprise features", url: "https://solace.com/products/agent-mesh/" },
      { group: "try", title: "Managing Agent Meshes in Solace Cloud", url: "https://docs.solace.com/" },
    ],
  },
];

// Library starts empty — every category is populated from solace.com via Sync/cron.
export const LIBRARY_SEED: LibraryItem[] = [
];
