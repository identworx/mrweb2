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
    style: "collections-ambiente-teaser",
    label: "Ambiente-Mosaik (Kollektionen)",
    description: "Mosaik-Teaser mit Ambiente-Bildern. Bilder werden unter /admin/ambiente gepflegt. Hier nur Texte und Position.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "collections-ambiente-teaser",
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
  {
    style: "materials-technology",
    label: "Mackintosh® Technology (Materialien)",
    description: "Helper-Section: Technologie-Bereich mit Schritte-Karten und Vorteile-Liste.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "materials-technology",
      helper: true,
      steps: [
        { title: "Granulat", label: "100 % PP", description: "" },
      ],
      benefits: ["Erster Vorteil"],
    },
  },
  {
    style: "materials-olefin",
    label: "Warum Olefin? (Materialien)",
    description: "Helper-Section: Text, Tags und optionales Bild für den Olefin-Abschnitt.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "materials-olefin",
      helper: true,
      tags: ["Flexibel"],
    },
  },
  {
    style: "materials-oceancycle",
    label: "OceanCycle Kreislauf (Materialien)",
    description: "Helper-Section: Prozesskette mit Schritten und Highlights für OceanCycle.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "materials-oceancycle",
      helper: true,
      steps: [{ title: "Schritt 1", description: "" }],
      highlights: ["Erster Highlight"],
    },
  },
  {
    style: "materials-catalog-cta",
    label: "Katalog-CTA (Materialien)",
    description: "Helper-Section: CTA-Block am Ende des Materialien-Hubs. Titel, Text, Button.",
    sectionType: "CTA",
    defaultSettings: {
      style: "materials-catalog-cta",
      helper: true,
    },
  },
  {
    style: "nerio-story",
    label: "NERIO Story",
    description: "Helper-Section: Einleitung und Geschichte der NERIO-Linie.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-story",
      helper: true,
    },
  },
  {
    style: "nerio-oceancycle",
    label: "NERIO OceanCycle Kreislauf",
    description: "Helper-Section: OceanCycle-Prozesskette mit Schritten und Highlights für NERIO.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-oceancycle",
      helper: true,
      steps: [{ title: "Schritt 1", description: "", imageId: null, imageFit: "contain" }],
      highlights: ["Erster Highlight"],
    },
  },
  {
    style: "nerio-promise",
    label: "NERIO Versprechen",
    description: "Helper-Section: Nachhaltigkeitsversprechen mit Icon-Karten.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-promise",
      helper: true,
      items: [{ iconKey: "recycle", title: "Titel", text: "Beschreibung" }],
    },
  },
  {
    style: "nerio-highlights",
    label: "NERIO Highlights",
    description: "Helper-Section: Statistiken und Kennzahlen der NERIO-Linie.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-highlights",
      helper: true,
      stats: [{ value: "50 %", label: "recycelt", detail: "" }],
    },
  },
  {
    style: "nerio-technical-facts",
    label: "NERIO Technische Fakten",
    description: "Helper-Section: Technische Daten und Materialspezifikationen.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-technical-facts",
      helper: true,
      facts: [{ label: "Material", value: "" }],
    },
  },
  {
    style: "nerio-products-preview",
    label: "NERIO Stoffe Preview",
    description: "Helper-Section: Vorschau der NERIO-Stoffe aus der Stoffbibliothek.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-products-preview",
      helper: true,
      cards: [
        { id: "dekokissen", title: "Deko-Kissen", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 1 },
        { id: "hochlehner", title: "Hochlehner", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 2 },
        { id: "niedriglehner", title: "Niedriglehner", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 3 },
        { id: "sitzkissen", title: "Sitzkissen", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 4 },
        { id: "bankauflagen", title: "Bankauflagen", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 5 },
      ],
    },
  },
  {
    style: "nerio-videos",
    label: "NERIO Videos",
    description: "Helper-Section: Video-Galerie mit YouTube-Videos zum Thema Recycling & Kreisläufe.",
    sectionType: "CUSTOM",
    defaultSettings: {
      style: "nerio-videos",
      helper: true,
      videos: [
        {
          enabled: true,
          order: 1,
          youtubeUrl: "",
          title: "",
          description: "",
          startSeconds: null,
          thumbnailMediaId: null,
          label: "",
        },
      ],
    },
  },
  {
    style: "nerio-final-cta",
    label: "NERIO CTA",
    description: "Helper-Section: Abschließender CTA-Block der NERIO-Seite.",
    sectionType: "CTA",
    defaultSettings: {
      style: "nerio-final-cta",
      helper: true,
    },
  },
];

export function getStyleDef(style: string): SectionStyleDef | undefined {
  return SECTION_STYLES.find((s) => s.style === style);
}

export function getStyleLabel(style: string): string {
  return getStyleDef(style)?.label ?? style;
}

export function isHelperSection(settings: Record<string, unknown>): boolean {
  const style = String(settings.style ?? "");
  return (
    settings.helper === true ||
    style.startsWith("materials-") ||
    style.startsWith("nerio-")
  );
}
