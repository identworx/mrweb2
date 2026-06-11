import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import ScrollReveal from "@/components/ScrollReveal";

interface PatternColor {
  name: string;
  hex: string;
}

interface Pattern {
  name: string;
  colors: PatternColor[];
}

interface PatternGroup {
  name: string;
  quality: string;
  description: string;
  patterns: Pattern[];
}

export default function FabricPatternOverviewSection({
  section,
  className = "bg-white",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const groups = Array.isArray(section.settings.groups)
    ? (section.settings.groups as PatternGroup[])
    : [];

  if (groups.length === 0) return null;

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
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            {section.title}
          </h2>
        )}

        {section.content && (
          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
            {section.content}
          </p>
        )}

        <div className="space-y-12 md:space-y-16">
          {groups.map((group, gi) => (
            <ScrollReveal key={group.name} delay={gi * 80}>
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="font-heading text-anthracite text-xl font-bold">
                    {group.name}
                  </h3>
                  <span className="font-accent text-pumpkin text-xs tracking-[0.15em] uppercase">
                    {group.quality}
                  </span>
                </div>
                <p className="font-body text-text-gray text-sm leading-relaxed mb-6">
                  {group.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {group.patterns.map((pattern) => (
                    <div
                      key={pattern.name}
                      className="bg-cream p-4 transition-all duration-300 motion-safe:hover:-translate-y-0.5"
                    >
                      <p className="font-heading text-anthracite text-sm font-semibold mb-3 leading-tight">
                        {pattern.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {pattern.colors.map((color) => (
                          <div
                            key={color.name}
                            className="group/swatch relative"
                          >
                            <div
                              className="w-5 h-5 border border-black/10"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-anthracite text-white text-[10px] font-body whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-200 pointer-events-none">
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="font-accent text-text-gray/60 text-[10px] tracking-[0.1em] uppercase mt-2">
                        {pattern.colors.length}{" "}
                        {pattern.colors.length === 1 ? "Farbe" : "Farben"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
