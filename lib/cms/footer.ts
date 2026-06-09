import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getFooterSettings() {
  try {
    return await prisma.footerSettings.findFirst({
      include: {
        logoMedia: { select: { url: true, alt: true } },
      },
    });
  } catch (error) {
    console.error("CMS: getFooterSettings failed", error);
    return null;
  }
}
