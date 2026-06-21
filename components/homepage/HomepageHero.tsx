import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

interface Props {
  section: HomepageSection;
  icons?: Record<string, ResolvedIcon>;
}

const FALLBACK_IMAGE = "/Luxury-Outdoor-Space-with-Premium-Garden-Furniture.jpg";

export default function HomepageHero({ section, icons = {} }: Props) {
  const s = section.settings;
  const eyebrow = section.eyebrow || "Hochwertige Outdoor-Textilien";
  const headline = section.title || "Design trifft\nPerformance.";
  const subheadline = (s.subheadline as string) || "";
  const description = section.content || "";
  const ctaLabel = section.buttonLabel || "Kollektionen entdecken";
  const ctaHref = section.buttonHref || "/kollektionen";
  const secondaryLabel = (s.secondaryLabel as string) || "";
  const secondaryHref = (s.secondaryHref as string) || "";
  const bgImage = section.imageUrl || FALLBACK_IMAGE;

  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundPosition: "center 45%",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 22%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.08) 65%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 30%, transparent 55%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/30 to-transparent"
        style={{ height: "28%" }}
      />

      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 lg:px-12 pb-20 md:pb-32 lg:pb-40 xl:pb-44">
          <div className="max-w-xl lg:max-w-[620px]">
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase mb-6">
              {eyebrow}
            </p>

            <h1 className="font-heading text-white text-[2.75rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extrabold leading-[1.02] tracking-[-0.02em] mb-6 md:mb-8 whitespace-pre-line">
              {headline}
            </h1>

            {subheadline && (
              <p className="font-heading text-white/90 text-lg md:text-xl lg:text-2xl font-medium leading-snug mb-4 max-w-[28rem] md:max-w-[32rem]">
                {subheadline}
              </p>
            )}

            {description && (
              <RichTextRenderer
                html={description}
                className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.75] mb-10 md:mb-12 max-w-[28rem] md:max-w-[32rem]"
              />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link href={ctaHref} className="btn-primary">
                {ctaLabel}
                <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
              </Link>
              {secondaryLabel && secondaryHref && (
                <Link href={secondaryHref} className="btn-outline-white">
                  {secondaryLabel}
                  <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50 motion-safe:animate-bounce text-white">
        <CmsIcon icon={icons["scroll-down"]} width={16} height={24} />
      </div>
    </section>
  );
}
