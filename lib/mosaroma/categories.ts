export interface CategoryDimensions {
  width?: number;
  height?: number;
  depth?: number;
  thickness?: number;
  label: string;
  fabric?: string;
}

export interface Category {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  alt: string;
  availableFabrics: string[];
  availableCollectionSlugs: string[];
  features: string[];
  dimensions: CategoryDimensions[];
}

export const categories: Category[] = [
  {
    slug: "dekokissen",
    title: "Dekokissen",
    shortDescription:
      "Dekorative Akzentkissen für den Außenbereich — vielseitig kombinierbar in allen Stoffqualitäten.",
    description:
      "Unsere Dekokissen setzen farbliche Akzente auf Lounge-Möbeln, Bänken und Liegen. Erhältlich mit und ohne Keder, in allen Stoffqualitäten der Saison 2027. Die hochwertige Verarbeitung und die outdoor-tauglichen Materialien sorgen für langlebige Freude im Freien.",
    image: "/images/placeholders/categories/dekokissen.svg",
    alt: "MOSAROMA Dekokissen für den Außenbereich",
    availableFabrics: ["Mackintosh®", "Mackintosh® Lite", "Nerio", "Basic"],
    availableCollectionSlugs: ["green", "blue", "red", "golden", "earth-grey", "nerio-oceana", "basic"],
    features: [
      "Mit und ohne Keder erhältlich",
      "Alle Stoffqualitäten verfügbar",
      "Perfekt als Farbakzent auf Outdoor-Möbeln",
      "Hochwertige Verarbeitung für den Außenbereich",
    ],
    dimensions: [
      {
        width: 48,
        height: 48,
        label: "48 × 48 cm",
        fabric: "Mackintosh® / Lite / Nerio",
      },
      {
        width: 45,
        height: 45,
        label: "45 × 45 cm",
        fabric: "Basic",
      },
    ],
  },
  {
    slug: "hochlehner",
    title: "Hochlehner",
    shortDescription:
      "Auflagen für Hochlehner-Gartenstühle — komfortable Polsterung mit durchgehender Rückenlehne.",
    description:
      "Hochlehner-Auflagen bieten durchgehenden Sitzkomfort von der Sitzfläche bis zur hohen Rückenlehne. Mit Keder verarbeitet und in mehreren Stoffqualitäten erhältlich — für anspruchsvolle Outdoor-Sitzplätze, die Komfort und Ästhetik verbinden.",
    image: "/images/placeholders/categories/hochlehner.svg",
    alt: "MOSAROMA Hochlehner-Auflagen",
    availableFabrics: ["Mackintosh®", "Mackintosh® Lite", "Nerio", "Basic"],
    availableCollectionSlugs: ["green", "blue", "red", "golden", "earth-grey", "nerio-oceana", "basic"],
    features: [
      "Mit Keder",
      "Durchgehende Polsterung für Sitz und Rückenlehne",
      "Formstabile Füllung",
      "Für gängige Hochlehner-Gartenstühle passend",
    ],
    dimensions: [
      {
        width: 48,
        height: 120,
        thickness: 6,
        label: "120 × 48 × 6 cm",
        fabric: "Mackintosh® / Nerio",
      },
      {
        width: 48,
        height: 120,
        thickness: 6,
        label: "120 × 48 × 6 cm",
        fabric: "Mackintosh® Lite",
      },
      {
        width: 48,
        height: 120,
        thickness: 5,
        label: "120 × 48 × 5 cm",
        fabric: "Basic",
      },
    ],
  },
  {
    slug: "niedriglehner",
    title: "Niedriglehner",
    shortDescription:
      "Auflagen für Niedriglehner-Stühle — komfortabel gepolstert mit kürzerer Rückenlehne.",
    description:
      "Niedriglehner-Auflagen ergänzen kompaktere Gartenstühle mit kürzerer Rückenlehne. Mit Keder eingefasst und in mehreren Stoffqualitäten verfügbar, bieten sie den gleichen hochwertigen Sitzkomfort wie unsere Hochlehner — in reduzierter Höhe.",
    image: "/images/placeholders/categories/niedriglehner.svg",
    alt: "MOSAROMA Niedriglehner-Auflagen",
    availableFabrics: ["Mackintosh®", "Mackintosh® Lite", "Nerio", "Basic"],
    availableCollectionSlugs: ["green", "blue", "red", "golden", "earth-grey", "nerio-oceana", "basic"],
    features: [
      "Mit Keder",
      "Komfortable Polsterung für kürzere Rückenlehnen",
      "Formstabile Füllung",
      "Für gängige Niedriglehner-Gartenstühle passend",
    ],
    dimensions: [
      {
        width: 48,
        height: 105,
        thickness: 6,
        label: "105 × 48 × 6 cm",
        fabric: "Mackintosh® / Nerio",
      },
      {
        width: 48,
        height: 105,
        thickness: 6,
        label: "105 × 48 × 6 cm",
        fabric: "Mackintosh® Lite",
      },
      {
        width: 48,
        height: 105,
        thickness: 5,
        label: "105 × 48 × 5 cm",
        fabric: "Basic",
      },
    ],
  },
  {
    slug: "sitzkissen",
    title: "Sitzkissen",
    shortDescription:
      "Vielseitige Sitzkissen für Gartenstühle — bequem gepolstert und outdoor-tauglich.",
    description:
      "Unsere Sitzkissen verwandeln jeden Gartenstuhl in einen komfortablen Sitzplatz. Mit Keder verarbeitet und in allen Stoffqualitäten erhältlich, bieten sie angenehme Polsterung für den täglichen Gebrauch im Freien.",
    image: "/images/placeholders/categories/sitzkissen.svg",
    alt: "MOSAROMA Sitzkissen für Gartenstühle",
    availableFabrics: ["Mackintosh®", "Mackintosh® Lite", "Nerio", "Basic"],
    availableCollectionSlugs: ["green", "blue", "red", "golden", "earth-grey", "nerio-oceana", "basic"],
    features: [
      "Mit Keder",
      "Bequeme Polsterung für den Außenbereich",
      "Passend für gängige Gartenstühle",
      "In allen Stoffqualitäten erhältlich",
    ],
    dimensions: [
      {
        width: 45,
        height: 46,
        thickness: 6,
        label: "46 × 45 × 6 cm",
        fabric: "Mackintosh® / Lite / Nerio",
      },
      {
        width: 45,
        height: 46,
        thickness: 5,
        label: "46 × 45 × 5 cm",
        fabric: "Basic",
      },
    ],
  },
  {
    slug: "sitzpolster",
    title: "Sitzpolster",
    shortDescription:
      "Flache Sitzpolster für Stühle und Bänke — schlank, leicht und unkompliziert im Einsatz.",
    description:
      "Unsere Sitzpolster bieten eine flache, leichte Polsterlösung für Outdoor-Stühle und Bänke. Ohne Keder verarbeitet, in eckiger und halbrunder Ausführung. Ausschließlich in Mackintosh® Lite erhältlich.",
    image: "/images/placeholders/categories/sitzpolster.svg",
    alt: "MOSAROMA Sitzpolster flach",
    availableFabrics: ["Mackintosh® Lite"],
    availableCollectionSlugs: ["green", "blue", "golden", "earth-grey"],
    features: [
      "Ohne Keder",
      "Eckige und halbrunde Variante",
      "Flache, leichte Polsterung (2 cm)",
      "Exklusiv in Mackintosh® Lite",
    ],
    dimensions: [
      {
        width: 40,
        height: 40,
        thickness: 2,
        label: "40 × 40 × 2 cm (eckig)",
        fabric: "Mackintosh® Lite",
      },
      {
        width: 40,
        height: 38,
        thickness: 2,
        label: "40 × 38 × 2 cm (halbrund)",
        fabric: "Mackintosh® Lite",
      },
    ],
  },
  {
    slug: "bankauflagen",
    title: "Bankauflagen",
    shortDescription:
      "Maßgefertigte Bankauflagen in vier Längen — von der Gartenbank bis zur XXL-Sitzfläche.",
    description:
      "Unsere Bankauflagen gibt es in vier Größen für unterschiedliche Banklängen. Mit Keder verarbeitet und in Mackintosh® Lite sowie Nerio erhältlich, bieten sie komfortable Polsterung für Gartenbänke aller gängigen Maße.",
    image: "/images/placeholders/categories/bankauflagen.svg",
    alt: "MOSAROMA Bankauflagen in verschiedenen Größen",
    availableFabrics: ["Mackintosh® Lite", "Nerio"],
    availableCollectionSlugs: ["green", "blue", "golden", "earth-grey", "nerio-oceana"],
    features: [
      "Mit Keder",
      "Vier Längen: S, M, L, XL",
      "Einheitliche Tiefe von 49 cm",
      "6 cm Polsterdicke in allen Größen",
    ],
    dimensions: [
      {
        width: 49,
        height: 50,
        thickness: 6,
        label: "S: 50 × 49 × 6 cm",
        fabric: "Mackintosh® Lite / Nerio",
      },
      {
        width: 49,
        height: 110,
        thickness: 6,
        label: "M: 110 × 49 × 6 cm",
        fabric: "Mackintosh® Lite / Nerio",
      },
      {
        width: 49,
        height: 140,
        thickness: 6,
        label: "L: 140 × 49 × 6 cm",
        fabric: "Mackintosh® Lite / Nerio",
      },
      {
        width: 49,
        height: 170,
        thickness: 6,
        label: "XL: 170 × 49 × 6 cm",
        fabric: "Mackintosh® Lite / Nerio",
      },
    ],
  },
  {
    slug: "poufs",
    title: "Poufs",
    shortDescription:
      "Vielseitige Outdoor-Poufs — als Sitzgelegenheit, Beistelltisch oder Fußablage einsetzbar.",
    description:
      "Unsere Poufs sind vielseitige Begleiter für den Außenbereich: als zusätzliche Sitzgelegenheit, als Beistelltisch oder als komfortable Fußablage. In zwei Größen und exklusiv in Mackintosh® erhältlich.",
    image: "/images/placeholders/categories/poufs.svg",
    alt: "MOSAROMA Outdoor-Poufs",
    availableFabrics: ["Mackintosh®"],
    availableCollectionSlugs: ["green", "blue", "red", "golden", "earth-grey"],
    features: [
      "Zwei Größen: Klein und Groß",
      "Vielseitig einsetzbar",
      "Exklusiv in Mackintosh®",
      "Robust und outdoor-tauglich",
    ],
    dimensions: [
      {
        width: 45,
        height: 45,
        label: "Klein: 45 × 45 cm",
        fabric: "Mackintosh®",
      },
      {
        width: 70,
        height: 36,
        label: "Groß: 70 × 36 cm",
        fabric: "Mackintosh®",
      },
    ],
  },
  {
    slug: "tischsets-tischlaeufer",
    title: "Tischsets & Tischläufer",
    shortDescription:
      "Elegante Tischsets und Tischläufer für den gedeckten Tisch im Freien — wetterfest und stilvoll.",
    description:
      "Unsere Tischsets und Tischläufer bringen Farbe und Stil auf den Outdoor-Esstisch. In drei Formaten erhältlich und exklusiv in Mackintosh® gefertigt — für eine stilvolle Tischdekoration, die Wind und Wetter standhält.",
    image: "/images/placeholders/categories/tischsets-tischlaeufer.svg",
    alt: "MOSAROMA Tischsets und Tischläufer",
    availableFabrics: ["Mackintosh®"],
    availableCollectionSlugs: ["green", "blue", "red", "golden", "earth-grey"],
    features: [
      "Drei Formate: Tischset und zwei Tischläufer-Varianten",
      "Exklusiv in Mackintosh®",
      "Flache 0,6 cm Ausführung",
      "Perfekt für den gedeckten Outdoor-Tisch",
    ],
    dimensions: [
      {
        width: 45,
        height: 35,
        thickness: 0.6,
        label: "Tischset: 35 × 45 × 0,6 cm",
        fabric: "Mackintosh®",
      },
      {
        width: 130,
        height: 35,
        thickness: 0.6,
        label: "Tischläufer A: 35 × 130 × 0,6 cm",
        fabric: "Mackintosh®",
      },
      {
        width: 120,
        height: 47.5,
        thickness: 0.6,
        label: "Tischläufer B: 47,5 × 120 × 0,6 cm",
        fabric: "Mackintosh®",
      },
    ],
  },
  {
    slug: "decken",
    title: "Decken",
    shortDescription:
      "Weiche Outdoor-Decken für kühle Abende — in Bambusfaser und Acryl erhältlich.",
    description:
      "Unsere Decken ergänzen den Outdoor-Bereich um eine kuschelige Komponente. Erhältlich in Bambusfaser und Acryl, bieten sie angenehme Wärme an kühlen Abenden und passen sich harmonisch in jede Farbwelt ein.",
    image: "/images/placeholders/categories/decken.svg",
    alt: "MOSAROMA Outdoor-Decken",
    availableFabrics: ["Bambusfaser", "Acryl"],
    availableCollectionSlugs: ["green", "blue", "golden", "earth-grey"],
    features: [
      "Zwei Materialien: Bambusfaser und Acryl",
      "Angenehm weich und wärmend",
      "Ideal für kühle Abende im Freien",
      "Vielseitig kombinierbar mit allen Kollektionen",
    ],
    dimensions: [
      {
        width: 160,
        height: 130,
        label: "130 × 160 cm",
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
