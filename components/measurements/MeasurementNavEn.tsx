"use client";

const navItems = [
  { label: "Cushions & Pads", href: "#kissen-auflagen" },
  { label: "Back Cushions", href: "#lehner" },
  { label: "Bench Cushions", href: "#bankauflagen" },
  { label: "Poufs", href: "#poufs" },
  { label: "Placemats & Table Runners", href: "#tischsets" },
  { label: "Custom Sizes", href: "#massanfertigung" },
];

export default function MeasurementNavEn() {
  return (
    <nav aria-label="Dimension navigation" className="flex flex-wrap gap-2">
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
