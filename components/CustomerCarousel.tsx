"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Building2 } from "lucide-react";
import { FEATURED_CUSTOMERS } from "@/lib/data/customers";

// Auto-looping showcase of the newest Solace customers. Logos cross-fade on a timer
// (pauses on hover); dots allow manual selection; "Learn More" opens the full list.
export function CustomerCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = FEATURED_CUSTOMERS.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), 3500);
    return () => clearInterval(id);
  }, [paused, count]);

  const current = FEATURED_CUSTOMERS[active];

  return (
    <div
      className="rounded-2xl border border-cool-13 bg-white p-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="overline flex items-center gap-2 text-classic-green">
        <Building2 size={14} /> New Customers
      </p>

      {/* Cross-fading logo stage */}
      <div className="relative mt-3 h-32 rounded-xl bg-deep-blue/[0.03]">
        {FEATURED_CUSTOMERS.map((c, i) => (
          <div
            key={c.name}
            className={`absolute inset-0 grid place-items-center p-5 transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.logo}
              alt={c.name}
              referrerPolicy="no-referrer"
              className="max-h-20 max-w-[88%] object-contain"
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm font-semibold text-deep-blue">
        {current.name} <span className="font-normal text-deep-blue/50">· {current.industry}</span>
      </p>
      <p className="mt-1 line-clamp-3 text-sm leading-snug text-deep-blue/70">
        {current.description}
      </p>

      {/* Dots */}
      <div className="mt-3 flex items-center gap-1.5">
        {FEATURED_CUSTOMERS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setActive(i)}
            aria-label={`Show ${c.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-classic-green" : "w-1.5 bg-deep-blue/15 hover:bg-deep-blue/30"
            }`}
          />
        ))}
      </div>

      <a
        href={current.href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-classic-green hover:underline"
      >
        Learn More <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
