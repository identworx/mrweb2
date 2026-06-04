import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("CMS: getSiteSettings failed", error);
    return null;
  }
}
