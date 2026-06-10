import Link from "next/link";
import Image from "next/image";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { FrontendCollection } from "@/lib/cms/collections";

interface Props {
  section: HomepageSection;
  collections: FrontendCollection[];
}

export default function HomepageCollections({ section, collections }: Props) {
  const eyebrow = section.eyebrow || "Farbwelten";
  const title = section.title || "Kollektionen.";
  const description = section.content || "";
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            {title}
          </h2>
          {description && (
            <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-5 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/kollektionen/${col.slug}`}
              className="group block relative overflow-hidden bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-cream">
                {col.cardImage ? (
                  <Image
                    src={col.cardImage}
                    alt={col.cardAlt || `${col.name} Collection`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: col.moodColors.length >= 2
                        ? `linear-gradient(135deg, ${col.moodColors[0]} 0%, ${col.moodColors[col.moodColors.length - 1]} 100%)`
                        : col.moodColors[0] || "#E5E1DC",
                    }}
                  />
                )}
              </div>

              <div className="flex">
                {col.moodColors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 transition-all duration-500 group-hover:h-2"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="p-4 md:p-5">
                <span className="font-accent text-text-gray/40 text-[10px] tracking-[0.2em] uppercase">
                  {col.number ? `0${col.number}` : col.slug}
                </span>
                <h3 className="font-heading text-anthracite text-sm md:text-base font-bold mt-1 group-hover:text-pumpkin transition-colors duration-300">
                  {col.name}
                </h3>
                {col.fabric && (
                  <p className="font-body text-text-gray/50 text-xs mt-1 truncate">
                    {col.fabric}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-12 md:mt-16">
            <Link href={ctaHref} className="btn-primary">
              {ctaLabel}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
