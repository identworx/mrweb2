import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCta from "@/components/PageCta";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getHomepageData, type HomepageSection } from "@/lib/cms/homepage";
import { getPublishedCollections } from "@/lib/cms/collections";
import { getPublicDownloads } from "@/lib/cms/downloads";
import { getPublishedNewsArticles } from "@/lib/cms/news";
import { getIconSlots } from "@/lib/cms/icons";
import { getTeaserAmbienteImages } from "@/lib/cms/ambiente";
import HomepageHero from "@/components/homepage/HomepageHero";
import HomepageValueProps from "@/components/homepage/HomepageValueProps";
import HomepageImageTextFeature from "@/components/homepage/HomepageImageTextFeature";
import HomepageCollections from "@/components/homepage/HomepageCollections";
import HomepageSustainability from "@/components/homepage/HomepageSustainability";
import HomepageDownloads from "@/components/homepage/HomepageDownloads";
import HomepageNews from "@/components/homepage/HomepageNews";
import AmbienteTeaser from "@/components/collections/AmbienteTeaser";

export const revalidate = 60;

const locale: Locale = "en";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mosaroma | Design Meets Performance",
    description:
      "Premium outdoor textiles, seat cushions, decorative cushions, poufs and collections for garden, terrace, hospitality and trade.",
  };
}

const FALLBACK_SECTIONS: HomepageSection[] = [
  {
    id: "fallback-hero",
    style: "home-hero",
    eyebrow: "Premium Outdoor Textiles",
    title: "Design Meets\nPerformance.",
    content: "Mosaroma combines sophisticated design, durable materials and reliable outdoor performance for garden, terrace, hospitality and trade.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Discover collections",
    buttonHref: "/en/collections",
    settings: {
      style: "home-hero",
      subheadline: "Premium outdoor textiles for spaces and moments that last.",
      secondaryLabel: "View catalogue",
      secondaryHref: "/en/catalogues",
    },
    order: 0,
    isActive: true,
  },
  {
    id: "fallback-value-props",
    style: "value-props",
    eyebrow: "Why Mosaroma",
    title: "What Sets Us Apart.",
    content: null,
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "More about Mosaroma",
    buttonHref: "/en/about-us",
    settings: {
      style: "value-props",
      cards: [
        { iconKey: "comfort", title: "Comfort", text: "Dimensionally stable padding and ergonomic fits for relaxed hours outdoors." },
        { iconKey: "quality", title: "Quality", text: "Solution-dyed fibres, UV-resistant and colourfast — built for years, not seasons." },
        { iconKey: "sustainability", title: "Responsibility", text: "Resource-efficient production with 42% less water and 71% solar power." },
        { iconKey: "design", title: "Design", text: "Seven curated colour worlds and timeless forms that elevate any outdoor concept." },
      ],
    },
    order: 1,
    isActive: true,
  },
  {
    id: "fallback-technology",
    style: "image-text-feature",
    eyebrow: "Material & Technology",
    title: "Mackintosh® Technology.",
    content: "Our Mackintosh® fabrics are based on solution-dyed olefin — the colour is introduced during fibre production itself. The result: exceptional lightfastness, UV resistance and a low carbon footprint.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Discover materials",
    buttonHref: "/en/materials",
    settings: {
      style: "image-text-feature",
      bullets: [
        "Solution-Dyed Olefin — colour in the fibre",
        "Water-repellent & quick-drying",
        "100% outdoor-suitable",
        "Durable & easy to maintain",
        "Sustainably manufactured",
      ],
    },
    order: 2,
    isActive: true,
  },
  {
    id: "fallback-collections",
    style: "collection-showcase",
    eyebrow: "Colour Worlds",
    title: "Collections.",
    content: "Seven curated colour worlds for the 2027 season — from fresh greens to the sustainable NERIO Oceana line.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "View all collections",
    buttonHref: "/en/collections",
    settings: { style: "collection-showcase" },
    order: 3,
    isActive: true,
  },
  {
    id: "fallback-sustainability",
    style: "sustainability-stats",
    eyebrow: "Sustainability",
    title: "Green by Design. From the First Thread.",
    content: "Solution-dyed polypropylene saves significant amounts of water, energy and CO₂ compared to conventionally dyed fibres.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "More on responsibility",
    buttonHref: "/en/about-us",
    settings: {
      style: "sustainability-stats",
      stats: [
        { value: "42%", label: "less water", detail: "in the dyeing process compared to conventional methods" },
        { value: "38%", label: "fewer chemicals", detail: "through solution-dyed fibres without post-treatment" },
        { value: "71%", label: "solar power", detail: "of our production runs on photovoltaic energy" },
      ],
    },
    order: 4,
    isActive: true,
  },
  {
    id: "fallback-downloads",
    style: "downloads-teaser",
    eyebrow: "Downloads",
    title: "Catalogues & Documents.",
    content: "All essential documents available for download — product catalogue, dimensions and care instructions.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "View all downloads",
    buttonHref: "/en/catalogues",
    settings: { style: "downloads-teaser" },
    order: 5,
    isActive: true,
  },
  {
    id: "fallback-news",
    style: "news-teaser",
    eyebrow: "News",
    title: "Latest News.",
    content: "Updates from the world of Mosaroma — collections, materials and more.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: null,
    buttonHref: null,
    settings: { style: "news-teaser" },
    order: 6,
    isActive: true,
  },
];

export default async function Home() {
  const [layout, homepageData, collections, downloads, articles, icons, ambienteSlots] = await Promise.all([
    getPublicLayoutData("en"),
    getHomepageData("en"),
    getPublishedCollections("en"),
    getPublicDownloads("en"),
    getPublishedNewsArticles("en"),
    getIconSlots([
      "arrow-right", "scroll-down", "download-book",
      "value-comfort", "value-quality", "value-sustainability", "value-design",
    ]),
    getTeaserAmbienteImages(),
  ]);

  const sections = homepageData?.sections || FALLBACK_SECTIONS;

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        {sections.map((section) => {
          switch (section.style) {
            case "home-hero":
              return <HomepageHero key={section.id} section={section} icons={icons} locale={locale} />;
            case "homepage-ambiente-teaser":
              return (
                <AmbienteTeaser
                  key={section.id}
                  slots={ambienteSlots}
                  showHeader={false}
                  ctaPlacement="below-right"
                  variant="homepage"
                  ctaLabel={section.buttonLabel || "All ambiente images"}
                  ctaHref={section.buttonHref || "/en/collections/ambiente"}
                  locale={locale}
                />
              );
            case "value-props":
              return <HomepageValueProps key={section.id} section={section} icons={icons} locale={locale} />;
            case "image-text-feature":
              return <HomepageImageTextFeature key={section.id} section={section} icons={icons} locale={locale} />;
            case "collection-showcase":
              return <HomepageCollections key={section.id} section={section} collections={collections} icons={icons} locale={locale} />;
            case "sustainability-stats":
              return <HomepageSustainability key={section.id} section={section} icons={icons} locale={locale} />;
            case "downloads-teaser":
              return <HomepageDownloads key={section.id} section={section} downloads={downloads} icons={icons} locale={locale} />;
            case "news-teaser":
              return <HomepageNews key={section.id} section={section} articles={articles} icons={icons} locale={locale} />;
            default:
              return null;
          }
        })}
        <PageCta
          variant="minimal"
          title="Ready for Your Outdoor Space?"
          description="Request a sample set or get personal advice on collections, materials and custom dimensions."
          primaryLabel="Request samples"
          primaryHref="/en/contact"
          secondaryLabel="View catalogues"
          secondaryHref="/en/catalogues"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
