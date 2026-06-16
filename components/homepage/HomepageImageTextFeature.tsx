import Link from "next/link";
import Image from "next/image";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

interface Props {
  section: HomepageSection;
  icons?: Record<string, ResolvedIcon>;
}

const FALLBACK_IMAGE = "/images/news/mackintosh-technologie.jpg";

export default function HomepageImageTextFeature({ section, icons = {} }: Props) {
  const bullets = (section.settings.bullets as string[]) || [];
  const eyebrow = section.eyebrow || "Material & Technologie";
  const title = section.title || "Mackintosh® Technology.";
  const content = section.content || "";
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;
  const imageUrl = section.imageUrl || FALLBACK_IMAGE;
  const imageAlt = section.imageAlt || "Nahaufnahme Mackintosh® Gewebe";

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] ring-1 ring-black/5 shadow-[0_24px_60px_rgba(45,45,45,0.10)] bg-cream group">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-safe:group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-6">
              {title}
            </h2>

            {content && (
              <RichTextRenderer
                html={content}
                className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-8"
              />
            )}

            {bullets.length > 0 && (
              <ul className="space-y-4">
                {bullets.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 bg-pumpkin shrink-0" />
                    <span className="font-body text-text-gray text-sm leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {ctaLabel && ctaHref && (
              <div className="mt-10">
                <Link href={ctaHref} className="btn-outline">
                  {ctaLabel}
                  <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
