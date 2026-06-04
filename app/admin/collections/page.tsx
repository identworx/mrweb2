import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import ListActions from "@/components/admin/ListActions";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

export default async function CollectionsListPage() {
  const [collections, sessionUser] = await Promise.all([
    prisma.collection.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
        cardImage: { select: { url: true } },
      },
    }),
    getSessionUser(),
  ]);
  const userRole = sessionUser?.role ?? "VIEWER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kollektionen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Alle Kollektionen verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neue Kollektion
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Bild
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Produkte
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Farben
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nr.
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collections.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Kollektionen vorhanden.
                </td>
              </tr>
            )}
            {collections.map((collection) => {
              const colors = Array.isArray(collection.moodColors)
                ? (collection.moodColors as string[])
                : [];
              const cardUrl =
                collection.cardImage?.url ||
                `/images/placeholders/collections/${collection.slug}.svg`;

              return (
                <tr
                  key={collection.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-16 h-10 rounded overflow-hidden bg-gray-100">
                      <img
                        src={cardUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/collections/${collection.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      {collection.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    /{collection.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[collection.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {collection.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {collection._count.products}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      {colors.length === 0 && (
                        <span className="text-xs text-gray-400">--</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {collection.order}
                  </td>
                  <td className="px-6 py-4">
                    <ListActions
                      entityId={collection.id}
                      entityName={collection.name}
                      apiEndpoint="/api/admin/collections"
                      editHref={`/admin/collections/${collection.id}`}
                      viewHref={`/kollektionen/${collection.slug}`}
                      archiveAction={{ currentStatus: collection.status }}
                      userRole={userRole}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
