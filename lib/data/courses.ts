// Training courses for the "Training" section, modeled on the "Get ahead of the curve"
// shelf at https://training.solace.com/learn. That shelf's exact tiles are served from an
// auth-gated Docebo LMS (not publicly scrapable), so these are representative Solace
// learning tracks. Update titles/links here as the catalog changes — all links open the
// Solace Academy.

export type Course = {
  title: string;
  level: string;
  description: string;
  href: string;
  icon: string; // maps to components/Icon.tsx
};

export const COURSES_URL = "https://training.solace.com/learn";

export const COURSES: Course[] = [
  {
    title: "Fundamentals of Event-Driven Architecture",
    level: "Beginner",
    description: "Start here — the core concepts behind events, brokers, and event-driven systems.",
    href: COURSES_URL,
    icon: "Lightbulb",
  },
  {
    title: "PubSub+ for Developers",
    level: "Developer",
    description: "Hands-on labs for publishing, subscribing, and building apps on Solace PubSub+.",
    href: COURSES_URL,
    icon: "Code2",
  },
  {
    title: "Designing an Event Mesh",
    level: "Architect",
    description: "Topic taxonomy, event portal, and patterns for architecting a production event mesh.",
    href: COURSES_URL,
    icon: "Network",
  },
  {
    title: "Solace Certification",
    level: "All levels",
    description: "Validate your skills and show off your expertise with an official Solace credential.",
    href: COURSES_URL,
    icon: "Trophy",
  },
];
