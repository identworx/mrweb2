export interface PageHeroData {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  alt: string;
}

export const pageHeroes: Record<string, PageHeroData> = {
  kollektionen: {
    eyebrow: "Saison 2027 · Outdoor Living",
    title: "Sieben Farbwelten.",
    description:
      "Jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung. Wählen Sie die Welt, die zu Ihrem Außenbereich passt.",
    image: "/images/placeholders/page-heroes/kollektionen-hero.svg",
    alt: "Mosaroma Kollektionen Hero Platzhalter mit Stoffstruktur und Farbfeldern",
  },
  materialien: {
    eyebrow: "Material & Technologie",
    title: "Materialien, die draußen bestehen.",
    description:
      "Outdoor-Textilien, entwickelt für Komfort, Beständigkeit und zuverlässige Performance im Freien.",
    image: "/images/placeholders/page-heroes/materialien-hero.svg",
    alt: "Mosaroma Materialien Hero Platzhalter mit gewebter Stoffstruktur",
  },
  ueberUns: {
    eyebrow: "Über Mosaroma",
    title: "Das sind wir.",
    description:
      "Design, Performance und verantwortungsvolles Handeln für langlebige Outdoor-Textilien.",
    image: "/images/placeholders/page-heroes/ueber-uns-hero.svg",
    alt: "Mosaroma Über uns Hero Platzhalter im hochwertigen Outdoor-Stil",
  },
  kataloge: {
    eyebrow: "Downloads",
    title: "Kataloge & Downloads",
    description:
      "Dokumente rund um Produkte, Stoffe, Kollektionen, Pflege und technische Daten.",
    image: "/images/placeholders/page-heroes/kataloge-hero.svg",
    alt: "Mosaroma Kataloge und Downloads Hero Platzhalter",
  },
  neuigkeiten: {
    eyebrow: "Aktuelles",
    title: "Neuigkeiten",
    description:
      "Aktuelle Themen rund um Kollektionen, Materialien und Outdoor-Textilien.",
    image: "/images/placeholders/page-heroes/neuigkeiten-hero.svg",
    alt: "Mosaroma Neuigkeiten Hero Platzhalter",
  },
  kontakt: {
    eyebrow: "Kontakt",
    title: "Sprechen Sie uns an.",
    description:
      "Wir unterstützen Sie bei Fragen zu Kollektionen, Materialien, Katalogen und Produkten.",
    image: "/images/placeholders/page-heroes/kontakt-hero.svg",
    alt: "Mosaroma Kontakt Hero Platzhalter",
  },
  produktmasse: {
    eyebrow: "Übersicht · Bemaßung am Produkt",
    title: "Produktmaße",
    description:
      "Alle relevanten Maße und Abmessungen der Mosaroma Produktformen auf einen Blick.",
    image: "/images/placeholders/page-heroes/produktmasse-hero.svg",
    alt: "Mosaroma Produktmaße Hero Platzhalter mit technischen Linien und Maßangaben",
  },
  pflegeGarantie: {
    eyebrow: "Service",
    title: "Pflege & Garantie",
    description:
      "Hinweise zur Reinigung, Lagerung und Garantie von Mosaroma Outdoor-Produkten.",
    image: "/images/placeholders/page-heroes/pflege-garantie-hero.svg",
    alt: "Mosaroma Pflege und Garantie Hero Platzhalter",
  },
  stoffeMuster: {
    eyebrow: "Stoffbibliothek",
    title: "Stoffe & Muster",
    description:
      "Filtern Sie nach Materialfamilie, Produktart oder suchen Sie gezielt nach Stoffname und Artikelnummer.",
    image: "/images/placeholders/page-heroes/materialien-hero.svg",
    alt: "Mosaroma Stoffe und Muster Hero Platzhalter",
  },
  technischeDaten: {
    eyebrow: "Materialvergleich",
    title: "Technische Daten",
    description:
      "Materialeigenschaften, Prüfwerte und Outdoor-Performance unserer Stoffqualitäten im Vergleich.",
    image: "/images/placeholders/page-heroes/materialien-hero.svg",
    alt: "Mosaroma Technische Daten Hero Platzhalter",
  },
  stoffTechnischeDaten: {
    eyebrow: "Service",
    title: "Stoff- & technische Daten",
    description:
      "Technische Informationen zu Stoffqualitäten, Materialaufbau und Prüfwerten.",
    image: "/images/placeholders/page-heroes/stoff-technische-daten-hero.svg",
    alt: "Mosaroma Stoff und technische Daten Hero Platzhalter",
  },
  nerio: {
    eyebrow: "Nachhaltigkeit · OceanCycle®",
    title: "NERIO — Aus dem Ozean geboren.",
    description:
      "Performance-Stoffe aus recyceltem Ozean-Polypropylen. OceanCycle® zertifiziert, PFAS-frei und spinndüsengefärbt.",
    image: "/images/placeholders/page-heroes/nerio-hero.svg",
    alt: "Mosaroma NERIO Nachhaltigkeits-Kollektion Hero",
  },
};

export const pageHeroesEn: Record<string, Partial<PageHeroData>> = {
  kollektionen: {
    eyebrow: "Season 2027 · Outdoor Living",
    title: "Seven Colour Worlds.",
    description: "Each collection tells its own story of colour, material and mood. Choose the world that suits your outdoor space.",
    alt: "Mosaroma Collections Hero with fabric texture and colour fields",
  },
  materialien: {
    eyebrow: "Material & Technology",
    title: "Materials built for the outdoors.",
    description: "Outdoor textiles designed for comfort, durability and reliable performance in the open air.",
    alt: "Mosaroma Materials Hero with woven fabric texture",
  },
  ueberUns: {
    eyebrow: "About Mosaroma",
    title: "This is who we are.",
    description: "Design, performance and responsible practice for long-lasting outdoor textiles.",
    alt: "Mosaroma About Us Hero in premium outdoor style",
  },
  kataloge: {
    eyebrow: "Downloads",
    title: "Catalogues & Downloads",
    description: "Documents on products, fabrics, collections, care and technical data.",
    alt: "Mosaroma Catalogues and Downloads Hero",
  },
  neuigkeiten: {
    eyebrow: "Latest",
    title: "News",
    description: "Current topics on collections, materials and outdoor textiles.",
    alt: "Mosaroma News Hero",
  },
  kontakt: {
    eyebrow: "Contact",
    title: "Get in touch.",
    description: "We are happy to help with questions about collections, materials, catalogues and products.",
    alt: "Mosaroma Contact Hero",
  },
  produktmasse: {
    eyebrow: "Overview · Product Dimensions",
    title: "Product Dimensions",
    description: "All key dimensions of Mosaroma product types at a glance.",
    alt: "Mosaroma Product Dimensions Hero with technical lines and measurements",
  },
  pflegeGarantie: {
    eyebrow: "Service",
    title: "Care & Warranty",
    description: "Instructions on cleaning, storage and warranty for Mosaroma outdoor products.",
    alt: "Mosaroma Care and Warranty Hero",
  },
  stoffeMuster: {
    eyebrow: "Fabric Library",
    title: "Fabrics & Samples",
    description: "Filter by material family, product type or search by fabric name and article number.",
    alt: "Mosaroma Fabrics and Samples Hero",
  },
  technischeDaten: {
    eyebrow: "Material Comparison",
    title: "Technical Data",
    description: "Material properties, test values and outdoor performance of our fabric qualities compared.",
    alt: "Mosaroma Technical Data Hero",
  },
  stoffTechnischeDaten: {
    eyebrow: "Service",
    title: "Fabric & Technical Data",
    description: "Technical information on fabric qualities, material composition and test values.",
    alt: "Mosaroma Fabric and Technical Data Hero",
  },
  nerio: {
    eyebrow: "Sustainability · OceanCycle®",
    title: "NERIO — Born from the Ocean.",
    description: "Performance fabrics made from recycled ocean polypropylene. OceanCycle® certified, PFAS-free and solution-dyed.",
    alt: "Mosaroma NERIO Sustainability Collection Hero",
  },
};
