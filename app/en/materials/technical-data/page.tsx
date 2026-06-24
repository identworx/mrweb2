import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MaterialAnchorNavEn from "@/components/materials/MaterialAnchorNavEn";
import ScrollReveal from "@/components/ScrollReveal";
import TechnicalDataTableEn from "@/components/materials/TechnicalDataTableEn";
import { fabricQualities } from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import PageCta from "@/components/PageCta";

import DataRow from "@/components/DataRow";

export const revalidate = 60;

const fabricLabelsEn: Record<string, Record<string, string>> = {
  mackintosh: {
    material: "100% Olefin",
    weight: "from 260 g/m²",
    dyeing: "solution-dyed",
    comfort: "high seating comfort",
    cushionThickness: "5–6 cm thick cushions",
    description: "",
  },
  "mackintosh-lite": {
    material: "100% Olefin",
    weight: "approx. 170–300 g/m²",
    dyeing: "solution-dyed",
    comfort: "high seating comfort",
    cushionThickness: "5–6 cm cushions",
    description: "slightly lighter fabric",
  },
  nerio: {
    material: "100% Olefin (50% recycled)",
    weight: "approx. 200–230 g/m²",
    dyeing: "solution-dyed",
    comfort: "high seating comfort",
    cushionThickness: "5–6 cm cushions",
    subtitle: "Born from the ocean. Made for the future.",
  },
  basic: {
    material: "100% Polyester",
    weight: "approx. 280 g/m²",
    dyeing: "piece-dyed",
    comfort: "comfortable seating",
    description: "soft hand feel",
  },
};

const mackintoshHighlightsEn = [
  "Highest lightfastness (7–8)",
  "UV resistance 5/5",
  "Water uptake < 0.1%",
  "Bleach-resistant",
  "Mould-resistant",
  "PFAS-free",
];

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("technische-daten", "technischeDaten");
  return {
    title:
      hero.seoTitle || "Technical Data | Mosaroma",
    description:
      hero.seoDescription ||
      "Technical material properties, test values and outdoor performance of Mosaroma fabric qualities compared.",
  };
}

export default async function TechnicalDataPage() {
  const [layout, hero, icons] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("technische-daten", "technischeDaten"),
    getIconSlots(["arrow-right", "checkmark"]),
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
            { label: "Technical Data" },
          ]}
        />
        <MaterialAnchorNavEn />

        {/* Fabric Qualities */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                Fabric Qualities
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Material & Weight
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fabricQualities.map((fabric) => {
                const en = fabricLabelsEn[fabric.slug] || {};
                return (
                  <ScrollReveal key={fabric.slug}>
                    <div className="bg-cream p-6 md:p-8 border border-light-gray h-full">
                      <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-4">
                        {fabric.name}
                      </h3>
                      {(en.subtitle || fabric.subtitle) && (
                        <span className="inline-block font-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1 border border-pumpkin/25 text-text-muted bg-pumpkin/5 mb-4">
                          {en.subtitle || fabric.subtitle}
                        </span>
                      )}
                      <div className="space-y-3">
                        <DataRow label="Material" value={en.material || fabric.material} />
                        <DataRow label="Weight" value={en.weight || fabric.weight} />
                        <DataRow label="Dyeing" value={en.dyeing || fabric.dyeing} />
                        <DataRow label="Comfort" value={en.comfort || fabric.comfort} />
                        {fabric.cushionThickness && (
                          <DataRow
                            label="Cushion"
                            value={en.cushionThickness || fabric.cushionThickness}
                          />
                        )}
                      </div>
                      {(en.description || fabric.description) && (
                        <p className="font-body text-text-gray text-sm mt-4 italic">
                          {en.description || fabric.description}
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Properties Comparison */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              Properties Comparison
            </h2>

            <TechnicalDataTableEn />
          </div>
        </section>

        {/* Mackintosh® Highlights */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Mackintosh® in Detail
            </h2>

            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl">
                {mackintoshHighlightsEn.map((highlight) => (
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

            <Link
              href="/en/materials"
              className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin mt-10 group transition-colors duration-300"
            >
              <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                Discover all materials
              </span>
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>

        <PageCta
          variant="light"
          title="Questions about fabrics or technical data?"
          description="We are happy to advise you on materials, test values and fabric qualities."
          primaryLabel="Get in touch"
          primaryHref="/en/contact"
          secondaryLabel="View catalogue"
          secondaryHref="/en/catalogues"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
