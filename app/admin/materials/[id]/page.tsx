import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import MaterialEditForm from "@/components/admin/MaterialEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function MaterialEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  if (id === "new") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </Link>
            {" > "}
            <Link href="/admin/materials" className="hover:text-orange-600 transition-colors">
              Materialien
            </Link>
            {" > "}
            Neues Material
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Neues Material</h1>
        </div>

        <MaterialEditForm
          material={{
            id: "",
            name: "",
            slug: "",
            subtitle: "",
            materialComp: "",
            weight: "",
            dyeing: "",
            comfort: "",
            order: 0,
          }}
          userRole={sessionUser?.role ?? "VIEWER"}
          productCount={0}
          isActive={true}
        />
      </div>
    );
  }

  const material = await prisma.material.findUnique({ where: { id } });

  if (!material) {
    redirect("/admin/materials");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/materials" className="hover:text-orange-600 transition-colors">
            Materialien
          </Link>
          {" > "}
          Material bearbeiten
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{material.name}</h1>
      </div>

      <MaterialEditForm
        material={{
          id: material.id,
          name: material.name,
          slug: material.slug,
          subtitle: material.subtitle ?? "",
          materialComp: material.materialComp ?? "",
          weight: material.weight ?? "",
          dyeing: material.dyeing ?? "",
          comfort: material.comfort ?? "",
          order: material.order,
        }}
        userRole={sessionUser?.role ?? "VIEWER"}
        productCount={await prisma.product.count({ where: { materialId: material.id } })}
        isActive={material.isActive}
      />
    </div>
  );
}
