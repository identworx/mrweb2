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
    ],
  },
  {
    slug: "mackintosh-lite",
    name: "Mackintosh® Lite",
    material: "100 % Olefin",
    weight: "ca. 170–300 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    description: "etwas leichterer Stoff",
  },
  {
    slug: "nerio",
    name: "Mackintosh® Nerio",
    material: "100 % Olefin (50 % recycelt)",
    weight: "ca. 200–230 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    subtitle: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
    highlights: [
      "OceanCycle® zertifiziert",
      "50 % recyceltes Ozean-Polypropylen",
    ],
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

export interface PropertyRow {
  property: string;
  standard: string;
  olefin: string;
  polyester: string;
}

export const propertiesComparison: PropertyRow[] = [
  {
    property: "Lichtechtheit",
    standard: "BS EN ISO 105-B02 / B04",
    olefin: "7–8",
    polyester: "5–6",
  },
  {
    property: "Reibechtheit",
    standard: "BS EN ISO 105-X12",
    olefin: "Trocken/Nass: 4–5",
    polyester: "Trocken: 4+ / Nass: 3,5+",
  },
  {
    property: "Waschechtheit",
    standard: "BS EN ISO 105-C06",
    olefin: "4–5",
    polyester: "4",
  },
  {
    property: "Meerwasserechtheit",
    standard: "BS EN ISO 105-E02",
    olefin: "4–5",
    polyester: "3,5",
  },
  {
    property: "Entflammbarkeit",
    standard: "BS EN 1021-1",
    olefin: "Bestanden",
    polyester: "Bestanden",
  },
  {
    property: "Schimmelbeständigkeit",
    standard: "AATCC 147",
    olefin: "Bestanden",
    polyester: "Bestanden",
  },
  {
    property: "Wasserabweisung",
    standard: "AATCC 22",
    olefin: "90",
    polyester: "80",
  },
  {
    property: "Pillingbeständigkeit",
    standard: "BS EN ISO 12945-2",
    olefin: "4–5 nach 5.000 Zyklen",
    polyester: "4–5 nach 5.000 Zyklen",
  },
  {
    property: "Abriebfestigkeit",
    standard: "BS EN ISO 12947-2",
    olefin: "15.000–56.000 Zyklen",
    polyester: "15.000–25.000 Zyklen",
  },
  {
    property: "Gesamtfluor / PFAS",
    standard: "EN 14582:2016",
    olefin: "Nicht nachgewiesen",
    polyester: "Nicht nachgewiesen",
  },
  {
    property: "Produktion / Nachhaltigkeit",
    standard: "—",
    olefin: "Geringerer Energieverbrauch in der Produktion",
    polyester: "—",
  },
  {
    property: "Haptik",
    standard: "—",
    olefin: "Sehr weich, textilähnlich",
    polyester: "—",
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

export const olefinBenefits = {
  tags: ["Flexibel", "Geringes Gewicht", "Hitzebeständig", "Formstabil"],
  paragraphs: [
    "Polypropylen, seit vielen Jahren auch als Olefin bekannt, ist ein moderner Kunststoff, der durch die Polymerisation von Propylen entsteht. Zu seinen wichtigsten Eigenschaften zählen hohe Flexibilität, geringes Gewicht und eine sehr gute Hitzebeständigkeit.",
    "Olefin kann zu Fasern versponnen werden und wird sowohl in Industrie- als auch in Haushaltstextilien eingesetzt. Das Material teilt einige Eigenschaften mit Polyethylen, ist jedoch stärker, steifer und widerstandsfähiger. Bei höheren Temperaturen bleibt es formstabil und langlebig. Ein großer Teil der weltweiten Polypropylen-Produktion wird zu Fasern verarbeitet.",
    "Olefinfasern kommen in zahlreichen Produkten zum Einsatz, darunter Polstermöbel, Teppiche für den Innen- und Außenbereich, Seile, Taue, Fischfanggeräte sowie medizinische Anwendungen. Darüber hinaus werden Vliesstoffe aus Polypropylen zur Bodenstabilisierung und Bewehrung im Bauwesen und Straßenbau genutzt.",
    "Dank dieser Eigenschaften sind Olefinstoffe besonders für den Außenbereich geeignet. Die Mosaroma Kollektionen bestehen vollständig aus Polypropylen und sind daher dauerhaft für den Einsatz im Freien konzipiert.",
  ],
};

/* -------------------------------------------------------------------------- */
/*  OceanCycle Process (catalog p. 98)                                        */
/* -------------------------------------------------------------------------- */

export interface OceanCycleStep {
  title: string;
  description: string;
}

export const oceanCycleProcess = {
  title: "OceanCycle Kreislauf",
  description:
    "Ozeangebundenes Plastik wird im Umkreis von 50 km der Küsten oder an größeren Wasserwegen gesammelt, die in die Ozeane münden. Durch ein zertifiziertes Verfahren wird es zu hochwertigem Material für unsere NERIO-Stoffe.",
  steps: [
    {
      title: "Sammlung",
      description:
        "Ozeangebundenes Plastik wird in Küstennähe und an Wasserwegen eingesammelt, bevor es die Meere erreicht.",
    },
    {
      title: "Sortierung",
      description:
        "Die gesammelten Materialien werden nach Polymertyp und Qualität getrennt und für die Weiterverarbeitung vorbereitet.",
    },
    {
      title: "Reinigung",
      description:
        "Gründliche Reinigung und Aufbereitung des Materials zur Entfernung von Verunreinigungen und Fremdstoffen.",
    },
    {
      title: "Recycling",
      description:
        "Verarbeitung zu hochwertigem recyceltem Polypropylen (rPP), das als Basis für NERIO-Garne dient.",
    },
  ] as OceanCycleStep[],
  highlights: [
    "Min. 50 % OceanCycle recyceltem Polypropylen",
    "PFAS-frei — sicherer für Mensch und Planet",
    "Solution-Dyed für exzellente Farbechtheit",
    "Auf Langlebigkeit und lange Produktlebensdauer ausgelegt",
    "Reduziert ozeangebundene Plastikverschmutzung",
  ],
};

/* -------------------------------------------------------------------------- */
/*  NERIO Landing Page – fallback content                                     */
/* -------------------------------------------------------------------------- */

export const nerioStory = {
  eyebrow: "Die Geschichte",
  title: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
  paragraphs: [
    "NERIO verbindet hochwertige Outdoor-Performance mit echter Nachhaltigkeit. Jeder Stoff der NERIO-Linie enthält mindestens 50 % recyceltes Polypropylen, gewonnen aus ozeangebundenem Plastik.",
    "Die Faser wird spinndüsengefärbt — Farbe und UV-Schutz sind im Kern verankert. Kein nachträgliches Färben, kein Wasserverbrauch, keine chemischen Bäder. Das Ergebnis: langlebige Stoffe mit exzellenter Farbechtheit und messbarer CO₂-Einsparung.",
  ],
};

export const nerioPromise = {
  eyebrow: "Unser Versprechen",
  title: "Nachhaltigkeit ohne Kompromisse",
  items: [
    { iconKey: "recycle", title: "50 % recycelt", text: "Mindestens die Hälfte des Materials stammt aus OceanCycle® zertifiziertem, recyceltem Ozean-Polypropylen." },
    { iconKey: "droplet", title: "PFAS-frei", text: "Komplett frei von Per- und Polyfluoralkylsubstanzen — sicherer für Mensch, Tier und Umwelt." },
    { iconKey: "sun", title: "Solution-Dyed", text: "Spinndüsengefärbt für exzellente Farbechtheit bei drastisch reduziertem Wasser- und Energieverbrauch." },
    { iconKey: "shield", title: "Langlebig", text: "Auf lange Produktlebensdauer ausgelegt — weniger Abfall, mehr Nutzungsjahre." },
  ],
};

export const nerioHighlights = {
  eyebrow: "Auf einen Blick",
  title: "NERIO Highlights",
  stats: [
    { value: "50 %", label: "recyceltes Ozean-PP", detail: "OceanCycle® zertifiziert" },
    { value: "0", label: "PFAS", detail: "Komplett fluorfreie Produktion" },
    { value: "7–8", label: "Lichtechtheit", detail: "Höchste Stufe der Bewertungsskala" },
    { value: "< 0,1 %", label: "Wasseraufnahme", detail: "Praktisch wasserabweisend" },
  ],
};

export const nerioTechnicalFacts = {
  eyebrow: "Technische Daten",
  title: "NERIO im Detail",
  facts: [
    { label: "Material", value: "100 % Olefin (50 % recycelt)" },
    { label: "Gewicht", value: "ca. 200–230 g/m²" },
    { label: "Färbung", value: "spinndüsengefärbt" },
    { label: "Zertifizierung", value: "OceanCycle®" },
    { label: "Lichtechtheit", value: "7–8 (BS EN ISO 105-B02)" },
    { label: "UV-Beständigkeit", value: "5/5" },
    { label: "PFAS", value: "Nicht nachgewiesen" },
    { label: "Schimmelbeständigkeit", value: "Bestanden (AATCC 147)" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Fabric Patterns overview (catalog pp. 14–16)                              */
/* -------------------------------------------------------------------------- */

export interface FabricPatternColor {
  name: string;
  hex: string;
}

export interface FabricPattern {
  name: string;
  thumbnailUrl?: string;
  colors: FabricPatternColor[];
  availableCategories?: string[];
}

export interface FabricPatternGroup {
  name: string;
  quality: string;
  description: string;
  patterns: FabricPattern[];
}

export interface ProductCategoryIcon {
  categorySlug: string;
  categoryName: string;
  iconUrl?: string;
}

export const defaultCategoryIcons: ProductCategoryIcon[] = [
  { categorySlug: "dekokissen", categoryName: "Dekokissen" },
  { categorySlug: "hochlehner", categoryName: "Hochlehner" },
  { categorySlug: "niedriglehner", categoryName: "Niedriglehner" },
  { categorySlug: "sitzkissen", categoryName: "Sitzkissen" },
  { categorySlug: "sitzpolster", categoryName: "Sitzpolster" },
  { categorySlug: "bankauflagen", categoryName: "Bankauflagen" },
  { categorySlug: "poufs", categoryName: "Poufs" },
  { categorySlug: "tischsets-tischlaeufer", categoryName: "Tischsets & Läufer" },
  { categorySlug: "decken", categoryName: "Decken" },
];

export const fabricPatternGroups: FabricPatternGroup[] = [
  {
    name: "Dobby",
    quality: "Mackintosh® & Lite",
    description: "Monochrome, durchgefärbte Gewebe mit klarer Textur.",
    patterns: [
      {
        name: "Rocky Mountain",
        colors: [
          { name: "Olive", hex: "#6B7C3F" },
          { name: "Forest Green", hex: "#2D5A27" },
          { name: "Sage", hex: "#8BA888" },
          { name: "Midnight", hex: "#1C2841" },
          { name: "Mist Gray", hex: "#8B9DAF" },
          { name: "Crimson Red", hex: "#8B1A1A" },
          { name: "Rosebloom", hex: "#C4737B" },
          { name: "Yellow Jasmine", hex: "#E8C547" },
          { name: "Navajo White", hex: "#D4C5A9" },
        ],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen", "bankauflagen", "poufs", "tischsets-tischlaeufer"],
      },
      {
        name: "St. Tropez",
        colors: [
          { name: "Citron", hex: "#D4C040" },
          { name: "Mushroom", hex: "#8B7D6B" },
        ],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen", "sitzpolster", "bankauflagen"],
      },
      {
        name: "Canvas",
        colors: [{ name: "Wheat", hex: "#D4B896" }],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen", "sitzpolster", "bankauflagen"],
      },
      {
        name: "Birdeyes",
        colors: [
          { name: "Garnet", hex: "#722F37" },
          { name: "Oatmeal", hex: "#C9B99A" },
        ],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Alpine",
        colors: [
          { name: "Forest Green", hex: "#2D5A27" },
          { name: "Midnight", hex: "#1C2841" },
        ],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner"],
      },
      {
        name: "Midnight Marcie",
        colors: [{ name: "Blue", hex: "#1C2841" }],
        availableCategories: ["bankauflagen"],
      },
    ],
  },
  {
    name: "Jacquard",
    quality: "Mackintosh® & Lite",
    description: "Strukturierte Gewebe mit komplexen Mustern und edler Haptik.",
    patterns: [
      {
        name: "Bean",
        colors: [
          { name: "Olive", hex: "#5C6B2B" },
          { name: "Azure", hex: "#4A8BAD" },
          { name: "Citron", hex: "#C5B84A" },
          { name: "Tuscan", hex: "#A0522D" },
          { name: "Charcoal", hex: "#4A4A4A" },
        ],
        availableCategories: ["dekokissen", "tischsets-tischlaeufer"],
      },
      {
        name: "Palmway",
        colors: [
          { name: "Warm Pigments", hex: "#C4956B" },
          { name: "Neutrals", hex: "#B5A896" },
          { name: "Peat", hex: "#5C4B35" },
        ],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Tartan",
        colors: [
          { name: "Tuscan", hex: "#A0522D" },
          { name: "Hemp", hex: "#8B7D6B" },
        ],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Caravan",
        colors: [
          { name: "Warm Pigments", hex: "#C4956B" },
          { name: "Retro Warmth", hex: "#D49B4E" },
        ],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Vanity",
        colors: [{ name: "Charcoal", hex: "#4A4A4A" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Monaco",
        colors: [{ name: "Peat", hex: "#5C4B35" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Parker Stripe",
        colors: [{ name: "Tuscan", hex: "#A0522D" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Longitude",
        colors: [{ name: "Warm Pigments", hex: "#C4956B" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Rain Stripe",
        colors: [{ name: "Brick & Ivory", hex: "#9B4A3C" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Bouclé",
        colors: [
          { name: "Nordic Icebound", hex: "#B5C8D6" },
          { name: "Glacial Mosaic", hex: "#94A8B0" },
        ],
        availableCategories: ["dekokissen"],
      },
    ],
  },
  {
    name: "NERIO",
    quality: "OceanCycle rPP",
    description: "Performance-Stoffe aus recyceltem Ozean-Polypropylen.",
    patterns: [
      {
        name: "Basket",
        colors: [
          { name: "Chili", hex: "#C0392B" },
          { name: "Midnight", hex: "#1C2841" },
          { name: "Hemp", hex: "#8B7D6B" },
          { name: "Stone", hex: "#A69B8D" },
        ],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen", "bankauflagen"],
      },
      {
        name: "Birdeye",
        colors: [
          { name: "Terracotta", hex: "#CC6633" },
          { name: "Moss", hex: "#6B8F5E" },
        ],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen", "bankauflagen"],
      },
      {
        name: "Stripe",
        colors: [
          { name: "Sailor Blue", hex: "#2C5F7C" },
          { name: "Rockstone", hex: "#7D7C7A" },
        ],
        availableCategories: ["dekokissen"],
      },
    ],
  },
  {
    name: "Basic",
    quality: "Polyester",
    description: "Unkomplizierte, pflegeleichte Stoffe für saisonale Sortimente.",
    patterns: [
      {
        name: "Earthy Chevron",
        colors: [{ name: "Brown", hex: "#6B4226" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Striato Ink",
        colors: [{ name: "Ink", hex: "#2D2D3D" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Midnight Ogee",
        colors: [{ name: "Navy", hex: "#1C2841" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Jungle Canopy",
        colors: [{ name: "Green", hex: "#3D5A3D" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Meadow Bloom",
        colors: [{ name: "Blue", hex: "#4A6FA5" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Red Bloom",
        colors: [{ name: "Red", hex: "#A0522D" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Timeless Stripe",
        colors: [{ name: "Pink", hex: "#C4737B" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Field Stripe",
        colors: [{ name: "Yellow", hex: "#E8C547" }],
        availableCategories: ["dekokissen"],
      },
      {
        name: "Boletus Brown",
        colors: [{ name: "Brown", hex: "#6B4226" }],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen"],
      },
      {
        name: "Creme au Lait",
        colors: [{ name: "Creme", hex: "#D4C5A9" }],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen"],
      },
      {
        name: "Stone Blue",
        colors: [{ name: "Blue", hex: "#5B7C8A" }],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen"],
      },
      {
        name: "Elder Purple",
        colors: [{ name: "Purple", hex: "#6B4C7C" }],
        availableCategories: ["dekokissen", "hochlehner", "niedriglehner", "sitzkissen"],
      },
    ],
  },
];
