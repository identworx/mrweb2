export interface Collection {
  slug: string;
  name: string;
  number: string;
  subtitle?: string;
  description: string;
  extendedDescription: string;
  fabric: string;
  image: string;
  alt: string;
  moodColors: [string, string, string, string];
  productCategories: string[];
}

export const collections: Collection[] = [
  {
    slug: "green",
    name: "Green",
    number: "01",
    description:
      "Grüne Nuancen für natürliche Rückzugsorte im Freien.",
    extendedDescription:
      "Inspiriert von Olivenlaub, Schattenplätzen und gealtertem Stein. Eine Farbwelt für Gärten, die Ruhe ausstrahlen und lange schön bleiben.",
    fabric: "Mackintosh® & Lite",
    image: "/images/collections/green.jpg",
    alt: "MOSAROMA Collection Green — natürliche Grüntöne für den Außenbereich",
    moodColors: ["#4A7C59", "#6B8F71", "#8FB996", "#C5D5C5"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
      "sitzpolster",
      "bankauflagen",
      "poufs",
      "tischsets-tischlaeufer",
      "decken",
    ],
  },
  {
    slug: "blue",
    name: "Blue",
    number: "02",
    description:
      "Kühle Blautöne für klare, frische Outdoor-Looks.",
    extendedDescription:
      "Inspiriert von Wasser, Himmel und hellen Terrassen am Meer.",
    fabric: "Mackintosh® & Lite",
    image: "/images/collections/blue.jpg",
    alt: "MOSAROMA Collection Blue — kühle Blautöne für den Außenbereich",
    moodColors: ["#2C5F7C", "#4A8BAD", "#7AB3CC", "#B5D5E2"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
      "sitzpolster",
      "bankauflagen",
      "poufs",
      "tischsets-tischlaeufer",
      "decken",
    ],
  },
  {
    slug: "red",
    name: "Red",
    number: "03",
    description:
      "Warme Rot-, Terracotta- und Rosétöne für lebendige Outdoor-Akzente.",
    extendedDescription:
      "Inspiriert von Abendsonne, gebranntem Ton und mediterranen Blüten.",
    fabric: "Mackintosh® & Lite",
    image: "/images/collections/red.jpg",
    alt: "MOSAROMA Collection Red — warme Rottöne für den Außenbereich",
    moodColors: ["#8B2500", "#C0392B", "#E67E73", "#F5C6C1"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
      "sitzpolster",
      "bankauflagen",
      "poufs",
      "tischsets-tischlaeufer",
      "decken",
    ],
  },
  {
    slug: "golden",
    name: "Golden",
    number: "04",
    description:
      "Sonnige Gelb- und Citron-Töne für helle, freundliche Outdoor-Bereiche.",
    extendedDescription:
      "Inspiriert von Sommerlicht, Zitronenhainen und warmem Sandstein.",
    fabric: "Mackintosh® & Lite",
    image: "/images/collections/golden.jpg",
    alt: "MOSAROMA Collection Golden — sonnige Gelbtöne für den Außenbereich",
    moodColors: ["#B8860B", "#DAA520", "#F0C75E", "#F5E1A4"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
      "sitzpolster",
      "bankauflagen",
      "poufs",
      "tischsets-tischlaeufer",
      "decken",
    ],
  },
  {
    slug: "earth-grey",
    name: "Earth & Grey",
    number: "05",
    description:
      "Erdige Naturtöne und ruhige Graunuancen für zeitlose Outdoor-Konzepte.",
    extendedDescription:
      "Inspiriert von Sandstein, Leinen, Kies, Schatten und verwittertem Holz.",
    fabric: "Mackintosh® & Lite",
    image: "/images/collections/earth-grey.jpg",
    alt: "MOSAROMA Collection Earth & Grey — erdige Naturtöne für den Außenbereich",
    moodColors: ["#6B5B4B", "#8B7D6B", "#A69B8D", "#C4BEB5"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
      "sitzpolster",
      "bankauflagen",
      "poufs",
      "tischsets-tischlaeufer",
      "decken",
    ],
  },
  {
    slug: "nerio-oceana",
    name: "NERIO · Oceana",
    number: "06",
    subtitle: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
    description:
      "Performance-Outdoorstoffe auf Basis von OceanCycle recyceltem Polypropylen. Solution-dyed, PFAS-frei und entwickelt für hohe Anforderungen im Außenbereich.",
    extendedDescription:
      "Aus dem Ozean geboren. Für die Zukunft gemacht.",
    fabric: "Nerio",
    image: "/images/collections/nerio-oceana.jpg",
    alt: "MOSAROMA Collection NERIO Oceana — nachhaltige Performance-Outdoorstoffe",
    moodColors: ["#1B6B6D", "#2E8B8B", "#5CACAC", "#96D4D4"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
      "bankauflagen",
    ],
  },
  {
    slug: "basic",
    name: "Basic",
    number: "07",
    description:
      "Unkomplizierte Outdoor-Textilien für starke Saisonflächen.",
    extendedDescription:
      "Leichte Polyesterqualitäten, vielseitig kombinierbar und angenehm pflegeleicht im Alltag.",
    fabric: "Basic (100 % Polyester, ca. 280 g/m², stückgefärbt)",
    image: "/images/collections/basic.jpg",
    alt: "MOSAROMA Collection Basic — unkomplizierte Outdoor-Textilien",
    moodColors: ["#555555", "#888888", "#AAAAAA", "#D5D5D5"],
    productCategories: [
      "dekokissen",
      "hochlehner",
      "niedriglehner",
      "sitzkissen",
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}
