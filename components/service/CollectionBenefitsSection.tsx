import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import ScrollReveal from "@/components/ScrollReveal";

interface BenefitItem {
  iconKey: string;
  title: string;
  text: string;
}

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  sun: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
      <circle cx="16" cy="16" r="6" />
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.8 7.8l2.8 2.8M21.4 21.4l2.8 2.8M7.8 24.2l2.8-2.8M21.4 10.6l2.8-2.8" />
    </svg>
  ),
  droplet: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
      <path d="M16 4C16 4 6 15 6 21a10 10 0 0020 0C26 15 16 4 16 4z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
      <path d="M10 16l4 4 8-8" />
      <rect x="4" y="4" width="24" height="24" rx="2" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
      <path d="M16 3l3.5 7 7.5 1-5.5 5.3L22.8 24 16 20.2 9.2 24l1.3-7.7L5 11l7.5-1z" />
    </svg>
  ),
};

function getFallbackIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
      <path d="M10 16l4 4 8-8" />
      <rect x="4" y="4" width="24" height="24" rx="2" />
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
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {(section.title || section.content) && (
          <ScrollReveal>
            <div className="max-w-3xl mb-12">
              {section.title && (
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
          {items.map((item, i) => (
            <ScrollReveal key={item.title || i} delay={i * 80}>
              <div className="bg-white p-6 md:p-8 h-full">
                <div className="text-pumpkin mb-4">
                  {BENEFIT_ICONS[item.iconKey] || getFallbackIcon()}
                </div>
                <h3 className="font-heading text-anthracite text-sm md:text-base font-bold tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-text-gray text-xs md:text-sm leading-[1.7]">
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
