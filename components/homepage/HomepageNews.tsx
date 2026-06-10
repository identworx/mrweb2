import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { FrontendNewsCard } from "@/lib/cms/news";
import NewsCard from "@/components/NewsCard";

interface Props {
  section: HomepageSection;
  articles: FrontendNewsCard[];
}

export default function HomepageNews({ section, articles }: Props) {
  const eyebrow = section.eyebrow || "Neuigkeiten";
  const title = section.title || "Aktuelles.";
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.slice(0, 3).map((item) => (
            <NewsCard
              key={item.slug}
              title={item.title}
              tag={item.tag}
              date={item.date}
              description={item.description}
              slug={item.slug}
            />
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
