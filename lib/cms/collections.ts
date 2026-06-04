import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getPublishedCollections() {
  try {
    return await prisma.collection.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("CMS: getPublishedCollections failed", error);
    return [];
  }
}

export async function getCollectionBySlug(slug: string) {
  try {
    return await prisma.collection.findUnique({
      where: { slug },
      include: { products: { orderBy: { name: "asc" } } },
    });
  } catch (error) {
    console.error(`CMS: getCollectionBySlug("${slug}") failed`, error);
    return null;
  }
}
