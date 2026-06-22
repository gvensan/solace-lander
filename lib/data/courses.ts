// Training section tiles, mirroring the "Get Ahead of the Curve" boxes on
// https://training.solace.com/learn (boxes 1, 2 & 4). Box 3 — "Role-Based Learning
// Paths" — is surfaced as the section's primary CTA instead of a tile.
// Tiles are informational (no per-tile link); only the CTA navigates.

export type TrainingTile = {
  title: string;
  icon: string; // maps to components/Icon.tsx
  points: string[];
};

// Role-based learning paths — our in-app guided page that collates Solace Academy
// courses + certifications into a role/goal-oriented path.
export const LEARNING_PATHS_URL = "/learning-path";

export const TRAINING_TILES: TrainingTile[] = [
  {
    title: "Get Started for Free",
    icon: "Rocket",
    points: [
      "Learn the Solace essentials with hands-on activity guides and code labs",
      "Take the Solace Certified Solutions Consultant Exam",
      "Additional free intro-level courses",
    ],
  },
  {
    title: "Digital Badges",
    icon: "BadgeCheck",
    points: [
      "Earn digital badges by passing certification exams or attending an instructor-led classroom",
      "Display earned badges on your LinkedIn profile",
      "Gain credibility with clients and peers",
    ],
  },
  {
    title: "Stay Solace Smart",
    icon: "Sparkles",
    points: [
      "Get access to new and future courses through our learning subscription",
      "Stay up to date with product updates and advanced feature-specific courses",
    ],
  },
];
