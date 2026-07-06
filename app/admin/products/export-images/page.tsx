import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import ImageExportForm from "@/components/admin/ImageExportForm";

export default async function ExportImagesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [collections, productGroups, productCount] = await Promise.all([
    prisma.collection.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.productGroup.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link
            href="/admin/products"
            className="hover:text-orange-600 transition-colors"
          >
            Produkte
          </Link>
          {" > "}
          Bildexport
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Produktbilder als PNG exportieren
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {productCount} Produkte im System. WebP-Bilder werden als PNG mit
          Transparenz exportiert.
        </p>
      </div>

      <ImageExportForm
        collections={collections}
        productGroups={productGroups}
      />
    </div>
  );
}
