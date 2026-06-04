export interface NewsItem {
  slug: string;
  title: string;
  tag: string;
  date: string;
  description: string;
  image: string;
  alt: string;
  isPlaceholder: true;
  content: string;
}

export const newsItems: NewsItem[] = [
  {
    slug: "neue-kollektionen-2027",
    title: "Neue Kollektionen Saison 2027",
    tag: "Kollektionen",
    date: "2027",
    description:
      "Sieben neue Farbwelten für die Saison 2027: Von frischen Grüntönen über kühles Blau und warmes Rot bis zu sonnigem Gelb, erdigen Naturtönen, der nachhaltigen NERIO Oceana Linie und unkomplizierter Basic-Qualität.",
    image: "/images/news/neue-kollektionen-2027.jpg",
    alt: "MOSAROMA Kollektionen 2027 Übersicht",
    isPlaceholder: true,
    content: "// TODO: Echten Newsinhalt einsetzen",
  },
  {
    slug: "mackintosh-technologie",
    title: "Mackintosh® Technologie erklärt",
    tag: "Materialien",
    date: "2027",
    description:
      "Spinndüsengefärbtes Olefin bildet die Grundlage unserer Mackintosh®-Stoffe. Die Farbe wird bereits bei der Faserherstellung eingebracht — für außergewöhnliche Lichtechtheit, UV-Beständigkeit und eine niedrige CO₂-Bilanz.",
    image: "/images/news/mackintosh-technologie.jpg",
    alt: "Nahaufnahme Mackintosh® Gewebe",
    isPlaceholder: true,
    content: "// TODO: Echten Newsinhalt einsetzen",
  },
  {
    slug: "nerio-oceana",
    title: "NERIO · Oceana Collection",
    tag: "Nachhaltigkeit",
    date: "2027",
    description:
      "Performance-Outdoorstoffe auf Basis von OceanCycle recyceltem Polypropylen. Solution-dyed, PFAS-frei und entwickelt für hohe Anforderungen im Außenbereich — aus dem Ozean geboren, für die Zukunft gemacht.",
    image: "/images/news/nerio-oceana.jpg",
    alt: "NERIO Oceana Stoffe in Nahaufnahme",
    isPlaceholder: true,
    content: "// TODO: Echten Newsinhalt einsetzen",
  },
  {
    slug: "pflegehinweise",
    title: "Pflegehinweise für Outdoor-Textilien",
    tag: "Service",
    date: "2027",
    description:
      "Richtige Pflege verlängert die Lebensdauer Ihrer Outdoor-Textilien erheblich. Unsere Empfehlungen zu Reinigung, Lagerung und Fleckenentfernung für alle MOSAROMA-Stoffqualitäten.",
    image: "/images/news/pflegehinweise.jpg",
    alt: "Pflege von Outdoor-Textilien",
    isPlaceholder: true,
    content: "// TODO: Echten Newsinhalt einsetzen",
  },
];
