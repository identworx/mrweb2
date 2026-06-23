"use client";

import { useEffect, useRef, useState } from "react";

interface AnchorItem {
  id: string;
  label: string;
}

interface CollectionAnchorNavProps {
  items: AnchorItem[];
}

export default function CollectionAnchorNav({ items }: CollectionAnchorNavProps) {
  const [activeId, setActiveId] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ids = items.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <nav
      ref={navRef}
      aria-label="Seitennavigation"
      className="sticky top-[68px] md:top-[76px] z-30 bg-white/95 backdrop-blur-sm border-b border-black/[0.05]"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 -mx-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${
                activeId === item.id
                  ? "text-pumpkin-accessible"
                  : "text-text-muted hover:text-anthracite"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
