import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getPublishedProducts() {
  try {
    return await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
      include: { collection: true, productGroup: true },
    });
  } catch (error) {
    console.error("CMS: getPublishedProducts failed", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        collection: true,
        productGroup: true,
        material: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error(`CMS: getProductBySlug("${slug}") failed`, error);
    return null;
  }
}

export async function getProductsByCollection(collectionSlug: string) {
  try {
    return await prisma.product.findMany({
      where: { collection: { slug: collectionSlug }, status: "PUBLISHED" },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error(`CMS: getProductsByCollection("${collectionSlug}") failed`, error);
    return [];
  }
}
