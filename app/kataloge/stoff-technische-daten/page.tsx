import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import {
  fabricQualities,
  propertiesComparison,
} from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";
import { getIconSlots } from "@/lib/cms/icons";
import { SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";
import CmsIcon from "@/components/cms/CmsIcon";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("stoff-technische-daten", "stoffTechnischeDaten");
  return {
    title: hero.seoTitle || "Stoff- & technische Daten | Mosaroma",
    description:
      hero.seoDescription ||
      "Technische Informationen zu Mosaroma Stoffqualitäten, Materialien, Gewichten und Prüfwerten.",
  };
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-text-gray/50 w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-body text-anthracite text-sm">{value}</span>
    </div>
  );
}

export default async function StoffTechnischeDatenPage() {
  const [layout, hero, result, icons] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("stoff-technische-daten", "stoffTechnischeDaten"),
    getServicePageBySlug("stoff-technische-daten"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS]),
  ]);

  if (result.state === "not-public") {
    notFound();
  }

  const hasCmsSections =
    result.state === "published" && result.page.sections.length > 0;

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
        <BreadcrumbBar items={[
          { label: "Kataloge", href: "/kataloge" },
          { label: "Stoff- & technische Daten" },
        ]} />

        {hasCmsSections ? (
          result.page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
            />
          ))
        ) : (
          <>
            {/* Static fallback — Fabric Qualities */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Stoffqualitäten
                  </p>
                </div>
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                  Material & Gewicht
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fabricQualities.map((fabric) => (
                    <div
                      key={fabric.slug}
                      className="bg-cream p-6 md:p-8 border border-light-gray"
                    >
                      <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-4">
                        {fabric.name}
                      </h3>
                      {fabric.subtitle && (
                        <span className="inline-block font-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1 border border-pumpkin/25 text-pumpkin/70 bg-pumpkin/5 mb-4">
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
                  ))}
                </div>
              </div>
            </section>

            {/* Static fallback — Properties Comparison */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                  Eigenschaften im Vergleich
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border border-light-gray bg-white">
                    <thead>
                      <tr className="bg-anthracite">
                        <th className="px-5 py-4 text-left font-accent text-[11px] font-normal uppercase tracking-[0.1em] text-white/70">
                          Eigenschaft
                        </th>
                        <th className="px-5 py-4 text-left font-accent text-[11px] font-normal uppercase tracking-[0.1em] text-white/70">
                          Prüfnorm
                        </th>
                        <th className="px-5 py-4 text-left font-accent text-[11px] font-normal uppercase tracking-[0.1em] text-pumpkin">
                          Solution Dyed Olefin
                        </th>
                        <th className="px-5 py-4 text-left font-accent text-[11px] font-normal uppercase tracking-[0.1em] text-white/70">
                          Piece Dyed Polyester
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertiesComparison.map((row, i) => (
                        <tr
                          key={row.property}
                          className={
                            i % 2 === 0 ? "bg-white" : "bg-cream/50"
                          }
                        >
                          <td className="px-5 py-4 font-heading text-anthracite text-sm font-semibold">
                            {row.property}
                          </td>
                          <td className="px-5 py-4 font-body text-text-gray/60 text-sm">
                            {row.standard}
                          </td>
                          <td className="px-5 py-4 font-body text-anthracite text-sm font-semibold">
                            {row.olefin}
                          </td>
                          <td className="px-5 py-4 font-body text-text-gray text-sm">
                            {row.polyester}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Static fallback — Mackintosh Highlights */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
                  Mackintosh® im Detail
                </h2>

                {fabricQualities[0].highlights && (
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
                )}

                <Link
                  href="/materialien"
                  className="inline-flex items-center gap-3 text-pumpkin mt-10 group"
                >
                  <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                    Alle Materialien entdecken
                  </span>
                  <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </section>

            {/* Static fallback — CTA */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Fragen zu Stoffen oder technischen Daten?
                </h2>
                <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
                  Wir beraten Sie gerne zu Materialien, Prüfwerten und
                  Stoffqualitäten.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/kontakt" className="btn-primary">
                    Kontakt aufnehmen
                  </Link>
                  <Link href="/kataloge" className="btn-outline-white">
                    Zurück zu Kataloge
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
