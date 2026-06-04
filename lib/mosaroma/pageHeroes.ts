export interface PageHeroData {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  alt: string;
}

export const pageHeroes: Record<string, PageHeroData> = {
  kollektionen: {
    eyebrow: "Saison 2027",
    title: "Unsere Kollektionen",
    description:
      "Sieben kuratierte Farbwelten für den Außenbereich -- jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung.",
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
    eyebrow: "Service",
    title: "Produktmaße",
    description:
      "Übersicht der wichtigsten Abmessungen für Mosaroma Produktformen.",
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
  stoffTechnischeDaten: {
    eyebrow: "Service",
    title: "Stoff- & technische Daten",
    description:
      "Technische Informationen zu Stoffqualitäten, Materialaufbau und Prüfwerten.",
    image: "/images/placeholders/page-heroes/stoff-technische-daten-hero.svg",
    alt: "Mosaroma Stoff und technische Daten Hero Platzhalter",
  },
};
