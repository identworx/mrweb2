import "server-only";
import { prisma } from "@/lib/db/prisma";
import {
  measurements as staticMeasurements,
  measurementGroups as staticGroups,
  type MeasurementItem,
  type MeasurementGroup,
  type DrawingType,
  type MeasurementVariant,
} from "@/lib/mosaroma/measurements";

export type { MeasurementItem, MeasurementGroup, DrawingType, MeasurementVariant };

export interface FrontendMeasurement {
  slug: string;
  title: string;
  group: MeasurementGroup;
  drawingType: DrawingType;
  variants: MeasurementVariant[];
  notes?: string[];
  sourceNote?: string;
}

export async function getPublicMeasurements(): Promise<FrontendMeasurement[]> {
  try {
    const items = await prisma.measurement.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
    });

    if (items.length === 0) return staticMeasurements;

    return items.map(mapMeasurementForFrontend);
  } catch (error) {
    console.error("CMS: getPublicMeasurements failed", error);
    return staticMeasurements;
  }
}

export async function getPublicMeasurementsByGroup(group: string): Promise<FrontendMeasurement[]> {
  try {
    const items = await prisma.measurement.findMany({
      where: { isActive: true, groupSlug: group },
      orderBy: { order: "asc" },
    });

    if (items.length === 0) {
      return staticMeasurements.filter((m) => m.group === group);
    }

    return items.map(mapMeasurementForFrontend);
  } catch (error) {
    console.error(`CMS: getPublicMeasurementsByGroup("${group}") failed`, error);
    return staticMeasurements.filter((m) => m.group === group);
  }
}

function parseJsonArray(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
    } catch { /* ignore */ }
  }
  return [];
}

function parseVariants(raw: unknown): MeasurementVariant[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (v): v is MeasurementVariant =>
        typeof v === "object" && v !== null && typeof v.label === "string" && typeof v.value === "string",
    );
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseVariants(parsed);
    } catch { /* ignore */ }
  }
  return [];
}

type DbMeasurement = {
  slug: string;
  title: string;
  groupSlug: string | null;
  drawingType: string | null;
  variants: unknown;
  notes: unknown;
  sourceNote: string | null;
};

function mapMeasurementForFrontend(m: DbMeasurement): FrontendMeasurement {
  const notes = parseJsonArray(m.notes);
  return {
    slug: m.slug,
    title: m.title,
    group: (m.groupSlug || "kissen-auflagen") as MeasurementGroup,
    drawingType: (m.drawingType || "square-cushion") as DrawingType,
    variants: parseVariants(m.variants),
    notes: notes.length > 0 ? notes : undefined,
    sourceNote: m.sourceNote || undefined,
  };
}

export { staticGroups as measurementGroups };
