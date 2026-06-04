import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getPublishedPages() {
  try {
    return await prisma.page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
    });
  } catch (error) {
    console.error("CMS: getPublishedPages failed", error);
    return [];
  }
}

export async function getPublishedPageBySlug(slug: string) {
  try {
    return await prisma.page.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        heroImage: true,
        sections: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error(`CMS: getPublishedPageBySlug("${slug}") failed`, error);
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    return await prisma.page.findUnique({
      where: { slug },
      include: {
        heroImage: true,
        sections: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error(`CMS: getPageBySlug("${slug}") failed`, error);
    return null;
  }
}
