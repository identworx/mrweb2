"use client";

const HEADER_OFFSET = 80;

const ANCHORS = [
  { label: "Story", id: "story" },
  { label: "Technology", id: "technologie" },
  { label: "Facts", id: "fakten" },
  { label: "Products", id: "produkte" },
  { label: "Consultation", id: "beratung" },
];

function scrollToAnchor(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function NerioAnchorNavEn() {
  return (
    <nav
      aria-label="NERIO page navigation"
      className="bg-white border-b border-anthracite/10"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-nowrap py-0 -mx-1">
          {ANCHORS.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              onClick={(e) => scrollToAnchor(e, anchor.id)}
              className="flex-shrink-0 px-4 py-3 font-accent text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted border-b-2 border-transparent hover:text-anthracite transition-colors duration-300"
            >
              {anchor.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
