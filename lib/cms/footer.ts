import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getFooterSettings() {
  try {
    return await prisma.footerSettings.findFirst();
  } catch (error) {
    console.error("CMS: getFooterSettings failed", error);
    return null;
  }
}
