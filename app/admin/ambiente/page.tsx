import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import Link from "next/link";
import Image from "next/image";
import ListActions from "@/components/admin/ListActions";

const COLOR_WORLD_LABELS: Record<string, string> = {
  green: "Green",
  blue: "Blue",
  earth: "Earth & Grey",
  golden: "Golden",
};

export default async function AmbienteListPage() {
  const [images, sessionUser] = await Promise.all([
    prisma.ambienteImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        mediaAsset: { select: { url: true, filename: true } },
      },
    }),
    getSessionUser(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </Link>
            {" > "}
            Ambiente-Galerie
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Ambiente-Galerie
          </h1>
        </div>
        <Link
          href="/admin/ambiente/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          + Neues Bild
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {images.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Noch keine Ambiente-Bilder vorhanden.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bild</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Titel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Farbwelten
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                  Mosaik
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Nr.
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {images.map((img) => {
                const worlds = Array.isArray(img.colorWorlds)
                  ? (img.colorWorlds as string[])
                  : [];
                return (
                  <tr key={img.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={img.mediaAsset.url}
                          alt={img.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/ambiente/${img.id}`}
                        className="text-gray-900 font-medium hover:text-orange-600 transition-colors"
                      >
                        {img.title}
                      </Link>
                      {img.caption && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                          {img.caption}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {worlds.map((w) => (
                          <span
                            key={w}
                            className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-gray-100 text-gray-600"
                          >
                            {COLOR_WORLD_LABELS[w] || w}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {img.teaserSlot ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-orange-50 text-orange-700">
                          {img.teaserSlot}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${
                          img.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {img.isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 hidden sm:table-cell">
                      {img.order}
                    </td>
                    <td className="px-4 py-3">
                      <ListActions
                        entityId={img.id}
                        entityName={img.title}
                        apiEndpoint="/api/admin/ambiente"
                        editHref={`/admin/ambiente/${img.id}`}
                        deactivateAction={{ isActive: img.isActive }}
                        userRole={sessionUser?.role ?? "VIEWER"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
