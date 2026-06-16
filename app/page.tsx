import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getSiteSettings } from "@/lib/cms/settings";
import { getHomepageData, type HomepageSection } from "@/lib/cms/homepage";
import { getPublishedCollections } from "@/lib/cms/collections";
import { getPublicDownloads } from "@/lib/cms/downloads";
import { getPublishedNewsArticles } from "@/lib/cms/news";
import { getIconSlots } from "@/lib/cms/icons";
import HomepageHero from "@/components/homepage/HomepageHero";
import HomepageValueProps from "@/components/homepage/HomepageValueProps";
import HomepageImageTextFeature from "@/components/homepage/HomepageImageTextFeature";
import HomepageCollections from "@/components/homepage/HomepageCollections";
import HomepageSustainability from "@/components/homepage/HomepageSustainability";
import HomepageDownloads from "@/components/homepage/HomepageDownloads";
import HomepageNews from "@/components/homepage/HomepageNews";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.defaultSeoTitle || "Mosaroma | Design trifft Performance",
    description:
      settings?.defaultSeoDescription ||
      "Hochwertige Outdoor-Textilien, Sitzauflagen, Kissen, Poufs und Kollektionen für Garten, Terrasse, Hospitality und Fachhandel.",
  };
}

const FALLBACK_SECTIONS: HomepageSection[] = [
  {
    id: "fallback-hero",
    style: "home-hero",
    eyebrow: "Hochwertige Outdoor-Textilien",
    title: "Design trifft\nPerformance.",
    content: "Mosaroma verbindet anspruchsvolles Design, langlebige Materialien und zuverlässige Outdoor-Performance für Garten, Terrasse, Hospitality und Fachhandel.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Kollektionen entdecken",
    buttonHref: "/kollektionen",
    settings: {
      style: "home-hero",
      subheadline: "Hochwertige Outdoor-Textilien für Räume und Momente, die bleiben.",
      secondaryLabel: "Katalog ansehen",
      secondaryHref: "/kataloge",
    },
    order: 0,
    isActive: true,
  },
  {
    id: "fallback-value-props",
    style: "value-props",
    eyebrow: "Warum Mosaroma",
    title: "Was uns ausmacht.",
    content: null,
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Mehr über Mosaroma",
    buttonHref: "/ueber-uns",
    settings: {
      style: "value-props",
      cards: [
        { iconKey: "comfort", title: "Komfort", text: "Formstabile Polsterung und ergonomische Passformen für entspannte Stunden im Freien." },
        { iconKey: "quality", title: "Qualität", text: "Spinndüsengefärbte Fasern, UV-beständig und farbecht — für Jahre, nicht Saisons." },
        { iconKey: "sustainability", title: "Verantwortung", text: "Ressourcenschonende Fertigung mit 42 % weniger Wasser und 71 % Solarstrom." },
        { iconKey: "design", title: "Design", text: "Sieben kuratierte Farbwelten und zeitlose Formen, die jedes Outdoor-Konzept veredeln." },
      ],
    },
    order: 1,
    isActive: true,
  },
  {
    id: "fallback-technology",
    style: "image-text-feature",
    eyebrow: "Material & Technologie",
    title: "Mackintosh® Technology.",
    content: "Unsere Mackintosh®-Stoffe basieren auf spinndüsengefärbtem Olefin — die Farbe wird bereits bei der Faserherstellung eingebracht. Das Ergebnis: außergewöhnliche Lichtechtheit, UV-Beständigkeit und eine niedrige CO₂-Bilanz.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Materialien entdecken",
    buttonHref: "/materialien",
    settings: {
      style: "image-text-feature",
      bullets: [
        "Solution-Dyed Olefin — Farbe in der Faser",
        "Wasserabweisend & schnelltrocknend",
        "100 % outdoor-tauglich",
        "Langlebig & pflegeleicht",
        "Nachhaltig in der Herstellung",
      ],
    },
    order: 2,
    isActive: true,
  },
  {
    id: "fallback-collections",
    style: "collection-showcase",
    eyebrow: "Farbwelten",
    title: "Kollektionen.",
    content: "Sieben kuratierte Farbwelten für die Saison 2027 — von frischem Grün bis zur nachhaltigen NERIO Oceana Linie.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Alle Kollektionen ansehen",
    buttonHref: "/kollektionen",
    settings: { style: "collection-showcase" },
    order: 3,
    isActive: true,
  },
  {
    id: "fallback-sustainability",
    style: "sustainability-stats",
    eyebrow: "Nachhaltigkeit",
    title: "Grün gewebt. Vom Tropfen an.",
    content: "Spinndüsengefärbtes Polypropylen spart im Vergleich zu konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Mehr zur Verantwortung",
    buttonHref: "/ueber-uns",
    settings: {
      style: "sustainability-stats",
      stats: [
        { value: "42 %", label: "weniger Wasser", detail: "im Färbeprozess gegenüber konventionellen Verfahren" },
        { value: "38 %", label: "weniger Chemie", detail: "durch spinndüsengefärbte Fasern ohne Nachbehandlung" },
        { value: "71 %", label: "Solarstrom", detail: "unserer Fertigung läuft mit Photovoltaik-Energie" },
      ],
    },
    order: 4,
    isActive: true,
  },
  {
    id: "fallback-downloads",
    style: "downloads-teaser",
    eyebrow: "Downloads",
    title: "Kataloge & Dokumente.",
    content: "Alle wichtigen Unterlagen zum Download — Produktkatalog, Maße und Pflegehinweise.",
    imageUrl: null,
    imageAlt: null,
    buttonLabel: "Alle Downloads ansehen",
    buttonHref: "/kataloge",
    settings: { style: "downloads-teaser" },
    order: 5,
    isActive: true,
  },
  {
    id: "fallback-news",
    style: "news-teaser",
    eyebrow: "Neuigkeiten",
    title: "Aktuelles.",
    content: "Neues aus der Welt von Mosaroma — Kollektionen, Materialien und mehr.",
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
  const [layout, homepageData, collections, downloads, articles, icons] = await Promise.all([
    getPublicLayoutData(),
    getHomepageData(),
    getPublishedCollections(),
    getPublicDownloads(),
    getPublishedNewsArticles(),
    getIconSlots([
      "arrow-right", "scroll-down", "download-book",
      "value-comfort", "value-quality", "value-sustainability", "value-design",
    ]),
  ]);

  const sections = homepageData?.sections.length
    ? homepageData.sections
    : FALLBACK_SECTIONS;

  return (
    <>
      <Header {...layout.header} />
      <main>
        {sections.map((section) => {
          switch (section.style) {
            case "home-hero":
              return <HomepageHero key={section.id} section={section} icons={icons} />;
            case "value-props":
              return <HomepageValueProps key={section.id} section={section} icons={icons} />;
            case "image-text-feature":
              return <HomepageImageTextFeature key={section.id} section={section} icons={icons} />;
            case "collection-showcase":
              return <HomepageCollections key={section.id} section={section} collections={collections} icons={icons} />;
            case "sustainability-stats":
              return <HomepageSustainability key={section.id} section={section} icons={icons} />;
            case "downloads-teaser":
              return <HomepageDownloads key={section.id} section={section} downloads={downloads} icons={icons} />;
            case "news-teaser":
              return <HomepageNews key={section.id} section={section} articles={articles} icons={icons} />;
            default:
              return null;
          }
        })}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
