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
      {/* Subtle woven texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.5) 6px, rgba(255,255,255,0.5) 6.5px), repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.3) 6px, rgba(255,255,255,0.3) 6.5px)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 text-center">
        <ScrollReveal>
          {section.eyebrow && (
            <p className="font-accent text-pumpkin/80 text-[11px] tracking-[0.25em] uppercase mb-5">
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight mb-5">
              {section.title}
            </h2>
          )}
          {section.content && (
            <p className="font-body text-white/55 text-base md:text-[1.0625rem] leading-[1.8] max-w-[52ch] mx-auto mb-10">
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
