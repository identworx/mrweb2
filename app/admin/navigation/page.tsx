import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

const locationLabels: Record<string, string> = {
  HEADER: "Header",
  FOOTER: "Footer",
  SERVICE: "Service",
  LEGAL: "Rechtliches",
};

export default async function NavigationListPage() {
  const menus = await prisma.navigationMenu.findMany({
    include: { items: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          Navigation
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Navigation</h1>
        <p className="text-sm text-gray-500 mt-1">
          {menus.length} Navigationsmenüs verwalten und bearbeiten.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Einträge
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktualisiert
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {menus.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Navigationsmenüs vorhanden.
                </td>
              </tr>
            )}
            {menus.map((menu) => (
              <tr
                key={menu.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/navigation/${menu.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {menu.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {locationLabels[menu.location] ?? menu.location}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {menu.items.length}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {menu.updatedAt.toLocaleDateString("de-DE")}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/navigation/${menu.id}`}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
