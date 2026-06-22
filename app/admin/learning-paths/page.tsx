import { getAllRolePaths, ROLES } from "@/lib/data/path-builder";
import { getCourses } from "@/lib/data/academy";
import { PathBuilder } from "@/components/admin/PathBuilder";

export const dynamic = "force-dynamic";

export default function AdminLearningPaths() {
  const rolePaths = getAllRolePaths();
  const catalog = getCourses();

  return (
    <div>
      <div className="max-w-2xl">
        <p className="overline text-deep-blue">Solace Academy</p>
        <h1 className="mt-1 text-3xl text-deep-blue">Learning Path Builder</h1>
        <p className="mt-1 text-sm text-deep-blue/60">
          Design each role&apos;s course sequence — add, remove, reorder, and mark courses optional.
          Seeded from today&apos;s curated paths; course details come from the synced catalog.
        </p>
      </div>

      <div className="mt-8">
        <PathBuilder roles={ROLES} rolePaths={rolePaths} catalog={catalog} />
      </div>
    </div>
  );
}
