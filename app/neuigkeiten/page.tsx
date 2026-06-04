import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import NewsCard from "@/components/NewsCard";
import { newsItems } from "@/lib/mosaroma/news";

export const metadata: Metadata = {
  title: "Neuigkeiten | Mosaroma",
  description:
    "Aktuelle Neuigkeiten, Kollektionen und Materialinnovationen von MOSAROMA.",
};

export default function NeuigkeitenPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <PageHero accent="Aktuelles" title="Neuigkeiten" />

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
      <Footer />
    </>
  );
}
