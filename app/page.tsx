import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SectionTeaser from "@/components/SectionTeaser";
import CategoryCard from "@/components/CategoryCard";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";
import { categories } from "@/lib/mosaroma/categories";
import { collections } from "@/lib/mosaroma/collections";
import { newsItems } from "@/lib/mosaroma/news";
import Footer from "@/components/Footer";

const brandPromises = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
    title: "Komfort",
    text: "Formstabile Polsterung und ergonomische Passformen für entspannte Stunden im Freien.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Qualität",
    text: "Spinndüsengefärbte Fasern, UV-beständig und farbecht — für Jahre, nicht Saisons.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Verantwortung",
    text: "Ressourcenschonende Fertigung mit 42 % weniger Wasser und 71 % Solarstrom.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V7.5M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125H12m-5.25 0V7.5m0 0h5.25" />
      </svg>
    ),
    title: "Design",
    text: "Sieben kuratierte Farbwelten und zeitlose Formen, die jedes Outdoor-Konzept veredeln.",
  },
];

const catalogs = [
  {
    title: "Katalog 2027",
    description: "Alle Produkte, Kollektionen und Stoffe der Saison.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Produktmaße",
    description: "Alle Maße und Abmessungen auf einen Blick.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 3h18v18H3V3zm3 15V6m12 12V6M6 6h12M6 18h12M9 6v12m3-12v12m3-12v12" />
      </svg>
    ),
  },
  {
    title: "Pflege & Garantie",
    description: "Pflegehinweise und Garantiebedingungen.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* Brand Promises */}
        <SectionTeaser
          accent="Warum Mosaroma"
          title="Was uns ausmacht."
          centered
          ctaLabel="Mehr über Mosaroma"
          ctaHref="/ueber-uns"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {brandPromises.map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pumpkin/10 text-pumpkin mb-5">
                  {item.icon}
                </div>
                <h3 className="font-heading text-anthracite text-lg font-bold mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-text-gray text-sm leading-[1.8]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </SectionTeaser>

        {/* Produktkategorien Teaser */}
        <SectionTeaser
          accent="Sortiment"
          title="Produktkategorien."
          description="Von Dekokissen über Hochlehner bis zu Poufs und Decken — neun Kategorien für Ihren Außenbereich."
          bgColor="cream"
          ctaLabel="Alle Produktkategorien ansehen"
          ctaHref="/produktkategorien"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-5">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                title={cat.title}
                image={cat.image}
                alt={cat.alt}
                size="medium"
                description={cat.shortDescription.split("—")[0].trim()}
                href={`/produktkategorien/${cat.slug}`}
              />
            ))}
          </div>
        </SectionTeaser>

        {/* Material & Technologie Teaser */}
        <SectionTeaser
          accent="Material & Technologie"
          title="Mackintosh® Technology."
          bgColor="white"
          ctaLabel="Materialien entdecken"
          ctaHref="/materialien"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-light-gray group">
              <div
                className="absolute inset-0 bg-cover bg-center img-zoom"
                style={{
                  backgroundImage:
                    "url('/images/news/mackintosh-technologie.jpg')",
                }}
                role="img"
                aria-label="Nahaufnahme Mackintosh® Gewebe"
              />
            </div>

            {/* Text */}
            <div>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-8">
                Unsere Mackintosh®-Stoffe basieren auf spinndüsengefärbtem Olefin
                — die Farbe wird bereits bei der Faserherstellung eingebracht. Das
                Ergebnis: außergewöhnliche Lichtechtheit, UV-Beständigkeit und
                eine niedrige CO&#8322;-Bilanz.
              </p>
              <ul className="space-y-4">
                {[
                  "Solution-Dyed Olefin — Farbe in der Faser",
                  "Wasserabweisend & schnelltrocknend",
                  "100 % outdoor-tauglich",
                  "Langlebig & pflegeleicht",
                  "Nachhaltig in der Herstellung",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 bg-pumpkin shrink-0" />
                    <span className="font-body text-text-gray text-sm leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionTeaser>

        {/* Kollektionen Teaser */}
        <SectionTeaser
          accent="Farbwelten"
          title="Kollektionen."
          description="Sieben kuratierte Farbwelten für die Saison 2027 — von frischem Grün bis zur nachhaltigen NERIO Oceana Linie."
          bgColor="cream"
          ctaLabel="Alle Kollektionen ansehen"
          ctaHref="/kollektionen"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-5">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/kollektionen/${col.slug}`}
                className="group block bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                {/* Color swatches */}
                <div className="flex">
                  {col.moodColors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 transition-all duration-500 group-hover:h-3"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {/* Content */}
                <div className="p-4 md:p-5">
                  <span className="font-accent text-text-gray/40 text-[10px] tracking-[0.2em] uppercase">
                    {col.number}
                  </span>
                  <h3 className="font-heading text-anthracite text-sm font-bold mt-1 group-hover:text-pumpkin transition-colors duration-300">
                    {col.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </SectionTeaser>

        {/* Nachhaltigkeit Teaser */}
        <SectionTeaser
          accent="Nachhaltigkeit"
          title="Grün gewebt. Vom Tropfen an."
          bgColor="anthracite"
          centered
          ctaLabel="Mehr zur Verantwortung"
          ctaHref="/ueber-uns"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {[
              { stat: "42 %", label: "weniger Wasser", detail: "im Färbeprozess gegenüber konventionellen Verfahren" },
              { stat: "38 %", label: "weniger Chemie", detail: "durch spinndüsengefärbte Fasern ohne Nachbehandlung" },
              { stat: "71 %", label: "Solarstrom", detail: "unserer Fertigung läuft mit Photovoltaik-Energie" },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <span className="font-heading text-pumpkin text-5xl md:text-6xl font-extrabold tracking-tight">
                  {item.stat}
                </span>
                <p className="font-heading text-white text-lg font-semibold mt-3 mb-2">
                  {item.label}
                </p>
                <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionTeaser>

        {/* Kataloge Teaser */}
        <SectionTeaser
          accent="Downloads"
          title="Kataloge & Dokumente."
          description="Alle wichtigen Unterlagen zum Download — Produktkatalog, Maße und Pflegehinweise."
          bgColor="white"
          ctaLabel="Alle Downloads ansehen"
          ctaHref="/kataloge"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {catalogs.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-5 p-7 bg-cream transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="shrink-0 text-pumpkin mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-heading text-anthracite text-base font-bold mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-body text-text-gray text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionTeaser>

        {/* Neuigkeiten Teaser */}
        <SectionTeaser
          accent="Neuigkeiten"
          title="Aktuelles."
          description="Neues aus der Welt von Mosaroma — Kollektionen, Materialien und mehr."
          bgColor="cream"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {newsItems.slice(0, 3).map((item) => (
              <NewsCard
                key={item.slug}
                title={item.title}
                tag={item.tag}
                date={item.date}
                description={item.description}
                slug={item.slug}
                isPlaceholder={item.isPlaceholder}
              />
            ))}
          </div>
        </SectionTeaser>
      </main>
      <Footer />
    </>
  );
}
