import Link from "next/link";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";

export default function HighlightCardsSection({
  section,
  className = "bg-white",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const items = Array.isArray(section.settings.items)
    ? (section.settings.items as string[]).filter((s) => typeof s === "string" && s.trim())
    : [];

  if (items.length === 0) return null;

  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {section.eyebrow && (
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              {section.eyebrow}
            </p>
          </div>
        )}
        {section.title && (
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
            {section.title}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-cream rounded"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pumpkin flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-body text-anthracite text-sm leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>

        {section.buttonHref && section.buttonLabel && (
          <Link
            href={section.buttonHref}
            className="inline-flex items-center gap-3 text-pumpkin mt-10 group"
          >
            <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
              {section.buttonLabel}
            </span>
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
