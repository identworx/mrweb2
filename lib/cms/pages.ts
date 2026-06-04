import { prisma } from "@/lib/db/prisma";

export async function getPublishedPages() {
  return prisma.page.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" },
  });
}

export async function getPublishedPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { sections: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
}
