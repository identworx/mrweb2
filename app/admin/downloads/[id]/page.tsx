import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import DownloadEditForm from "@/components/admin/DownloadEditForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function DownloadEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sessionUser = await getSessionUser();
  const isNew = id === "new";
  const [download, mediaAssets] = await Promise.all([
    isNew ? Promise.resolve(null) : prisma.download.findUnique({ where: { id } }),
    prisma.mediaAsset.findMany({ orderBy: { filename: "asc" }, select: { id: true, filename: true } }),
  ]);

  if (!isNew && !download) {
    redirect("/admin/downloads");
  }

  const downloadData = download
    ? {
        id: download.id,
        title: download.title,
        description: download.description ?? "",
        type: download.type ?? "",
        fileUrl: download.fileUrl ?? "",
        externalUrl: download.externalUrl ?? "",
        language: download.language ?? "",
        imageId: download.imageId ?? "",
        buttonLabel: download.buttonLabel ?? "",
        opensInNewTab: download.opensInNewTab,
        order: download.order,
      }
    : {
        id: "",
        title: "",
        description: "",
        type: "",
        fileUrl: "",
        externalUrl: "",
        language: "",
        imageId: "",
        buttonLabel: "",
        opensInNewTab: false,
        order: 0,
      };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/downloads" className="hover:text-orange-600 transition-colors">
            Kataloge &amp; Downloads
          </Link>
          {" > "}
          {isNew ? "Neuer Download" : "Download bearbeiten"}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {isNew ? "Neuer Download" : downloadData.title}
        </h1>
      </div>

      <DownloadEditForm
        download={downloadData}
        mediaAssets={mediaAssets}
        userRole={sessionUser?.role ?? "VIEWER"}
        isActive={download?.isActive ?? true}
      />
    </div>
  );
}
