import type { ResolvedIcon } from "@/lib/cms/icons";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import type { Locale } from "@/lib/i18n/config";
import ScrollReveal from "@/components/ScrollReveal";
import FabricPatternCard from "./FabricPatternCard";

interface PatternColor {
  name: string;
  hex: string;
}

interface Pattern {
  name: string;
  thumbnailUrl?: string;
  colors: PatternColor[];
  availableCategories?: string[];
}

interface PatternGroup {
  name: string;
  quality: string;
  description: string;
  patterns: Pattern[];
}

interface CategoryIcon {
  categorySlug: string;
  categoryName: string;
  iconUrl?: string;
}

export default function FabricPatternOverviewSection({
  section,
  className = "bg-white",
  icons = {},
  locale = "de",
}: {
  section: FrontendServiceSection;
  className?: string;
  icons?: Record<string, ResolvedIcon>;
  locale?: Locale;
}) {
  const groups = Array.isArray(section.settings.groups)
    ? (section.settings.groups as PatternGroup[])
    : [];
  const categoryIcons = Array.isArray(section.settings.categoryIcons)
    ? (section.settings.categoryIcons as CategoryIcon[])
    : [];

  if (groups.length === 0) return null;

  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {section.eyebrow && (
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
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
                  <span className="font-accent text-pumpkin-accessible text-xs tracking-[0.15em] uppercase">
                    {group.quality}
                  </span>
                </div>
                <p className="font-body text-text-gray text-sm leading-relaxed mb-6">
                  {group.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.patterns.map((pattern) => (
                    <FabricPatternCard
                      key={pattern.name}
                      name={pattern.name}
                      thumbnailUrl={pattern.thumbnailUrl}
                      colors={pattern.colors}
                      availableCategories={pattern.availableCategories}
                      categoryIcons={categoryIcons}
                      icons={icons}
                      locale={locale}
                    />
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
