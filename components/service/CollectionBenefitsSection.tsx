import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import ScrollReveal from "@/components/ScrollReveal";

interface BenefitItem {
  iconKey: string;
  title: string;
  text: string;
}

const ICON_KEY_MAP: Record<string, string> = {
  sun: "benefit-sun",
  droplet: "benefit-droplet",
  shield: "benefit-shield",
  star: "benefit-star",
};

export default function CollectionBenefitsSection({
  section,
  className = "bg-cream",
  icons = {},
}: {
  section: FrontendServiceSection;
  className?: string;
  icons?: Record<string, ResolvedIcon>;
}) {
  const items = Array.isArray(section.settings.items)
    ? (section.settings.items as BenefitItem[])
    : [];

  if (items.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {(section.title || section.content) && (
          <ScrollReveal>
            <div className="max-w-3xl mb-14">
              {section.title && (
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-[2.125rem] font-bold tracking-tight mb-4">
                  {section.title}
                </h2>
              )}
              {section.content && (
                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                  {section.content}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-black/[0.05]">
          {items.map((item, i) => (
            <ScrollReveal key={item.title || i} delay={i * 80}>
              <div className="bg-white p-7 md:p-8 h-full">
                <div className="text-anthracite/30 mb-5">
                  <CmsIcon
                    icon={icons[ICON_KEY_MAP[item.iconKey] ?? item.iconKey] ?? icons["benefit-fallback"]}
                    width={24}
                    height={24}
                  />
                </div>
                <h3 className="font-heading text-anthracite text-sm font-bold tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-text-gray text-[13px] leading-[1.75]">
                  {item.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
