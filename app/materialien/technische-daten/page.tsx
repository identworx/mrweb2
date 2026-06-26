import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MaterialAnchorNav from "@/components/materials/MaterialAnchorNav";
import ScrollReveal from "@/components/ScrollReveal";
import TechnicalDataTable from "@/components/materials/TechnicalDataTable";
import { fabricQualities } from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import PageCta from "@/components/PageCta";

import DataRow from "@/components/DataRow";
import { notFound } from "next/navigation";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("technische-daten", "technischeDaten");
  return {
    title:
      hero.seoTitle || "Technische Daten | Mosaroma",
    description:
      hero.seoDescription ||
      "Technische Materialeigenschaften, Prüfwerte und Outdoor-Performance der Mosaroma Stoffqualitäten im Vergleich.",
  };
}

export default async function TechnischeDatenPage() {
  if (!(await isPublicPathEnabled("/materialien/technische-daten"))) notFound();

  const [layout, hero, icons] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("technische-daten", "technischeDaten"),
    getIconSlots(["arrow-right", "checkmark"]),
  ]);

  return (
    <>
      <Header {...layout.header} />
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
            { label: "Materialien", href: "/materialien" },
            { label: "Technische Daten" },
          ]}
        />
        <MaterialAnchorNav />

        {/* Stoffqualitäten */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                Stoffqualitäten
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Material & Gewicht
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fabricQualities.map((fabric) => (
                <ScrollReveal key={fabric.slug}>
                  <div className="bg-cream p-6 md:p-8 border border-light-gray h-full">
                    <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-4">
                      {fabric.name}
                    </h3>
                    {fabric.subtitle && (
                      <span className="inline-block font-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1 border border-pumpkin/25 text-text-muted bg-pumpkin/5 mb-4">
                        {fabric.subtitle}
                      </span>
                    )}
                    <div className="space-y-3">
                      <DataRow label="Material" value={fabric.material} />
                      <DataRow label="Gewicht" value={fabric.weight} />
                      <DataRow label="Färbung" value={fabric.dyeing} />
                      <DataRow label="Komfort" value={fabric.comfort} />
                      {fabric.cushionThickness && (
                        <DataRow
                          label="Auflagenstärke"
                          value={fabric.cushionThickness}
                        />
                      )}
                    </div>
                    {fabric.description && (
                      <p className="font-body text-text-gray text-sm mt-4 italic">
                        {fabric.description}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Eigenschaften im Vergleich */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              Eigenschaften im Vergleich
            </h2>

            <TechnicalDataTable />
          </div>
        </section>

        {/* Mackintosh® Highlights */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Mackintosh® im Detail
            </h2>

            {fabricQualities[0].highlights && (
              <ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl">
                  {fabricQualities[0].highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3 p-4 bg-cream"
                    >
                      <CmsIcon icon={icons["checkmark"]} width={18} height={18} className="text-pumpkin flex-shrink-0 mt-0.5" />
                      <span className="font-body text-anthracite text-sm leading-relaxed">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <Link
              href="/materialien"
              className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin mt-10 group transition-colors duration-300"
            >
              <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                Alle Materialien entdecken
              </span>
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>

        <PageCta
          variant="light"
          title="Fragen zu Stoffen oder technischen Daten?"
          description="Wir beraten Sie gerne zu Materialien, Prüfwerten und Stoffqualitäten."
          primaryLabel="Kontakt aufnehmen"
          primaryHref="/kontakt"
          secondaryLabel="Katalog ansehen"
          secondaryHref="/kataloge"
        />
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
