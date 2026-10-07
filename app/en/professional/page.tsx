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
import HeroVideo from "@/components/HeroVideo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("professional", "professional", "en");
  return {
    title:
      hero.seoTitle ||
      "Mosaroma Professional — Technical Textiles & B2B Solutions | Mosaroma",
    description:
      hero.seoDescription ||
      "Technical textiles for shading, outdoor furniture and architectural applications. Local B2B support in Oyten, Germany.",
  };
}

const ABOUT_FALLBACK = {
  eyebrow: "About us",
  title: "About Mosaroma Professional",
  paragraphs: [
    "Mosaroma Professional stands for high-quality technical and textile solutions for professional outdoor applications.",
    "Our product portfolio is based on more than 30 years of experience in the development of outdoor textiles, combining proven materials, reliable supply structures and continuous advancement for demanding use cases.",
    "Our collections include solutions for sun protection, shading systems, architectural textiles, outdoor furniture and special decorative outdoor applications. Different constructions, colours, coatings and performance features allow flexible adaptation to various project requirements.",
    "Design, quality and functionality form the foundation of our product development. At the same time, we focus on durable materials, reliable supply chains and responsible, sustainable product advancement.",
  ],
  highlight:
    "Technical Textiles for Shading, Outdoor and Architectural Applications — We exclusively represent axroma® Technical Textiles from Taiwan.",
};

const APPLICATIONS_FALLBACK = [
  {
    title: "Sun Protection & Shading",
    description:
      "High-performance textiles for awnings, shade sails and shading systems with UV protection and weather resistance.",
    iconKey: "sun",
  },
  {
    title: "Outdoor Furniture Textiles",
    description:
      "Durable, colour-fast fabrics for garden furniture, lounges and hospitality settings in outdoor areas.",
    iconKey: "furniture",
  },
  {
    title: "Architectural Textiles",
    description:
      "Textile solutions for facades, interiors and structural applications with technical demands.",
    iconKey: "building",
  },
  {
    title: "Weather-Resistant Decor Textiles",
    description:
      "Decorative outdoor materials that retain their colour and shape even under intense weathering.",
    iconKey: "palette",
  },
  {
    title: "Project-Specific Developments",
    description:
      "Tailor-made textile solutions for individual project requirements — from material selection to series production.",
    iconKey: "custom",
  },
];

const OYTEN_FALLBACK = {
  eyebrow: "Oyten, Germany",
  title: "Technical & B2B Support Centre",
  description:
    "Mosaroma Professional is not just remote sourcing from Asia — we offer practical, local support in Germany. Our location in Oyten is the central point of contact for B2B customers in Europe: personal, direct and hands-on.",
  benefits: [
    { text: "Personal on-site consultation appointments" },
    { text: "Review fabric collections, compare colours and materials" },
    { text: "Discuss technical requirements and develop solutions" },
    { text: "Sampling and product development support" },
    { text: "Project coordination with Asian manufacturing and technical partners" },
  ],
};

const SUPPLY_CHAIN_FALLBACK = {
  title: "From Taiwan to Europe",
  description:
    "Our value chain connects technical expertise, local proximity and international manufacturing capacity.",
  nodes: [
    {
      flag: "Taiwan",
      title: "axroma® Technical Textiles",
      description:
        "Technical textile know-how, material development and production of high-performance outdoor fabrics.",
    },
    {
      flag: "Germany",
      title: "Mosaroma Industries GmbH",
      description:
        "Local B2B support, consulting, sampling, quality management and project coordination in Oyten.",
    },
    {
      flag: "International",
      title: "Production & Delivery",
      description:
        "International production and delivery capacities for European and global markets.",
    },
  ],
};

const CTA_FALLBACK = {
  title: "Contact & Location",
  content:
    "We look forward to your enquiry — whether project consulting, sampling or technical questions.",
  buttonLabel: "Get in touch",
  buttonHref: "/en/kontakt",
};

export default async function ProfessionalPageEn() {
  if (!(await isPublicPathEnabled("/professional"))) notFound();

  const [
    layout,
    hero,
    result,
    heroSectionData,
    heroSectionImage,
    ,
    aboutImage,
    ,
    ,
    oytenImage,
    ,
    ,
    icons,
  ] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("professional", "professional", "en"),
    getServicePageBySlug("professional"),
    getSectionData("professional", "professional-hero"),
    getSectionImage("professional", "professional-hero"),
    getSectionData("professional", "professional-about"),
    getSectionImage("professional", "professional-about"),
    getSectionData("professional", "professional-applications"),
    getSectionData("professional", "professional-oyten"),
    getSectionImage("professional", "professional-oyten"),
    getSectionData("professional", "professional-supply-chain"),
    getSectionData("professional", "professional-cta"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS, "checkmark"]),
  ]);

  const heroVideoUrl = String(heroSectionData?.settings?.videoUrl ?? "").trim() || null;
  const heroPosterUrl = heroSectionImage?.url || null;

  const about = {
    eyebrow: ABOUT_FALLBACK.eyebrow,
    title: ABOUT_FALLBACK.title,
    content: null as string | null,
    fallbackParagraphs: ABOUT_FALLBACK.paragraphs,
    highlight: ABOUT_FALLBACK.highlight,
  };

  type AppItem = { title: string; description: string; iconKey: string };
  const appsSection = {
    eyebrow: null as string | null,
    title: "Applications",
    content: "From sun protection to architectural textiles — our solutions for professional outdoor projects.",
    items: APPLICATIONS_FALLBACK as AppItem[],
  };

  const oyten = {
    eyebrow: OYTEN_FALLBACK.eyebrow,
    title: OYTEN_FALLBACK.title,
    content: OYTEN_FALLBACK.description,
    benefits: OYTEN_FALLBACK.benefits,
  };

  const supply = {
    title: SUPPLY_CHAIN_FALLBACK.title,
    content: SUPPLY_CHAIN_FALLBACK.description,
    nodes: SUPPLY_CHAIN_FALLBACK.nodes,
  };

  const cta = {
    title: CTA_FALLBACK.title,
    content: CTA_FALLBACK.content,
    buttonLabel: CTA_FALLBACK.buttonLabel,
    buttonHref: CTA_FALLBACK.buttonHref,
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
          {heroVideoUrl ? (
            <HeroVideo
              src={heroVideoUrl}
              poster={
                heroPosterUrl ||
                (hero.image && !hero.image.includes("placeholder")
                  ? hero.image
                  : undefined)
              }
            />
          ) : (
            hero.image &&
            !hero.image.includes("placeholder") && (
              <Image
                src={hero.image}
                alt={hero.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            )
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
                  Applications
                </Link>
                <Link href="/en/kontakt" className="btn-outline-white">
                  Get in touch
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
                  </div>

                  <ScrollReveal>
                    <div className="relative lg:mt-16">
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
                      <div className="lg:absolute lg:bottom-0 lg:right-0 lg:max-w-[340px] bg-pumpkin p-5 md:p-6">
                        <div className="w-6 h-[3px] bg-white mb-3" />
                        <p className="font-heading text-white text-[0.9375rem] font-semibold leading-snug">
                          {about.highlight}
                        </p>
                      </div>
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
                <div className="flex items-center gap-4 mb-4">
                  <div className="accent-line" />
                </div>
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                  {appsSection.title}
                </h2>
                <p className="font-accent text-text-muted text-[10px] tracking-[0.25em] uppercase">
                  {appsSection.content}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-10">
                  {appsSection.items.map((app, i) => (
                    <ScrollReveal
                      key={app.title}
                      delay={i * 60}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className="w-full aspect-[4/3] relative overflow-hidden"
                          style={{
                            background: tealGradients[i % tealGradients.length],
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px)",
                            }}
                          />
                        </div>
                        <div className="mt-4 flex flex-col items-center gap-2">
                          <CmsIcon
                            icon={icons[app.iconKey]}
                            width={28}
                            height={28}
                            className="text-pumpkin"
                          />
                          <p className="font-body text-anthracite text-[0.8125rem] font-medium leading-snug max-w-[160px]">
                            {app.title}
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

                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                      {oyten.title}
                    </h2>
                    <p className="font-accent text-text-muted text-[10px] tracking-[0.25em] uppercase mb-6">
                      Your local point of support in Germany
                    </p>

                    <p
                      className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                      style={{ textWrap: "pretty" }}
                    >
                      {oyten.content}
                    </p>

                    <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 gap-x-8 list-none p-0">
                      {oyten.benefits.map((b) => (
                        <li
                          key={b.text}
                          className="flex items-start gap-2.5"
                        >
                          <CmsIcon
                            icon={icons["checkmark"]}
                            width={16}
                            height={16}
                            className="text-pumpkin flex-shrink-0 mt-0.5"
                          />
                          <span className="font-body text-anthracite text-[0.875rem] leading-relaxed">
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
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="accent-line" />
                </div>
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                  {supply.title}
                </h2>
                <p className="font-accent text-text-muted text-[10px] tracking-[0.25em] uppercase mb-10">
                  {supply.content}
                </p>

                <div className="flex flex-col md:flex-row md:items-stretch gap-0">
                  {supply.nodes.map((node, i) => (
                    <ScrollReveal key={node.title} delay={i * 100} className="contents">
                      {i > 0 && (
                        <div className="flex items-center justify-center py-3 md:py-0 md:px-3">
                          <span className="font-heading text-2xl font-light text-pumpkin">
                            +
                          </span>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col">
                        <div
                          className="w-full aspect-[3/2] relative overflow-hidden"
                          style={{
                            background: tealGradients[i % tealGradients.length],
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px)",
                            }}
                          />
                        </div>
                        <div className="py-5 px-1">
                          <h3 className="font-heading text-anthracite text-[0.9375rem] font-bold mb-0.5">
                            {node.title}
                          </h3>
                          <p className="font-body text-text-muted text-[0.8125rem] mb-2.5">
                            {node.flag}
                          </p>
                          <p className="font-body text-text-gray text-[0.8125rem] leading-[1.6]">
                            {node.description}
                          </p>
                        </div>
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
