import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

interface Column {
  title: string;
  text: string;
}

export default function IntroColumnsSection({
  section,
  className = "bg-white",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const subtitle = (section.settings.subtitle as string) || "";
  const columns = Array.isArray(section.settings.columns)
    ? (section.settings.columns as Column[])
    : [];

  return (
    <section className={`pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {section.title && (
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-3">
            {section.title}
          </h2>
        )}
        {subtitle && (
          <p className="font-heading text-pumpkin text-2xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight leading-[1.1] italic mb-10 md:mb-14">
            {subtitle}
          </p>
        )}

        {section.content && (
          <div className="max-w-3xl mb-16 md:mb-20">
            <RichTextRenderer
              html={section.content}
              className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
            />
          </div>
        )}

        {columns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                  {col.title}
                </h3>
                <p
                  className="font-body text-text-gray text-sm leading-[1.8]"
                  style={{ textWrap: "pretty" }}
                >
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
