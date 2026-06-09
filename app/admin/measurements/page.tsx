import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import ListActions from "@/components/admin/ListActions";
import StatusFilter from "@/components/admin/StatusFilter";

const ACTIVE_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "active", label: "Aktiv" },
  { value: "inactive", label: "Inaktiv" },
];

function countRows(variants: unknown): number {
  if (Array.isArray(variants)) return variants.length;
  return 0;
}

export default async function MeasurementsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const where = statusFilter === "active"
    ? { isActive: true }
    : statusFilter === "inactive"
      ? { isActive: false }
      : {};

  const [measurements, sessionUser] = await Promise.all([
    prisma.measurement.findMany({
      where,
      orderBy: { order: "asc" },
      include: { image: { select: { url: true, alt: true } } },
    }),
    getSessionUser(),
  ]);
  const userRole = sessionUser?.role ?? "VIEWER";

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
            {measurements.length} Produktmaße verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/measurements/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neues Produktmaß
        </Link>
      </div>

      <StatusFilter
        basePath="/admin/measurements"
        current={statusFilter || "all"}
        options={ACTIVE_OPTIONS}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                Bild
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Gruppe
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Zeilen
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ord.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {measurements.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Produktmaße vorhanden.
                </td>
              </tr>
            )}
            {measurements.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {m.image ? (
                    <img
                      src={m.image.url}
                      alt={m.image.alt || m.title}
                      className="w-12 h-12 object-contain rounded border border-gray-200 bg-gray-50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                      <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 16l5-5 4 4 4-6 5 7" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/measurements/${m.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {m.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                  {m.slug}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {m.groupSlug || "–"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {countRows(m.variants)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {m.order}
                </td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3">
                  <ListActions
                    entityId={m.id}
                    entityName={m.title}
                    apiEndpoint="/api/admin/measurements"
                    editHref={`/admin/measurements/${m.id}`}
                    deactivateAction={{ isActive: m.isActive }}
                    userRole={userRole}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
