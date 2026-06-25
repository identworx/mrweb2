import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MaterialAnchorNavEn from "@/components/materials/MaterialAnchorNavEn";
import FabricLibrary from "@/components/materials/FabricLibrary";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getFabricLibraryData } from "@/lib/cms/fabric-library";
import { getIconSlots } from "@/lib/cms/icons";
import { getDictionaryAsync } from "@/lib/i18n/dictionary-async";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("stoffe-muster", "stoffeMuster", "en");
  return {
    title: "Fabrics & Samples | Mosaroma",
    description:
      "Discover all Mosaroma fabrics and samples. Filter by material family, product type or article number.",
  };
}

export default async function FabricsSamplesPage({
  searchParams,
}: {
  searchParams: Promise<{ family?: string }>;
}) {
  const { family } = await searchParams;
  const [layout, hero, fabricData, icons, dictionary] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("stoffe-muster", "stoffeMuster", "en"),
    getFabricLibraryData("en"),
    getIconSlots(["ui-search", "ui-grid", "ui-matrix", "ui-close", "ui-image-placeholder", "arrow-right", "checkmark"]),
    getDictionaryAsync("en"),
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
          height="compact"
        />
        <BreadcrumbBar
          items={[
            { label: "Materials", href: "/en/materials" },
            { label: "Fabrics & Samples" },
          ]}
        />
        <MaterialAnchorNavEn />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <FabricLibrary data={fabricData} initialFamily={family} icons={icons} locale="en" dictionary={dictionary} />
          </div>
        </section>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
