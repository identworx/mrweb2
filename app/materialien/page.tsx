import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import MaterialAnchorNav from "@/components/materials/MaterialAnchorNav";
import FabricLibraryPreview from "@/components/materials/FabricLibraryPreview";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import {
  fabricQualities,
  mackintoshTechnology,
  olefinBenefits,
  oceanCycleProcess,
} from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug, getSectionImage } from "@/lib/cms/service-pages";
import { getFabricPreviewSwatches } from "@/lib/cms/fabric-library";
import Image from "next/image";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("materialien", "materialien");
  return {
    title: hero.seoTitle || "Materialien & Technologie | Mosaroma",
    description:
      hero.seoDescription ||
      "Mackintosh® Technology: spinndüsengefärbtes Olefin für höchste Lichtechtheit, UV-Beständigkeit und niedrige CO₂-Bilanz. Entdecken Sie unsere Stoffqualitäten.",
  };
}

export default async function MaterialienPage() {
  const [layout, hero, result, previewSwatches, olefinImage] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("materialien", "materialien"),
    getServicePageBySlug("materialien"),
    getFabricPreviewSwatches(6),
    getSectionImage("materialien", "materials-olefin"),
  ]);

  const hasCmsSections =
    result.state === "published" && result.page.sections.length > 0;

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
        />
        <BreadcrumbBar items={[{ label: "Materialien" }]} />
        <MaterialAnchorNav />

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
            <section id="technologie" className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {mackintoshTechnology.steps.map((step, i) => (
                    <ScrollReveal key={step.title} delay={i * 120}>
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
                      <p className="font-accent text-pumpkin/70 text-xs tracking-[0.15em] uppercase mt-3">
                        {i === 0
                          ? "100 % PP"
                          : i === 1
                            ? "Additiv wasserabweisend"
                            : "spin-dyed UV-Pigmente"}
                      </p>
                    </ScrollReveal>
                  ))}
                </div>

                <ScrollReveal>
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
                </ScrollReveal>
              </div>
            </section>

            {/* Warum Olefin? */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className={`grid grid-cols-1 items-start gap-12 ${olefinImage ? "lg:grid-cols-[1fr_auto]" : ""}`}>
                  <div>
                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                      Warum <em className="text-pumpkin not-italic">Olefin?</em>
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-12">
                      {olefinBenefits.tags.map((tag, i) => (
                        <ScrollReveal key={tag} delay={i * 60}>
                          <span className="inline-block font-accent text-xs tracking-[0.15em] uppercase border border-anthracite/20 px-4 py-2 text-anthracite">
                            {tag}
                          </span>
                        </ScrollReveal>
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

                  {olefinImage && (
                    <ScrollReveal>
                      <div className="w-full lg:w-[420px] xl:w-[480px]">
                        <Image
                          src={olefinImage.url}
                          alt={olefinImage.alt}
                          width={480}
                          height={640}
                          className="w-full h-auto object-cover rounded-[14px] shadow-[0_24px_60px_rgba(45,45,45,0.10)] ring-1 ring-black/5"
                        />
                      </div>
                    </ScrollReveal>
                  )}
                </div>
              </div>
            </section>

            {/* Unsere Stofffamilien */}
            <section id="stofffamilien" className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Vier Qualitäten
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Unsere Stofffamilien
                </h2>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
                  Vier Materialfamilien, entwickelt für unterschiedliche Anforderungen im Outdoor-Bereich — von Premium-Olefin bis recyceltem Ozean-Polypropylen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {fabricQualities.map((fabric, i) => {
                    const isDark = i === 0;
                    return (
                      <ScrollReveal key={fabric.slug} delay={i * 80}>
                        <Link
                          href="/materialien/stoffe-muster"
                          className={`block p-7 h-full transition-all duration-300 motion-safe:hover:-translate-y-1 group ${
                            isDark
                              ? "bg-anthracite text-white"
                              : "bg-light-gray text-anthracite"
                          }`}
                        >
                          <h3
                            className={`font-heading text-lg font-bold mb-1 transition-colors duration-300 ${
                              isDark
                                ? "text-white group-hover:text-pumpkin"
                                : "text-anthracite group-hover:text-pumpkin"
                            }`}
                          >
                            {fabric.name}
                          </h3>
                          {fabric.subtitle && (
                            <p className="font-accent text-xs tracking-[0.15em] uppercase mb-4 text-pumpkin">
                              {fabric.subtitle}
                            </p>
                          )}
                          {!fabric.subtitle && <div className="mb-4" />}

                          <div className="space-y-3 text-sm">
                            <div>
                              <span
                                className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
                                  isDark ? "text-white/70" : "text-text-gray/60"
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
                                  isDark ? "text-white/70" : "text-text-gray/60"
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
                                  isDark ? "text-white/70" : "text-text-gray/60"
                                }`}
                              >
                                Färbung
                              </span>
                              <p
                                className={`font-body leading-relaxed ${
                                  isDark ? "text-white/80" : "text-anthracite"
                                }`}
                              >
                                {fabric.dyeing}
                              </p>
                            </div>
                          </div>

                          {fabric.highlights && fabric.highlights.length > 0 && (
                            <div className={`mt-5 pt-5 ${isDark ? "border-t border-white/10" : "border-t border-anthracite/10"}`}>
                              <ul className="space-y-2">
                                {fabric.highlights.slice(0, 3).map((hl) => (
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

                          <div className={`mt-5 pt-4 flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.1em] ${
                            isDark ? "text-pumpkin" : "text-pumpkin"
                          }`}>
                            <span>Stoffe ansehen</span>
                            <svg
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className="group-hover:translate-x-1 transition-transform duration-300"
                            >
                              <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                            </svg>
                          </div>
                        </Link>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* OceanCycle Kreislauf */}
            <section id="nachhaltigkeit" className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Nachhaltigkeit
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {oceanCycleProcess.title}
                </h2>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
                  {oceanCycleProcess.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-light-gray">
                  {oceanCycleProcess.steps.map((step, i) => (
                    <ScrollReveal key={step.title} delay={i * 100}>
                      <div className="bg-white p-6 md:p-8 h-full relative">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 bg-pumpkin/10 text-pumpkin font-heading text-sm font-bold">
                            {i + 1}
                          </span>
                          {i < oceanCycleProcess.steps.length - 1 && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="text-pumpkin/40 absolute right-4 top-8 hidden lg:block"
                            >
                              <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                            </svg>
                          )}
                        </div>
                        <h3 className="font-heading text-anthracite text-base font-bold mb-2">
                          {step.title}
                        </h3>
                        <p className="font-body text-text-gray text-sm leading-[1.8]">
                          {step.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <ScrollReveal>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {oceanCycleProcess.highlights.map((hl) => (
                      <div key={hl} className="flex items-start gap-3">
                        <svg
                          width="16"
                          height="16"
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
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Stoffe & Muster — Preview */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Stoffbibliothek
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Stoffe & Muster entdecken
                </h2>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-10">
                  Durchsuchen Sie unsere komplette Stoffbibliothek — filtern Sie nach Materialfamilie, Produktart oder suchen Sie gezielt nach Stoffname und Artikelnummer.
                </p>

                <FabricLibraryPreview swatches={previewSwatches} />
              </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Alle Details im Katalog
                </h2>
                <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
                  Entdecken Sie alle Stoffqualitäten, Farben und technischen Daten
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
