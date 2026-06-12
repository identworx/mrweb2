import Link from "next/link";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import ScrollReveal from "@/components/ScrollReveal";

export default function CollectionCtaSection({
  section,
}: {
  section: FrontendServiceSection;
}) {
  const secondaryHref = (section.settings.secondaryHref as string) || "/kataloge";
  const secondaryLabel = (section.settings.secondaryLabel as string) || "Kataloge ansehen";

  return (
    <section className="relative py-20 md:py-28 bg-anthracite overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 10.5px), repeating-linear-gradient(-45deg, transparent, transparent 10px, white 10.5px, white 11px)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 text-center">
        <ScrollReveal>
          {section.eyebrow && (
            <p className="font-accent text-pumpkin text-[11px] tracking-[0.3em] uppercase mb-4">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-5">
              {section.title}
            </h2>
          )}
          {section.content && (
            <p className="font-body text-white/65 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              {section.content}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {section.buttonHref && section.buttonLabel && (
              <Link href={section.buttonHref} className="btn-primary">
                {section.buttonLabel}
              </Link>
            )}
            <Link href={secondaryHref} className="btn-outline-white">
              {secondaryLabel}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
