"use client";

import { measurementGroups } from "@/lib/mosaroma/measurements";

const navItems = [
  ...measurementGroups.map((g) => ({ label: g.title, href: `#${g.id}` })),
  { label: "Maßanfertigung", href: "#massanfertigung" },
];

export default function MeasurementNav() {
  return (
    <nav aria-label="Maßnavigation" className="flex flex-wrap gap-2">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2.5 border border-anthracite/15 text-anthracite/70 bg-white hover:bg-pumpkin-button hover:border-pumpkin-button hover:text-white transition-all duration-300"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
