import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import { downloads as staticDownloads } from "@/lib/mosaroma/downloads";
import type { Locale } from "@/lib/i18n/config";
import { overlayCmsBatch } from "@/lib/i18n/cms-overlay";

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

const DOWNLOAD_TEXT_FIELDS: (keyof FrontendDownload & string)[] = [
  "title", "description", "buttonLabel",
];

const BUTTON_LABEL_DE = "Ansehen";
const BUTTON_LABEL_EN = "View";

export async function getPublicDownloads(locale: Locale = "de"): Promise<FrontendDownload[]> {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { image: true },
    });

    if (downloads.length === 0) return getStaticFallbackDownloads(locale);

    const mapped = downloads.map((dl) => mapDownloadForFrontend(dl, locale));
    return overlayCmsBatch("download", mapped, "id", DOWNLOAD_TEXT_FIELDS, locale);
  } catch (error) {
    console.error("CMS: getPublicDownloads failed", error);
    return getStaticFallbackDownloads(locale);
  }
}

export async function getPublicDownloadsByType(type: string, locale: Locale = "de"): Promise<FrontendDownload[]> {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true, type },
      orderBy: { order: "asc" },
      include: { image: true },
    });

    if (downloads.length > 0) {
      const mapped = downloads.map((dl) => mapDownloadForFrontend(dl, locale));
      return overlayCmsBatch("download", mapped, "id", DOWNLOAD_TEXT_FIELDS, locale);
    }

    return getCatalogFallbacks(type, locale);
  } catch (error) {
    console.error(`CMS: getPublicDownloadsByType("${type}") failed`, error);
    return getCatalogFallbacks(type, locale);
  }
}

type DbDownload = NonNullable<Awaited<ReturnType<typeof prisma.download.findFirst<{ include: { image: true } }>>>>;

function mapDownloadForFrontend(dl: DbDownload, locale: Locale = "de"): FrontendDownload {
  const defaultLabel = locale === "en" ? BUTTON_LABEL_EN : BUTTON_LABEL_DE;
  return {
    id: dl.id,
    title: dl.title,
    description: dl.description || "",
    type: dl.type || "PDF",
    language: dl.language || "de",
    fileUrl: dl.fileUrl || null,
    externalUrl: dl.externalUrl || null,
    buttonLabel: dl.buttonLabel || defaultLabel,
    opensInNewTab: dl.opensInNewTab,
    imageUrl: dl.image ? getMediaUrl(dl.image, "") : null,
    order: dl.order,
  };
}

function getCatalogFallbacks(type: string, locale: Locale): FrontendDownload[] {
  if (type !== "catalog") return [];
  return [
    {
      id: "fallback-catalog-de",
      title: "Katalog 2027 (Deutsch)",
      description: "",
      type: "catalog",
      language: "de",
      fileUrl: null,
      externalUrl: "https://katalog.mosaroma.de/",
      buttonLabel: locale === "en" ? "View German" : "Deutsch ansehen",
      opensInNewTab: true,
      imageUrl: null,
      order: 0,
    },
    {
      id: "fallback-catalog-en",
      title: "Catalog 2027 (English)",
      description: "",
      type: "catalog",
      language: "en",
      fileUrl: null,
      externalUrl: "https://catalog.mosaroma.de/",
      buttonLabel: locale === "en" ? "View English" : "English ansehen",
      opensInNewTab: true,
      imageUrl: null,
      order: 1,
    },
  ];
}

function getStaticFallbackDownloads(locale: Locale = "de"): FrontendDownload[] {
  const defaultLabel = locale === "en" ? BUTTON_LABEL_EN : BUTTON_LABEL_DE;
  return staticDownloads.map((d, i) => ({
    id: `static-${i}`,
    title: d.title,
    description: d.description,
    type: d.type,
    language: d.languages.join(", "),
    fileUrl: d.href === "#" ? null : d.href,
    externalUrl: null,
    buttonLabel: defaultLabel,
    opensInNewTab: false,
    imageUrl: null,
    order: i,
  }));
}
