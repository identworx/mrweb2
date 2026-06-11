import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MeasurementNav from "@/components/measurements/MeasurementNav";
import MeasurementImageCard from "@/components/measurements/MeasurementImageCard";
import BenchMeasurementCard from "@/components/measurements/BenchMeasurementCard";
import MaterialQualityBox from "@/components/measurements/MaterialQualityBox";
import CustomSizeCta from "@/components/measurements/CustomSizeCta";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublicMeasurements, measurementGroups } from "@/lib/cms/measurements";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("produktmasse", "produktmasse");
  return {
    title: hero.seoTitle || "Produktmaße | Mosaroma",
    description:
      hero.seoDescription ||
      "Übersicht der wichtigsten Mosaroma Produktmaße für Kissen, Auflagen, Lehner, Bankauflagen, Poufs, Tischsets und Tischläufer.",
  };
}

export default async function ProduktmassePage() {
  const [layout, hero, allMeasurements] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("produktmasse", "produktmasse"),
    getPublicMeasurements(),
  ]);

  const kissenItems = allMeasurements.filter((m) => m.group === "kissen-auflagen");
  const lehnerItems = allMeasurements.filter((m) => m.group === "lehner");
  const bankauflagenItem = allMeasurements.find((m) => m.group === "bankauflagen");
  const poufItems = allMeasurements.filter((m) => m.group === "poufs");
  const tischItems = allMeasurements.filter((m) => m.group === "tischsets");

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
        <BreadcrumbBar items={[
          { label: "Kataloge", href: "/kataloge" },
          { label: "Produktmaße" },
        ]} />

        {/* Notice + Quick Nav */}
        <section className="bg-white pt-10 pb-6 md:pt-14 md:pb-8">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <p className="font-body text-text-gray text-sm leading-relaxed">
                  Alle Maße sind ca.-Maße und sollten vorab auf Passgenauigkeit
                  geprüft werden.
                </p>
                <p className="font-body text-text-gray/60 text-xs mt-1">
                  Sondermaße auf Anfrage möglich.
                </p>
              </div>
            </div>
            <MeasurementNav />
          </div>
        </section>

        {/* Kissen & Auflagen */}
        <section id="kissen-auflagen" className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                {measurementGroups[0].title}
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Kissen & Auflagen
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {kissenItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Lehner */}
        <section id="lehner" className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Hochlehner & Niedriglehner
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lehnerItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Bankauflagen */}
        <section id="bankauflagen" className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Bankauflagen
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {poufItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Tischsets & Tischläufer */}
        <section id="tischsets" className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Tischsets & Tischläufer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {tischItems.map((item) => (
                <MeasurementImageCard key={item.slug} item={item} />
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
              <MaterialQualityBox />
              <CustomSizeCta />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Fragen zu Produktmaßen?
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Sprechen Sie uns an — wir beraten Sie gerne zu Maßen,
              Sonderanfertigungen und Verfügbarkeit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kontakt" className="btn-outline-white">
                Kontakt aufnehmen
              </Link>
              <Link href="/kataloge" className="btn-outline-white">
                Zurück zu Kataloge
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
