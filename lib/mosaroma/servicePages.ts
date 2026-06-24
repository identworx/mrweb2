export interface ServicePage {
  slug: string;
  title: string;
  href: string;
  description: string;
  icon: "ruler" | "shield" | "fabric";
}

export const servicePages: ServicePage[] = [
  {
    slug: "produktmasse",
    title: "Produktmaße",
    href: "/kataloge/produktmasse",
    description:
      "Alle Maße und Abmessungen relevanter Produktformen auf einen Blick.",
    icon: "ruler",
  },
  {
    slug: "pflege-garantie",
    title: "Pflege & Garantie",
    href: "/kataloge/pflege-garantie",
    description:
      "Hinweise zu Reinigung, Lagerung und Garantiebedingungen für Mosaroma Outdoor-Produkte.",
    icon: "shield",
  },
  {
    slug: "stoff-technische-daten",
    title: "Stoff- & technische Daten",
    href: "/kataloge/stoff-technische-daten",
    description:
      "Technische Daten, Stoffqualitäten und Prüfwerte der Mosaroma Materialien.",
    icon: "fabric",
  },
];
