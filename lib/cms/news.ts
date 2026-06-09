import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import { newsItems as staticNews } from "@/lib/mosaroma/news";

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
}

export type NewsArticleLookupResult =
  | { state: "published"; article: FrontendNewsArticle }
  | { state: "not-public"; status: "DRAFT" | "ARCHIVED" }
  | { state: "not-found" }
  | { state: "error"; error?: unknown };

const DEFAULT_HERO = "/images/placeholders/page-heroes/neuigkeiten-hero.svg";

export async function getPublishedNewsArticles(): Promise<FrontendNewsCard[]> {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { cardImage: true },
    });

    if (articles.length === 0) return getStaticFallbackCards();

    return articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      tag: a.category || a.eyebrow || "Neuigkeiten",
      date: a.publishedAt
        ? a.publishedAt.toLocaleDateString("de-DE", { year: "numeric", month: "long" })
        : "2027",
      description: a.excerpt || (a.content ? a.content.slice(0, 200) : ""),
    }));
  } catch (error) {
    console.error("CMS: getPublishedNewsArticles failed", error);
    return getStaticFallbackCards();
  }
}

export async function getNewsArticleBySlugWithStatus(slug: string): Promise<NewsArticleLookupResult> {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      include: { heroImage: true, cardImage: true },
    });

    if (!article) return { state: "not-found" };

    if (article.status !== "PUBLISHED") {
      return { state: "not-public", status: article.status as "DRAFT" | "ARCHIVED" };
    }

    return {
      state: "published",
      article: mapNewsArticleForFrontend(article),
    };
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

function mapNewsArticleForFrontend(a: DbArticle): FrontendNewsArticle {
  const heroImageUrl = getMediaUrl(a.heroImage, "") || getMediaUrl(a.cardImage, DEFAULT_HERO);
  const cardImageUrl = getMediaUrl(a.cardImage, "") || heroImageUrl;

  return {
    slug: a.slug,
    title: a.title,
    eyebrow: a.eyebrow,
    excerpt: a.excerpt || (a.content ? a.content.slice(0, 200) : ""),
    content: a.content || "",
    category: a.category || a.eyebrow || "Neuigkeiten",
    publishedAt: a.publishedAt
      ? a.publishedAt.toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })
      : "2027",
    heroImageUrl,
    cardImageUrl,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
    status: a.status,
  };
}

function getStaticFallbackCards(): FrontendNewsCard[] {
  return staticNews.map((n) => ({
    slug: n.slug,
    title: n.title,
    tag: n.tag,
    date: n.date,
    description: n.description,
  }));
}
