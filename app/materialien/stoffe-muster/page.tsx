import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MaterialAnchorNav from "@/components/materials/MaterialAnchorNav";
import FabricLibrary from "@/components/materials/FabricLibrary";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getFabricLibraryData } from "@/lib/cms/fabric-library";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("stoffe-muster", "stoffeMuster");
  return {
    title:
      hero.seoTitle || "Stoffe & Muster | Mosaroma",
    description:
      hero.seoDescription ||
      "Entdecken Sie alle Mosaroma Stoffe und Muster. Filtern Sie nach Materialfamilie, Produktart oder Artikelnummer.",
  };
}

export default async function StoffeMusterPage() {
  const [layout, hero, fabricData] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("stoffe-muster", "stoffeMuster"),
    getFabricLibraryData(),
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
          height="compact"
        />
        <BreadcrumbBar
          items={[
            { label: "Materialien", href: "/materialien" },
            { label: "Stoffe & Muster" },
          ]}
        />
        <MaterialAnchorNav />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <FabricLibrary data={fabricData} />
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
