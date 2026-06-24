"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const SECTION_LINKS: NavItem[] = [
  { label: "Overview", href: "/en/materials" },
  { label: "Fabrics & Samples", href: "/en/materials/fabrics-samples" },
  { label: "Technical Data", href: "/en/materials/technical-data" },
];

const HEADER_OFFSET = 80;

interface AnchorItem {
  label: string;
  id: string;
}

const HUB_ANCHORS: AnchorItem[] = [
  { label: "Technology", id: "technologie" },
  { label: "Fabric Families", id: "stofffamilien" },
  { label: "Sustainability", id: "nachhaltigkeit" },
];

function scrollToAnchor(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function MaterialAnchorNavEn() {
  const pathname = usePathname();
  const isHub = pathname === "/en/materials";

  return (
    <nav
      aria-label="Materials section navigation"
      className="bg-white border-b border-anthracite/10"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-nowrap py-0 -mx-1">
          {SECTION_LINKS.map((item) => {
            const isActive = item.href === pathname;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 px-4 py-3 font-accent text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-colors duration-300 ${
                  isActive
                    ? "text-anthracite border-pumpkin"
                    : "text-text-muted border-transparent hover:text-anthracite"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {isHub && HUB_ANCHORS.length > 0 && (
            <>
              <span className="flex-shrink-0 w-px h-4 bg-anthracite/10 mx-2" aria-hidden="true" />
              {HUB_ANCHORS.map((anchor) => (
                <a
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  onClick={(e) => scrollToAnchor(e, anchor.id)}
                  className="flex-shrink-0 px-3 py-3 font-accent text-[10px] uppercase tracking-[0.12em] text-text-muted border-b-2 border-transparent hover:text-anthracite transition-colors duration-300"
                >
                  {anchor.label}
                </a>
              ))}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
