import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CollectionEditForm from "@/components/admin/CollectionEditForm";

export default async function CollectionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const isNew = id === "new";
  const collection = isNew ? null : await prisma.collection.findUnique({ where: { id } });

  if (!isNew && !collection) {
    redirect("/admin/collections");
  }

  const moodColors = collection && Array.isArray(collection.moodColors)
    ? (collection.moodColors as string[])
    : [];

  const collectionData = collection
    ? {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        number: collection.number ?? 0,
        subtitle: collection.subtitle ?? "",
        shortDescription: collection.shortDescription ?? "",
        longDescription: collection.longDescription ?? "",
        moodColors: moodColors.join(", "),
        fabric: collection.fabric ?? "",
        status: collection.status,
        seoTitle: collection.seoTitle ?? "",
        seoDescription: collection.seoDescription ?? "",
        order: collection.order,
      }
    : {
        id: "",
        name: "",
        slug: "",
        number: 0,
        subtitle: "",
        shortDescription: "",
        longDescription: "",
        moodColors: "",
        fabric: "",
        status: "DRAFT",
        seoTitle: "",
        seoDescription: "",
        order: 0,
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

      <CollectionEditForm collection={collectionData} />
    </div>
  );
}
