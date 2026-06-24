import Link from "next/link";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routes";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

export default function ServiceCtaSection({
  section,
  locale = "de",
}: {
  section: FrontendServiceSection;
  locale?: Locale;
}) {
  const rawHref = (section.settings.secondaryHref as string) || "/kataloge";
  const secondaryHref = localizedHref(rawHref, locale);
  const secondaryLabel = (section.settings.secondaryLabel as string) || (locale === "en" ? "Back to Catalogues" : "Zurück zu Kataloge");

  return (
    <section className="section-padding bg-anthracite">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
        {section.title && (
          <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            {section.title}
          </h2>
        )}
        {section.content && (
          <RichTextRenderer
            html={section.content}
            className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10"
          />
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {section.buttonHref && section.buttonLabel && (
            <Link href={localizedHref(section.buttonHref, locale)} className="btn-primary">
              {section.buttonLabel}
            </Link>
          )}
          <Link href={secondaryHref} className="btn-outline-white">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
