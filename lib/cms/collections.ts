import { prisma } from "@/lib/db/prisma";

export async function getPublishedCollections() {
  return prisma.collection.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });
}

export async function getCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({
    where: { slug },
    include: { products: { orderBy: { name: "asc" } } },
  });
}
