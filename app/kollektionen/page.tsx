import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import CollectionCard from "@/components/CollectionCard";
import { collections } from "@/lib/mosaroma/collections";
import { pageHeroes } from "@/lib/mosaroma/pageHeroes";

export const metadata: Metadata = {
  title: "Kollektionen 2027 | Mosaroma",
  description:
    "Entdecken Sie die 7 Kollektionen von MOSAROMA -- kuratierte Farbwelten für den Außenbereich, gefertigt in Mackintosh®, Nerio und Basic Qualitäten.",
};

export default function KollektionenPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHeroes.kollektionen} />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.slug}
                  name={collection.name}
                  slug={collection.slug}
                  description={collection.description}
                  moodColors={collection.moodColors}
                  fabric={collection.fabric}
                  image={collection.image}
                  alt={collection.alt}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
