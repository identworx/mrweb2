import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AmbienteEditForm from "@/components/admin/AmbienteEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function AmbienteEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessionUser = await getSessionUser();
  const isNew = id === "new";
  const [image, mediaAssets, slotRows] = await Promise.all([
    isNew
      ? Promise.resolve(null)
      : prisma.ambienteImage.findUnique({
          where: { id },
          include: { mediaAsset: { select: { id: true, url: true, alt: true, filename: true } } },
        }),
    prisma.mediaAsset.findMany({
      orderBy: { filename: "asc" },
      select: { id: true, filename: true, url: true, alt: true },
    }),
    prisma.ambienteImage.findMany({
      where: { teaserSlot: { not: null } },
      select: { id: true, title: true, teaserSlot: true },
    }),
  ]);

  if (!isNew && !image) {
    redirect("/admin/ambiente");
  }

  const formData = image
    ? {
        id: image.id,
        title: image.title,
        caption: image.caption ?? "",
        alt: image.alt ?? "",
        colorWorlds: Array.isArray(image.colorWorlds)
          ? (image.colorWorlds as string[])
          : [],
        featured: image.featured,
        teaserSlot: image.teaserSlot ?? "",
        isActive: image.isActive,
        order: image.order,
        mediaAssetId: image.mediaAssetId,
      }
    : {
        id: "",
        title: "",
        caption: "",
        alt: "",
        colorWorlds: [] as string[],
        featured: false,
        teaserSlot: "",
        isActive: true,
        order: 0,
        mediaAssetId: "",
      };

  const imagePreview = image?.mediaAsset ?? null;

  const existingSlots = slotRows
    .filter((r) => r.teaserSlot)
    .map((r) => ({ slot: r.teaserSlot!, title: r.title, id: r.id }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/ambiente" className="hover:text-orange-600 transition-colors">
            Ambiente-Galerie
          </Link>
          {" > "}
          {isNew ? "Neues Bild" : "Bild bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neues Ambiente-Bild" : formData.title}
        </h1>
      </div>

      <AmbienteEditForm
        image={formData}
        mediaAssets={mediaAssets}
        imagePreview={imagePreview}
        userRole={sessionUser?.role ?? "VIEWER"}
        existingSlots={existingSlots}
      />
    </div>
  );
}
