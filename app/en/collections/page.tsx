import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import CollectionCard from "@/components/CollectionCard";
import ConsultationCard from "@/components/ConsultationCard";
import ScrollReveal from "@/components/ScrollReveal";
import CollectionBenefitsSection from "@/components/service/CollectionBenefitsSection";
import CollectionCtaSection from "@/components/service/CollectionCtaSection";
import { getPublishedCollections } from "@/lib/cms/collections";
import { getTeaserAmbienteImages } from "@/lib/cms/ambiente";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";
import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import { getIconSlots } from "@/lib/cms/icons";
import AmbienteTeaser from "@/components/collections/AmbienteTeaser";

export const revalidate = 60;

const FALLBACK_CONSULTATION: FrontendServiceSection = {
  id: "fallback-consultation",
  type: "CUSTOM",
  title: "Which Colour World Suits You?",
  eyebrow: null,
  content: "We advise you personally and send matching samples for your project.",
  settings: {
    style: "collection-consultation-card",
    secondaryLabel: "Get in touch",
    secondaryHref: "/en/contact",
  },
  imageUrl: null,
  buttonLabel: "Samples & Advice",
  buttonHref: "/en/contact",
  order: 0,
};

const FALLBACK_BENEFITS: FrontendServiceSection = {
  id: "fallback-benefits",
  type: "CUSTOM",
  title: "One Performance. Seven Colour Worlds.",
  eyebrow: null,
  content: "Regardless of colour: every Mosaroma collection is made from weatherproof outdoor fabrics.",
  settings: {
    style: "collection-benefits",
    items: [
      { iconKey: "sun", title: "UV-resistant", text: "Solution-dyed fibres for the highest colour fastness, even under prolonged sun exposure." },
      { iconKey: "droplet", title: "Water-repellent", text: "Fabrics that shed rain and moisture and dry quickly." },
      { iconKey: "shield", title: "Mould-resistant", text: "Resistant materials that stay clean even in damp environments." },
      { iconKey: "star", title: "3-Year Warranty", text: "Quality promise on all Mosaroma products per warranty conditions." },
    ],
  },
  imageUrl: null,
  buttonLabel: null,
  buttonHref: null,
  order: 1,
};

const FALLBACK_CTA: FrontendServiceSection = {
  id: "fallback-cta",
  type: "CTA",
  title: "Let Us Send You a Sample Set.",
  eyebrow: "Still undecided?",
  content: "Compare colours, textures and feel at your leisure. We put together matching fabric samples for your project.",
  settings: {
    style: "collection-cta",
    secondaryLabel: "View catalogues",
    secondaryHref: "/en/catalogues",
  },
  imageUrl: null,
  buttonLabel: "Request sample set",
  buttonHref: "/en/contact",
  order: 2,
};

function findSection(
  sections: FrontendServiceSection[],
  style: string,
): FrontendServiceSection | undefined {
  return sections.find((s) => (s.settings.style as string) === style);
}

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kollektionen", "kollektionen", "en");
  return {
    title: "Collections 2027 | Mosaroma",
    description:
      "Discover MOSAROMA's 7 collections — curated colour worlds for the outdoors, made in Mackintosh®, Nerio and Basic qualities.",
  };
}

export default async function CollectionsPage() {
  const [layout, hero, collections, ambienteSlots, pageResult, icons] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("kollektionen", "kollektionen", "en"),
    getPublishedCollections("en"),
    getTeaserAmbienteImages(),
    getServicePageBySlug("kollektionen"),
    getIconSlots(["benefit-sun", "benefit-droplet", "benefit-shield", "benefit-star", "benefit-fallback", "arrow-right", "checkmark"]),
  ]);

  const sections =
    pageResult.state === "published" ? pageResult.page.sections : [];

  const ambienteSection = findSection(sections, "collections-ambiente-teaser");
  const consultationSection = FALLBACK_CONSULTATION;
  const benefitsSection = FALLBACK_BENEFITS;
  const ctaSection = FALLBACK_CTA;

  const pageEyebrow = "Colour Worlds";
  const pageHeadline = "Collections.";
  const introText = "Each collection tells its own story of colour, material and mood. Choose the colour world that suits your outdoor space.";

  const allMoodColors = collections.flatMap((c) => c.moodColors);

  // Build ordered content blocks
  const ambienteOrder = ambienteSection?.order ?? 10;

  const ambienteBlock = (
    <AmbienteTeaser
      key="ambiente"
      slots={ambienteSlots}
      eyebrow={ambienteSection?.eyebrow || undefined}
      title={ambienteSection?.title || undefined}
      intro={ambienteSection?.content || undefined}
      ctaLabel={ambienteSection?.buttonLabel || undefined}
      ctaHref={ambienteSection?.buttonHref || undefined}
      locale="en"
    />
  );

  const introBlock = (
    <section key="intro" className="pt-14 md:pt-20 pb-10 md:pb-14 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <ScrollReveal>
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-4 mb-4">
              <div className="accent-line" />
              <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                {pageEyebrow}
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
              {pageHeadline}
            </h2>
          </div>
        </ScrollReveal>

        {allMoodColors.length > 0 && (
          <div className="flex mb-10 md:mb-14" aria-hidden="true">
            {allMoodColors.map((color, i) => (
              <div
                key={i}
                className="flex-1 h-1.5"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <ScrollReveal>
          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-[56ch]">
            {introText}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );

  const gridBlock = (
    <section key="grid" className="pt-14 md:pt-20 pb-20 md:pb-28 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {collections.length === 0 ? (
          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
            No collections are currently available. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {collections.map((collection, i) => (
              <ScrollReveal key={collection.slug} delay={i * 60}>
                <CollectionCard
                  name={collection.name}
                  slug={collection.slug}
                  description={collection.shortDescription}
                  moodColors={collection.moodColors}
                  fabric={collection.fabric}
                  image={collection.cardImage}
                  alt={collection.cardAlt}
                  locale="en"
                />
              </ScrollReveal>
            ))}
            <ScrollReveal delay={collections.length * 60}>
              <ConsultationCard
                title={consultationSection.title ?? undefined}
                content={consultationSection.content ?? undefined}
                primaryLabel={consultationSection.buttonLabel ?? undefined}
                primaryHref={consultationSection.buttonHref ?? undefined}
                secondaryLabel={(consultationSection.settings.secondaryLabel as string) || undefined}
                secondaryHref={(consultationSection.settings.secondaryHref as string) || undefined}
              />
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );

  const benefitsBlock = (
    <CollectionBenefitsSection key="benefits" section={benefitsSection} icons={icons} />
  );

  const ctaBlock = (
    <CollectionCtaSection key="cta" section={ctaSection} locale="en" />
  );

  // Sort content blocks by order (ambiente from CMS, others at fixed positions)
  const contentBlocks: { order: number; node: ReactNode }[] = [
    { order: ambienteOrder, node: ambienteBlock },
    { order: 20, node: introBlock },
    { order: 30, node: gridBlock },
    { order: 40, node: benefitsBlock },
    { order: 50, node: ctaBlock },
  ].filter((b) => b.node !== null);

  contentBlocks.sort((a, b) => a.order - b.order);

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
        />
        <BreadcrumbBar items={[{ label: "Collections" }]} locale="en" />

        {contentBlocks.map((b) => b.node)}
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
