import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { FrontendCollection } from "@/lib/cms/collections";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import CollectionCard from "@/components/CollectionCard";

interface Props {
  section: HomepageSection;
  collections: FrontendCollection[];
  icons?: Record<string, ResolvedIcon>;
}

export default function HomepageCollections({ section, collections, icons = {} }: Props) {
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
            <RichTextRenderer
              html={description}
              className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-5 max-w-2xl"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {collections.map((col) => (
            <CollectionCard
              key={col.slug}
              name={col.name}
              slug={col.slug}
              description={col.shortDescription}
              moodColors={col.moodColors}
              fabric={col.fabric}
              image={col.cardImage}
              alt={col.cardAlt}
              icons={icons}
            />
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-12 md:mt-16">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 font-heading text-pumpkin text-sm font-semibold tracking-wide hover:text-burnt-orange transition-colors duration-300"
            >
              {ctaLabel}
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
