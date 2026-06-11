import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import {
  fabricQualities,
  propertiesComparison,
  mackintoshTechnology,
  olefinBenefits,
} from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("materialien", "materialien");
  return {
    title: hero.seoTitle || "Materialien & Technologie | Mosaroma",
    description:
      hero.seoDescription ||
      "Mackintosh® Technology: spinnduesengefaerbtes Olefin fuer hoechste Lichtechtheit, UV-Bestaendigkeit und niedrige CO2-Bilanz. Entdecken Sie unsere Stoffqualitaeten.",
  };
}

export default async function MaterialienPage() {
  const [layout, hero, result] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("materialien", "materialien"),
    getServicePageBySlug("materialien"),
  ]);

  const hasCmsSections =
    result.state === "published" && result.page.sections.length > 0;

  return (
    <>
      <Header {...layout.header} />
      <main>
        {/* Hero */}
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "Materialien" }]} />

        {hasCmsSections ? (
          result.page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
            />
          ))
        ) : (
        <>
        {/* Mackintosh® Technologie */}
        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Technologie
              </p>
            </div>

            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              {mackintoshTechnology.title}
            </h2>

            <div className="max-w-3xl space-y-5 mb-16">
              {mackintoshTechnology.description.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 3 Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {mackintoshTechnology.steps.map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 bg-pumpkin text-white font-heading text-sm font-bold">
                      {i + 1}
                    </span>
                    <h3 className="font-heading text-anthracite text-lg font-bold">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-body text-text-gray text-sm leading-[1.8]">
                    {step.description}
                  </p>
                  {/* Subline */}
                  <p className="font-accent text-pumpkin/70 text-xs tracking-[0.15em] uppercase mt-3">
                    {i === 0
                      ? "100 % PP"
                      : i === 1
                        ? "Additiv wasserabweisend"
                        : "spin-dyed UV-Pigmente"}
                  </p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-cream p-8 md:p-12">
              <h3 className="font-heading text-anthracite text-xl font-bold mb-6">
                Vorteile der Mackintosh® Technology
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mackintoshTechnology.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pumpkin flex-shrink-0 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-body text-anthracite text-sm leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Warum Olefin? */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              Warum <em className="text-pumpkin not-italic">Olefin?</em>
            </h2>

            <div className="flex flex-wrap gap-3 mb-12">
              {olefinBenefits.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-accent text-xs tracking-[0.15em] uppercase border border-anthracite/20 px-4 py-2 text-anthracite"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="max-w-3xl space-y-5">
              {olefinBenefits.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                  style={{ textWrap: "pretty" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Unsere Stoffe */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              Unsere Stoffe
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fabricQualities.map((fabric, i) => {
                const isDark = i === 0;
                return (
                  <div
                    key={fabric.slug}
                    className={`p-7 transition-all duration-300 motion-safe:hover:-translate-y-1 ${
                      isDark
                        ? "bg-anthracite text-white"
                        : "bg-light-gray text-anthracite"
                    }`}
                  >
                    <h3
                      className={`font-heading text-lg font-bold mb-1 ${
                        isDark ? "text-white" : "text-anthracite"
                      }`}
                    >
                      {fabric.name}
                    </h3>
                    {fabric.subtitle && (
                      <p
                        className={`font-accent text-xs tracking-[0.15em] uppercase mb-4 ${
                          isDark ? "text-pumpkin" : "text-pumpkin"
                        }`}
                      >
                        {fabric.subtitle}
                      </p>
                    )}
                    {!fabric.subtitle && <div className="mb-4" />}

                    <div className="space-y-3 text-sm">
                      <div>
                        <span
                          className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isDark ? "text-white/60" : "text-text-gray/60"
                          }`}
                        >
                          Material
                        </span>
                        <p
                          className={`font-body leading-relaxed ${
                            isDark ? "text-white/80" : "text-anthracite"
                          }`}
                        >
                          {fabric.material}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isDark ? "text-white/60" : "text-text-gray/60"
                          }`}
                        >
                          Gewicht
                        </span>
                        <p
                          className={`font-body leading-relaxed ${
                            isDark ? "text-white/80" : "text-anthracite"
                          }`}
                        >
                          {fabric.weight}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isDark ? "text-white/60" : "text-text-gray/60"
                          }`}
                        >
                          Faerbung
                        </span>
                        <p
                          className={`font-body leading-relaxed ${
                            isDark ? "text-white/80" : "text-anthracite"
                          }`}
                        >
                          {fabric.dyeing}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            isDark ? "text-white/60" : "text-text-gray/60"
                          }`}
                        >
                          Komfort
                        </span>
                        <p
                          className={`font-body leading-relaxed ${
                            isDark ? "text-white/80" : "text-anthracite"
                          }`}
                        >
                          {fabric.comfort}
                        </p>
                      </div>
                      {fabric.cushionThickness && (
                        <div>
                          <span
                            className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
                              isDark ? "text-white/60" : "text-text-gray/60"
                            }`}
                          >
                            Auflagenstaerke
                          </span>
                          <p
                            className={`font-body leading-relaxed ${
                              isDark ? "text-white/80" : "text-anthracite"
                            }`}
                          >
                            {fabric.cushionThickness}
                          </p>
                        </div>
                      )}
                    </div>

                    {fabric.highlights && fabric.highlights.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-white/10">
                        <ul className="space-y-2">
                          {fabric.highlights.map((hl) => (
                            <li
                              key={hl}
                              className="flex items-start gap-2 text-sm"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-pumpkin flex-shrink-0 mt-0.5"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span
                                className={`font-body leading-relaxed ${
                                  isDark ? "text-white/70" : "text-text-gray"
                                }`}
                              >
                                {hl}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {fabric.description && (
                      <p
                        className={`font-body text-sm mt-4 italic ${
                          isDark ? "text-white/60" : "text-text-gray/70"
                        }`}
                      >
                        {fabric.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="font-body text-text-gray/70 text-sm italic mt-10">
              Weitere Qualitäten auf Anfrage möglich.
            </p>
          </div>
        </section>

        {/* Eigenschaften im Vergleich */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Eigenschaften im Vergleich
              </p>
            </div>

            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              Mackintosh® Olefin{" "}
              <span className="text-text-gray font-normal">· Polyester</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr>
                    <th className="text-left font-accent text-[11px] font-normal uppercase tracking-[0.12em] text-anthracite/50 py-4 px-5">
                      Eigenschaft
                    </th>
                    <th className="text-left font-accent text-[11px] font-normal uppercase tracking-[0.12em] text-anthracite/50 py-4 px-5">
                      Prüfnorm
                    </th>
                    <th className="text-left font-accent text-[11px] font-normal uppercase tracking-[0.12em] text-pumpkin py-4 px-5">
                      Solution Dyed Olefin
                    </th>
                    <th className="text-left font-accent text-[11px] font-normal uppercase tracking-[0.12em] text-anthracite/50 py-4 px-5">
                      Piece Dyed Polyester
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesComparison.map((row, i) => (
                    <tr
                      key={row.property}
                      className={i % 2 === 0 ? "bg-white" : "bg-transparent"}
                    >
                      <td className="font-body text-anthracite text-sm font-medium py-4 px-5">
                        {row.property}
                      </td>
                      <td className="font-body text-text-gray/60 text-sm py-4 px-5">
                        {row.standard}
                      </td>
                      <td className="font-body text-anthracite text-sm font-semibold py-4 px-5">
                        {row.olefin}
                      </td>
                      <td className="font-body text-text-gray text-sm py-4 px-5">
                        {row.polyester}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-1">
              <p className="font-body text-text-gray/50 text-xs">
                ¹ Die Bewertung erfolgt auf einer Skala von 1–8, wobei 1 die schlechteste und 8 die beste Bewertung darstellt.
              </p>
              <p className="font-body text-text-gray/50 text-xs">
                ² Die Bewertung der Waschechtheit und der Reibungsfestigkeit erfolgt auf einer Skala von 1–5, wobei 1 die schlechteste und 5 die beste Bewertung ist.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Alle Details im Katalog
            </h2>
            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Entdecken Sie alle Stoffqualitaeten, Farben und technischen Daten
              in unserem aktuellen Katalog.
            </p>
            <Link href="/kataloge" className="btn-outline-white">
              Katalog ansehen
            </Link>
          </div>
        </section>
        </>
        )}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
