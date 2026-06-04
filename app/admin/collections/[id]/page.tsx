import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CollectionEditForm from "@/components/admin/CollectionEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function CollectionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessionUser = await getSessionUser();
  const isNew = id === "new";
  const [collection, mediaAssets] = await Promise.all([
    isNew ? null : prisma.collection.findUnique({ where: { id } }),
    prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, alt: true, originalName: true },
    }),
  ]);

  if (!isNew && !collection) {
    redirect("/admin/collections");
  }

  const moodColors =
    collection && Array.isArray(collection.moodColors)
      ? (collection.moodColors as string[])
      : [];

  const collectionData = collection
    ? {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        number: collection.number ?? 0,
        eyebrow: collection.eyebrow ?? "",
        subtitle: collection.subtitle ?? "",
        shortDescription: collection.shortDescription ?? "",
        longDescription: collection.longDescription ?? "",
        moodColors,
        fabric: collection.fabric ?? "",
        status: collection.status,
        seoTitle: collection.seoTitle ?? "",
        seoDescription: collection.seoDescription ?? "",
        order: collection.order,
        heroImageId: collection.heroImageId ?? "",
        cardImageId: collection.cardImageId ?? "",
      }
    : {
        id: "",
        name: "",
        slug: "",
        number: 0,
        eyebrow: "",
        subtitle: "",
        shortDescription: "",
        longDescription: "",
        moodColors: [],
        fabric: "",
        status: "DRAFT",
        seoTitle: "",
        seoDescription: "",
        order: 0,
        heroImageId: "",
        cardImageId: "",
      };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin/collections" className="hover:text-orange-600 transition-colors">
            Kollektionen
          </Link>
          {" > "}
          {isNew ? "Neue Kollektion" : "Kollektion bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neue Kollektion erstellen" : collectionData.name}
        </h1>
      </div>

      <CollectionEditForm
        collection={collectionData}
        mediaAssets={mediaAssets}
        userRole={sessionUser?.role ?? "VIEWER"}
        productCount={collection ? await prisma.product.count({ where: { collectionId: collection.id } }) : 0}
      />
    </div>
  );
}
