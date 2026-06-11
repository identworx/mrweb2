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
