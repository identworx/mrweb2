import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import {
  measurements as staticMeasurements,
  measurementGroups as staticGroups,
  type MeasurementItem,
  type MeasurementGroup,
  type DrawingType,
  type MeasurementVariant,
} from "@/lib/mosaroma/measurements";
import type { Locale } from "@/lib/i18n/config";
import { translateProductDisplayName } from "@/lib/i18n/product-types";

const MEASUREMENT_TITLE_EN: Record<string, string> = {
  "Deko-Kissen Mackintosh & Lite / Nerio": "Decorative Cushion Mackintosh & Lite / Nerio",
  "Deko-Kissen Basic": "Decorative Cushion Basic",
  "Sitzkissen": "Seat Cushion",
  "Sitzpolster eckig": "Seat Pad Square",
  "Sitzpolster halbrund": "Seat Pad Half-Round",
  "Hochlehner": "High-Back Cushion",
  "Niedriglehner": "Low-Back Cushion",
  "Bankauflagen": "Bench Cushions",
  "Pouf klein": "Pouf Small",
  "Pouf groß": "Pouf Large",
  "Tischset": "Placemat",
  "Tischläufer": "Table Runner",
};

const MEASUREMENT_NOTE_EN: Record<string, string> = {
  "Grundmaß: 46 × 45 cm": "Base dimensions: 46 × 45 cm",
  "Tiefe 49 cm": "Depth 49 cm",
  "Dicke 6 cm bei allen Längen identisch": "Thickness 6 cm identical for all lengths",
};

function translateMeasurement(m: FrontendMeasurement, locale: Locale): FrontendMeasurement {
  if (locale === "de") return m;
  return {
    ...m,
    title: MEASUREMENT_TITLE_EN[m.title] || translateProductDisplayName(m.title, locale),
    notes: m.notes.map((n) => MEASUREMENT_NOTE_EN[n] || n),
  };
}

export type { MeasurementItem, MeasurementGroup, DrawingType, MeasurementVariant };

export interface MeasurementRow {
  label: string;
  value: string;
}

export interface FrontendMeasurement {
  id: string;
  slug: string;
  title: string;
  group: MeasurementGroup;
  drawingType: DrawingType;
  imageUrl: string | null;
  imageAlt: string | null;
  rows: MeasurementRow[];
  notes: string[];
  order: number;
}

export async function getPublicMeasurements(locale: Locale = "de"): Promise<FrontendMeasurement[]> {
  try {
    const items = await prisma.measurement.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
      include: { image: true },
    });

    const results = items.length === 0
      ? staticMeasurements.map(mapStaticToFrontend)
      : items.map(mapDbToFrontend);

    return results.map((m) => translateMeasurement(m, locale));
  } catch (error) {
    console.error("CMS: getPublicMeasurements failed", error);
    return staticMeasurements.map(mapStaticToFrontend).map((m) => translateMeasurement(m, locale));
  }
}

export async function getPublicMeasurementsByGroup(group: string): Promise<FrontendMeasurement[]> {
  try {
    const items = await prisma.measurement.findMany({
      where: { isActive: true, groupSlug: group },
      orderBy: { order: "asc" },
      include: { image: true },
    });

    if (items.length === 0) {
      return staticMeasurements.filter((m) => m.group === group).map(mapStaticToFrontend);
    }

    return items.map(mapDbToFrontend);
  } catch (error) {
    console.error(`CMS: getPublicMeasurementsByGroup("${group}") failed`, error);
    return staticMeasurements.filter((m) => m.group === group).map(mapStaticToFrontend);
  }
}

function parseRows(raw: unknown): MeasurementRow[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (v): v is MeasurementRow =>
        typeof v === "object" && v !== null && typeof v.label === "string" && typeof v.value === "string",
    );
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseRows(parsed);
    } catch { /* ignore */ }
  }
  return [];
}

function parseNotes(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
    } catch { /* ignore */ }
  }
  return [];
}

interface DbMeasurement {
  id: string;
  slug: string;
  title: string;
  groupSlug: string | null;
  drawingType: string | null;
  imageAlt: string | null;
  variants: unknown;
  notes: unknown;
  order: number;
  image: { url?: string | null } | null;
}

function mapDbToFrontend(m: DbMeasurement): FrontendMeasurement {
  return {
    id: m.id,
    slug: m.slug,
    title: m.title,
    group: (m.groupSlug || "kissen-auflagen") as MeasurementGroup,
    drawingType: (m.drawingType || "square-cushion") as DrawingType,
    imageUrl: getMediaUrl(m.image, "") || null,
    imageAlt: m.imageAlt,
    rows: parseRows(m.variants),
    notes: parseNotes(m.notes),
    order: m.order,
  };
}

function mapStaticToFrontend(m: MeasurementItem, index: number): FrontendMeasurement {
  return {
    id: m.slug,
    slug: m.slug,
    title: m.title,
    group: m.group,
    drawingType: m.drawingType,
    imageUrl: null,
    imageAlt: null,
    rows: m.variants,
    notes: m.notes || [],
    order: index,
  };
}

export { staticGroups as measurementGroups };
