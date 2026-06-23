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
  const ctaHref = section.buttonHref || "/kollektionen";

  return (
    <section className="py-20 md:py-24 lg:py-28 bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin-text text-xs tracking-[0.3em] uppercase">
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

          <Link
            href={ctaHref}
            className="group relative flex flex-col h-full bg-[#FAF8F5] border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.12]"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-pumpkin/20 group-hover:bg-pumpkin/40 transition-colors duration-500" />

            <div className="flex flex-col items-start justify-center flex-1 p-5 pt-6">
              <p className="font-accent text-pumpkin-text text-[10px] tracking-[0.25em] uppercase mb-3">
                Alle Farbwelten
              </p>
              <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold tracking-tight leading-snug mb-3">
                Alle Kollektionen ansehen
              </h3>
              <p className="font-body text-text-gray text-[13px] leading-[1.75]">
                Entdecken Sie alle Farbwelten und Materialien im Überblick.
              </p>
            </div>

            <div className="mt-auto p-5 pt-0">
              <div className="flex items-center justify-end mt-4 pt-3 border-t border-black/[0.05]">
                <span className="flex items-center gap-1.5 text-pumpkin-text group-hover:text-pumpkin transition-colors duration-500">
                  <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em]">
                    Übersicht öffnen
                  </span>
                  <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
