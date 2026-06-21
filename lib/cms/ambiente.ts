import "server-only";
import { prisma } from "@/lib/db/prisma";

export interface FrontendAmbienteImage {
  id: string;
  title: string;
  caption: string | null;
  alt: string | null;
  colorWorlds: string[];
  featured: boolean;
  imageUrl: string;
  width: number | null;
  height: number | null;
}

function parseColorWorlds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v) => typeof v === "string");
  if (typeof raw === "string") return raw.split(/[,\s]+/).filter(Boolean);
  return [];
}

export async function getActiveAmbienteImages(): Promise<FrontendAmbienteImage[]> {
  const rows = await prisma.ambienteImage.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { mediaAsset: { select: { url: true, alt: true, width: true, height: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    caption: r.caption,
    alt: r.alt || r.mediaAsset.alt,
    colorWorlds: parseColorWorlds(r.colorWorlds),
    featured: r.featured,
    imageUrl: r.mediaAsset.url,
    width: r.mediaAsset.width,
    height: r.mediaAsset.height,
  }));
}

export async function getFeaturedAmbienteImages(
  limit = 5,
): Promise<FrontendAmbienteImage[]> {
  const rows = await prisma.ambienteImage.findMany({
    where: { isActive: true, featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
    include: { mediaAsset: { select: { url: true, alt: true, width: true, height: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    caption: r.caption,
    alt: r.alt || r.mediaAsset.alt,
    colorWorlds: parseColorWorlds(r.colorWorlds),
    featured: r.featured,
    imageUrl: r.mediaAsset.url,
    width: r.mediaAsset.width,
    height: r.mediaAsset.height,
  }));
}
