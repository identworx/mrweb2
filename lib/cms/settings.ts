import { prisma } from "@/lib/db/prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.findFirst();
}
