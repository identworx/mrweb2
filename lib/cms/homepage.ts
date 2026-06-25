import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "@/lib/cms/media-url";
import type { Locale } from "@/lib/i18n/config";
import { overlayHomepageSections } from "@/lib/i18n/cms-overlay";

export interface HomepageSection {
  id: string;
  style: string;
  eyebrow: string | null;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  settings: Record<string, unknown>;
  order: number;
  isActive: boolean;
}

export interface HomepageData {
  seoTitle: string | null;
  seoDescription: string | null;
  sections: HomepageSection[];
}

function parseSettings(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return {};
}

export async function getHomepageData(locale: Locale = "de"): Promise<HomepageData | null> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "home" },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: { image: true },
        },
      },
    });

    if (!page || page.status !== "PUBLISHED") return null;

    const sections: HomepageSection[] = page.sections.map((s) => ({
      id: s.id,
      style: (parseSettings(s.settings).style as string) || "",
      eyebrow: s.eyebrow,
      title: s.title,
      content: s.content,
      imageUrl: s.image ? getMediaUrl(s.image, "") : null,
      imageAlt: s.image?.alt || null,
      buttonLabel: s.buttonLabel,
      buttonHref: s.buttonHref,
      settings: parseSettings(s.settings),
      order: s.order,
      isActive: s.isActive,
    }));

    const overlaid = await overlayHomepageSections(sections, locale);

    return {
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      sections: overlaid,
    };
  } catch (error) {
    console.warn("[homepage] Failed to load homepage data:", error);
    return null;
  }
}
