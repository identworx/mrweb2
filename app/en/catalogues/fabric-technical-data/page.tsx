import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import {
  fabricQualities,
} from "@/lib/mosaroma/materials";
import TechnicalDataTableEn from "@/components/materials/TechnicalDataTableEn";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";
import { getIconSlots } from "@/lib/cms/icons";
import { SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";
import CmsIcon from "@/components/cms/CmsIcon";
import DataRow from "@/components/DataRow";
import PageCta from "@/components/PageCta";
import { getTranslations } from "@/lib/i18n/get-translation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, t] = await Promise.all([
    getPageHeroData("stoff-technische-daten", "stoffTechnischeDaten", "en"),
    getTranslations("page", "fabric-technical-data", "en"),
  ]);
  return {
    title: t["seoTitle"] || "Fabric & Technical Data | Mosaroma",
    description: t["seoDescription"] || "Technical information on Mosaroma fabric qualities, materials, weights and test values.",
  };
}

export default async function FabricTechnicalDataPage() {
  const [layout, hero, result, icons, t] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("stoff-technische-daten", "stoffTechnischeDaten", "en"),
    getServicePageBySlug("stoff-technische-daten"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS]),
    getTranslations("page", "fabric-technical-data", "en"),
  ]);

  if (result.state === "not-public") {
    notFound();
  }

  const FABRIC_EN: Record<string, Record<string, string>> = {
    mackintosh: { dyeing: "solution-dyed", comfort: "high seating comfort", cushionThickness: "5–6 cm thick cushions" },
    "mackintosh-lite": { dyeing: "solution-dyed", comfort: "high seating comfort", cushionThickness: "5–6 cm cushions", description: "slightly lighter fabric" },
    nerio: { dyeing: "solution-dyed", comfort: "high seating comfort", cushionThickness: "5–6 cm cushions", subtitle: "Born from the ocean. Made for the future." },
    basic: { dyeing: "piece-dyed", comfort: "comfortable seating", description: "soft feel" },
  };

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
          { label: t["breadcrumb.catalogues"] || "Catalogues", href: "/en/catalogues" },
          { label: t["breadcrumb.self"] || "Fabric & Technical Data" },
        ]} locale="en" />

        <>
            {/* Static fallback — Fabric Qualities */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                    {t["qualitiesEyebrow"] || "Fabric Qualities"}
                  </p>
                </div>
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                  {t["qualitiesTitle"] || "Material & Weight"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fabricQualities.map((fabric) => {
                    const en = FABRIC_EN[fabric.slug] || {};
                    return (
                      <div
                        key={fabric.slug}
                        className="bg-cream p-6 md:p-8 border border-light-gray"
                      >
                        <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-4">
                          {fabric.name}
                        </h3>
                        {(en.subtitle || fabric.subtitle) && (
                          <span className="inline-block font-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1 border border-pumpkin/25 text-text-muted bg-pumpkin/5 mb-4">
                            {en.subtitle || fabric.subtitle}
                          </span>
                        )}
                        <div className="space-y-3">
                          <DataRow label="Material" value={fabric.material} />
                          <DataRow label="Weight" value={fabric.weight} />
                          <DataRow label="Dyeing" value={en.dyeing || fabric.dyeing} />
                          <DataRow label="Comfort" value={en.comfort || fabric.comfort} />
                          {fabric.cushionThickness && (
                            <DataRow
                              label="Cushion Thickness"
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
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Static fallback — Properties Comparison */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                  {t["comparisonTitle"] || "Properties Comparison"}
                </h2>

                <TechnicalDataTableEn />
              </div>
            </section>

            {/* Static fallback — Mackintosh Highlights */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
                  {t["mackintoshTitle"] || "Mackintosh® in Detail"}
                </h2>

                {(() => {
                  const highlightsEn = [
                    "Highest lightfastness (7–8)",
                    "UV resistance 5/5",
                    "Water absorption < 0.1%",
                    "Bleach resistant",
                    "Mould resistant",
                    "PFAS-free",
                  ];
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl">
                      {highlightsEn.map((highlight) => (
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
                  );
                })()}

                <Link
                  href="/en/materials"
                  className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin mt-10 group transition-colors duration-300"
                >
                  <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                    {t["discoverLink"] || "Discover all materials"}
                  </span>
                  <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </section>

            <PageCta
              variant="light"
              title={t["cta.title"] || "Questions about fabrics or technical data?"}
              description={t["cta.description"] || "We are happy to advise you on materials, test values and fabric qualities."}
              primaryLabel={t["cta.primaryLabel"] || "Contact us"}
              primaryHref="/en/contact"
              secondaryLabel={t["cta.secondaryLabel"] || "Back to Catalogues"}
              secondaryHref="/en/catalogues"
            />
        </>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
