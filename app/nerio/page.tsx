import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const NERIO_PRODUCT_TYPES = [
  { slug: "dekokissen", name: "Deko-Kissen", image: "/images/placeholders/categories/dekokissen.svg" },
  { slug: "hochlehner", name: "Hochlehner", image: "/images/placeholders/categories/hochlehner.svg" },
  { slug: "niedriglehner", name: "Niedriglehner", image: "/images/placeholders/categories/niedriglehner.svg" },
  { slug: "sitzkissen", name: "Sitzkissen", image: "/images/placeholders/categories/sitzkissen.svg" },
  { slug: "bankauflagen", name: "Bankauflagen", image: "/images/placeholders/categories/bankauflagen.svg" },
];

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
    eyebrow: productsData?.eyebrow || "Produkte & Stoffe",
    title: productsData?.title || "NERIO Stoffe entdecken",
    content: productsData?.content?.trim() || null,
    fallbackDescription:
      "Alle NERIO-Stoffe aus recyceltem Ozean-Polypropylen auf einen Blick — verfügbar als Auflagen, Kissen und Accessoires.",
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
        {/* NERIO Hero */}
        <section className="relative overflow-hidden h-[400px] md:h-[480px] flex items-end">
          <Image
            src={hero.image}
            alt={hero.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(12,61,64,0.92) 0%, rgba(12,61,64,0.7) 30%, rgba(12,61,64,0.45) 55%, rgba(12,61,64,0.2) 80%, rgba(12,61,64,0.1) 100%)",
            }}
          />
          <div className="relative w-full pb-10 md:pb-14">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              {hero.eyebrow && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-px bg-pumpkin" />
                  <p className="font-accent text-pumpkin text-[11px] tracking-[0.3em] uppercase">
                    {hero.eyebrow}
                  </p>
                </div>
              )}

              <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-[3rem] font-bold tracking-tight leading-[1.08] max-w-3xl">
                {hero.title}
              </h1>

              {hero.description && (
                <p className="font-body text-white/70 text-sm md:text-base leading-[1.7] mt-3 max-w-2xl">
                  {hero.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/materialien/stoffe-muster?family=nerio"
                  className="btn-primary"
                >
                  Stoffe ansehen
                </Link>
                <Link
                  href="/kollektionen/nerio-oceana"
                  className="btn-outline-white"
                >
                  Collection ansehen
                </Link>
              </div>
            </div>
          </div>
        </section>

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
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] items-start gap-10 lg:gap-16">
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
                        <div className="mt-3 bg-[#1B6B6D]/[0.06] p-5 md:p-6">
                          <p className="font-heading text-anthracite text-base md:text-lg font-semibold leading-snug">
                            50 % recyceltes Ozean-Polypropylen — keine Kompromisse bei Performance.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <ScrollReveal>
                    <div className="lg:mt-16">
                      <Image
                        src={storyImage?.url || "/images/placeholders/nerio/story.svg"}
                        alt={storyImage?.alt || "NERIO Stoffnahaufnahme"}
                        width={600}
                        height={480}
                        className="w-full aspect-[5/4] object-cover shadow-[0_6px_28px_rgba(45,45,45,0.06)]"
                      />
                    </div>
                  </ScrollReveal>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ocean.steps.map((step, i) => (
                    <ScrollReveal key={step.title} delay={i * 100}>
                      <div className="bg-white h-full">
                        <div
                          className="aspect-[4/3] relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${
                              ["#0C3D40", "#145A5C", "#1B6B6D", "#1A5C5E"][i] || "#1B6B6D"
                            }, ${
                              ["#145A5C", "#1B6B6D", "#2E8B8B", "#1B6B6D"][i] || "#165858"
                            })`,
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)",
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 flex items-center justify-center bg-white/10 text-white/60 font-heading text-lg font-bold">
                              {i + 1}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 md:p-8">
                          <h3 className="font-heading text-anthracite text-lg font-bold mb-2">
                            {step.title}
                          </h3>
                          <p className="font-body text-text-gray text-sm leading-[1.8]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <ScrollReveal>
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            {/* Produkte & Stoffe */}
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {NERIO_PRODUCT_TYPES.map((type) => (
                    <Link
                      key={type.slug}
                      href="/materialien/stoffe-muster?family=nerio"
                      className="group"
                    >
                      <div className="aspect-square overflow-hidden bg-cream relative">
                        <Image
                          src={type.image}
                          alt={type.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>
                      <p className="font-heading text-anthracite text-sm font-semibold mt-3 group-hover:text-pumpkin transition-colors duration-300">
                        {type.name}
                      </p>
                    </Link>
                  ))}
                </div>

                {nerioSwatches.length > 0 && (
                  <div className="mt-16">
                    <h3 className="font-heading text-anthracite text-xl font-bold mb-6">
                      Aktuelle NERIO-Stoffe
                    </h3>
                    <FabricLibraryPreview swatches={nerioSwatches} />
                  </div>
                )}

                <div className="mt-10">
                  <Link
                    href="/materialien/stoffe-muster?family=nerio"
                    className="btn-primary"
                  >
                    Alle NERIO-Stoffe ansehen
                  </Link>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-center">
                  {cta.title}
                </h2>
                <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-12 text-center">
                  {cta.content}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <Link
                    href="/materialien/stoffe-muster?family=nerio"
                    className="group block bg-white/[0.06] border border-white/[0.08] p-8 text-center transition-all duration-300 hover:bg-white/[0.10] hover:border-white/[0.14]"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-pumpkin">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="3" y1="15" x2="21" y2="15" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                        <line x1="15" y1="3" x2="15" y2="21" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-white text-lg font-bold mb-2">
                      NERIO Stoffe
                    </h3>
                    <p className="font-body text-white/50 text-sm leading-relaxed mb-6">
                      Alle Stoffe, Muster und Farben der NERIO-Linie entdecken.
                    </p>
                    <span className="font-heading text-pumpkin text-xs font-semibold uppercase tracking-[0.12em] group-hover:tracking-[0.16em] transition-all duration-300">
                      Stoffe ansehen
                    </span>
                  </Link>

                  <Link
                    href="/kollektionen/nerio-oceana"
                    className="group block bg-white/[0.06] border border-white/[0.08] p-8 text-center transition-all duration-300 hover:bg-white/[0.10] hover:border-white/[0.14]"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-pumpkin">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-white text-lg font-bold mb-2">
                      NERIO Collection
                    </h3>
                    <p className="font-body text-white/50 text-sm leading-relaxed mb-6">
                      Die NERIO Oceana Kollektion mit allen Produkten.
                    </p>
                    <span className="font-heading text-pumpkin text-xs font-semibold uppercase tracking-[0.12em] group-hover:tracking-[0.16em] transition-all duration-300">
                      Collection ansehen
                    </span>
                  </Link>
                </div>

                <div className="text-center mt-10">
                  <Link href={cta.buttonHref} className="btn-outline-white">
                    {cta.buttonLabel}
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
