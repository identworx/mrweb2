export type MeasurementGroup =
  | "kissen-auflagen"
  | "lehner"
  | "bankauflagen"
  | "poufs"
  | "tischsets";

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
  | "table-runner";

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
}

export const measurements: MeasurementItem[] = [
  // ── Kissen & Auflagen ──────────────────────────────────
  {
    slug: "deko-kissen-mackintosh-lite-nerio",
    title: "Deko-Kissen Mackintosh & Lite / Nerio",
    group: "kissen-auflagen",
    drawingType: "square-cushion",
    variants: [
      { label: "MACK. & LITE", value: "48 × 48 cm" },
      { label: "NERIO", value: "48 × 48 cm" },
    ],
  },
  {
    slug: "deko-kissen-basic",
    title: "Deko-Kissen Basic",
    group: "kissen-auflagen",
    drawingType: "square-cushion-small",
    variants: [{ label: "BASIC", value: "45 × 45 cm" }],
  },
  {
    slug: "sitzkissen",
    title: "Sitzkissen",
    group: "kissen-auflagen",
    drawingType: "seat-cushion",
    variants: [
      { label: "MACK. & LITE", value: "H = 6 cm" },
      { label: "NERIO", value: "H = 6 cm" },
      { label: "BASIC", value: "H = 5 cm" },
    ],
    notes: ["Grundmaß: 46 × 45 cm"],
  },
  {
    slug: "sitzpolster-eckig",
    title: "Sitzpolster eckig",
    group: "kissen-auflagen",
    drawingType: "square-pad",
    variants: [{ label: "MACK. LITE", value: "40 × 40 × 2 cm" }],
  },
  {
    slug: "sitzpolster-halbrund",
    title: "Sitzpolster halbrund",
    group: "kissen-auflagen",
    drawingType: "rounded-pad",
    variants: [{ label: "MACK. LITE", value: "38 × 40 × 2 cm" }],
  },

  // ── Lehner ──────────────────────────────────────────────
  {
    slug: "hochlehner",
    title: "Hochlehner",
    group: "lehner",
    drawingType: "high-back",
    variants: [
      { label: "MACK.", value: "120 × 48 × 6 cm" },
      { label: "NERIO", value: "120 × 48 × 6 cm" },
      { label: "LITE & BASIC", value: "120 × 48 × 6 cm" },
    ],
  },
  {
    slug: "niedriglehner",
    title: "Niedriglehner",
    group: "lehner",
    drawingType: "low-back",
    variants: [
      { label: "MACK.", value: "105 × 48 × 6 cm" },
      { label: "NERIO", value: "105 × 48 × 6 cm" },
      { label: "LITE & BASIC", value: "105 × 48 × 6 cm" },
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
    notes: ["Tiefe 49 cm", "Dicke 6 cm bei allen Längen identisch"],
  },

  // ── Poufs ───────────────────────────────────────────────
  {
    slug: "pouf-klein",
    title: "Pouf klein",
    group: "poufs",
    drawingType: "pouf-small",
    variants: [{ label: "MACK.", value: "45 × 45 cm" }],
  },
  {
    slug: "pouf-gross",
    title: "Pouf groß",
    group: "poufs",
    drawingType: "pouf-large",
    variants: [{ label: "MACK.", value: "70 × 36 cm" }],
  },

  // ── Tischsets & Tischläufer ─────────────────────────────
  {
    slug: "tischset",
    title: "Tischset",
    group: "tischsets",
    drawingType: "placemat",
    variants: [{ label: "MACK.", value: "35 × 45 × 0,6 cm" }],
  },
  {
    slug: "tischlaeufer",
    title: "Tischläufer",
    group: "tischsets",
    drawingType: "table-runner",
    variants: [
      { label: "MACK. Variante A", value: "35 × 130 × 0,6 cm" },
      { label: "MACK. Variante B", value: "47,5 × 120 × 0,6 cm" },
    ],
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
];
