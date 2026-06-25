import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import {
  collections as staticCollections,
  getCollectionBySlug as getStaticCollectionBySlug,
} from "@/lib/mosaroma/collections";
import type { Locale } from "@/lib/i18n/config";
import { overlayCmsBatch } from "@/lib/i18n/cms-overlay";

export interface FrontendCollection {
  slug: string;
  name: string;
  number: string;
  eyebrow: string;
  subtitle?: string;
  shortDescription: string;
  longDescription: string;
  fabric: string;
  cardImage: string;
  cardAlt: string;
  heroImage: string;
  heroAlt: string;
  moodColors: string[];
  seoTitle: string | null;
  seoDescription: string | null;
}

function parseMoodColors(
  raw: unknown,
  fallback: string[],
): string[] {
  if (Array.isArray(raw)) {
    const colors = raw.filter(
      (c): c is string => typeof c === "string" && c.length > 0,
    );
    return colors.length > 0 ? colors : fallback;
  }
  if (typeof raw === "string" && raw.length > 0) {
    const colors = raw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    return colors.length > 0 ? colors : fallback;
  }
  return fallback;
}

function formatNumber(n: number | null | undefined): string {
  if (n == null) return "00";
  return n < 10 ? `0${n}` : `${n}`;
}

type DbCollection = NonNullable<Awaited<ReturnType<typeof fetchCollectionBySlug>>>;

async function fetchCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({
    where: { slug },
    include: {
      heroImage: true,
      cardImage: true,
    },
  });
}

export function mapCollectionForFrontend(
  dbCol: DbCollection,
  fallbackSlug?: string,
): FrontendCollection {
  const staticFallback = getStaticCollectionBySlug(fallbackSlug ?? dbCol.slug);

  const cardImage = getMediaUrl(
    dbCol.cardImage,
    staticFallback?.image ?? `/images/placeholders/collections/${dbCol.slug}.svg`,
  );
  const heroImage = getMediaUrl(
    dbCol.heroImage,
    staticFallback
      ? `/images/placeholders/collections/hero/${dbCol.slug}.svg`
      : `/images/placeholders/page-heroes/default-hero.svg`,
  );

  return {
    slug: dbCol.slug,
    name: dbCol.name,
    number: formatNumber(dbCol.number),
    eyebrow:
      dbCol.eyebrow ||
      (dbCol.number ? `Kollektion ${formatNumber(dbCol.number)}` : "Kollektion"),
    subtitle: dbCol.subtitle ?? staticFallback?.subtitle,
    shortDescription:
      dbCol.shortDescription ||
      staticFallback?.description ||
      "",
    longDescription:
      dbCol.longDescription ||
      staticFallback?.extendedDescription ||
      "",
    fabric: dbCol.fabric || staticFallback?.fabric || "",
    cardImage,
    cardAlt:
      dbCol.cardImage?.alt ||
      staticFallback?.alt ||
      `${dbCol.name} Collection`,
    heroImage,
    heroAlt:
      dbCol.heroImage?.alt ||
      `${dbCol.name} Collection Hero`,
    moodColors: parseMoodColors(
      dbCol.moodColors,
      staticFallback?.moodColors ?? [],
    ),
    seoTitle: dbCol.seoTitle ?? null,
    seoDescription: dbCol.seoDescription ?? null,
  };
}

const COLLECTION_TEXT_FIELDS: (keyof FrontendCollection & string)[] = [
  "name", "eyebrow", "subtitle", "shortDescription", "longDescription", "fabric",
  "cardAlt", "heroAlt", "seoTitle", "seoDescription",
];

export async function getPublishedCollections(locale: Locale = "de"): Promise<FrontendCollection[]> {
  try {
    const dbCollections = await prisma.collection.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: {
        heroImage: true,
        cardImage: true,
      },
    });

    let collections: FrontendCollection[];

    if (dbCollections.length > 0) {
      collections = dbCollections.map((c) => mapCollectionForFrontend(c));
    } else {
      collections = staticCollections.map((sc) => ({
        slug: sc.slug,
        name: sc.name,
        number: sc.number,
        eyebrow: `Kollektion ${sc.number}`,
        subtitle: sc.subtitle,
        shortDescription: sc.description,
        longDescription: sc.extendedDescription,
        fabric: sc.fabric,
        cardImage: sc.image,
        cardAlt: sc.alt,
        heroImage: `/images/placeholders/collections/hero/${sc.slug}.svg`,
        heroAlt: `${sc.name} Collection Hero`,
        moodColors: [...sc.moodColors],
        seoTitle: null,
        seoDescription: null,
      }));
    }

    return overlayCmsBatch("collection", collections, "slug", COLLECTION_TEXT_FIELDS, locale);
  } catch (error) {
    console.error("CMS: getPublishedCollections failed", error);
    const collections = staticCollections.map((sc) => ({
      slug: sc.slug,
      name: sc.name,
      number: sc.number,
      eyebrow: `Kollektion ${sc.number}`,
      subtitle: sc.subtitle,
      shortDescription: sc.description,
      longDescription: sc.extendedDescription,
      fabric: sc.fabric,
      cardImage: sc.image,
      cardAlt: sc.alt,
      heroImage: `/images/placeholders/collections/hero/${sc.slug}.svg`,
      heroAlt: `${sc.name} Collection Hero`,
      moodColors: [...sc.moodColors],
      seoTitle: null,
      seoDescription: null,
    }));
    return overlayCmsBatch("collection", collections, "slug", COLLECTION_TEXT_FIELDS, locale);
  }
}

export type CollectionLookupResult =
  | { state: "published"; collection: FrontendCollection }
  | { state: "not-public"; status: string }
  | { state: "not-found" }
  | { state: "error" };

export async function getCollectionBySlugWithStatus(
  slug: string,
  locale: Locale = "de",
): Promise<CollectionLookupResult> {
  try {
    const dbCol = await fetchCollectionBySlug(slug);

    if (dbCol && dbCol.status === "PUBLISHED") {
      const collection = mapCollectionForFrontend(dbCol);
      const [overlaid] = await overlayCmsBatch("collection", [collection], "slug", COLLECTION_TEXT_FIELDS, locale);
      return { state: "published", collection: overlaid };
    }

    if (dbCol) {
      return { state: "not-public", status: dbCol.status };
    }

    return { state: "not-found" };
  } catch (error) {
    console.error(`CMS: getCollectionBySlugWithStatus("${slug}") failed`, error);
    return { state: "error" };
  }
}

export async function getCollectionStaticParams(): Promise<{ slug: string }[]> {
  try {
    const dbSlugs = await prisma.collection.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    const slugSet = new Set(dbSlugs.map((c) => c.slug));
    for (const sc of staticCollections) {
      slugSet.add(sc.slug);
    }
    return Array.from(slugSet).map((slug) => ({ slug }));
  } catch {
    return staticCollections.map((sc) => ({ slug: sc.slug }));
  }
}
