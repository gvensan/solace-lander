import Link from "next/link";
import { getWorkshops } from "@/lib/data/workshops";
import { getEvents } from "@/lib/data/events";
import { getMarketingEvents } from "@/lib/data/marketing-events";
import { getPillars } from "@/lib/data/pillars";
import { getGroups } from "@/lib/data/groups";
import { getLibraryItems } from "@/lib/data/library";
import { academyCounts } from "@/lib/data/academy";
import { ROLES } from "@/lib/data/learning-paths";
import {
  GraduationCap,
  CalendarDays,
  Layers,
  Tags,
  BookOpen,
  BookMarked,
  Route,
  Megaphone,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const academy = academyCounts();
  const cards = [
    { href: "/admin/workshops", label: "Workshops", value: getWorkshops().length, icon: GraduationCap, sub: "Replays, attendees, links" },
    { href: "/admin/pillars", label: "Focus Areas", value: getPillars().length, icon: Layers, sub: "Topics & references" },
    { href: "/admin/groups", label: "Groups", value: getGroups().length, icon: Tags, sub: "Reference categories" },
    { href: "/admin/library", label: "Library", value: getLibraryItems().length, icon: BookOpen, sub: "Videos & blogs" },
    { href: "/admin/courses", label: "Academy Courses", value: academy.courses + academy.paths, icon: BookMarked, sub: `Synced catalog${academy.newItems ? ` · ${academy.newItems} new` : ""}` },
    { href: "/admin/learning-paths", label: "Learning Paths", value: ROLES.length, icon: Route, sub: "Per-role course sequences" },
    { href: "/admin/events", label: "Webinars & Workshops", value: getEvents().length, icon: CalendarDays, sub: "Synced from events.solace.com" },
    { href: "/admin/marketing-events", label: "Events", value: getMarketingEvents().length, icon: Megaphone, sub: "Synced from solace.com (sidebar)" },
  ];

  return (
    <div>
      <p className="overline text-classic-green">Content Management</p>
      <h1 className="mt-1 text-3xl text-deep-blue">Dashboard</h1>
      <p className="mt-2 text-deep-blue/70">Manage the content that powers the Solace Lander hub.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, value, icon: Icon, sub }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-cool-13 bg-white p-5 transition hover:border-classic-green hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-deep-blue/5 text-deep-blue group-hover:bg-classic-green/10 group-hover:text-classic-green">
                <Icon size={20} />
              </span>
              <span className="text-3xl font-semibold text-deep-blue">{value}</span>
            </div>
            <h2 className="mt-3 text-lg text-deep-blue">{label}</h2>
            <p className="text-sm text-deep-blue/60">{sub}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-classic-green">
              Manage <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-cool-13 bg-cool-12 p-4 text-sm text-deep-blue/70">
        <strong className="text-deep-blue">Note:</strong> Community links remain code-managed. All
        other content is editable here and reflected live on the hub.
      </div>
    </div>
  );
}
