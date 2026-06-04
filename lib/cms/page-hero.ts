import "server-only";
import { getPublishedPageBySlug } from "./pages";
import { getMediaUrl } from "./media-url";
import { pageHeroes, type PageHeroData } from "@/lib/mosaroma/pageHeroes";

interface CmsPageHeroData extends PageHeroData {
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export async function getPageHeroData(
  slug: string,
  fallbackKey: string,
): Promise<CmsPageHeroData> {
  const fallback = pageHeroes[fallbackKey];
  const page = await getPublishedPageBySlug(slug);

  if (!page) return { ...fallback, seoTitle: null, seoDescription: null };

  return {
    eyebrow: page.eyebrow || fallback?.eyebrow,
    title: page.headline || page.title || fallback?.title || slug,
    description: page.introText || fallback?.description,
    image: getMediaUrl(page.heroImage, fallback?.image || "/images/placeholders/page-heroes/default-hero.svg"),
    alt: page.heroImage?.alt || fallback?.alt || "MOSAROMA Hero",
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
}
