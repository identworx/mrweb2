"use client";

import Link from "next/link";

const HEADER_OFFSET = 80;

interface NavItem {
  label: string;
  href: string;
  isRoute: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Technologie", href: "#technologie", isRoute: false },
  { label: "Stofffamilien", href: "#stofffamilien", isRoute: false },
  { label: "Nachhaltigkeit", href: "#nachhaltigkeit", isRoute: false },
  { label: "Stoffe & Muster", href: "/materialien/stoffe-muster", isRoute: true },
  { label: "Technische Daten", href: "/materialien/technische-daten", isRoute: true },
];

function scrollToAnchor(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function MaterialAnchorNav() {
  return (
    <nav
      aria-label="Materialien-Seitennavigation"
      className="bg-white border-b border-anthracite/10"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-nowrap py-3 -mx-1">
          {NAV_ITEMS.map((item) =>
            item.isRoute ? (
              <Link
                key={item.href}
                href={item.href}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 font-accent text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite/50 hover:text-pumpkin transition-colors duration-300"
              >
                {item.label}
                <span className="text-[9px] leading-none" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToAnchor(e, item.href.slice(1))}
                className="flex-shrink-0 px-3.5 py-1.5 font-accent text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite/50 hover:text-pumpkin transition-colors duration-300"
              >
                {item.label}
              </a>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
