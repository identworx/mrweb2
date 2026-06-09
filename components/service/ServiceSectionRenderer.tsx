import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import CareListSection from "./CareListSection";
import FabricCardsSection from "./FabricCardsSection";
import ComparisonTableSection from "./ComparisonTableSection";
import HighlightCardsSection from "./HighlightCardsSection";
import CrossLinkSection from "./CrossLinkSection";
import ServiceCtaSection from "./ServiceCtaSection";

interface Props {
  section: FrontendServiceSection;
  background?: "white" | "cream";
}

export default function ServiceSectionRenderer({ section, background = "white" }: Props) {
  const style = (section.settings.style as string) || "";
  const bg = background === "cream" ? "bg-cream" : "bg-white";

  switch (style) {
    case "care-list":
      return <CareListSection section={section} className={bg} />;
    case "fabric-cards":
      return <FabricCardsSection section={section} className={bg} />;
    case "comparison-table":
      return <ComparisonTableSection section={section} className={bg} />;
    case "highlight-cards":
      return <HighlightCardsSection section={section} className={bg} />;
    case "cross-link":
      return <CrossLinkSection section={section} className={bg} />;
    case "cta":
      return <ServiceCtaSection section={section} />;
    default:
      if (section.content) {
        return (
          <section className={`section-padding ${bg}`}>
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="max-w-3xl">
                {section.title && (
                  <>
                    {section.eyebrow && (
                      <div className="flex items-center gap-4 mb-5">
                        <div className="accent-line" />
                        <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                          {section.eyebrow}
                        </p>
                      </div>
                    )}
                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
                      {section.title}
                    </h2>
                  </>
                )}
                <div
                  className="font-body text-text-gray text-base leading-[1.8] prose prose-neutral max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </div>
          </section>
        );
      }
      return null;
  }
}
