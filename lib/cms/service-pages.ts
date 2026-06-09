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
