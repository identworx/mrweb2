import { prisma } from "@/lib/db/prisma";

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
    include: { collection: true, productGroup: true },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { collection: true, productGroup: true, material: true, images: { orderBy: { order: "asc" } } },
  });
}

export async function getProductsByCollection(collectionSlug: string) {
  return prisma.product.findMany({
    where: { collection: { slug: collectionSlug }, status: "PUBLISHED" },
    orderBy: { name: "asc" },
  });
}
