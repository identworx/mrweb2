import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import MeasurementEditForm from "@/components/admin/MeasurementEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function MeasurementEditPage({
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
            <Link href="/admin/measurements" className="hover:text-orange-600 transition-colors">
              Produktmaße
            </Link>
            {" > "}
            Neues Produktmaß
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Neues Produktmaß</h1>
        </div>

        <MeasurementEditForm
          measurement={{
            id: "",
            title: "",
            slug: "",
            groupSlug: "",
            drawingType: "",
            sourceNote: "",
            order: 0,
            variants: "[]",
            notes: "[]",
          }}
          userRole={sessionUser?.role ?? "VIEWER"}
          isActive={true}
        />
      </div>
    );
  }

  const measurement = await prisma.measurement.findUnique({ where: { id } });

  if (!measurement) {
    redirect("/admin/measurements");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/measurements" className="hover:text-orange-600 transition-colors">
            Produktmaße
          </Link>
          {" > "}
          Produktmaß bearbeiten
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{measurement.title}</h1>
      </div>

      <MeasurementEditForm
        measurement={{
          id: measurement.id,
          title: measurement.title,
          slug: measurement.slug,
          groupSlug: measurement.groupSlug ?? "",
          drawingType: measurement.drawingType ?? "",
          sourceNote: measurement.sourceNote ?? "",
          order: measurement.order,
          variants: measurement.variants ? JSON.stringify(measurement.variants, null, 2) : "[]",
          notes: measurement.notes ? JSON.stringify(measurement.notes, null, 2) : "[]",
        }}
        userRole={sessionUser?.role ?? "VIEWER"}
        isActive={measurement.isActive}
      />
    </div>
  );
}
