import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import { newsItems as staticNews } from "@/lib/mosaroma/news";
import type { Locale } from "@/lib/i18n/config";
import { overlayCmsBatch } from "@/lib/i18n/cms-overlay";

export interface FrontendNewsArticle {
  slug: string;
  title: string;
  eyebrow: string | null;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  heroImageUrl: string;
  cardImageUrl: string;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
}

export interface FrontendNewsCard {
  slug: string;
  title: string;
  tag: string;
  date: string;
  description: string;
  imageUrl: string | null;
}

export type NewsArticleLookupResult =
  | { state: "published"; article: FrontendNewsArticle }
  | { state: "not-public"; status: "DRAFT" | "ARCHIVED" }
  | { state: "not-found" }
  | { state: "error"; error?: unknown };

const DEFAULT_HERO = "/images/placeholders/page-heroes/neuigkeiten-hero.svg";

const NEWS_CARD_TEXT_FIELDS: (keyof FrontendNewsCard & string)[] = [
  "title", "tag", "description",
];

const NEWS_ARTICLE_TEXT_FIELDS: (keyof FrontendNewsArticle & string)[] = [
  "title", "eyebrow", "excerpt", "content", "category",
  "seoTitle", "seoDescription",
];

function formatNewsDate(date: Date | null, locale: Locale): string {
  if (!date) return "2027";
  const dateLocale = locale === "en" ? "en-GB" : "de-DE";
  return date.toLocaleDateString(dateLocale, { year: "numeric", month: "long" });
}

function formatNewsDateFull(date: Date | null, locale: Locale): string {
  if (!date) return "2027";
  const dateLocale = locale === "en" ? "en-GB" : "de-DE";
  return date.toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" });
}

const DEFAULT_TAG_DE = "Neuigkeiten";
const DEFAULT_TAG_EN = "News";

export async function getPublishedNewsArticles(locale: Locale = "de"): Promise<FrontendNewsCard[]> {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { cardImage: true },
    });

    if (articles.length === 0) return getStaticFallbackCards(locale);

    const defaultTag = locale === "en" ? DEFAULT_TAG_EN : DEFAULT_TAG_DE;
    const cards: FrontendNewsCard[] = articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      tag: a.category || a.eyebrow || defaultTag,
      date: formatNewsDate(a.publishedAt, locale),
      description: a.excerpt || (a.content ? a.content.slice(0, 200) : ""),
      imageUrl: getMediaUrl(a.cardImage, "") || null,
    }));

    return overlayCmsBatch("newsArticle", cards, "slug", NEWS_CARD_TEXT_FIELDS, locale);
  } catch (error) {
    console.error("CMS: getPublishedNewsArticles failed", error);
    return getStaticFallbackCards(locale);
  }
}

export async function getNewsArticleBySlugWithStatus(
  slug: string,
  locale: Locale = "de",
): Promise<NewsArticleLookupResult> {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      include: { heroImage: true, cardImage: true },
    });

    if (!article) return { state: "not-found" };

    if (article.status !== "PUBLISHED") {
      return { state: "not-public", status: article.status as "DRAFT" | "ARCHIVED" };
    }

    const mapped = mapNewsArticleForFrontend(article, locale);
    const [overlaid] = await overlayCmsBatch("newsArticle", [mapped], "slug", NEWS_ARTICLE_TEXT_FIELDS, locale);
    return { state: "published", article: overlaid };
  } catch (error) {
    console.error(`CMS: getNewsArticleBySlugWithStatus("${slug}") failed`, error);
    return { state: "error", error };
  }
}

export async function getNewsStaticParams(): Promise<{ slug: string }[]> {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });

    if (articles.length === 0) {
      return staticNews.map((n) => ({ slug: n.slug }));
    }

    return articles.map((a) => ({ slug: a.slug }));
  } catch (error) {
    console.error("CMS: getNewsStaticParams failed", error);
    return staticNews.map((n) => ({ slug: n.slug }));
  }
}

interface DbArticle {
  slug: string;
  title: string;
  eyebrow: string | null;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  status: string;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  heroImage: { url?: string | null } | null;
  cardImage: { url?: string | null } | null;
}

function mapNewsArticleForFrontend(a: DbArticle, locale: Locale = "de"): FrontendNewsArticle {
  const heroImageUrl = getMediaUrl(a.heroImage, "") || getMediaUrl(a.cardImage, DEFAULT_HERO);
  const cardImageUrl = getMediaUrl(a.cardImage, "") || heroImageUrl;
  const defaultTag = locale === "en" ? DEFAULT_TAG_EN : DEFAULT_TAG_DE;

  return {
    slug: a.slug,
    title: a.title,
    eyebrow: a.eyebrow,
    excerpt: a.excerpt || (a.content ? a.content.slice(0, 200) : ""),
    content: a.content || "",
    category: a.category || a.eyebrow || defaultTag,
    publishedAt: formatNewsDateFull(a.publishedAt, locale),
    heroImageUrl,
    cardImageUrl,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
    status: a.status,
  };
}

function getStaticFallbackCards(locale: Locale = "de"): FrontendNewsCard[] {
  return staticNews.map((n) => ({
    slug: n.slug,
    title: n.title,
    tag: n.tag,
    date: n.date,
    description: n.description,
    imageUrl: n.image || null,
  }));
}
