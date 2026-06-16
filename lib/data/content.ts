// Static reference content (stable; code-managed). Workshops, events, users,
// pillars, and library live in SQLite (lib/db.ts + lib/data/*).
// Only community links remain code-managed.
import type { CommunityLink } from "../types";

export const COMMUNITY_LINKS: CommunityLink[] = [
  {
    id: "community-solacelabs",
    label: "SolaceLabs on GitHub",
    description: "Open-source projects, samples, and SDKs from Solace — including Solace Agent Mesh.",
    url: "https://github.com/SolaceLabs",
    icon: "Github",
  },
  {
    id: "community-dev",
    label: "Solace Developer Portal",
    description: "Tutorials, codelabs, docs, and everything you need to start building on Solace.",
    url: "https://www.solace.dev/",
    icon: "Code2",
  },
  {
    id: "community-github",
    label: "Solace Community on GitHub",
    description: "Community-driven projects, tools, and integrations from the Solace community.",
    url: "https://github.com/SolaceCommunity/",
    icon: "Github",
  },
  {
    id: "community-codelabs",
    label: "Solace Codelabs",
    description: "Guided, hands-on tutorials that walk you through building on Solace step by step.",
    url: "https://codelabs.solace.dev/",
    icon: "FlaskConical",
  },
];
