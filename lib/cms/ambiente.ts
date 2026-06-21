import "server-only";
import { prisma } from "@/lib/db/prisma";

export type TeaserSlot = "hero" | "portrait" | "wide" | "smallA" | "smallB";

export interface FrontendAmbienteImage {
  id: string;
  title: string;
  caption: string | null;
  alt: string | null;
  colorWorlds: string[];
  featured: boolean;
  teaserSlot: TeaserSlot | null;
  imageUrl: string;
  width: number | null;
  height: number | null;
}

function parseColorWorlds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v) => typeof v === "string");
  if (typeof raw === "string") return raw.split(/[,\s]+/).filter(Boolean);
  return [];
}

const VALID_SLOTS = new Set<string>(["hero", "portrait", "wide", "smallA", "smallB"]);

function parseSlot(raw: string | null | undefined): TeaserSlot | null {
  if (!raw || !VALID_SLOTS.has(raw)) return null;
  return raw as TeaserSlot;
}

function mapRow(r: {
  id: string;
  title: string;
  caption: string | null;
  alt: string | null;
  colorWorlds: unknown;
  featured: boolean;
  teaserSlot: string | null;
  mediaAsset: { url: string; alt: string | null; width: number | null; height: number | null };
}): FrontendAmbienteImage {
  return {
    id: r.id,
    title: r.title,
    caption: r.caption,
    alt: r.alt || r.mediaAsset.alt,
    colorWorlds: parseColorWorlds(r.colorWorlds),
    featured: r.featured,
    teaserSlot: parseSlot(r.teaserSlot),
    imageUrl: r.mediaAsset.url,
    width: r.mediaAsset.width,
    height: r.mediaAsset.height,
  };
}

const INCLUDE_MEDIA = {
  mediaAsset: { select: { url: true, alt: true, width: true, height: true } },
} as const;

export async function getActiveAmbienteImages(): Promise<FrontendAmbienteImage[]> {
  const rows = await prisma.ambienteImage.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: INCLUDE_MEDIA,
  });
  return rows.map(mapRow);
}

const SLOT_ORDER: TeaserSlot[] = ["hero", "portrait", "wide", "smallA", "smallB"];

export async function getTeaserAmbienteImages(): Promise<Record<TeaserSlot, FrontendAmbienteImage | null>> {
  const rows = await prisma.ambienteImage.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: INCLUDE_MEDIA,
  });

  const slotMap: Record<TeaserSlot, FrontendAmbienteImage | null> = {
    hero: null,
    portrait: null,
    wide: null,
    smallA: null,
    smallB: null,
  };

  const usedIds = new Set<string>();

  // Phase 1: images with explicit teaserSlot
  for (const r of rows) {
    const slot = parseSlot(r.teaserSlot);
    if (slot && !slotMap[slot]) {
      const mapped = mapRow(r);
      slotMap[slot] = mapped;
      usedIds.add(mapped.id);
    }
  }

  // Phase 2: fill empty slots from featured images (by order)
  const emptySlots = SLOT_ORDER.filter((s) => !slotMap[s]);
  if (emptySlots.length > 0) {
    const featured = rows
      .filter((r) => r.featured && !usedIds.has(r.id))
      .map(mapRow);

    for (const img of featured) {
      if (emptySlots.length === 0) break;
      const slot = emptySlots.shift()!;
      slotMap[slot] = img;
      usedIds.add(img.id);
    }
  }

  // Phase 3: fill remaining empty slots from any active images (by order)
  const stillEmpty = SLOT_ORDER.filter((s) => !slotMap[s]);
  if (stillEmpty.length > 0) {
    const remaining = rows
      .filter((r) => !usedIds.has(r.id))
      .map(mapRow);

    for (const img of remaining) {
      if (stillEmpty.length === 0) break;
      const slot = stillEmpty.shift()!;
      slotMap[slot] = img;
      usedIds.add(img.id);
    }
  }

  return slotMap;
}

export async function getFeaturedAmbienteImages(
  limit = 5,
): Promise<FrontendAmbienteImage[]> {
  const rows = await prisma.ambienteImage.findMany({
    where: { isActive: true, featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
    include: INCLUDE_MEDIA,
  });
  return rows.map(mapRow);
}
