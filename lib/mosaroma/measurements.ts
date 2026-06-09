export type MeasurementGroup =
  | "kissen-auflagen"
  | "lehner"
  | "bankauflagen"
  | "poufs"
  | "tischsets"
  | "decken";

export type DrawingType =
  | "square-cushion"
  | "square-cushion-small"
  | "seat-cushion"
  | "square-pad"
  | "rounded-pad"
  | "high-back"
  | "low-back"
  | "bench-pad"
  | "pouf-small"
  | "pouf-large"
  | "placemat"
  | "table-runner"
  | "blanket";

export interface MeasurementVariant {
  label: string;
  value: string;
}

export interface MeasurementItem {
  slug: string;
  title: string;
  group: MeasurementGroup;
  drawingType: DrawingType;
  variants: MeasurementVariant[];
  notes?: string[];
  sourceNote?: string;
}

export const measurements: MeasurementItem[] = [
  // ── Kissen & Auflagen ──────────────────────────────────
  {
    slug: "deko-kissen",
    title: "Deko-Kissen",
    group: "kissen-auflagen",
    drawingType: "square-cushion",
    variants: [
      { label: "Mack. & Lite / Nerio", value: "48 × 48 cm" },
      { label: "Basic", value: "45 × 45 cm" },
    ],
  },
  {
    slug: "sitzkissen",
    title: "Sitzkissen",
    group: "kissen-auflagen",
    drawingType: "seat-cushion",
    variants: [
      { label: "Mack. & Lite", value: "H = 7 cm" },
      { label: "Nerio", value: "H = 7 cm" },
      { label: "Basic", value: "H = 5 cm" },
    ],
    notes: ["Grundmaß: 46 × 45 cm"],
  },
  {
    slug: "sitzpolster-eckig",
    title: "Sitzpolster eckig",
    group: "kissen-auflagen",
    drawingType: "square-pad",
    variants: [{ label: "Mack. Lite", value: "40 × 40 × 2 cm" }],
  },
  {
    slug: "sitzpolster-halbrund",
    title: "Sitzpolster halbrund",
    group: "kissen-auflagen",
    drawingType: "rounded-pad",
    variants: [{ label: "Mack. Lite", value: "38 × 40 × 2 cm" }],
  },

  // ── Lehner ──────────────────────────────────────────────
  {
    slug: "hochlehner",
    title: "Hochlehner",
    group: "lehner",
    drawingType: "high-back",
    variants: [
      { label: "Mackintosh®", value: "120 × 48 × 6 cm" },
      { label: "Nerio", value: "120 × 48 × 6 cm" },
      { label: "Lite & Basic", value: "120 × 48 × 6 cm" },
    ],
  },
  {
    slug: "niedriglehner",
    title: "Niedriglehner",
    group: "lehner",
    drawingType: "low-back",
    variants: [
      { label: "Mackintosh®", value: "105 × 48 × 6 cm" },
      { label: "Nerio", value: "105 × 48 × 6 cm" },
      { label: "Lite & Basic", value: "105 × 48 × 6 cm" },
    ],
  },

  // ── Bankauflagen ────────────────────────────────────────
  {
    slug: "bankauflagen",
    title: "Bankauflagen",
    group: "bankauflagen",
    drawingType: "bench-pad",
    variants: [
      { label: "S", value: "50 cm" },
      { label: "M", value: "110 cm" },
      { label: "L", value: "140 cm" },
      { label: "XL", value: "170 cm" },
    ],
    notes: ["Tiefe 49 cm", "Dicke 7 cm bei allen Längen identisch"],
  },

  // ── Poufs ───────────────────────────────────────────────
  {
    slug: "pouf-klein",
    title: "Pouf klein",
    group: "poufs",
    drawingType: "pouf-small",
    variants: [{ label: "Mack.", value: "45 × 45 cm" }],
  },
  {
    slug: "pouf-gross",
    title: "Pouf groß",
    group: "poufs",
    drawingType: "pouf-large",
    variants: [{ label: "Mack.", value: "70 × 36 cm" }],
  },

  // ── Tischsets & Tischläufer ─────────────────────────────
  {
    slug: "tischset",
    title: "Tischset",
    group: "tischsets",
    drawingType: "placemat",
    variants: [{ label: "Mack.", value: "35 × 45 × 0,6 cm" }],
  },
  {
    slug: "tischlaeufer",
    title: "Tischläufer",
    group: "tischsets",
    drawingType: "table-runner",
    variants: [
      { label: "Mack. · Variante A", value: "35 × 130 × 0,6 cm" },
      { label: "Mack. · Variante B", value: "47,5 × 120 × 0,6 cm" },
    ],
  },

  // ── Decken ──────────────────────────────────────────────
  {
    slug: "decken",
    title: "Decken",
    group: "decken",
    drawingType: "blanket",
    variants: [{ label: "Alle Größen", value: "Maße auf Anfrage" }],
  },
];

export interface MeasurementGroupDef {
  slug: MeasurementGroup;
  title: string;
  id: string;
}

export const measurementGroups: MeasurementGroupDef[] = [
  { slug: "kissen-auflagen", title: "Kissen & Auflagen", id: "kissen-auflagen" },
  { slug: "lehner", title: "Lehner", id: "lehner" },
  { slug: "bankauflagen", title: "Bankauflagen", id: "bankauflagen" },
  { slug: "poufs", title: "Poufs", id: "poufs" },
  { slug: "tischsets", title: "Tischsets & Tischläufer", id: "tischsets" },
  { slug: "decken", title: "Decken", id: "decken" },
];
