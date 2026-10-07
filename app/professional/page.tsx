import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import PageCta from "@/components/PageCta";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getIconSlots } from "@/lib/cms/icons";
import { SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";
import CmsIcon from "@/components/cms/CmsIcon";
import { getPageHeroData } from "@/lib/cms/page-hero";
import {
  getServicePageBySlug,
  getSectionData,
  getSectionImage,
} from "@/lib/cms/service-pages";
import { notFound } from "next/navigation";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("professional", "professional");
  return {
    title:
      hero.seoTitle ||
      "Mosaroma Professional — Technical Textiles & B2B Solutions | Mosaroma",
    description:
      hero.seoDescription ||
      "Technical Textiles für Sonnenschutz, Outdoor-Möbel und architektonische Anwendungen. Lokaler B2B-Support in Oyten, Deutschland.",
  };
}

const ABOUT_FALLBACK = {
  eyebrow: "Über uns",
  title: "About Mosaroma Professional",
  paragraphs: [
    "Mosaroma Professional steht für hochwertige technische und textile Lösungen für professionelle Outdoor-Anwendungen.",
    "Unser Produktportfolio basiert auf mehr als 30 Jahren Erfahrung in der Entwicklung von Outdoor-Textilien und verbindet bewährte Materialien, zuverlässige Lieferstrukturen und eine kontinuierliche Weiterentwicklung für anspruchsvolle Einsatzbereiche.",
    "Unsere Kollektionen umfassen Lösungen für Sonnenschutz, Beschattungssysteme, architektonische Textilien, Outdoor-Möbel sowie spezielle dekorative Außenanwendungen. Unterschiedliche Konstruktionen, Farben, Beschichtungen und Leistungsmerkmale ermöglichen eine flexible Anpassung an verschiedene Projektanforderungen.",
    "Design, Qualität und Funktionalität bilden dabei die Grundlage unserer Produktentwicklung. Gleichzeitig setzen wir auf langlebige Materialien, verlässliche Lieferketten und eine verantwortungsbewusste, nachhaltige Weiterentwicklung unserer Produkte.",
  ],
  highlight:
    "Technical Textiles for Shading, Outdoor and Architectural Applications — Wir vertreten exklusiv axroma® Technical Textiles aus Taiwan.",
};

const APPLICATIONS_FALLBACK = [
  {
    title: "Sonnenschutz & Beschattung",
    description:
      "Hochleistungstextilien für Markisen, Sonnensegel und Beschattungssysteme mit UV-Schutz und Wetterbeständigkeit.",
    iconKey: "sun",
  },
  {
    title: "Outdoor-Möbeltextilien",
    description:
      "Strapazierfähige, farbechte Stoffe für Gartenmöbel, Lounges und Hospitality-Einrichtungen im Außenbereich.",
    iconKey: "furniture",
  },
  {
    title: "Architektonische Textilien",
    description:
      "Textile Lösungen für Fassaden, Innenräume und baukonstruktive Anwendungen mit technischem Anspruch.",
    iconKey: "building",
  },
  {
    title: "Wetterfeste Dekor-Textilien",
    description:
      "Dekorative Outdoor-Materialien, die auch bei intensiver Witterung ihre Farbe und Form behalten.",
    iconKey: "palette",
  },
  {
    title: "Projektspezifische Entwicklungen",
    description:
      "Maßgeschneiderte textile Lösungen für individuelle Projektanforderungen — von der Materialauswahl bis zur Serie.",
    iconKey: "custom",
  },
];

const OYTEN_FALLBACK = {
  eyebrow: "Oyten, Deutschland",
  title: "Technical & B2B Support Centre",
  description:
    "Mosaroma Professional ist nicht nur Fernsourcing aus Asien — wir bieten praktischen, lokalen Support in Deutschland. Unser Standort in Oyten ist die zentrale Anlaufstelle für B2B-Kunden in Europa: persönlich, direkt und praxisnah.",
  benefits: [
    { text: "Persönliche Beratungstermine vor Ort" },
    { text: "Stoffkollektionen begutachten, Farben und Materialien vergleichen" },
    { text: "Technische Anforderungen besprechen und Lösungen entwickeln" },
    { text: "Bemusterung und Produktentwicklungsunterstützung" },
    { text: "Projektkoordination mit asiatischen Fertigungs- und Technikpartnern" },
  ],
};

const SUPPLY_CHAIN_FALLBACK = {
  title: "Von Taiwan nach Europa",
  description:
    "Unsere Wertschöpfungskette verbindet technische Kompetenz, lokale Nähe und internationale Fertigungskapazität.",
  nodes: [
    {
      flag: "Taiwan",
      title: "axroma® Technical Textiles",
      description:
        "Technisches Textil-Know-how, Materialentwicklung und Fertigung hochleistungsfähiger Outdoor-Gewebe.",
    },
    {
      flag: "Deutschland",
      title: "Mosaroma Industries GmbH",
      description:
        "Lokaler B2B-Support, Beratung, Bemusterung, Qualitätssteuerung und Projektkoordination in Oyten.",
    },
    {
      flag: "International",
      title: "Produktion & Lieferung",
      description:
        "Internationale Produktions- und Lieferkapazitäten für europäische und globale Märkte.",
    },
  ],
};

const CTA_FALLBACK = {
  title: "Kontakt & Standort",
  content:
    "Wir freuen uns auf Ihre Anfrage — ob Projektberatung, Bemusterung oder technische Fragen.",
  buttonLabel: "Kontakt aufnehmen",
  buttonHref: "/kontakt",
};

export default async function ProfessionalPage() {
  if (!(await isPublicPathEnabled("/professional"))) notFound();

  const [
    layout,
    hero,
    result,
    aboutData,
    aboutImage,
    appsData,
    oytenData,
    oytenImage,
    supplyData,
    ctaData,
    icons,
  ] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("professional", "professional"),
    getServicePageBySlug("professional"),
    getSectionData("professional", "professional-about"),
    getSectionImage("professional", "professional-about"),
    getSectionData("professional", "professional-applications"),
    getSectionData("professional", "professional-oyten"),
    getSectionImage("professional", "professional-oyten"),
    getSectionData("professional", "professional-supply-chain"),
    getSectionData("professional", "professional-cta"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS, "checkmark"]),
  ]);

  const about = {
    eyebrow: aboutData?.eyebrow || ABOUT_FALLBACK.eyebrow,
    title: aboutData?.title || ABOUT_FALLBACK.title,
    content: aboutData?.content?.trim() || null,
    fallbackParagraphs: ABOUT_FALLBACK.paragraphs,
    highlight: ABOUT_FALLBACK.highlight,
  };

  type AppItem = { title: string; description: string; iconKey: string };
  const applications: AppItem[] =
    Array.isArray(appsData?.settings?.items) &&
    (appsData.settings.items as AppItem[]).length > 0
      ? (appsData.settings.items as AppItem[])
      : APPLICATIONS_FALLBACK;

  const appsSection = {
    eyebrow: appsData?.eyebrow || null,
    title: appsData?.title || "Anwendungsbereiche",
    content: appsData?.content?.trim() || "Von Sonnenschutz bis architektonische Textilien — unsere Lösungen für professionelle Outdoor-Projekte.",
    items: applications,
  };

  type Benefit = { text: string };
  const oyten = {
    eyebrow: oytenData?.eyebrow || OYTEN_FALLBACK.eyebrow,
    title: oytenData?.title || OYTEN_FALLBACK.title,
    content:
      oytenData?.content?.trim() || OYTEN_FALLBACK.description,
    benefits:
      Array.isArray(oytenData?.settings?.benefits) &&
      (oytenData.settings.benefits as Benefit[]).length > 0
        ? (oytenData.settings.benefits as Benefit[])
        : OYTEN_FALLBACK.benefits,
  };

  type ChainNode = { flag: string; title: string; description: string };
  const supply = {
    title: supplyData?.title || SUPPLY_CHAIN_FALLBACK.title,
    content:
      supplyData?.content?.trim() || SUPPLY_CHAIN_FALLBACK.description,
    nodes:
      Array.isArray(supplyData?.settings?.nodes) &&
      (supplyData.settings.nodes as ChainNode[]).length > 0
        ? (supplyData.settings.nodes as ChainNode[])
        : SUPPLY_CHAIN_FALLBACK.nodes,
  };

  const cta = {
    title: ctaData?.title || CTA_FALLBACK.title,
    content: ctaData?.content || CTA_FALLBACK.content,
    buttonLabel: ctaData?.buttonLabel || CTA_FALLBACK.buttonLabel,
    buttonHref: ctaData?.buttonHref || CTA_FALLBACK.buttonHref,
  };

  const contentSections =
    result.state === "published"
      ? result.page.sections.filter(
          (s) =>
            !s.settings?.helper &&
            !String(s.settings?.style ?? "").startsWith("professional-"),
        )
      : [];

  const hasCmsSections = contentSections.length > 0;

  const tealGradients = [
    "linear-gradient(135deg, #0C3D40, #145A5C)",
    "linear-gradient(135deg, #145A5C, #1B6B6D)",
    "linear-gradient(135deg, #1B6B6D, #2E8B8B)",
    "linear-gradient(135deg, #1A5C5E, #1B6B6D)",
    "linear-gradient(135deg, #0E4446, #145A5C)",
  ];

  return (
    <>
      <Header {...layout.header} />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden h-[400px] md:h-[480px] flex items-end">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0C3D40 0%, #145A5C 40%, #1B6B6D 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(120deg, transparent, transparent 80px, rgba(255,255,255,0.015) 80px, rgba(255,255,255,0.015) 81px)",
            }}
          />
          {hero.image && !hero.image.includes("placeholder") && (
            <Image
              src={hero.image}
              alt={hero.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(12,61,64,0.6) 0%, transparent 100%)",
            }}
          />
          <div className="relative z-10 w-full pb-10 md:pb-14">
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
                <Link href="#applications" className="btn-primary">
                  Anwendungsbereiche
                </Link>
                <Link href="/kontakt" className="btn-outline-white">
                  Kontakt aufnehmen
                </Link>
              </div>
            </div>
          </div>
        </section>

        <BreadcrumbBar items={[{ label: "Professional" }]} />

        {hasCmsSections ? (
          contentSections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
            />
          ))
        ) : (
          <>
            {/* About / Introduction */}
            <section className="pt-12 md:pt-16 pb-24 md:pb-32 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] items-start gap-10 lg:gap-16">
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="accent-line" />
                      <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                        {about.eyebrow}
                      </p>
                    </div>

                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                      {about.title}
                    </h2>

                    {about.content ? (
                      <RichTextRenderer
                        html={about.content}
                        className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] [&_p+p]:mt-5 [text-wrap:pretty]"
                      />
                    ) : (
                      <div className="space-y-5">
                        {about.fallbackParagraphs.map((p, i) => (
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

                    <div className="mt-6 bg-[#1B6B6D]/[0.06] p-5 md:p-6">
                      <p className="font-heading text-anthracite text-base md:text-lg font-semibold leading-snug">
                        {about.highlight}
                      </p>
                    </div>
                  </div>

                  <ScrollReveal>
                    <div className="lg:mt-16">
                      <Image
                        src={
                          aboutImage?.url ||
                          "/images/placeholders/page-heroes/default-hero.svg"
                        }
                        alt={aboutImage?.alt || "Mosaroma Professional"}
                        width={600}
                        height={480}
                        className="w-full aspect-[5/4] object-cover shadow-[0_6px_28px_rgba(45,45,45,0.06)]"
                      />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* Applications */}
            <section
              id="applications"
              className="section-padding bg-cream"
            >
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {appsSection.title}
                </h2>
                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl">
                  {appsSection.content}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-6 mt-12">
                  {appsSection.items.map((app, i) => (
                    <ScrollReveal
                      key={app.title}
                      delay={i * 80}
                      className={
                        i < 3
                          ? "sm:col-span-2"
                          : i === 3
                            ? "sm:col-start-2 sm:col-span-2"
                            : "sm:col-span-2"
                      }
                    >
                      <div className="bg-white h-full">
                        <div
                          className="aspect-[4/3] relative overflow-hidden flex items-center justify-center"
                          style={{
                            background: tealGradients[i % tealGradients.length],
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,0.03) 14px, rgba(255,255,255,0.03) 15px)",
                            }}
                          />
                          <span className="relative z-10 w-12 h-12 flex items-center justify-center bg-white/10 text-white/60 font-heading text-lg font-bold">
                            {i + 1}
                          </span>
                        </div>
                        <div className="p-6 md:p-8">
                          <h3 className="font-heading text-anthracite text-base font-bold mb-2">
                            {app.title}
                          </h3>
                          <p className="font-body text-text-gray text-sm leading-[1.8]">
                            {app.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Oyten B2B Support Centre */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-16">
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="accent-line" />
                      <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                        {oyten.eyebrow}
                      </p>
                    </div>

                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                      {oyten.title}
                    </h2>

                    {oytenData?.content ? (
                      <RichTextRenderer
                        html={oytenData.content}
                        className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] [text-wrap:pretty]"
                      />
                    ) : (
                      <p
                        className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                        style={{ textWrap: "pretty" }}
                      >
                        {oyten.content}
                      </p>
                    )}

                    <ul className="mt-8 space-y-4">
                      {oyten.benefits.map((b) => (
                        <li
                          key={b.text}
                          className="flex items-start gap-3.5"
                        >
                          <CmsIcon
                            icon={icons["checkmark"]}
                            width={16}
                            height={16}
                            className="text-pumpkin flex-shrink-0 mt-0.5"
                          />
                          <span className="font-body text-anthracite text-[0.9375rem] leading-relaxed">
                            {b.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ScrollReveal>
                    <Image
                      src={
                        oytenImage?.url ||
                        "/images/placeholders/page-heroes/default-hero.svg"
                      }
                      alt={
                        oytenImage?.alt || "Mosaroma Oyten B2B Centre"
                      }
                      width={640}
                      height={480}
                      className="w-full aspect-[4/3] object-cover shadow-[0_6px_28px_rgba(45,45,45,0.06)]"
                    />
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* Supply Chain */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                  {supply.title}
                </h2>
                <p className="font-body text-white/65 text-base md:text-[1.0625rem] leading-[1.7] max-w-2xl mb-12">
                  {supply.content}
                </p>

                <div className="flex flex-col md:flex-row md:items-stretch gap-0">
                  {supply.nodes.map((node, i) => (
                    <ScrollReveal key={node.title} delay={i * 100} className="contents">
                      {i > 0 && (
                        <div className="flex items-center justify-center py-4 md:py-0 md:px-2">
                          <svg
                            viewBox="0 0 28 28"
                            fill="none"
                            className="w-7 h-7 text-pumpkin md:rotate-0 rotate-90"
                          >
                            <path
                              d="M6 14h16M18 9l5 5-5 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                      <div
                        className="flex-1 p-8 flex flex-col justify-center"
                        style={{
                          background:
                            i === 0
                              ? "rgba(255,255,255,0.05)"
                              : i === 2
                                ? "rgba(255,255,255,0.03)"
                                : "transparent",
                        }}
                      >
                        <p className="font-accent text-pumpkin text-[10px] tracking-[0.25em] uppercase mb-2.5">
                          {node.flag}
                        </p>
                        <h3 className="font-heading text-white text-lg font-bold mb-2.5">
                          {node.title}
                        </h3>
                        <p className="font-body text-white/70 text-sm leading-[1.7]">
                          {node.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact / CTA */}
            <PageCta
              title={cta.title}
              description={cta.content}
              primaryLabel={cta.buttonLabel}
              primaryHref={cta.buttonHref}
              variant="light"
            />
          </>
        )}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
