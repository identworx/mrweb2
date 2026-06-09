import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import { downloads as staticDownloads } from "@/lib/mosaroma/downloads";

export interface FrontendDownload {
  id: string;
  title: string;
  description: string;
  type: string;
  language: string;
  fileUrl: string | null;
  externalUrl: string | null;
  buttonLabel: string;
  opensInNewTab: boolean;
  imageUrl: string | null;
  order: number;
}

export async function getPublicDownloads(): Promise<FrontendDownload[]> {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { image: true },
    });

    if (downloads.length === 0) return getStaticFallbackDownloads();

    return downloads.map(mapDownloadForFrontend);
  } catch (error) {
    console.error("CMS: getPublicDownloads failed", error);
    return getStaticFallbackDownloads();
  }
}

export async function getPublicDownloadsByType(type: string): Promise<FrontendDownload[]> {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true, type },
      orderBy: { order: "asc" },
      include: { image: true },
    });

    return downloads.map(mapDownloadForFrontend);
  } catch (error) {
    console.error(`CMS: getPublicDownloadsByType("${type}") failed`, error);
    return [];
  }
}

type DbDownload = NonNullable<Awaited<ReturnType<typeof prisma.download.findFirst<{ include: { image: true } }>>>>;

function mapDownloadForFrontend(dl: DbDownload): FrontendDownload {
  return {
    id: dl.id,
    title: dl.title,
    description: dl.description || "",
    type: dl.type || "PDF",
    language: dl.language || "de",
    fileUrl: dl.fileUrl || null,
    externalUrl: dl.externalUrl || null,
    buttonLabel: dl.buttonLabel || "Ansehen",
    opensInNewTab: dl.opensInNewTab,
    imageUrl: dl.image ? getMediaUrl(dl.image, "") : null,
    order: dl.order,
  };
}

function getStaticFallbackDownloads(): FrontendDownload[] {
  return staticDownloads.map((d, i) => ({
    id: `static-${i}`,
    title: d.title,
    description: d.description,
    type: d.type,
    language: d.languages.join(", "),
    fileUrl: d.href === "#" ? null : d.href,
    externalUrl: null,
    buttonLabel: "Ansehen",
    opensInNewTab: false,
    imageUrl: null,
    order: i,
  }));
}
