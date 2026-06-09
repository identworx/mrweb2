import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import MeasurementEditForm from "@/components/admin/MeasurementEditForm";
import { getSessionUser } from "@/lib/auth/session";

function parseVariants(raw: unknown): { label: string; value: string }[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (v): v is { label: string; value: string } =>
        typeof v === "object" && v !== null && typeof v.label === "string" && typeof v.value === "string",
    );
  }
  return [];
}

function parseNotes(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
  return [];
}

export default async function MeasurementEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [sessionUser, mediaAssets] = await Promise.all([
    getSessionUser(),
    prisma.mediaAsset.findMany({
      select: { id: true, url: true, alt: true, originalName: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const media = mediaAssets.map((m) => ({
    id: m.id,
    url: m.url,
    alt: m.alt,
    originalName: m.originalName,
  }));

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
            imageId: "",
            imageAlt: "",
            sourceNote: "",
            order: 0,
            rows: [],
            notes: [],
          }}
          mediaAssets={media}
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
          imageId: measurement.imageId ?? "",
          imageAlt: measurement.imageAlt ?? "",
          sourceNote: measurement.sourceNote ?? "",
          order: measurement.order,
          rows: parseVariants(measurement.variants),
          notes: parseNotes(measurement.notes),
        }}
        mediaAssets={media}
        userRole={sessionUser?.role ?? "VIEWER"}
        isActive={measurement.isActive}
      />
    </div>
  );
}
