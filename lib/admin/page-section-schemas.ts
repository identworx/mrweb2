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
];

export function getStyleDef(style: string): SectionStyleDef | undefined {
  return SECTION_STYLES.find((s) => s.style === style);
}

export function getStyleLabel(style: string): string {
  return getStyleDef(style)?.label ?? style;
}
