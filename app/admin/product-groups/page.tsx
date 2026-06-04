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

export default async function ProductGroupsListPage({
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

  const [productGroups, sessionUser] = await Promise.all([
    prisma.productGroup.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
    getSessionUser(),
  ]);
  const userRole = sessionUser?.role ?? "VIEWER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produktgruppen</h1>
          <p className="text-sm text-gray-500 mt-1">
            {productGroups.length} Produktgruppen verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/product-groups/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neue Produktgruppe
        </Link>
      </div>

      <StatusFilter
        basePath="/admin/product-groups"
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
                Beschreibung
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Reihenfolge
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Produkte
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productGroups.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Produktgruppen vorhanden.
                </td>
              </tr>
            )}
            {productGroups.map((group) => (
              <tr
                key={group.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/product-groups/${group.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {group.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {group.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {group.description || "--"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {group.order}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      group.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {group.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {group._count.products}
                </td>
                <td className="px-6 py-4">
                  <ListActions
                    entityId={group.id}
                    entityName={group.name}
                    apiEndpoint="/api/admin/product-groups"
                    editHref={`/admin/product-groups/${group.id}`}
                    deactivateAction={{ isActive: group.isActive }}
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
