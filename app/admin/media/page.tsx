import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaListPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <a href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </a>
            {" > "}
            Medien
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Medien</h1>
          <p className="text-sm text-gray-500 mt-1">
            Alle Medien verwalten und hochladen.
          </p>
        </div>
        <Link
          href="/admin/media/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Hochladen
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 px-6 py-12 text-center text-sm text-gray-400">
          Keine Medien vorhanden.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <Link
              key={asset.id}
              href={`/admin/media/${asset.id}`}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-300 transition-colors group"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {asset.mimeType.startsWith("image/") ? (
                  <img
                    src={asset.url}
                    alt={asset.alt ?? asset.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="text-gray-400 text-sm font-medium">
                    {asset.mimeType.split("/")[1]?.toUpperCase() ?? "Datei"}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {asset.filename}
                </p>
                {asset.alt && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{asset.alt}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatFileSize(asset.size)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
