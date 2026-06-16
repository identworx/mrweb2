import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "@/lib/cms/media-url";

export interface FrontendFabricFamily {
  id: string;
  slug: string;
  name: string;
  description: string;
  eyebrow: string;
}

export interface FrontendFabricSwatch {
  id: string;
  slug: string;
  name: string;
  articleNumber: string;
  familyId: string;
  familySlug: string;
  familyName: string;
  subtitle: string;
  description: string;
  swatchImageUrl: string;
  colorHex: string;
  patternType: string;
  availableProductTypes: { slug: string; name: string; iconKey: string; note: string }[];
}

export interface FrontendFabricProductType {
  id: string;
  slug: string;
  name: string;
  iconKey: string;
}

export interface FabricLibraryData {
  families: FrontendFabricFamily[];
  swatches: FrontendFabricSwatch[];
  productTypes: FrontendFabricProductType[];
}

export async function getFabricLibraryData(): Promise<FabricLibraryData> {
  try {
    const [families, swatches, productTypes] = await Promise.all([
      prisma.fabricFamily.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.fabricSwatch.findMany({
        where: { isActive: true },
        orderBy: [
          { family: { order: "asc" } },
          { order: "asc" },
        ],
        include: {
          family: true,
          swatchImage: true,
          availabilities: {
            where: { isAvailable: true },
            include: { productType: true },
          },
        },
      }),
      prisma.fabricProductType.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return {
      families: families.map(mapFamily),
      swatches: swatches.map(mapSwatch),
      productTypes: productTypes.map(mapProductType),
    };
  } catch (error) {
    console.error("CMS: getFabricLibraryData failed", error);
    return { families: [], swatches: [], productTypes: [] };
  }
}

export interface HubFabricFamily {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness: string;
  highlights: string[];
  isHighlighted: boolean;
}

export async function getFabricFamiliesForHub(): Promise<HubFabricFamily[]> {
  try {
    const families = await prisma.fabricFamily.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return families.map((f) => ({
      id: f.id,
      slug: f.slug || "",
      name: f.name || "",
      subtitle: f.subtitle || f.eyebrow || "",
      description: f.description || "",
      material: f.material || "",
      weight: f.weight || "",
      dyeing: f.dyeing || "",
      comfort: f.comfort || "",
      cushionThickness: f.cushionThickness || "",
      highlights: (f.hubHighlights || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      isHighlighted: f.isHighlighted,
    }));
  } catch (error) {
    console.error("CMS: getFabricFamiliesForHub failed", error);
    return [];
  }
}

export async function getFabricFamilies(): Promise<FrontendFabricFamily[]> {
  try {
    const families = await prisma.fabricFamily.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return families.map(mapFamily);
  } catch (error) {
    console.error("CMS: getFabricFamilies failed", error);
    return [];
  }
}

export interface FabricPreviewSwatch {
  id: string;
  slug: string;
  name: string;
  articleNumber: string;
  familyName: string;
  swatchImageUrl: string;
  colorHex: string;
}

export async function getFabricPreviewSwatches(
  limit = 6,
): Promise<FabricPreviewSwatch[]> {
  try {
    const featured = await prisma.fabricSwatch.findMany({
      where: { isActive: true, featuredOnMaterials: true },
      orderBy: [
        { materialsPreviewOrder: { sort: "asc", nulls: "last" } },
        { family: { order: "asc" } },
        { order: "asc" },
        { name: "asc" },
      ],
      take: limit,
      include: {
        family: { select: { name: true } },
        swatchImage: { select: { url: true, normalizedUrl: true } },
      },
    });

    const results = featured.length > 0
      ? featured
      : await prisma.fabricSwatch.findMany({
          where: { isActive: true, family: { isActive: true } },
          orderBy: [
            { family: { order: "asc" } },
            { order: "asc" },
            { name: "asc" },
          ],
          take: limit,
          include: {
            family: { select: { name: true } },
            swatchImage: { select: { url: true, normalizedUrl: true } },
          },
        });

    return results.map((s) => ({
      id: s.id,
      slug: s.slug || "",
      name: s.name || "",
      articleNumber: s.articleNumber || "",
      familyName: s.family?.name || "",
      swatchImageUrl: getMediaUrl(s.swatchImage, ""),
      colorHex: s.colorHex || "",
    }));
  } catch (error) {
    console.error("CMS: getFabricPreviewSwatches failed", error);
    return [];
  }
}

export async function getNerioFabricSwatches(): Promise<FabricPreviewSwatch[]> {
  try {
    const nerioFamily = await prisma.fabricFamily.findFirst({
      where: { slug: "nerio", isActive: true },
    });
    if (!nerioFamily) return [];

    const swatches = await prisma.fabricSwatch.findMany({
      where: { familyId: nerioFamily.id, isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        family: { select: { name: true } },
        swatchImage: { select: { url: true, normalizedUrl: true } },
      },
    });

    return swatches.map((s) => ({
      id: s.id,
      slug: s.slug || "",
      name: s.name || "",
      articleNumber: s.articleNumber || "",
      familyName: s.family?.name || "",
      swatchImageUrl: getMediaUrl(s.swatchImage, ""),
      colorHex: s.colorHex || "",
    }));
  } catch (error) {
    console.error("CMS: getNerioFabricSwatches failed", error);
    return [];
  }
}

type DbFamily = NonNullable<Awaited<ReturnType<typeof prisma.fabricFamily.findFirst>>>;

type DbSwatch = NonNullable<
  Awaited<
    ReturnType<
      typeof prisma.fabricSwatch.findFirst<{
        include: {
          family: true;
          swatchImage: true;
          availabilities: { include: { productType: true } };
        };
      }>
    >
  >
>;

type DbProductType = NonNullable<Awaited<ReturnType<typeof prisma.fabricProductType.findFirst>>>;

function mapFamily(f: DbFamily): FrontendFabricFamily {
  return {
    id: f.id,
    slug: f.slug || "",
    name: f.name || "",
    description: f.description || "",
    eyebrow: f.eyebrow || "",
  };
}

function mapSwatch(s: DbSwatch): FrontendFabricSwatch {
  return {
    id: s.id,
    slug: s.slug || "",
    name: s.name || "",
    articleNumber: s.articleNumber || "",
    familyId: s.familyId || "",
    familySlug: s.family?.slug || "",
    familyName: s.family?.name || "",
    subtitle: s.subtitle || "",
    description: s.description || "",
    swatchImageUrl: getMediaUrl(s.swatchImage, ""),
    colorHex: s.colorHex || "",
    patternType: s.patternType || "",
    availableProductTypes: s.availabilities.map((a) => ({
      slug: a.productType?.slug || "",
      name: a.productType?.name || "",
      iconKey: a.productType?.iconKey || "",
      note: a.note || "",
    })),
  };
}

function mapProductType(pt: DbProductType): FrontendFabricProductType {
  return {
    id: pt.id,
    slug: pt.slug || "",
    name: pt.name || "",
    iconKey: pt.iconKey || "",
  };
}
