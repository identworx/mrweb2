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

export async function getPublicMeasurements(): Promise<FrontendMeasurement[]> {
  try {
    const items = await prisma.measurement.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
      include: { image: true },
    });

    if (items.length === 0) return staticMeasurements.map(mapStaticToFrontend);

    return items.map(mapDbToFrontend);
  } catch (error) {
    console.error("CMS: getPublicMeasurements failed", error);
    return staticMeasurements.map(mapStaticToFrontend);
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
