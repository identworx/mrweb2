import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { FrontendNewsCard } from "@/lib/cms/news";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import NewsCard from "@/components/NewsCard";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routes";

interface Props {
  section: HomepageSection;
  articles: FrontendNewsCard[];
  icons?: Record<string, ResolvedIcon>;
  locale?: Locale;
}

export default function HomepageNews({ section, articles, icons = {}, locale = "de" }: Props) {
  const title = section.title || "Aktuelles.";
  const description = section.content || "";
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              {title}
            </h2>
            {description && (
              <RichTextRenderer
                html={description}
                className="font-body text-text-gray text-sm md:text-base leading-[1.7] mt-3 max-w-xl"
              />
            )}
          </div>
          {ctaLabel && ctaHref && (
            <Link
              href={localizedHref(ctaHref, locale)}
              className="inline-flex items-center gap-2 font-heading text-anthracite text-sm font-semibold tracking-wide hover:text-pumpkin transition-colors duration-300 shrink-0"
            >
              {ctaLabel}
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.slice(0, 3).map((item) => (
            <NewsCard
              key={item.slug}
              title={item.title}
              tag={item.tag}
              date={item.date}
              description={item.description}
              slug={item.slug}
              imageUrl={item.imageUrl}
              locale={locale}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
