import type { Pillar } from "@/lib/types";
import { Icon } from "./Icon";
import { ChevronRight } from "lucide-react";

// Single pillar tile. `active` highlights the selected/open pillar.
export function PillarCard({
  pillar,
  active,
  onClick,
}: {
  pillar: Pillar;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-expanded={active}
      className={`group flex flex-col items-start rounded-2xl border p-5 text-left transition ${
        active
          ? "border-classic-green bg-deep-blue text-white shadow-lg"
          : "border-cool-13 bg-white hover:border-classic-green hover:shadow-md"
      }`}
    >
      <div
        className={`grid h-11 w-11 place-items-center rounded-xl ${
          active ? "bg-solace-green" : "bg-deep-blue/5 group-hover:bg-classic-green/10"
        }`}
      >
        <Icon name={pillar.icon} size={22} className={active ? "text-dark-blue" : "text-deep-blue"} />
      </div>
      <p className="overline mt-4 text-deep-blue">
        Focus Area {pillar.number}
      </p>
      <h3 className={`mt-1 text-xl ${active ? "text-white" : "text-deep-blue"}`}>{pillar.title}</h3>
      <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-deep-blue/70"}`}>
        {pillar.description}
      </p>
      <span
        className={`mono-label mt-4 inline-flex items-center gap-1 ${
          active ? "text-bright-green" : "text-deep-blue/50 group-hover:text-deep-blue group-hover:underline decoration-classic-green decoration-2 underline-offset-2"
        }`}
      >
        {active ? "Showing in panel" : "Explore"}
        <ChevronRight size={14} className={active ? "rotate-90 transition" : "transition"} />
      </span>
    </button>
  );
}
