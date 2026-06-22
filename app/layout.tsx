import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

// Brand fonts are served from the Solace Adobe Typekit kit (loaded via <link> below):
//   New Spirit (headlines), Figtree (body/UI), Space Mono (overlines/labels).
// Family names + weights are wired through CSS variables in globals.css.
const TYPEKIT_CSS = "https://use.typekit.net/oxa1jxb.css";

export const metadata: Metadata = {
  title: "Solace Lander — Post-Workshop Hub",
  description:
    "Everything from the workshop in one place: replays, topic deep-dives, labs, and learning resources for the real-time, event-driven, agentic world.",
  openGraph: {
    title: "Solace Lander — Post-Workshop Hub",
    description:
      "Replays, topic deep-dives, hands-on labs, and learning resources for the real-time, event-driven, agentic world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Solace brand fonts — Adobe Typekit (New Spirit, Figtree, Space Mono) */}
        <link rel="stylesheet" href={TYPEKIT_CSS} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-deep-blue font-body">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
