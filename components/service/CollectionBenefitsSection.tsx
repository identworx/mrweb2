import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import ScrollReveal from "@/components/ScrollReveal";

interface BenefitItem {
  iconKey: string;
  title: string;
  text: string;
}

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  sun: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
      <circle cx="16" cy="16" r="5.5" />
      <path d="M16 5v3M16 24v3M5 16h3M24 16h3M8.5 8.5l2 2M21.5 21.5l2 2M8.5 23.5l2-2M21.5 10.5l2-2" />
    </svg>
  ),
  droplet: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
      <path d="M16 5C16 5 7 14.5 7 20a9 9 0 0018 0C25 14.5 16 5 16 5z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
      <path d="M16 3L5 8v7c0 7.5 4.7 14.5 11 17 6.3-2.5 11-9.5 11-17V8L16 3z" />
      <path d="M11 16l3.5 3.5L21 13" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
      <path d="M16 4l3.2 6.5 7.1.9-5.15 4.9 1.25 7-6.4-3.5-6.4 3.5 1.25-7L5.7 11.4l7.1-.9z" />
    </svg>
  ),
};

function getFallbackIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6">
      <circle cx="16" cy="16" r="10" />
      <path d="M12 16l3 3 5-5" />
    </svg>
  );
}

export default function CollectionBenefitsSection({
  section,
  className = "bg-cream",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const items = Array.isArray(section.settings.items)
    ? (section.settings.items as BenefitItem[])
    : [];

  if (items.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
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
                  {BENEFIT_ICONS[item.iconKey] || getFallbackIcon()}
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
