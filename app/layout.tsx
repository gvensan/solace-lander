import type { Metadata } from "next";
import { Figtree, Space_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ConsentAnalytics } from "@/components/ConsentAnalytics";

// Figtree — body, buttons, labels, secondary headings (Solace brand)
const figtree = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Space Mono — overlines, code snippets, UI labels (Solace brand, <=16pt)
const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Fraunces — free stand-in for "New Spirit" (H1/H2 headlines, title case).
// Swap to the licensed New Spirit font file when available; only --font-heading changes.
const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${figtree.variable} ${spaceMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-deep-blue font-body">
        <AuthProvider>{children}</AuthProvider>
        <ConsentAnalytics />
      </body>
    </html>
  );
}
