import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import BoldText from "./BoldText";

interface Step {
  step: string;
  title: string;
  text: string;
}

export default function NumberedStepsSection({
  section,
  className = "bg-cream",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const steps = Array.isArray(section.settings.steps)
    ? (section.settings.steps as Step[])
    : [];

  if (steps.length === 0) return null;

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
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12 md:mb-16">
            {section.title}
          </h2>
        )}

        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 max-w-5xl">
          {steps.map((step) => (
            <div key={step.step}>
              <span className="font-heading text-pumpkin text-4xl md:text-5xl font-extrabold tracking-tight">
                {step.step}
              </span>
              <h3 className="font-heading text-anthracite text-lg font-bold mt-4 mb-3">
                {step.title}
              </h3>
              <p
                className="font-body text-text-gray text-sm leading-[1.8]"
                style={{ textWrap: "pretty" }}
              >
                <BoldText text={step.text} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
