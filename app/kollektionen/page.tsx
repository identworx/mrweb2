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
  title: "Welche Farbwelt passt zu Ihnen?",
  eyebrow: null,
  content: "Wir beraten Sie persönlich und senden passende Muster für Ihr Projekt.",
  settings: {
    style: "collection-consultation-card",
    secondaryLabel: "Kontakt aufnehmen",
    secondaryHref: "/kontakt",
  },
  imageUrl: null,
  buttonLabel: "Muster & Beratung",
  buttonHref: "/kontakt",
  order: 0,
};

const FALLBACK_BENEFITS: FrontendServiceSection = {
  id: "fallback-benefits",
  type: "CUSTOM",
  title: "Eine Performance. Sieben Farbwelten.",
  eyebrow: null,
  content: "Unabhängig von der Farbe: Jede Mosaroma-Kollektion wird aus wetterfesten Outdoor-Stoffen gefertigt.",
  settings: {
    style: "collection-benefits",
    items: [
      { iconKey: "sun", title: "UV-beständig", text: "Spinndüsengefärbte Fasern für höchste Lichtechtheit, auch bei dauerhafter Sonneneinstrahlung." },
      { iconKey: "droplet", title: "Wasserabweisend", text: "Stoffe, die Regen und Feuchtigkeit abperlen lassen und schnell trocknen." },
      { iconKey: "shield", title: "Schimmelfest", text: "Resistente Materialien, die auch in feuchten Umgebungen sauber bleiben." },
      { iconKey: "star", title: "3 Jahre Garantie", text: "Qualitätsversprechen auf alle Mosaroma-Produkte gemäß Garantiebedingungen." },
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
  title: "Lassen Sie sich ein Musterset schicken.",
  eyebrow: "Noch unentschlossen?",
  content: "Vergleichen Sie Farben, Texturen und Haptik in Ruhe. Wir stellen passende Stoffmuster für Ihr Projekt zusammen.",
  settings: {
    style: "collection-cta",
    secondaryLabel: "Kataloge ansehen",
    secondaryHref: "/kataloge",
  },
  imageUrl: null,
  buttonLabel: "Musterset anfordern",
  buttonHref: "/kontakt",
  order: 2,
};

function findSection(
  sections: FrontendServiceSection[],
  style: string,
): FrontendServiceSection | undefined {
  return sections.find((s) => (s.settings.style as string) === style);
}

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kollektionen", "kollektionen");
  return {
    title: hero.seoTitle || "Kollektionen 2027 | Mosaroma",
    description:
      hero.seoDescription ||
      "Entdecken Sie die 7 Kollektionen von MOSAROMA -- kuratierte Farbwelten für den Außenbereich, gefertigt in Mackintosh®, Nerio und Basic Qualitäten.",
  };
}

export default async function KollektionenPage() {
  const [layout, hero, collections, ambienteSlots, pageResult, icons] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("kollektionen", "kollektionen"),
    getPublishedCollections(),
    getTeaserAmbienteImages(),
    getServicePageBySlug("kollektionen"),
    getIconSlots(["benefit-sun", "benefit-droplet", "benefit-shield", "benefit-star", "benefit-fallback", "arrow-right", "checkmark"]),
  ]);

  const sections =
    pageResult.state === "published" ? pageResult.page.sections : [];

  const ambienteSection = findSection(sections, "collections-ambiente-teaser");
  const consultationSection =
    findSection(sections, "collection-consultation-card") ?? FALLBACK_CONSULTATION;
  const benefitsSection =
    findSection(sections, "collection-benefits") ?? FALLBACK_BENEFITS;
  const ctaSection =
    findSection(sections, "collection-cta") ?? FALLBACK_CTA;

  const pageEyebrow =
    pageResult.state === "published" && pageResult.page.eyebrow
      ? pageResult.page.eyebrow
      : "Farbwelten";

  const pageHeadline =
    pageResult.state === "published" && pageResult.page.headline
      ? pageResult.page.headline
      : "Kollektionen.";

  const introText =
    pageResult.state === "published" && pageResult.page.introText
      ? pageResult.page.introText
      : "Jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung. Wählen Sie die Farbwelt, die zu Ihrem Außenbereich passt.";

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
    />
  );

  const introBlock = (
    <section key="intro" className="pt-14 md:pt-20 pb-10 md:pb-14 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <ScrollReveal>
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-4 mb-4">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
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
            Aktuell sind keine Kollektionen verfügbar. Bitte schauen Sie
            später wieder vorbei.
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
    <CollectionCtaSection key="cta" section={ctaSection} />
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
      <Header {...layout.header} />
      <main id="main">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "Kollektionen" }]} />

        {contentBlocks.map((b) => b.node)}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
