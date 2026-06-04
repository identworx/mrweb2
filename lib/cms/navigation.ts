import { prisma } from "@/lib/db/prisma";

export async function getHeaderNavigation() {
  return prisma.navigationMenu.findFirst({
    where: { location: "HEADER" },
    include: { items: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });
}

export async function getFooterNavigation() {
  return prisma.navigationMenu.findMany({
    where: { location: { in: ["FOOTER", "SERVICE", "LEGAL"] } },
    include: { items: { where: { isActive: true }, orderBy: { order: "asc" } } },
  });
}
