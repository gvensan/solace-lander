"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export interface SectionItem {
  id: string;
  label: string;
  gated?: boolean;
}

export function SectionNav({ sections }: { sections: SectionItem[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sticky top-24">
      <p className="overline mb-3 text-deep-blue/40">On This Page</p>
      <ul className="space-y-0.5 border-l border-cool-13">
        {sections.map((s, i) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`-ml-px flex items-center gap-2 border-l-2 py-1.5 pl-4 text-sm transition ${
                  isActive
                    ? "border-deep-blue font-semibold text-deep-blue"
                    : "border-transparent text-deep-blue/60 hover:border-cool-14 hover:text-deep-blue"
                }`}
              >
                <span className="mono-label text-xs text-deep-blue/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s.label}</span>
                {s.gated && <Lock size={12} className="text-deep-blue/40" />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
