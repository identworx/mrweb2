import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";

export interface FrontendServiceSection {
  id: string;
  type: string;
  title: string | null;
  eyebrow: string | null;
  content: string | null;
  settings: Record<string, unknown>;
  imageUrl: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  order: number;
}

export interface FrontendServicePage {
  slug: string;
  title: string;
  headline: string | null;
  introText: string | null;
  heroImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sections: FrontendServiceSection[];
}

export type ServicePageResult =
  | { state: "published"; page: FrontendServicePage }
  | { state: "not-public" }
  | { state: "not-found" }
  | { state: "error" };

export async function getServicePageBySlug(slug: string): Promise<ServicePageResult> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        heroImage: true,
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) return { state: "not-found" };

    if (page.status !== "PUBLISHED") {
      return { state: "not-public" };
    }

    const activeSections = page.sections.filter((s) => s.isActive);

    return {
      state: "published",
      page: {
        slug: page.slug,
        title: page.title,
        headline: page.headline,
        introText: page.introText,
        heroImageUrl: getMediaUrl(page.heroImage, "") || null,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        sections: activeSections.map((s) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          eyebrow: s.eyebrow,
          content: s.content,
          settings: parseSettings(s.settings),
          imageUrl: null,
          buttonLabel: s.buttonLabel,
          buttonHref: s.buttonHref,
          order: s.order,
        })),
      },
    };
  } catch (error) {
    console.error(`CMS: getServicePageBySlug("${slug}") failed`, error);
    return { state: "error" };
  }
}

export interface SectionImage {
  url: string;
  alt: string;
}

export async function getSectionImage(
  pageSlug: string,
  style: string,
): Promise<SectionImage | null> {
  try {
    const sections = await prisma.pageSection.findMany({
      where: {
        page: { slug: pageSlug },
        isActive: true,
        imageId: { not: null },
      },
      include: { image: true },
      orderBy: { order: "asc" },
    });

    const match = sections.find(
      (s) => parseSettings(s.settings).style === style && s.image,
    );
    if (!match?.image) return null;

    const url = getMediaUrl(match.image, "");
    if (!url) return null;
    return { url, alt: match.image.alt || match.title || "" };
  } catch (error) {
    console.error(`CMS: getSectionImage("${pageSlug}", "${style}") failed`, error);
    return null;
  }
}

export interface SectionData {
  title: string | null;
  eyebrow: string | null;
  content: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  imageUrl: string | null;
  settings: Record<string, unknown>;
}

export async function getSectionData(
  pageSlug: string,
  style: string,
): Promise<SectionData | null> {
  try {
    const sections = await prisma.pageSection.findMany({
      where: {
        page: { slug: pageSlug },
        isActive: true,
      },
      include: { image: true },
      orderBy: { order: "asc" },
    });

    const match = sections.find(
      (s) => parseSettings(s.settings).style === style,
    );
    if (!match) return null;

    return {
      title: match.title,
      eyebrow: match.eyebrow,
      content: match.content,
      buttonLabel: match.buttonLabel,
      buttonHref: match.buttonHref,
      imageUrl: match.image ? getMediaUrl(match.image, "") : null,
      settings: parseSettings(match.settings),
    };
  } catch (error) {
    console.error(`CMS: getSectionData("${pageSlug}", "${style}") failed`, error);
    return null;
  }
}

export interface VideoThumbnail {
  url: string;
  alt: string;
}

export async function resolveVideoThumbnails(
  settings: Record<string, unknown>,
): Promise<Record<string, VideoThumbnail>> {
  const videos = Array.isArray(settings.videos) ? settings.videos : [];
  const mediaIds = videos
    .map((v: any) => v?.thumbnailMediaId)
    .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);

  if (mediaIds.length === 0) return {};

  try {
    const assets = await prisma.mediaAsset.findMany({
      where: { id: { in: mediaIds } },
    });

    const result: Record<string, VideoThumbnail> = {};
    for (const asset of assets) {
      const url = getMediaUrl(asset, "");
      if (url) {
        result[asset.id] = { url, alt: asset.alt || "" };
      }
    }
    return result;
  } catch {
    return {};
  }
}

export interface ResolvedMedia {
  url: string;
  alt: string;
}

export async function resolveMediaIds(
  ids: (string | null | undefined)[],
): Promise<Record<string, ResolvedMedia>> {
  const validIds = ids.filter(
    (id): id is string => typeof id === "string" && id.length > 0,
  );
  if (validIds.length === 0) return {};

  try {
    const assets = await prisma.mediaAsset.findMany({
      where: { id: { in: validIds } },
    });
    const result: Record<string, ResolvedMedia> = {};
    for (const asset of assets) {
      const url = getMediaUrl(asset, "");
      if (url) {
        result[asset.id] = { url, alt: asset.alt || "" };
      }
    }
    return result;
  } catch {
    return {};
  }
}

function parseSettings(raw: unknown): Record<string, unknown> {
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch { /* ignore */ }
  }
  return {};
}
