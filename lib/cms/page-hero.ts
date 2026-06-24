import "server-only";
import { getPublishedPageBySlug } from "./pages";
import { getMediaUrl } from "./media-url";
import { pageHeroes, pageHeroesEn, type PageHeroData } from "@/lib/mosaroma/pageHeroes";
import type { Locale } from "@/lib/i18n/config";

interface CmsPageHeroData extends PageHeroData {
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export async function getPageHeroData(
  slug: string,
  fallbackKey: string,
  locale: Locale = "de",
): Promise<CmsPageHeroData> {
  const fallback = pageHeroes[fallbackKey];
  const enOverride = locale === "en" ? pageHeroesEn[fallbackKey] : null;
  const page = await getPublishedPageBySlug(slug);

  const image = getMediaUrl(
    page?.heroImage,
    fallback?.image || "/images/placeholders/page-heroes/default-hero.svg",
  );

  if (locale === "en") {
    return {
      eyebrow: enOverride?.eyebrow || fallback?.eyebrow,
      title: enOverride?.title || fallback?.title || slug,
      description: enOverride?.description || fallback?.description,
      image,
      alt: enOverride?.alt || fallback?.alt || "MOSAROMA Hero",
      seoTitle: null,
      seoDescription: null,
    };
  }

  if (!page) return { ...fallback, seoTitle: null, seoDescription: null };

  return {
    eyebrow: page.eyebrow || fallback?.eyebrow,
    title: page.headline || page.title || fallback?.title || slug,
    description: page.introText || fallback?.description,
    image,
    alt: page.heroImage?.alt || fallback?.alt || "MOSAROMA Hero",
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
}
