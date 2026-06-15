import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import FabricAdminList from "@/components/admin/FabricAdminList";

export default async function FabricsAdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [swatches, families, productTypes] = await Promise.all([
    prisma.fabricSwatch.findMany({
      orderBy: [{ family: { order: "asc" } }, { order: "asc" }],
      include: {
        family: true,
        swatchImage: true,
        availabilities: { include: { productType: true } },
      },
    }),
    prisma.fabricFamily.findMany({ orderBy: { order: "asc" } }),
    prisma.fabricProductType.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <FabricAdminList
      swatches={swatches.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        articleNumber: s.articleNumber || "",
        familyId: s.familyId,
        familyName: s.family.name,
        colorHex: s.colorHex || "",
        swatchImageUrl: s.swatchImage?.url || "",
        isActive: s.isActive,
        availabilityCount: s.availabilities.filter((a) => a.isAvailable).length,
      }))}
      families={families.map((f) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        description: f.description || "",
        eyebrow: f.eyebrow || "",
        subtitle: f.subtitle || "",
        material: f.material || "",
        weight: f.weight || "",
        dyeing: f.dyeing || "",
        comfort: f.comfort || "",
        cushionThickness: f.cushionThickness || "",
        hubHighlights: f.hubHighlights || "",
        isHighlighted: f.isHighlighted,
        order: f.order,
        isActive: f.isActive,
      }))}
      productTypes={productTypes.map((pt) => ({
        id: pt.id,
        name: pt.name,
        slug: pt.slug,
        iconKey: pt.iconKey || "",
        order: pt.order,
        isActive: pt.isActive,
      }))}
      userRole={user.role}
    />
  );
}
