import Link from "next/link";
import Image from "next/image";
import type { HomepageSection } from "@/lib/cms/homepage";

interface Props {
  section: HomepageSection;
}

const FALLBACK_IMAGE = "/images/news/mackintosh-technologie.jpg";

export default function HomepageImageTextFeature({ section }: Props) {
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
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-cream">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            {content && (
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-8">
                {content}
              </p>
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
                <Link href={ctaHref} className="btn-primary">
                  {ctaLabel}
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
