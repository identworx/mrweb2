import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductGroupEditForm from "@/components/admin/ProductGroupEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function ProductGroupEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessionUser = await getSessionUser();
  const isNew = id === "new";
  const [productGroup, mediaAssets] = await Promise.all([
    isNew ? Promise.resolve(null) : prisma.productGroup.findUnique({ where: { id } }),
    prisma.mediaAsset.findMany({ orderBy: { filename: "asc" }, select: { id: true, filename: true, url: true, alt: true } }),
  ]);

  if (!isNew && !productGroup) {
    redirect("/admin/product-groups");
  }

  const groupData = productGroup
    ? {
        id: productGroup.id,
        name: productGroup.name,
        slug: productGroup.slug,
        description: productGroup.description ?? "",
        iconId: productGroup.iconId ?? "",
        imageId: productGroup.imageId ?? "",
        order: productGroup.order,
        isActive: productGroup.isActive,
      }
    : {
        id: "",
        name: "",
        slug: "",
        description: "",
        iconId: "",
        imageId: "",
        order: 0,
        isActive: true,
      };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin/product-groups" className="hover:text-orange-600 transition-colors">
            Produktgruppen
          </Link>
          {" > "}
          {isNew ? "Neue Produktgruppe" : "Produktgruppe bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neue Produktgruppe erstellen" : groupData.name}
        </h1>
      </div>

      <ProductGroupEditForm
        productGroup={groupData}
        mediaAssets={mediaAssets}
        userRole={sessionUser?.role ?? "VIEWER"}
        productCount={productGroup ? await prisma.product.count({ where: { productGroupId: productGroup.id } }) : 0}
      />
    </div>
  );
}
