import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import NewsCard from "@/components/NewsCard";
import { newsItems } from "@/lib/mosaroma/news";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("neuigkeiten", "neuigkeiten");
  return {
    title: hero.seoTitle || "Neuigkeiten | Mosaroma",
    description:
      hero.seoDescription ||
      "Aktuelle Neuigkeiten, Kollektionen und Materialinnovationen von MOSAROMA.",
  };
}

export default async function NeuigkeitenPage() {
  const [layout, hero] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("neuigkeiten", "neuigkeiten"),
  ]);

  return (
    <>
      <Header {...layout.header} />
      <main>
        {/* Hero */}
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />

        {/* News Grid */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsItems.map((item) => (
                <NewsCard
                  key={item.slug}
                  title={item.title}
                  tag={item.tag}
                  date={item.date}
                  description={item.description}
                  slug={item.slug}
                  isPlaceholder={item.isPlaceholder}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
