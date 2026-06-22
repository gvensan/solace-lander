import type { Metadata } from "next";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { LearningPathExplorer } from "@/components/LearningPathExplorer";
import { getAllRolePaths, ROLES } from "@/lib/data/path-builder";
import { getCourses, formatDuration } from "@/lib/data/academy";
import type { CatalogCourse } from "@/lib/data/learning-paths";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Find Your Learning Path — Solace Lander",
  description:
    "Pick your role and follow a guided path of Solace Academy courses and certifications — from universal foundations to role-based, goal-oriented tracks.",
};

// DB-backed: course metadata + per-role sequences come from the synced catalog and the
// admin path-builder; rendered identically to before.
export const dynamic = "force-dynamic";

export default function LearningPathPage() {
  const rolePaths = getAllRolePaths();
  const catalog: CatalogCourse[] = getCourses().map((c) => ({
    title: c.title,
    url: c.url,
    price: c.priceUsd > 0 ? `$${c.priceUsd}` : "FREE",
    duration: formatDuration(c.durationSec),
    category: c.category,
  }));

  return (
    <>
      <TopNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-solace-blue text-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <Link href="/#training" className="mono-label inline-flex items-center gap-1 text-white/80 hover:text-white hover:underline">
              <ArrowLeft size={14} /> Back to Training
            </Link>
            <p className="overline mt-4 text-eyebrow">Solace Academy</p>
            <h1 className="mt-2 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">Find Your Learning Path</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/80">
              Tell us your role and we&apos;ll chart the courses and certifications to get you there —
              starting with universal foundations, then a goal-oriented track built for you.
            </p>
          </div>
        </section>

        {/* Explorer */}
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <LearningPathExplorer roles={ROLES} rolePaths={rolePaths} catalog={catalog} />
        </section>
      </main>
      <Footer />
    </>
  );
}
