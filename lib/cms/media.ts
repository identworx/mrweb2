import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getMediaAssets(folder?: string) {
  try {
    return await prisma.mediaAsset.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("CMS: getMediaAssets failed", error);
    return [];
  }
}

export async function getMediaAssetById(id: string) {
  try {
    return await prisma.mediaAsset.findUnique({ where: { id } });
  } catch (error) {
    console.error(`CMS: getMediaAssetById("${id}") failed`, error);
    return null;
  }
}
