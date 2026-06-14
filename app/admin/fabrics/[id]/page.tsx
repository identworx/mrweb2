import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import FabricSwatchEditForm from "@/components/admin/FabricSwatchEditForm";

export default async function FabricEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const isNew = id === "new";

  const [swatch, families, productTypes] = await Promise.all([
    isNew
      ? null
      : prisma.fabricSwatch.findUnique({
          where: { id },
          include: {
            swatchImage: true,
            availabilities: { include: { productType: true } },
          },
        }),
    prisma.fabricFamily.findMany({ orderBy: { order: "asc" } }),
    prisma.fabricProductType.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!isNew && !swatch) redirect("/admin/fabrics");

  return (
    <AdminShell user={{ id: user.id, name: user.name, email: user.email, role: user.role }}>
      <FabricSwatchEditForm
        swatch={
          swatch
            ? {
                id: swatch.id,
                name: swatch.name,
                slug: swatch.slug,
                familyId: swatch.familyId,
                articleNumber: swatch.articleNumber || "",
                subtitle: swatch.subtitle || "",
                description: swatch.description || "",
                swatchImageId: swatch.swatchImageId || "",
                swatchImageUrl: swatch.swatchImage?.url || "",
                colorHex: swatch.colorHex || "",
                patternType: swatch.patternType || "",
                order: swatch.order,
                isActive: swatch.isActive,
                availabilities: swatch.availabilities.map((a) => ({
                  productTypeId: a.productTypeId,
                  productTypeName: a.productType.name,
                  isAvailable: a.isAvailable,
                  note: a.note || "",
                })),
              }
            : null
        }
        families={families.map((f) => ({ id: f.id, name: f.name }))}
        productTypes={productTypes.map((pt) => ({
          id: pt.id,
          name: pt.name,
          slug: pt.slug,
        }))}
        userRole={user.role}
      />
    </AdminShell>
  );
}
