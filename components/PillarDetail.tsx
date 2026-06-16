import type { Pillar, Reference, Group } from "@/lib/types";
import { ArrowUpRight, Rss } from "lucide-react";

function fmt(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Group references by their group id, ordered by the group's sortOrder; items
// within a group keep their stored order. Unknown groups fall back gracefully.
function groupReferences(refs: Reference[], groups: Group[]) {
  const byId = new Map(groups.map((g) => [g.id, g]));
  const buckets = new Map<string, Reference[]>();
  for (const r of refs) {
    if (!buckets.has(r.group)) buckets.set(r.group, []);
    buckets.get(r.group)!.push(r);
  }
  return [...buckets.entries()]
    .map(([id, items]) => ({
      group: byId.get(id) ?? { id, label: id, icon: "🔗", sortOrder: 999 },
      items,
    }))
    .sort((a, b) => a.group.sortOrder - b.group.sortOrder);
}

export function PillarDetail({
  pillar,
  groups,
  columns = 1,
}: {
  pillar: Pillar;
  groups: Group[];
  columns?: 1 | 2;
}) {
  return (
    <div>
      <p className="overline text-deep-blue/50">References</p>
      <div className={`mt-3 grid gap-5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {groupReferences(pillar.references, groups).map(({ group, items }) => (
          <div key={group.id}>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-deep-blue">
              <span aria-hidden>{group.icon}</span>
              <span>{group.label}</span>
            </p>
            <ul className="space-y-1.5">
              {items.map((ref) => (
                <li key={ref.title}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-1.5 text-sm text-deep-blue/80 transition hover:text-classic-green"
                  >
                    <span>{ref.title}</span>
                    <ArrowUpRight
                      size={14}
                      className="mt-0.5 shrink-0 opacity-0 transition group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Latest from the blog — auto-ingested posts tagged with this pillar's topic */}
      {pillar.latestPosts && pillar.latestPosts.length > 0 && (
        <div className="mt-6 border-t border-cool-14 pt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="overline flex items-center gap-1.5 text-deep-blue/50">
              <Rss size={12} /> Latest from the Blog
            </p>
            <a
              href="https://solace.com/blog/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-classic-green hover:underline"
            >
              More <ArrowUpRight size={12} />
            </a>
          </div>
          <ul className="space-y-1.5">
            {pillar.latestPosts.map((post) => (
              <li key={post.url}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block text-sm text-deep-blue/80 transition hover:text-classic-green"
                >
                  {post.title}
                  <span className="mono-label ml-1.5 text-deep-blue/40">{fmt(post.date)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
