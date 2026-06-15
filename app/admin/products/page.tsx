import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import ProductAdminList from "@/components/admin/ProductAdminList";

export default async function ProductsListPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [products, collections, productGroups, materials] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        collection: { select: { id: true, name: true } },
        productGroup: { select: { id: true, name: true } },
        material: { select: { id: true, name: true } },
        mainImage: { select: { url: true, normalizedUrl: true } },
        images: { select: { id: true } },
      },
    }),
    prisma.collection.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    prisma.productGroup.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    prisma.material.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code || "",
    colorName: p.colorName || "",
    patternName: p.patternName || "",
    status: p.status,
    collectionId: p.collectionId,
    collectionName: p.collection.name,
    productGroupId: p.productGroupId,
    productGroupName: p.productGroup.name,
    materialId: p.materialId || "",
    materialName: p.material?.name || "",
    mainImageUrl: p.mainImage?.normalizedUrl || p.mainImage?.url || "",
    galleryCount: p.images.length,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produkte</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} Produkte verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neues Produkt
        </Link>
      </div>

      <ProductAdminList
        products={rows}
        collections={collections}
        productGroups={productGroups}
        materials={materials}
        userRole={user.role}
      />
    </div>
  );
}
