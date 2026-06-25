import "server-only";
import { getPublishedPageBySlug } from "./pages";
import { getMediaUrl } from "./media-url";
import { pageHeroes, type PageHeroData } from "@/lib/mosaroma/pageHeroes";
import type { Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/get-translation";

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
  const page = await getPublishedPageBySlug(slug);

  const image = getMediaUrl(
    page?.heroImage,
    fallback?.image || "/images/placeholders/page-heroes/default-hero.svg",
  );

  const baseEyebrow = page?.eyebrow || fallback?.eyebrow;
  const baseTitle = page?.headline || page?.title || fallback?.title || slug;
  const baseDescription = page?.introText || fallback?.description;
  const baseAlt = page?.heroImage?.alt || fallback?.alt || "MOSAROMA Hero";

  if (locale === "de") {
    return {
      eyebrow: baseEyebrow,
      title: baseTitle,
      description: baseDescription,
      image,
      alt: baseAlt,
      seoTitle: page?.seoTitle ?? null,
      seoDescription: page?.seoDescription ?? null,
    };
  }

  const translations = await getTranslations("pageHero", fallbackKey, locale);

  return {
    eyebrow: translations.eyebrow || baseEyebrow,
    title: translations.title || baseTitle,
    description: translations.description || baseDescription,
    image,
    alt: translations.alt || baseAlt,
    seoTitle: null,
    seoDescription: null,
  };
}
