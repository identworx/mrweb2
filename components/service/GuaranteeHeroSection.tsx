import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

export default function GuaranteeHeroSection({
  section,
}: {
  section: FrontendServiceSection;
}) {
  const number = (section.settings.number as string) || "3";

  return (
    <section className="section-padding bg-pumpkin">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className="block font-heading text-white text-[8rem] md:text-[10rem] lg:text-[12rem] font-extrabold leading-none tracking-tight">
              {number}
            </span>
            {section.title && (
              <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight -mt-2 md:-mt-4">
                {section.title}
              </h2>
            )}
          </div>
          {section.content && (
            <div>
              <RichTextRenderer
                html={section.content}
                className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8] [&_p+p]:mt-6"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
