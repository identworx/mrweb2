import Link from "next/link";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";

export default function CrossLinkSection({
  section,
  className = "bg-cream",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="bg-white p-8 md:p-10 border border-light-gray max-w-2xl">
          {section.title && (
            <h3 className="font-heading text-anthracite text-xl font-bold mb-3">
              {section.title}
            </h3>
          )}
          {section.content && (
            <p className="font-body text-text-gray text-sm leading-[1.8] mb-6">
              {section.content}
            </p>
          )}
          {section.buttonHref && section.buttonLabel && (
            <Link
              href={section.buttonHref}
              className="inline-flex items-center gap-3 text-pumpkin group"
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
      </div>
    </section>
  );
}
