import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import FabricLibraryPreview from "@/components/materials/FabricLibraryPreview";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import {
  nerioStory,
  nerioPromise,
  nerioHighlights,
  nerioTechnicalFacts,
  oceanCycleProcess,
} from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import {
  getServicePageBySlug,
  getSectionData,
  getSectionImage,
} from "@/lib/cms/service-pages";
import { getNerioFabricSwatches } from "@/lib/cms/fabric-library";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("nerio", "nerio");
  return {
    title:
      hero.seoTitle ||
      "NERIO — Nachhaltige Outdoor-Stoffe | Mosaroma",
    description:
      hero.seoDescription ||
      "NERIO: Performance-Stoffe aus 50 % recyceltem Ozean-Polypropylen. OceanCycle® zertifiziert, PFAS-frei und spinndüsengefärbt für höchste Farbechtheit.",
  };
}

const PROMISE_ICONS: Record<string, React.ReactNode> = {
  recycle: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 7.5l4-4 4 4" />
      <path d="M11.5 3.5v10" />
      <path d="M19.4 15l-1.7 3H6.3l-1.7-3" />
      <path d="M3.5 12l2 3.5" />
      <path d="M20.5 12l-2 3.5" />
    </svg>
  ),
  droplet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  ),
  sun: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

export default async function NerioPage() {
  const [
    layout,
    hero,
    result,
    storyData,
    storyImage,
    oceanData,
    promiseData,
    highlightsData,
    techFactsData,
    productsData,
    ctaData,
    nerioSwatches,
  ] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("nerio", "nerio"),
    getServicePageBySlug("nerio"),
    getSectionData("nerio", "nerio-story"),
    getSectionImage("nerio", "nerio-story"),
    getSectionData("nerio", "nerio-oceancycle"),
    getSectionData("nerio", "nerio-promise"),
    getSectionData("nerio", "nerio-highlights"),
    getSectionData("nerio", "nerio-technical-facts"),
    getSectionData("nerio", "nerio-products-preview"),
    getSectionData("nerio", "nerio-final-cta"),
    getNerioFabricSwatches(),
  ]);

  const story = {
    eyebrow: storyData?.eyebrow || nerioStory.eyebrow,
    title: storyData?.title || nerioStory.title,
    content: storyData?.content?.trim() || null,
    fallbackParagraphs: nerioStory.paragraphs,
  };

  const ocean = {
    eyebrow: oceanData?.eyebrow || "OceanCycle®",
    title: oceanData?.title || oceanCycleProcess.title,
    content: oceanData?.content?.trim() || null,
    fallbackDescription: oceanCycleProcess.description,
    steps:
      Array.isArray(oceanData?.settings?.steps) &&
      (oceanData.settings.steps as Array<{ title: string; description: string }>).length > 0
        ? (oceanData.settings.steps as Array<{ title: string; description: string }>)
        : oceanCycleProcess.steps,
    highlights:
      Array.isArray(oceanData?.settings?.highlights) &&
      (oceanData.settings.highlights as string[]).length > 0
        ? (oceanData.settings.highlights as string[])
        : oceanCycleProcess.highlights,
  };

  const promise = {
    eyebrow: promiseData?.eyebrow || nerioPromise.eyebrow,
    title: promiseData?.title || nerioPromise.title,
    content: promiseData?.content?.trim() || null,
    items:
      Array.isArray(promiseData?.settings?.items) &&
      (promiseData.settings.items as Array<{ iconKey: string; title: string; text: string }>).length > 0
        ? (promiseData.settings.items as Array<{ iconKey: string; title: string; text: string }>)
        : nerioPromise.items,
  };

  const highlights = {
    eyebrow: highlightsData?.eyebrow || nerioHighlights.eyebrow,
    title: highlightsData?.title || nerioHighlights.title,
    stats:
      Array.isArray(highlightsData?.settings?.stats) &&
      (highlightsData.settings.stats as Array<{ value: string; label: string; detail: string }>).length > 0
        ? (highlightsData.settings.stats as Array<{ value: string; label: string; detail: string }>)
        : nerioHighlights.stats,
  };

  const techFacts = {
    eyebrow: techFactsData?.eyebrow || nerioTechnicalFacts.eyebrow,
    title: techFactsData?.title || nerioTechnicalFacts.title,
    content: techFactsData?.content?.trim() || null,
    facts:
      Array.isArray(techFactsData?.settings?.facts) &&
      (techFactsData.settings.facts as Array<{ label: string; value: string }>).length > 0
        ? (techFactsData.settings.facts as Array<{ label: string; value: string }>)
        : nerioTechnicalFacts.facts,
  };

  const productsPreview = {
    eyebrow: productsData?.eyebrow || "Stoffbibliothek",
    title: productsData?.title || "NERIO Stoffe entdecken",
    content: productsData?.content?.trim() || null,
    fallbackDescription:
      "Alle NERIO-Stoffe aus recyceltem Ozean-Polypropylen auf einen Blick. Filtern Sie nach Muster, Farbe und Produktverfügbarkeit.",
  };

  const cta = {
    title: ctaData?.title || "NERIO erleben",
    content:
      ctaData?.content ||
      "Entdecken Sie die vollständige NERIO-Kollektion und fordern Sie Ihr persönliches Musterset an.",
    buttonLabel: ctaData?.buttonLabel || "Musterset anfragen",
    buttonHref: ctaData?.buttonHref || "/kontakt",
  };

  const contentSections =
    result.state === "published"
      ? result.page.sections.filter(
          (s) =>
            !s.settings?.helper &&
            !String(s.settings?.style ?? "").startsWith("nerio-"),
        )
      : [];

  const hasCmsSections = contentSections.length > 0;

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
        <BreadcrumbBar items={[{ label: "NERIO" }]} />

        {hasCmsSections ? (
          contentSections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
            />
          ))
        ) : (
          <>
            {/* Story */}
            <section className="pt-12 md:pt-16 pb-24 md:pb-32 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div
                  className={`grid grid-cols-1 items-start gap-10 lg:gap-16 ${storyImage ? "lg:grid-cols-[5fr_4fr]" : ""}`}
                >
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="accent-line" />
                      <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                        {story.eyebrow}
                      </p>
                    </div>

                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                      {story.title}
                    </h2>

                    {story.content ? (
                      <RichTextRenderer
                        html={story.content}
                        className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] [&_p+p]:mt-5 [text-wrap:pretty]"
                      />
                    ) : (
                      <div className="space-y-5">
                        {story.fallbackParagraphs.map((p, i) => (
                          <p
                            key={i}
                            className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                            style={{ textWrap: "pretty" }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {storyImage && (
                    <ScrollReveal>
                      <div className="lg:mt-16">
                        <Image
                          src={storyImage.url}
                          alt={storyImage.alt}
                          width={600}
                          height={460}
                          className="w-full aspect-[5/4] object-cover shadow-[0_6px_28px_rgba(45,45,45,0.06)]"
                        />
                      </div>
                    </ScrollReveal>
                  )}
                </div>
              </div>
            </section>

            {/* OceanCycle Kreislauf */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    {ocean.eyebrow}
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {ocean.title}
                </h2>

                {ocean.content ? (
                  <RichTextRenderer
                    html={ocean.content}
                    className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12 [&_p+p]:mt-5"
                  />
                ) : (
                  <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
                    {ocean.fallbackDescription}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-light-gray">
                  {ocean.steps.map((step, i) => (
                    <ScrollReveal key={step.title} delay={i * 100}>
                      <div className="bg-white p-6 md:p-8 h-full relative">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 bg-pumpkin/10 text-pumpkin font-heading text-sm font-bold">
                            {i + 1}
                          </span>
                          {i < ocean.steps.length - 1 && (
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
                    {ocean.highlights.map((hl) => (
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

            {/* Versprechen */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    {promise.eyebrow}
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {promise.title}
                </h2>

                {promise.content && (
                  <RichTextRenderer
                    html={promise.content}
                    className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12 [&_p+p]:mt-5"
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                  {promise.items.map((item, i) => (
                    <ScrollReveal key={item.title} delay={i * 80}>
                      <div className="p-7 bg-cream h-full">
                        <div className="w-10 h-10 flex items-center justify-center text-pumpkin mb-5">
                          {PROMISE_ICONS[item.iconKey] || PROMISE_ICONS.shield}
                        </div>
                        <h3 className="font-heading text-anthracite text-base font-bold mb-2">
                          {item.title}
                        </h3>
                        <p className="font-body text-text-gray text-sm leading-[1.8]">
                          {item.text}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Highlights / Stats */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line !bg-pumpkin" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    {highlights.eyebrow}
                  </p>
                </div>

                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
                  {highlights.title}
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                  {highlights.stats.map((stat, i) => (
                    <ScrollReveal key={stat.label} delay={i * 100}>
                      <div className="bg-anthracite p-6 md:p-8 h-full">
                        <p className="font-heading text-pumpkin text-3xl md:text-4xl font-bold mb-2">
                          {stat.value}
                        </p>
                        <p className="font-heading text-white text-sm font-semibold uppercase tracking-[0.08em] mb-1">
                          {stat.label}
                        </p>
                        {stat.detail && (
                          <p className="font-body text-white/50 text-xs leading-relaxed">
                            {stat.detail}
                          </p>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Technische Fakten */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    {techFacts.eyebrow}
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {techFacts.title}
                </h2>

                {techFacts.content && (
                  <RichTextRenderer
                    html={techFacts.content}
                    className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12 [&_p+p]:mt-5"
                  />
                )}

                <ScrollReveal>
                  <div className="bg-white overflow-hidden mt-8">
                    <table className="w-full">
                      <tbody>
                        {techFacts.facts.map((fact, i) => (
                          <tr
                            key={fact.label}
                            className={i < techFacts.facts.length - 1 ? "border-b border-light-gray" : ""}
                          >
                            <td className="py-4 px-5 md:px-8 font-heading text-anthracite text-sm font-semibold uppercase tracking-[0.06em] w-1/3">
                              {fact.label}
                            </td>
                            <td className="py-4 px-5 md:px-8 font-body text-text-gray text-sm leading-relaxed">
                              {fact.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* NERIO Stoffe Preview */}
            {nerioSwatches.length > 0 && (
              <section className="section-padding bg-white">
                <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="accent-line" />
                    <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                      {productsPreview.eyebrow}
                    </p>
                  </div>

                  <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    {productsPreview.title}
                  </h2>

                  {productsPreview.content ? (
                    <RichTextRenderer
                      html={productsPreview.content}
                      className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-10 [&_p+p]:mt-5"
                    />
                  ) : (
                    <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-10">
                      {productsPreview.fallbackDescription}
                    </p>
                  )}

                  <FabricLibraryPreview swatches={nerioSwatches} />

                  <div className="mt-10 flex items-center gap-4">
                    <Link
                      href="/materialien/stoffe-muster?family=nerio"
                      className="btn-primary"
                    >
                      Alle NERIO-Stoffe ansehen
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {cta.title}
                </h2>
                <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
                  {cta.content}
                </p>
                <Link
                  href={cta.buttonHref}
                  className="btn-outline-white"
                >
                  {cta.buttonLabel}
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
