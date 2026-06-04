import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import {
  categories as staticCategories,
  getCategoryBySlug as getStaticCategoryBySlug,
} from "@/lib/mosaroma/categories";

export interface FrontendProductGroup {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  icon: string | null;
  features: string[];
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
}

type DbProductGroup = NonNullable<Awaited<ReturnType<typeof fetchGroupBySlug>>>;

async function fetchGroupBySlug(slug: string) {
  return prisma.productGroup.findUnique({
    where: { slug },
    include: { icon: true, image: true },
  });
}

export function mapProductGroupForFrontend(db: DbProductGroup): FrontendProductGroup {
  const staticFallback = getStaticCategoryBySlug(db.slug);

  return {
    slug: db.slug,
    name: db.name,
    description: db.description || staticFallback?.description || "",
    shortDescription: staticFallback?.shortDescription || db.description || "",
    image: getMediaUrl(
      db.image,
      staticFallback?.image || `/images/placeholders/categories/${db.slug}.svg`,
    ),
    imageAlt: db.image?.alt || staticFallback?.alt || db.name,
    icon: getMediaUrl(db.icon, ""),
    features: staticFallback?.features || [],
    order: db.order,
    seoTitle: null,
    seoDescription: null,
  };
}

export async function getActiveProductGroups(): Promise<FrontendProductGroup[]> {
  try {
    const dbGroups = await prisma.productGroup.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { icon: true, image: true },
    });

    if (dbGroups.length > 0) {
      return dbGroups.map((g) => mapProductGroupForFrontend(g));
    }

    return staticCategories.map((sc) => ({
      slug: sc.slug,
      name: sc.title,
      description: sc.description,
      shortDescription: sc.shortDescription,
      image: sc.image,
      imageAlt: sc.alt,
      icon: null,
      features: sc.features,
      order: 0,
      seoTitle: null,
      seoDescription: null,
    }));
  } catch (error) {
    console.error("CMS: getActiveProductGroups failed", error);
    return staticCategories.map((sc) => ({
      slug: sc.slug,
      name: sc.title,
      description: sc.description,
      shortDescription: sc.shortDescription,
      image: sc.image,
      imageAlt: sc.alt,
      icon: null,
      features: sc.features,
      order: 0,
      seoTitle: null,
      seoDescription: null,
    }));
  }
}

export type ProductGroupLookupResult =
  | { state: "active"; group: FrontendProductGroup }
  | { state: "inactive" }
  | { state: "not-found" }
  | { state: "error"; error?: unknown };

export async function getProductGroupBySlugWithStatus(
  slug: string,
): Promise<ProductGroupLookupResult> {
  try {
    const dbGroup = await fetchGroupBySlug(slug);

    if (dbGroup && dbGroup.isActive) {
      return { state: "active", group: mapProductGroupForFrontend(dbGroup) };
    }

    if (dbGroup) {
      return { state: "inactive" };
    }

    return { state: "not-found" };
  } catch (error) {
    console.error(`CMS: getProductGroupBySlugWithStatus("${slug}") failed`, error);
    return { state: "error", error };
  }
}

export async function getProductGroupStaticParams(): Promise<{ slug: string }[]> {
  try {
    const dbSlugs = await prisma.productGroup.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    const slugSet = new Set(dbSlugs.map((g) => g.slug));
    for (const sc of staticCategories) {
      slugSet.add(sc.slug);
    }
    return Array.from(slugSet).map((slug) => ({ slug }));
  } catch {
    return staticCategories.map((sc) => ({ slug: sc.slug }));
  }
}
