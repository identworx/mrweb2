import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getHeaderNavigation() {
  try {
    return await prisma.navigationMenu.findFirst({
      where: { location: "HEADER" },
      include: {
        items: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
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
      include: {
        items: { where: { isActive: true }, orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error("CMS: getFooterNavigation failed", error);
    return [];
  }
}
