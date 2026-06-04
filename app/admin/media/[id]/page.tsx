import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import MediaEditForm from "@/components/admin/MediaEditForm";

export default async function MediaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </Link>
            {" > "}
            <Link href="/admin/media" className="hover:text-orange-600 transition-colors">
              Medien
            </Link>
            {" > "}
            Hochladen
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Medium hochladen</h1>
        </div>

        <MediaEditForm asset={null} />
      </div>
    );
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });

  if (!asset) {
    redirect("/admin/media");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/media" className="hover:text-orange-600 transition-colors">
            Medien
          </Link>
          {" > "}
          Medium bearbeiten
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{asset.filename}</h1>
      </div>

      <MediaEditForm
        asset={{
          id: asset.id,
          filename: asset.filename,
          url: asset.url,
          alt: asset.alt ?? "",
          caption: asset.caption ?? "",
          mimeType: asset.mimeType,
          size: asset.size,
        }}
      />
    </div>
  );
}
