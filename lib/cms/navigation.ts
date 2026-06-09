import "server-only";
import { prisma } from "@/lib/db/prisma";

const itemsInclude = {
  where: { isActive: true },
  orderBy: { order: "asc" as const },
  include: {
    linkedPage: { select: { slug: true, status: true } },
  },
};

export async function getHeaderNavigation() {
  try {
    return await prisma.navigationMenu.findFirst({
      where: { location: "HEADER" },
      include: { items: itemsInclude },
    });
  } catch (error) {
    console.error("CMS: getHeaderNavigation failed", error);
    return null;
  }
}

export async function getFooterNavigation() {
  try {
    return await prisma.navigationMenu.findMany({
      where: { location: { in: ["FOOTER", "SERVICE", "LEGAL"] } },
      include: { items: itemsInclude },
    });
  } catch (error) {
    console.error("CMS: getFooterNavigation failed", error);
    return [];
  }
}
