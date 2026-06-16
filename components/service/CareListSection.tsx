import type { ResolvedIcon } from "@/lib/cms/icons";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import CmsIcon from "@/components/cms/CmsIcon";

export default function CareListSection({
  section,
  className = "bg-white",
  icons = {},
}: {
  section: FrontendServiceSection;
  className?: string;
  icons?: Record<string, ResolvedIcon>;
}) {
  const items = Array.isArray(section.settings.items)
    ? (section.settings.items as string[]).filter((s) => typeof s === "string" && s.trim())
    : [];

  if (items.length === 0) return null;

  return (
    <div className={className}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-5xl py-14 first:pt-0">
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
                <CmsIcon icon={icons["checkmark"]} width={18} height={18} className="text-pumpkin flex-shrink-0 mt-0.5" />
                <RichTextRenderer
                  html={item}
                  className="font-body text-anthracite text-sm md:text-base leading-relaxed prose prose-sm prose-neutral max-w-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
