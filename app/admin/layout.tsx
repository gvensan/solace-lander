import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import {
  ShieldAlert,
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Megaphone,
  Layers,
  Tags,
  BookOpen,
  BookMarked,
  Route,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/workshops", label: "Workshops", icon: GraduationCap },
  { href: "/admin/pillars", label: "Focus Areas", icon: Layers },
  { href: "/admin/groups", label: "Groups", icon: Tags },
  { href: "/admin/library", label: "Blog", icon: BookOpen },
  { href: "/admin/courses", label: "Academy Courses", icon: BookMarked },
  { href: "/admin/learning-paths", label: "Learning Paths", icon: Route },
  { href: "/admin/events", label: "Webinars & Workshops", icon: CalendarDays },
  { href: "/admin/marketing-events", label: "Events", icon: Megaphone },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Access allowed only for users granted the admin role.
  if (!user || user.role !== "admin") {
    return (
      <>
        <TopNav />
        <main className="bg-cool-12 flex flex-1 items-center justify-center px-4">
          <div className="my-24 max-w-md rounded-2xl border border-cool-13 bg-white p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-orange/10">
              <ShieldAlert className="text-orange" size={26} />
            </span>
            <h1 className="mt-4 text-2xl text-deep-blue">Admin Access Required</h1>
            <p className="mt-2 text-deep-blue/70">
              {user
                ? `You're signed in as ${user.email}, which doesn't have the admin role.`
                : "Content management is restricted to DevRel team members with the admin role."}
            </p>
            <p className="mt-4 rounded-lg bg-cool-12 px-3 py-2 text-sm text-deep-blue/60">
              Demo: log in as <strong>admin@solace.com</strong> to manage content.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-solace-green px-6 py-2.5 font-semibold text-dark-blue transition hover:brightness-105"
            >
              Back to site
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <p className="overline mb-3 text-deep-blue/40">Admin</p>
          <nav className="space-y-1">
            {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-deep-blue/80 transition hover:bg-cool-12 hover:text-deep-blue"
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
          <p className="mono-label mt-6 border-t border-cool-13 pt-4 text-deep-blue/50">
            {user.name}
          </p>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
