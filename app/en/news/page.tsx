import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import NewsCard from "@/components/NewsCard";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublishedNewsArticles } from "@/lib/cms/news";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("neuigkeiten", "neuigkeiten", "en");
  return {
    title: "News | Mosaroma",
    description:
      "Latest news, collections and material innovations from MOSAROMA.",
  };
}

export default async function NewsPage() {
  const [layout, hero, articles] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("neuigkeiten", "neuigkeiten", "en"),
    getPublishedNewsArticles("en"),
  ]);

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "News" }]} locale="en" />

        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            {articles.length === 0 ? (
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                There are currently no news articles. Please check back later.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((item) => (
                  <NewsCard
                    key={item.slug}
                    title={item.title}
                    tag={item.tag}
                    date={item.date}
                    description={item.description}
                    slug={item.slug}
                    imageUrl={item.imageUrl}
                    locale="en"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
