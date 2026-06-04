import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import CategoryCard from "@/components/CategoryCard";
import { getActiveProductGroups } from "@/lib/cms/product-groups";
import { getPublicLayoutData } from "@/lib/cms/public-layout";

export const metadata: Metadata = {
  title: "Produktkategorien | Mosaroma Outdoor-Textilien",
  description:
    "Entdecken Sie Dekokissen, Hochlehner, Niedriglehner, Sitzkissen, Sitzpolster, Bankauflagen, Poufs, Tischsets und Decken von Mosaroma.",
};

export const revalidate = 60;

export default async function ProduktkategorienPage() {
  const [layout, groups] = await Promise.all([
    getPublicLayoutData(),
    getActiveProductGroups(),
  ]);

  return (
    <>
      <Header {...layout.header} />
      <main>
        <PageHero
          eyebrow="Entdecken"
          title="Produktkategorien"
          description="Entdecken Sie alle MOSAROMA Produktkategorien -- von Dekokissen und Auflagen bis hin zu Poufs, Tischsets und Decken. Jede Kategorie vereint Premium-Materialien mit durchdachtem Design fuer den Aussenbereich."
        />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <CategoryCard
                  key={group.slug}
                  title={group.name}
                  image={group.image}
                  alt={group.imageAlt}
                  description={group.shortDescription}
                  href={`/produktkategorien/${group.slug}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-6">
              Sie suchen nach Farbe oder Kollektion? Entdecken Sie unsere
              Kollektionen.
            </p>
            <Link href="/kollektionen" className="btn-outline">
              Zu den Kollektionen
            </Link>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
