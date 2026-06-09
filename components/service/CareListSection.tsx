import type { FrontendServiceSection } from "@/lib/cms/service-pages";

function CheckIcon() {
  return (
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
  );
}

export default function CareListSection({
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
    <div className={className}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-3xl py-14 first:pt-0">
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

          <div className="space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-cream rounded"
              >
                <CheckIcon />
                <span className="font-body text-anthracite text-sm md:text-base leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
