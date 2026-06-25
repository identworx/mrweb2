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
import { getTranslations } from "@/lib/i18n/get-translation";
import { localizedHref } from "@/lib/i18n/routes";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getIconSlots } from "@/lib/cms/icons";
import { NERIO_PROMISE_KEY_MAP, SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";
import CmsIcon from "@/components/cms/CmsIcon";
import { getPageHeroData } from "@/lib/cms/page-hero";
import {
  getServicePageBySlug,
  getSectionData,
  getSectionImage,
  resolveVideoThumbnails,
  resolveMediaIds,
} from "@/lib/cms/service-pages";
import { getNerioFabricSwatches } from "@/lib/cms/fabric-library";
import NerioVideoSection from "@/components/nerio/NerioVideoSection";
import NerioAnchorNavEn from "@/components/nerio/NerioAnchorNavEn";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, seoT] = await Promise.all([
    getPageHeroData("nerio", "nerio", "en"),
    getTranslations("pageHero", "nerio", "en"),
  ]);
  return {
    title: seoT.seoTitle || hero.seoTitle || "NERIO | Mosaroma",
    description: seoT.seoDescription || hero.seoDescription || "NERIO: Performance-Stoffe aus 50 % recyceltem Ozean-Polypropylen.",
  };
}

const NERIO_PRODUCT_CARDS_FALLBACK = [
  { id: "dekokissen", title: "Deko-Kissen", href: "/kollektionen/nerio-oceana", imageId: null as string | null, isActive: true, order: 1, fallbackImage: "/images/placeholders/categories/dekokissen.svg" },
  { id: "hochlehner", title: "Hochlehner", href: "/kollektionen/nerio-oceana", imageId: null as string | null, isActive: true, order: 2, fallbackImage: "/images/placeholders/categories/hochlehner.svg" },
  { id: "niedriglehner", title: "Niedriglehner", href: "/kollektionen/nerio-oceana", imageId: null as string | null, isActive: true, order: 3, fallbackImage: "/images/placeholders/categories/niedriglehner.svg" },
  { id: "sitzkissen", title: "Sitzkissen", href: "/kollektionen/nerio-oceana", imageId: null as string | null, isActive: true, order: 4, fallbackImage: "/images/placeholders/categories/sitzkissen.svg" },
  { id: "bankauflagen", title: "Bankauflagen", href: "/kollektionen/nerio-oceana", imageId: null as string | null, isActive: true, order: 5, fallbackImage: "/images/placeholders/categories/bankauflagen.svg" },
];


export default async function NerioPageEn() {
  const [
    layout,
    hero,
    result,
    storyData,
    storyImage,
    oceanData,
    promiseData,
    highlightsData,
    videosData,
    techFactsData,
    techFactsImage,
    productsData,
    ctaData,
    nerioSwatches,
    icons,
  ] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("nerio", "nerio", "en"),
    getServicePageBySlug("nerio"),
    getSectionData("nerio", "nerio-story"),
    getSectionImage("nerio", "nerio-story"),
    getSectionData("nerio", "nerio-oceancycle"),
    getSectionData("nerio", "nerio-promise"),
    getSectionData("nerio", "nerio-highlights"),
    getSectionData("nerio", "nerio-videos"),
    getSectionData("nerio", "nerio-technical-facts"),
    getSectionImage("nerio", "nerio-technical-facts"),
    getSectionData("nerio", "nerio-products-preview"),
    getSectionData("nerio", "nerio-final-cta"),
    getNerioFabricSwatches(),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS, "nerio-recycle", "nerio-droplet", "nerio-sun", "nerio-shield", "nerio-fabric-grid", "nerio-collection-box"]),
  ]);

  const [storyT, promiseT, highlightsT, techT, oceanT, videosT, productsT, ctaT] = await Promise.all([
    getTranslations("material", "nerio-story", "en"),
    getTranslations("material", "nerio-promise", "en"),
    getTranslations("material", "nerio-highlights", "en"),
    getTranslations("material", "nerio-technical-facts", "en"),
    getTranslations("material", "nerio-ocean-cycle", "en"),
    getTranslations("material", "nerio-videos", "en"),
    getTranslations("material", "nerio-products", "en"),
    getTranslations("material", "nerio-cta", "en"),
  ]);

  const story = {
    eyebrow: storyT.eyebrow || nerioStory.eyebrow,
    title: storyT.title || nerioStory.title,
    content: null,
    fallbackParagraphs: nerioStory.paragraphs.map((p, i) => storyT[`paragraph.${i + 1}`] || p),
  };

  type OceanStep = { title: string; description: string; imageId?: string | null; imageFit?: "contain" | "cover" };
  const cmsOceanSteps = Array.isArray(oceanData?.settings?.steps) && (oceanData.settings.steps as OceanStep[]).length > 0
    ? (oceanData.settings.steps as OceanStep[])
    : null;
  const oceanSteps: OceanStep[] = oceanCycleProcess.steps.map((fallback, i) => ({
    title: oceanT[`step.${i + 1}.title`] || fallback.title,
    description: oceanT[`step.${i + 1}.description`] || fallback.description,
    imageId: cmsOceanSteps?.[i]?.imageId ?? null,
    imageFit: cmsOceanSteps?.[i]?.imageFit ?? "contain",
  }));

  const oceanStepImages = await resolveMediaIds(
    oceanSteps.map((s) => s.imageId),
  );

  const ocean = {
    eyebrow: "OceanCycle®",
    title: oceanT.title || oceanCycleProcess.title,
    content: null,
    fallbackDescription: oceanT.description || oceanCycleProcess.description,
    steps: oceanSteps.map((s) => ({ ...s, imageFit: s.imageFit || "contain", image: s.imageId ? oceanStepImages[s.imageId] ?? null : null })),
    highlights: oceanCycleProcess.highlights.map((hl, i) => oceanT[`highlight.${i + 1}`] || hl),
  };

  const promise = {
    eyebrow: promiseT.eyebrow || nerioPromise.eyebrow,
    title: promiseT.title || nerioPromise.title,
    content: null,
    items: nerioPromise.items.map((item, i) => ({
      ...item,
      title: promiseT[`item.${i + 1}.title`] || item.title,
      text: promiseT[`item.${i + 1}.text`] || item.text,
    })),
  };

  const highlights = {
    eyebrow: highlightsT.eyebrow || nerioHighlights.eyebrow,
    title: highlightsT.title || nerioHighlights.title,
    stats: nerioHighlights.stats.map((stat, i) => ({
      value: stat.value,
      label: highlightsT[`stat.${i + 1}.label`] || stat.label,
      detail: highlightsT[`stat.${i + 1}.detail`] || stat.detail,
    })),
  };

  const fallbackVideos = [
    {
      enabled: true,
      youtubeUrl: "https://www.youtube.com/watch?v=DzLeef6Mxak",
      title: videosT["video.1.title"] || "Vom Fischernetz zum neuen Rohstoff",
      description: videosT["video.1.description"] || "Dieser Film zeigt, wie recycelte Fischernetze zu Kunststoffgranulat verarbeitet werden.",
      startSeconds: null,
      thumbnailMediaId: null,
      label: videosT["video.1.label"] || "Prozessvideo",
      order: 1,
    },
    {
      enabled: true,
      youtubeUrl: "https://www.youtube.com/watch?v=OwGfs0qwIlE&t=26s",
      title: videosT["video.2.title"] || "Textilkreisläufe neu gedacht",
      description: videosT["video.2.description"] || "Ein Einblick in neue Recyclingverfahren, bei denen textile Materialien effizienter aufbereitet werden.",
      startSeconds: 26,
      thumbnailMediaId: null,
      label: videosT["video.2.label"] || "Recycling",
      order: 2,
    },
    {
      enabled: true,
      youtubeUrl: "https://www.youtube.com/watch?v=xP6PFrg9IHY",
      title: videosT["video.3.title"] || "Ein Material. Ein klarerer Kreislauf.",
      description: videosT["video.3.description"] || "Dieses Video zeigt den Ansatz eines Mono-Material-Systems aus Polypropylen.",
      startSeconds: null,
      thumbnailMediaId: null,
      label: videosT["video.3.label"] || "Materialkreislauf",
      order: 3,
    },
  ];

  const rawVideos = fallbackVideos;

  const videoThumbnails = await resolveVideoThumbnails(
    videosData?.settings ?? { videos: rawVideos },
  );

  const nerioVideos = {
    eyebrow: videosT.eyebrow || "Prozesse & Kreisläufe",
    title: videosT.title || "Wie Verantwortung zu neuem Material wird",
    intro: videosT.intro || "Die NERIO-Materialgeschichte wird greifbarer, wenn man die einzelnen Schritte sieht: vom gesammelten Rohstoff über Verarbeitung und Recycling bis zur neuen Anwendung im Textilbereich.",
    videos: rawVideos
      .filter((v) => v.enabled)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((v) => {
        const thumb = v.thumbnailMediaId ? videoThumbnails[v.thumbnailMediaId] : null;
        return {
          enabled: v.enabled,
          youtubeUrl: v.youtubeUrl,
          title: v.title,
          description: v.description,
          startSeconds: v.startSeconds ?? null,
          thumbnailUrl: thumb?.url ?? null,
          thumbnailAlt: thumb?.alt ?? null,
          label: v.label ?? null,
        };
      }),
  };

  const techFacts = {
    eyebrow: techT.eyebrow || nerioTechnicalFacts.eyebrow,
    title: techT.title || nerioTechnicalFacts.title,
    content: null,
    facts: nerioTechnicalFacts.facts.map((fact, i) => ({
      label: techT[`fact.${i + 1}.label`] || fact.label,
      value: techT[`fact.${i + 1}.value`] || fact.value,
    })),
  };

  type ProductCard = { id: string; title: string; href: string; imageId: string | null; isActive: boolean; order: number; fallbackImage?: string };
  const rawCards: ProductCard[] = NERIO_PRODUCT_CARDS_FALLBACK;

  const productCardImages = await resolveMediaIds(
    rawCards.map((c) => c.imageId),
  );

  const activeCards = rawCards
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => {
      const resolved = c.imageId ? productCardImages[c.imageId] : null;
      const fallback = NERIO_PRODUCT_CARDS_FALLBACK.find((f) => f.id === c.id);
      const title = productsT[`card.${c.id}.title`] || c.title;
      return {
        ...c,
        title,
        href: c.href ? localizedHref(c.href, "en") : "/en/collections/nerio-oceana",
        imageUrl: resolved?.url || fallback?.fallbackImage || "/images/placeholders/categories/dekokissen.svg",
        imageAlt: resolved?.alt || title,
      };
    });

  const productsPreview = {
    eyebrow: productsT.eyebrow || "Produkte & Stoffe",
    title: productsT.title || "NERIO-Stoffe entdecken",
    content: null,
    fallbackDescription: productsT.description || "Alle NERIO-Stoffe aus recyceltem Ozean-Polypropylen auf einen Blick — erhältlich als Kissen, Polster und Accessoires.",
    cards: activeCards,
  };

  const cta = {
    title: ctaT.title || "NERIO erleben",
    content: ctaT.content || "Entdecken Sie die komplette NERIO-Kollektion und fordern Sie Ihr persönliches Musterset an.",
    buttonLabel: ctaT.buttonLabel || "Musterset anfordern",
    buttonHref: "/en/contact",
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
      <Header {...layout.header} locale="en" />
      <main id="main">
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
                  <p className="font-accent text-pumpkin-accessible text-[11px] tracking-[0.3em] uppercase">
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
                  href="/en/collections/nerio-oceana"
                  className="btn-primary"
                >
                  {productsT["heroButton.primary"] || "Kollektion ansehen"}
                </Link>
                <Link
                  href="/en/materials/fabrics-samples?family=nerio"
                  className="btn-outline-white"
                >
                  {productsT["heroButton.secondary"] || "Stoffe ansehen"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <BreadcrumbBar items={[{ label: "NERIO" }]} />
        {!hasCmsSections && <NerioAnchorNavEn />}

        {hasCmsSections ? (
          contentSections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
              locale="en"
            />
          ))
        ) : (
          <>
            {/* Story */}
            <section id="story" className="pt-12 md:pt-16 pb-24 md:pb-32 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] items-start gap-10 lg:gap-16">
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="accent-line" />
                      <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
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
                            {storyT["quote"] || "50 % recyceltes Ozean-Polypropylen — kein Kompromiss bei der Leistung."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <ScrollReveal>
                    <div className="lg:mt-16">
                      <Image
                        src={storyImage?.url || "/images/placeholders/nerio/story.svg"}
                        alt={storyImage?.alt || "NERIO fabric close-up"}
                        width={600}
                        height={480}
                        className="w-full aspect-[5/4] object-cover shadow-[0_6px_28px_rgba(45,45,45,0.06)]"
                      />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* OceanCycle Process */}
            <section id="technologie" className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
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
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {step.image ? (
                            <Image
                              src={step.image.url}
                              alt={step.image.alt || step.title}
                              fill
                              className={step.imageFit === "cover" ? "object-cover" : "object-contain p-4"}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <>
                              <div
                                className="absolute inset-0"
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
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="w-12 h-12 flex items-center justify-center bg-white/10 text-white/60 font-heading text-lg font-bold">
                                  {i + 1}
                                </span>
                              </div>
                            </>
                          )}
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
                        <CmsIcon icon={icons["checkmark"]} width={16} height={16} className="text-pumpkin flex-shrink-0 mt-0.5" />
                        <span className="font-body text-anthracite text-sm leading-relaxed">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Promise */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <p className="font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase mb-3">
                  {promise.eyebrow}
                </p>

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
                          <CmsIcon icon={icons[NERIO_PROMISE_KEY_MAP[item.iconKey] ?? "nerio-shield"]} width={24} height={24} />
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
            <section id="fakten" className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
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
                          <p className="font-body text-white/70 text-xs leading-relaxed">
                            {stat.detail}
                          </p>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Videos */}
            <NerioVideoSection
              title={nerioVideos.title}
              intro={nerioVideos.intro}
              videos={nerioVideos.videos}
            />

            {/* Technical Facts */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <p className="font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase mb-3">
                  {techFacts.eyebrow}
                </p>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {techFacts.title}
                </h2>

                {techFacts.content && (
                  <RichTextRenderer
                    html={techFacts.content}
                    className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12 [&_p+p]:mt-5"
                  />
                )}

                <div className={`mt-8 grid grid-cols-1 ${techFactsImage ? "lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] gap-8 lg:gap-12 lg:items-stretch" : ""}`}>
                  <ScrollReveal className="h-full">
                    <div className="bg-white overflow-hidden h-full">
                      <table className="w-full">
                        <tbody>
                          {techFacts.facts.map((fact, i) => (
                            <tr
                              key={fact.label}
                              className={i < techFacts.facts.length - 1 ? "border-b border-light-gray" : ""}
                            >
                              <td className="py-4 px-5 md:px-8 font-heading text-anthracite text-sm font-semibold uppercase tracking-[0.06em] w-2/5">
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

                  {techFactsImage && (
                    <ScrollReveal className="h-full">
                      <div className="relative h-full min-h-[280px] lg:min-h-0 overflow-hidden bg-white border border-black/[0.06] shadow-[0_4px_20px_rgba(45,45,45,0.04)] flex items-center justify-center p-6 md:p-8">
                        <Image
                          src={techFactsImage.url}
                          alt={techFactsImage.alt || techFacts.title}
                          fill
                          className="object-contain p-6 md:p-8"
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                      </div>
                    </ScrollReveal>
                  )}
                </div>
              </div>
            </section>

            {/* Products & Fabrics */}
            <section id="produkte" className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
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
                  {productsPreview.cards.map((card) => (
                    <Link
                      key={card.id}
                      href={card.href || "/en/collections/nerio-oceana"}
                      className="group"
                    >
                      <div className="aspect-square overflow-hidden bg-cream relative">
                        <Image
                          src={card.imageUrl}
                          alt={card.imageAlt}
                          fill
                          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>
                      <p className="font-heading text-anthracite text-sm font-semibold mt-3 group-hover:text-pumpkin transition-colors duration-300">
                        {card.title}
                      </p>
                    </Link>
                  ))}
                </div>

                {nerioSwatches.length > 0 && (
                  <div className="mt-16">
                    <h3 className="font-heading text-anthracite text-xl font-bold mb-6">
                      {productsT["fabricsHeading"] || "Aktuelle NERIO-Stoffe"}
                    </h3>
                    <FabricLibraryPreview swatches={nerioSwatches} icons={icons} limit={5} locale="en" />
                  </div>
                )}

                <div className="mt-10">
                  <Link
                    href="/en/materials/fabrics-samples?family=nerio"
                    className="btn-primary"
                  >
                    {productsT["fabricsButton"] || "Alle NERIO-Stoffe ansehen"}
                  </Link>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section id="beratung" className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-center">
                  {cta.title}
                </h2>
                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-12 text-center">
                  {cta.content}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <Link
                    href="/en/materials/fabrics-samples?family=nerio"
                    className="group block bg-white border border-black/[0.06] p-8 text-center transition-all duration-300 hover:border-black/[0.10] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-pumpkin">
                      <CmsIcon icon={icons["nerio-fabric-grid"]} width={28} height={28} />
                    </div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-2">
                      {ctaT["card.fabrics.title"] || "NERIO-Stoffe"}
                    </h3>
                    <p className="font-body text-text-muted text-sm leading-relaxed mb-6">
                      {ctaT["card.fabrics.description"] || "Entdecken Sie alle Stoffe, Muster und Farben der NERIO-Linie."}
                    </p>
                    <span className="font-heading text-anthracite text-xs font-semibold uppercase tracking-[0.12em] group-hover:text-pumpkin group-hover:tracking-[0.16em] transition-all duration-300">
                      {ctaT["card.fabrics.button"] || "Stoffe ansehen"}
                    </span>
                  </Link>

                  <Link
                    href="/en/collections/nerio-oceana"
                    className="group block bg-white border border-black/[0.06] p-8 text-center transition-all duration-300 hover:border-black/[0.10] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-pumpkin">
                      <CmsIcon icon={icons["nerio-collection-box"]} width={28} height={28} />
                    </div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-2">
                      {ctaT["card.collection.title"] || "NERIO-Kollektion"}
                    </h3>
                    <p className="font-body text-text-muted text-sm leading-relaxed mb-6">
                      {ctaT["card.collection.description"] || "Die NERIO-Oceana-Kollektion mit allen Produkten."}
                    </p>
                    <span className="font-heading text-anthracite text-xs font-semibold uppercase tracking-[0.12em] group-hover:text-pumpkin group-hover:tracking-[0.16em] transition-all duration-300">
                      {ctaT["card.collection.button"] || "Kollektion ansehen"}
                    </span>
                  </Link>
                </div>

                <div className="text-center mt-10">
                  <Link href={cta.buttonHref} className="btn-outline">
                    {cta.buttonLabel}
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
