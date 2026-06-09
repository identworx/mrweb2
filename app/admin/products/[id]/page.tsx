import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductEditForm from "@/components/admin/ProductEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  const isNew = id === "new";
  const [product, collections, productGroups, materials, mediaAssets, galleryRaw] = await Promise.all([
    isNew ? Promise.resolve(null) : prisma.product.findUnique({ where: { id } }),
    prisma.collection.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.productGroup.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.material.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.mediaAsset.findMany({ orderBy: { filename: "asc" }, select: { id: true, filename: true, url: true, alt: true } }),
    isNew ? Promise.resolve([]) : prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { order: "asc" },
      include: { mediaAsset: { select: { id: true, url: true, alt: true } } },
    }),
  ]);

  if (!isNew && !product) {
    redirect("/admin/products");
  }

  const galleryImages = galleryRaw
    .filter((img) => img.mediaAsset)
    .map((img) => ({
      id: img.id,
      mediaAssetId: img.mediaAsset!.id,
      url: img.mediaAsset!.url,
      alt: img.mediaAsset!.alt ?? null,
      order: img.order,
    }));

  const features = product && Array.isArray(product.features)
    ? (product.features as string[]).join("\n")
    : "";

  const productData = product
    ? {
        id: product.id,
        name: product.name,
        slug: product.slug,
        collectionId: product.collectionId,
        productGroupId: product.productGroupId,
        materialId: product.materialId ?? "",
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        code: product.code ?? "",
        size: product.size ?? "",
        colorName: product.colorName ?? "",
        patternName: product.patternName ?? "",
        features,
        heroImageId: product.heroImageId ?? "",
        mainImageId: product.mainImageId ?? "",
        status: product.status,
        seoTitle: product.seoTitle ?? "",
        seoDescription: product.seoDescription ?? "",
      }
    : {
        id: "",
        name: "",
        slug: "",
        collectionId: "",
        productGroupId: "",
        materialId: "",
        shortDescription: "",
        description: "",
        code: "",
        size: "",
        colorName: "",
        patternName: "",
        features: "",
        heroImageId: "",
        mainImageId: "",
        status: "DRAFT",
        seoTitle: "",
        seoDescription: "",
      };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin/products" className="hover:text-orange-600 transition-colors">
            Produkte
          </Link>
          {" > "}
          {isNew ? "Neues Produkt" : "Produkt bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neues Produkt erstellen" : productData.name}
        </h1>
      </div>

      <ProductEditForm
        product={productData}
        collections={collections}
        productGroups={productGroups}
        materials={materials}
        mediaAssets={mediaAssets}
        galleryImages={galleryImages}
        userRole={sessionUser?.role ?? "VIEWER"}
      />
    </div>
  );
}
