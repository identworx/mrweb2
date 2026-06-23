import type { ResolvedIcon } from "@/lib/cms/icons";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import ScrollReveal from "@/components/ScrollReveal";
import CmsIcon from "@/components/cms/CmsIcon";

interface Step {
  title: string;
  description: string;
}

export default function ProcessChainSection({
  section,
  className = "bg-cream",
  icons = {},
}: {
  section: FrontendServiceSection;
  className?: string;
  icons?: Record<string, ResolvedIcon>;
}) {
  const steps = Array.isArray(section.settings.steps)
    ? (section.settings.steps as Step[])
    : [];
  const highlights = Array.isArray(section.settings.highlights)
    ? (section.settings.highlights as string[])
    : [];

  if (steps.length === 0) return null;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-light-gray">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 100}>
              <div className="bg-white p-6 md:p-8 h-full relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-pumpkin/10 text-pumpkin font-heading text-sm font-bold">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <CmsIcon icon={icons["arrow-right"]} width={20} height={20} className="text-pumpkin/40 absolute right-4 top-8 hidden lg:block" />
                  )}
                </div>
                <h3 className="font-heading text-anthracite text-base font-bold mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-text-gray text-sm leading-[1.8]">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {highlights.length > 0 && (
          <ScrollReveal>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((hl) => (
                <div key={hl} className="flex items-start gap-3">
                  <CmsIcon icon={icons["checkmark"]} width={16} height={16} className="text-pumpkin flex-shrink-0 mt-0.5" />
                  <span className="font-body text-anthracite text-sm leading-relaxed">
                    {hl}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
