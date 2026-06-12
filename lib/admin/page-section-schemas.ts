export interface SectionStyleDef {
  style: string;
  label: string;
  description: string;
  sectionType: string;
  defaultSettings: Record<string, unknown>;
}

export const SECTION_STYLES: SectionStyleDef[] = [
  {
    style: "care-list",
    label: "Checkliste",
    description: "Liste mit Häkchen-Icons (z.B. Pflegehinweise, Garantie)",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "care-list",
      items: ["Erster Eintrag"],
    },
  },
  {
    style: "fabric-cards",
    label: "Stoff-Karten",
    description: "Karten mit Materialdaten (Name, Gewicht, Färbung etc.)",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "fabric-cards",
      cards: [
        {
          name: "Neuer Stoff",
          material: "",
          weight: "",
          dyeing: "",
          comfort: "",
        },
      ],
    },
  },
  {
    style: "comparison-table",
    label: "Vergleichstabelle",
    description: "Tabelle zum Vergleich von Eigenschaften (z.B. Olefin vs. Acryl)",
    sectionType: "TECHNICAL_TABLE",
    defaultSettings: {
      style: "comparison-table",
      columns: ["Spalte 1", "Spalte 2"],
      rows: [{ property: "Eigenschaft", spalte_1: "", spalte_2: "" }],
    },
  },
  {
    style: "highlight-cards",
    label: "Highlight-Karten",
    description: "Kompakte Karten mit Häkchen-Icons im 2-Spalten-Grid",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "highlight-cards",
      items: ["Erster Highlight"],
    },
  },
  {
    style: "cross-link",
    label: "Querverweis",
    description: "Verweis-Karte mit Titel, Text und Button-Link",
    sectionType: "CUSTOM",
    defaultSettings: { style: "cross-link" },
  },
  {
    style: "cta",
    label: "Call to Action",
    description: "Dunkler CTA-Bereich mit primärem und sekundärem Button",
    sectionType: "CTA",
    defaultSettings: {
      style: "cta",
      secondaryHref: "/kataloge",
      secondaryLabel: "Zurück zu Kataloge",
    },
  },
  {
    style: "text",
    label: "Text",
    description: "Einfacher Textbereich mit Eyebrow und Titel",
    sectionType: "TEXT",
    defaultSettings: { style: "text" },
  },
  {
    style: "home-hero",
    label: "Hero (Startseite)",
    description: "Großer Hero-Bereich mit Headline, Subheadline, Beschreibung, zwei CTAs und Hintergrundbild",
    sectionType: "HERO",
    defaultSettings: {
      style: "home-hero",
      subheadline: "",
      secondaryLabel: "",
      secondaryHref: "",
    },
  },
  {
    style: "value-props",
    label: "Werte / Features",
    description: "Feature-Karten mit Icon-Key, Titel und Text (z.B. 'Was uns ausmacht')",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "value-props",
      cards: [{ iconKey: "comfort", title: "Komfort", text: "Beschreibung" }],
    },
  },
  {
    style: "image-text-feature",
    label: "Bild + Text Feature",
    description: "Zweispaltig mit Bild und Text/Bulletpoints (z.B. Mackintosh® Technology)",
    sectionType: "IMAGE_TEXT",
    defaultSettings: {
      style: "image-text-feature",
      bullets: [],
    },
  },
  {
    style: "collection-showcase",
    label: "Kollektionen-Showcase",
    description: "Collection Cards aus der Datenbank mit Einleitungstext",
    sectionType: "COLLECTION_GRID",
    defaultSettings: { style: "collection-showcase" },
  },
  {
    style: "sustainability-stats",
    label: "Nachhaltigkeits-Statistiken",
    description: "Statistiken mit großen Zahlen, Labels und Details",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "sustainability-stats",
      stats: [{ value: "42 %", label: "weniger Wasser", detail: "" }],
    },
  },
  {
    style: "downloads-teaser",
    label: "Downloads-Teaser",
    description: "Download-Karten aus der Datenbank mit Einleitungstext",
    sectionType: "DOWNLOAD_GRID",
    defaultSettings: { style: "downloads-teaser" },
  },
  {
    style: "news-teaser",
    label: "News-Teaser",
    description: "Neuigkeiten-Karten aus der Datenbank",
    sectionType: "CUSTOM",
    defaultSettings: { style: "news-teaser" },
  },
  {
    style: "process-chain",
    label: "Prozesskette",
    description: "Horizontale Schritt-für-Schritt-Kette (z.B. OceanCycle Kreislauf)",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "process-chain",
      steps: [{ title: "Schritt 1", description: "" }],
      highlights: [],
    },
  },
  {
    style: "fabric-pattern-overview",
    label: "Stoff- & Musterübersicht",
    description: "Gruppierte Übersicht mit Flip-Karten, Stoff-Thumbnails und Produktverfügbarkeit",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "fabric-pattern-overview",
      categoryIcons: [
        { categorySlug: "dekokissen", categoryName: "Dekokissen", iconUrl: "" },
        { categorySlug: "hochlehner", categoryName: "Hochlehner", iconUrl: "" },
        { categorySlug: "niedriglehner", categoryName: "Niedriglehner", iconUrl: "" },
        { categorySlug: "sitzkissen", categoryName: "Sitzkissen", iconUrl: "" },
        { categorySlug: "sitzpolster", categoryName: "Sitzpolster", iconUrl: "" },
        { categorySlug: "bankauflagen", categoryName: "Bankauflagen", iconUrl: "" },
        { categorySlug: "poufs", categoryName: "Poufs", iconUrl: "" },
        { categorySlug: "tischsets-tischlaeufer", categoryName: "Tischsets & Läufer", iconUrl: "" },
        { categorySlug: "decken", categoryName: "Decken", iconUrl: "" },
      ],
      groups: [
        {
          name: "Gruppe",
          quality: "Qualität",
          description: "",
          patterns: [{ name: "Muster", thumbnailUrl: "", colors: [{ name: "Farbe", hex: "#000000" }], availableCategories: ["dekokissen"] }],
        },
      ],
    },
  },
  {
    style: "collection-consultation-card",
    label: "Beratungskarte (Kollektionen)",
    description: "Service-Karte im Collection Grid mit Beratungsangebot und Musterset-CTA",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "collection-consultation-card",
      secondaryLabel: "Kontakt aufnehmen",
      secondaryHref: "/kontakt",
    },
  },
  {
    style: "collection-benefits",
    label: "Kollektion Benefits",
    description: "Performance-Vorteile der Mosaroma-Kollektionen (UV, Wasser, Schimmel, Garantie)",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "collection-benefits",
      items: [
        { iconKey: "sun", title: "UV-beständig", text: "Spinndüsengefärbte Fasern für höchste Lichtechtheit, auch bei dauerhafter Sonneneinstrahlung." },
        { iconKey: "droplet", title: "Wasserabweisend", text: "Stoffe, die Regen und Feuchtigkeit abperlen lassen und schnell trocknen." },
        { iconKey: "shield", title: "Schimmelfest", text: "Resistente Materialien, die auch in feuchten Umgebungen sauber bleiben." },
        { iconKey: "star", title: "3 Jahre Garantie", text: "Qualitätsversprechen auf alle Mosaroma-Produkte gemäß Garantiebedingungen." },
      ],
    },
  },
  {
    style: "collection-cta",
    label: "Musterset-CTA (Kollektionen)",
    description: "Dunkler Premium-CTA für Musterset-Anforderung am Ende der Kollektionsseite",
    sectionType: "CTA",
    defaultSettings: {
      style: "collection-cta",
      secondaryLabel: "Kataloge ansehen",
      secondaryHref: "/kataloge",
    },
  },
];

export function getStyleDef(style: string): SectionStyleDef | undefined {
  return SECTION_STYLES.find((s) => s.style === style);
}

export function getStyleLabel(style: string): string {
  return getStyleDef(style)?.label ?? style;
}
