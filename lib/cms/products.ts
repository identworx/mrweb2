import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "./media-url";
import {
  products as staticProducts,
  getProductBySlug as getStaticProductBySlug,
  getProductsByCollection as getStaticProductsByCollection,
  getProductsByCategory as getStaticProductsByCategory,
} from "@/lib/mosaroma/products";

export interface FrontendProduct {
  slug: string;
  name: string;
  categorySlug: string;
  collectionSlug: string;
  materialSlug: string;
  material: string;
  size: string;
  code: string;
  features: string[];
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  alt: string;
  colorName?: string;
  patternName?: string;
  heroImage: string;
  seoTitle: string | null;
  seoDescription: string | null;
  collectionName: string;
  productGroupName: string;
}

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((f): f is string => typeof f === "string" && f.length > 0);
  if (typeof raw === "string" && raw.length > 0) return raw.split("\n").map((f) => f.trim()).filter(Boolean);
  return [];
}

type DbProductFull = NonNullable<Awaited<ReturnType<typeof fetchProductBySlug>>>;

async function fetchProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      collection: { include: { heroImage: true } },
      productGroup: true,
      material: true,
      heroImage: true,
      mainImage: true,
      images: { orderBy: { order: "asc" }, include: { mediaAsset: true } },
    },
  });
}

function buildGallery(db: DbProductFull, mainImageUrl: string): string[] {
  const galleryFromDb = db.images
    .map((img) => getMediaUrl(img.mediaAsset, img.url || ""))
    .filter((url) => url.length > 0);

  if (galleryFromDb.length > 0) return galleryFromDb;
  if (mainImageUrl) return [mainImageUrl];
  return [];
}

export function mapProductForFrontend(db: DbProductFull): FrontendProduct {
  const staticFallback = getStaticProductBySlug(db.slug);
  const collectionSlug = db.collection.slug;

  const mainImage = getMediaUrl(
    db.mainImage,
    staticFallback?.image || `/images/placeholders/products/product-${collectionSlug}.svg`,
  );

  const heroImage = getMediaUrl(
    db.heroImage,
    getMediaUrl(
      db.mainImage,
      getMediaUrl(
        db.collection.heroImage,
        `/images/placeholders/page-heroes/default-hero.svg`,
      ),
    ),
  );

  return {
    slug: db.slug,
    name: db.name,
    categorySlug: db.productGroup.slug,
    collectionSlug,
    materialSlug: db.material?.slug || "",
    material: db.material?.name || "",
    size: db.size || "",
    code: db.code || "",
    features: parseFeatures(db.features),
    description: db.description || staticFallback?.description || "",
    shortDescription: db.shortDescription || "",
    image: mainImage,
    gallery: buildGallery(db, mainImage),
    alt: db.mainImage?.alt || staticFallback?.alt || `Mosaroma ${db.name}`,
    colorName: db.colorName || undefined,
    patternName: db.patternName || undefined,
    heroImage,
    seoTitle: db.seoTitle ?? null,
    seoDescription: db.seoDescription ?? null,
    collectionName: db.collection.name,
    productGroupName: db.productGroup.name,
  };
}

function staticToFrontend(sp: (typeof staticProducts)[0]): FrontendProduct {
  return {
    ...sp,
    shortDescription: "",
    heroImage: sp.image,
    seoTitle: null,
    seoDescription: null,
    collectionName: sp.collectionSlug,
    productGroupName: sp.categorySlug,
  };
}

export async function getPublishedProducts(): Promise<FrontendProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
      include: {
        collection: { include: { heroImage: true } },
        productGroup: true,
        material: true,
        heroImage: true,
        mainImage: true,
        images: { orderBy: { order: "asc" }, include: { mediaAsset: true } },
      },
    });

    if (dbProducts.length > 0) {
      return dbProducts.map((p) => mapProductForFrontend(p));
    }

    return staticProducts.map(staticToFrontend);
  } catch (error) {
    console.error("CMS: getPublishedProducts failed", error);
    return staticProducts.map(staticToFrontend);
  }
}

export async function getProductsByCollectionSlug(
  collectionSlug: string,
): Promise<FrontendProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        collection: { slug: collectionSlug, status: "PUBLISHED" },
        productGroup: { isActive: true },
        status: "PUBLISHED",
      },
      orderBy: [{ productGroup: { order: "asc" } }, { name: "asc" }],
      include: {
        collection: { include: { heroImage: true } },
        productGroup: true,
        material: true,
        heroImage: true,
        mainImage: true,
        images: { orderBy: { order: "asc" }, include: { mediaAsset: true } },
      },
    });

    if (dbProducts.length > 0) {
      return dbProducts.map((p) => mapProductForFrontend(p));
    }

    return getStaticProductsByCollection(collectionSlug).map(staticToFrontend);
  } catch (error) {
    console.error(`CMS: getProductsByCollectionSlug("${collectionSlug}") failed`, error);
    return getStaticProductsByCollection(collectionSlug).map(staticToFrontend);
  }
}

export async function getProductsByProductGroupSlug(
  groupSlug: string,
): Promise<FrontendProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        productGroup: { slug: groupSlug, isActive: true },
        collection: { status: "PUBLISHED" },
        status: "PUBLISHED",
      },
      orderBy: [{ collection: { order: "asc" } }, { name: "asc" }],
      include: {
        collection: { include: { heroImage: true } },
        productGroup: true,
        material: true,
        heroImage: true,
        mainImage: true,
        images: { orderBy: { order: "asc" }, include: { mediaAsset: true } },
      },
    });

    if (dbProducts.length > 0) {
      return dbProducts.map((p) => mapProductForFrontend(p));
    }

    return getStaticProductsByCategory(groupSlug).map(staticToFrontend);
  } catch (error) {
    console.error(`CMS: getProductsByProductGroupSlug("${groupSlug}") failed`, error);
    return getStaticProductsByCategory(groupSlug).map(staticToFrontend);
  }
}

export type ProductLookupResult =
  | { state: "published"; product: FrontendProduct }
  | { state: "not-public"; status: string }
  | { state: "not-found" }
  | { state: "error"; error?: unknown };

export async function getProductBySlugWithStatus(
  slug: string,
): Promise<ProductLookupResult> {
  try {
    const dbProduct = await fetchProductBySlug(slug);

    if (dbProduct && dbProduct.status === "PUBLISHED") {
      return { state: "published", product: mapProductForFrontend(dbProduct) };
    }

    if (dbProduct) {
      return { state: "not-public", status: dbProduct.status };
    }

    return { state: "not-found" };
  } catch (error) {
    console.error(`CMS: getProductBySlugWithStatus("${slug}") failed`, error);
    return { state: "error", error };
  }
}

export async function getProductStaticParams(): Promise<{ slug: string }[]> {
  try {
    const dbSlugs = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    const slugSet = new Set(dbSlugs.map((p) => p.slug));
    for (const sp of staticProducts) {
      slugSet.add(sp.slug);
    }
    return Array.from(slugSet).map((slug) => ({ slug }));
  } catch {
    return staticProducts.map((sp) => ({ slug: sp.slug }));
  }
}
