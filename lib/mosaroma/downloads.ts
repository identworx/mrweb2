export interface Download {
  title: string;
  description: string;
  type: string;
  languages: string[];
  href: string;
}

// TODO: PDF-Download-Links einsetzen, sobald verfügbar
export const downloads: Download[] = [
  {
    title: "Katalog 2027",
    description:
      "Vollständiger Produktkatalog mit allen Kollektionen, Maßen und Stoffqualitäten der Saison 2027.",
    type: "PDF",
    languages: ["Deutsch", "English"],
    href: "#",
  },
  {
    title: "Produktmaße",
    description:
      "Alle Maße und Abmessungen unserer Produktkategorien auf einen Blick.",
    type: "PDF",
    languages: ["Deutsch"],
    href: "#",
  },
  {
    title: "Pflege & Garantie",
    description:
      "Pflegehinweise, Lagerempfehlungen und Garantiebedingungen für alle MOSAROMA-Produkte.",
    type: "PDF",
    languages: ["Deutsch"],
    href: "#",
  },
  {
    title: "Stoff- & technische Daten",
    description:
      "Technische Datenblätter zu allen Stoffqualitäten: Gewicht, Breite, Prüfmethoden und Ergebnisse.",
    type: "PDF",
    languages: ["Deutsch"],
    href: "#",
  },
];
