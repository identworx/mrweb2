import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import CollectionCard from "@/components/CollectionCard";
import { getPublishedCollections } from "@/lib/cms/collections";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kollektionen", "kollektionen");
  return {
    title: hero.seoTitle || "Kollektionen 2027 | Mosaroma",
    description:
      hero.seoDescription ||
      "Entdecken Sie die 7 Kollektionen von MOSAROMA -- kuratierte Farbwelten für den Außenbereich, gefertigt in Mackintosh®, Nerio und Basic Qualitäten.",
  };
}

export default async function KollektionenPage() {
  const [layout, hero, collections] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("kollektionen", "kollektionen"),
    getPublishedCollections(),
  ]);

  return (
    <>
      <Header {...layout.header} />
      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "Kollektionen" }]} />

        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            {collections.length === 0 ? (
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                Aktuell sind keine Kollektionen verfügbar. Bitte schauen Sie
                später wieder vorbei.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <CollectionCard
                    key={collection.slug}
                    name={collection.name}
                    slug={collection.slug}
                    description={collection.shortDescription}
                    moodColors={collection.moodColors}
                    fabric={collection.fabric}
                    image={collection.cardImage}
                    alt={collection.cardAlt}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
