import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MeasurementNavEn from "@/components/measurements/MeasurementNavEn";
import MeasurementImageCard from "@/components/measurements/MeasurementImageCard";
import BenchMeasurementCard from "@/components/measurements/BenchMeasurementCard";
import MaterialQualityBox from "@/components/measurements/MaterialQualityBox";
import CustomSizeCta from "@/components/measurements/CustomSizeCta";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getIconSlots } from "@/lib/cms/icons";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublicMeasurements } from "@/lib/cms/measurements";
import PageCta from "@/components/PageCta";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("produktmasse", "produktmasse");
  return {
    title: hero.seoTitle || "Product Dimensions | Mosaroma",
    description:
      hero.seoDescription ||
      "Overview of key Mosaroma product dimensions for cushions, pads, back cushions, bench cushions, poufs, placemats and table runners.",
  };
}

export default async function ProductDimensionsPage() {
  const [layout, hero, allMeasurements, icons] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("produktmasse", "produktmasse"),
    getPublicMeasurements(),
    getIconSlots(["arrow-right"]),
  ]);

  const kissenItems = allMeasurements.filter((m) => m.group === "kissen-auflagen");
  const lehnerItems = allMeasurements.filter((m) => m.group === "lehner");
  const bankauflagenItem = allMeasurements.find((m) => m.group === "bankauflagen");
  const poufItems = allMeasurements.filter((m) => m.group === "poufs");
  const tischItems = allMeasurements.filter((m) => m.group === "tischsets");

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
        <BreadcrumbBar items={[
          { label: "Catalogues", href: "/en/catalogues" },
          { label: "Product Dimensions" },
        ]} />

        {/* Notice + Quick Nav */}
        <section className="bg-white pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <p className="font-body text-text-gray text-sm leading-relaxed">
                  All dimensions are approximate and should be checked for fit
                  before ordering.
                </p>
                <p className="font-body text-text-muted text-xs mt-1">
                  Custom sizes available on request.
                </p>
              </div>
            </div>
            <MeasurementNavEn />
          </div>
        </section>

        {/* Cushions & Pads */}
        <section id="kissen-auflagen" className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
                Cushions & Pads
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Cushions & Pads
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {kissenItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Back Cushions */}
        <section id="lehner" className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              High-Back & Low-Back Cushions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lehnerItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} mediaSize="tall" />
              ))}
            </div>
          </div>
        </section>

        {/* Bench Cushions */}
        <section id="bankauflagen" className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Bench Cushions
            </h2>

            {bankauflagenItem && (
              <BenchMeasurementCard item={bankauflagenItem} />
            )}
          </div>
        </section>

        {/* Poufs */}
        <section id="poufs" className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Poufs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {poufItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Placemats & Table Runners */}
        <section id="tischsets" className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Placemats & Table Runners
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {tischItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} mediaSize="wide" />
              ))}
            </div>
          </div>
        </section>

        {/* Material Quality + Custom Size */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div
              id="massanfertigung"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <MaterialQualityBox icons={icons} locale="en" />
              <CustomSizeCta icons={icons} locale="en" />
            </div>
          </div>
        </section>

        <PageCta
          variant="minimal"
          title="Questions about product dimensions?"
          description="Get in touch — we are happy to advise on dimensions, custom sizes and availability."
          primaryLabel="Contact us"
          primaryHref="/en/contact"
          secondaryLabel="Back to Catalogues"
          secondaryHref="/en/catalogues"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
