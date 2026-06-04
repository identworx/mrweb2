import { prisma } from "@/lib/db/prisma";

export async function getFooterSettings() {
  return prisma.footerSettings.findFirst();
}
