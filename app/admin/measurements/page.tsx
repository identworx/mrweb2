import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function MeasurementsListPage() {
  const measurements = await prisma.measurement.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </Link>
            {" > "}
            Produktmaße
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Produktmaße</h1>
          <p className="text-sm text-gray-500 mt-1">
            Produktmaße und technische Maßdaten verwalten.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        Der vollständige Produktmaß-Editor folgt in einer nächsten Phase.
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Gruppe
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Zeichnungstyp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nr.
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {measurements.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Produktmaße vorhanden.
                </td>
              </tr>
            )}
            {measurements.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {m.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.groupSlug || "–"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.drawingType || "–"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.order}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
