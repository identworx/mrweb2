export interface FabricQuality {
  slug: string;
  name: string;
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness?: string;
  description?: string;
  subtitle?: string;
  highlights?: string[];
}

export const fabricQualities: FabricQuality[] = [
  {
    slug: "mackintosh",
    name: "Mackintosh®",
    material: "100 % Olefin",
    weight: "ab 260 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm starke Auflagen",
    highlights: [
      "Höchste Lichtechtheit (7–8)",
      "UV-Beständigkeit 5/5",
      "Wasseraufnahme < 0,1 %",
      "Bleichfest",
      "Schimmelfest",
      "PFAS-frei",
      "5 Jahre Garantie auf Stoff",
    ],
  },
  {
    slug: "mackintosh-lite",
    name: "Mackintosh® Lite",
    material: "100 % Olefin",
    weight: "ca. 170–300 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "3,5–6 cm Auflagen",
    description: "etwas leichterer Stoff",
  },
  {
    slug: "nerio",
    name: "Nerio",
    material: "100 % Olefin (50 % recycelt)",
    weight: "ca. 250 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    subtitle: "OceanCycle rPP",
  },
  {
    slug: "basic",
    name: "Basic",
    material: "100 % Polyester",
    weight: "ca. 280 g/m²",
    dyeing: "stückgefärbt",
    comfort: "bequemer Sitzkomfort",
    description: "weiche Haptik",
  },
];

/* -------------------------------------------------------------------------- */
/*  Properties comparison table (catalog page 11)                             */
/* -------------------------------------------------------------------------- */

export type MaterialColumnKey = "olefin" | "acryl" | "polyester";

export interface PropertyRow {
  property: string;
  olefin: string;
  acryl: string;
  polyester: string;
}

export const propertiesComparison: PropertyRow[] = [
  {
    property: "Lichtechtheit",
    olefin: "7–8",
    acryl: "6–7",
    polyester: "4–6",
  },
  {
    property: "UV-Beständigkeit",
    olefin: "★★★★★",
    acryl: "★★★★",
    polyester: "★★★",
  },
  {
    property: "Wasseraufnahme",
    olefin: "< 0,1 %",
    acryl: "1–2 %",
    polyester: "0,4 %",
  },
  {
    property: "Bleichfest",
    olefin: "Ja",
    acryl: "Ja",
    polyester: "Nein",
  },
  {
    property: "Schimmelfest",
    olefin: "Ja",
    acryl: "Ja",
    polyester: "Bedingt",
  },
  {
    property: "Gewicht/m²",
    olefin: "Leicht",
    acryl: "Mittel",
    polyester: "Mittel",
  },
  {
    property: "CO₂-Bilanz",
    olefin: "Niedrig",
    acryl: "Mittel",
    polyester: "Mittel",
  },
];

/* -------------------------------------------------------------------------- */
/*  Mackintosh® Technology                                                     */
/* -------------------------------------------------------------------------- */

export interface MackintoshTechnologyStep {
  title: string;
  description: string;
}

export interface MackintoshTechnology {
  title: string;
  description: string[];
  steps: MackintoshTechnologyStep[];
  benefits: string[];
}

export const mackintoshTechnology: MackintoshTechnology = {
  title: "Mackintosh® Technology",
  description: [
    "Mackintosh® Technology steht für spinndüsengefärbtes Olefin — ein Verfahren, bei dem die Farbe bereits bei der Faserherstellung in das Granulat eingebracht wird. Das Ergebnis: Fasern, die durchgefärbt sind und ihre Farbe nicht an der Oberfläche tragen, sondern im Kern.",
    "Dieses Verfahren macht nachträgliches Färben, Waschen und chemische Behandlung überflüssig. Der Wasser- und Energieverbrauch sinkt drastisch, die CO₂-Bilanz verbessert sich messbar — ohne Kompromisse bei Farbtreue und Haltbarkeit.",
  ],
  steps: [
    {
      title: "Granulat",
      description:
        "Olefin-Granulat bildet die Rohstoffbasis. Das leichte, chemisch stabile Polymer ist die Grundlage für alle Mackintosh®-Stoffe.",
    },
    {
      title: "Additiv",
      description:
        "Farbpigmente und UV-Stabilisatoren werden direkt in das geschmolzene Granulat eingemischt — noch bevor die Faser entsteht.",
    },
    {
      title: "Spinndüsenfärbung",
      description:
        "Die eingefärbte Schmelze wird durch Spinndüsen zu Fasern gezogen. Die Farbe sitzt im Faserkern — dauerhaft, lichtecht und bleichbeständig.",
    },
  ],
  benefits: [
    "Außergewöhnliche Lichtechtheit (7–8 auf der Skala)",
    "Höchste UV-Beständigkeit",
    "Wasseraufnahme unter 0,1 %",
    "Bleich- und schimmelfest",
    "PFAS-frei",
    "Niedrige CO₂-Bilanz durch wegfallende Nassveredlung",
  ],
};

/* -------------------------------------------------------------------------- */
/*  Olefin benefits                                                            */
/* -------------------------------------------------------------------------- */

export const olefinBenefits: string[] = [
  "flexibel",
  "geringes Gewicht",
  "hitzebeständig",
  "formstabil",
  "langlebig",
  "für den Außenbereich geeignet",
];
