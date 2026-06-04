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

export default async function MaterialsListPage({
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

  const [materials, sessionUser] = await Promise.all([
    prisma.material.findMany({ where, orderBy: { order: "asc" } }),
    getSessionUser(),
  ]);
  const userRole = sessionUser?.role ?? "VIEWER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <a href="/admin" className="hover:text-orange-600 transition-colors">
              Dashboard
            </a>
            {" > "}
            Materialien
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Materialien</h1>
          <p className="text-sm text-gray-500 mt-1">
            {materials.length} Materialien verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/materials/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neues Material
        </Link>
      </div>

      <StatusFilter
        basePath="/admin/materials"
        current={statusFilter || "all"}
        options={ACTIVE_OPTIONS}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Zusammensetzung
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Gewicht
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Reihenfolge
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {materials.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Materialien vorhanden.
                </td>
              </tr>
            )}
            {materials.map((material) => (
              <tr
                key={material.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/materials/${material.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {material.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {material.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {material.materialComp}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {material.weight}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      material.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {material.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {material.order}
                </td>
                <td className="px-6 py-4">
                  <ListActions
                    entityId={material.id}
                    entityName={material.name}
                    apiEndpoint="/api/admin/materials"
                    editHref={`/admin/materials/${material.id}`}
                    deactivateAction={{ isActive: material.isActive }}
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
