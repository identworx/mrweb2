import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routes";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import CmsIcon from "@/components/cms/CmsIcon";

export default function CrossLinkSection({
  section,
  className = "bg-cream",
  icons = {},
  locale = "de",
}: {
  section: FrontendServiceSection;
  className?: string;
  icons?: Record<string, ResolvedIcon>;
  locale?: Locale;
}) {
  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="bg-white p-8 md:p-10 border border-light-gray max-w-4xl">
          {section.title && (
            <h3 className="font-heading text-anthracite text-xl font-bold mb-3">
              {section.title}
            </h3>
          )}
          {section.content && (
            <RichTextRenderer
              html={section.content}
              className="font-body text-text-gray text-sm leading-[1.8] mb-6 prose prose-sm prose-neutral max-w-none"
            />
          )}
          {section.buttonHref && section.buttonLabel && (
            <Link
              href={localizedHref(section.buttonHref, locale)}
              className="inline-flex items-center gap-3 text-pumpkin-accessible group"
            >
              <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                {section.buttonLabel}
              </span>
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
