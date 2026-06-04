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

export default async function DownloadsListPage({
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

  const [downloads, sessionUser] = await Promise.all([
    prisma.download.findMany({ where, orderBy: { order: "asc" } }),
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
            Kataloge &amp; Downloads
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Kataloge &amp; Downloads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {downloads.length} Downloads verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/downloads/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neuer Download
        </Link>
      </div>

      <StatusFilter
        basePath="/admin/downloads"
        current={statusFilter || "all"}
        options={ACTIVE_OPTIONS}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sprache
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Reihenfolge
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {downloads.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Downloads vorhanden.
                </td>
              </tr>
            )}
            {downloads.map((dl) => (
              <tr
                key={dl.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/downloads/${dl.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {dl.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dl.type || "–"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dl.language || "–"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {dl.externalUrl || dl.fileUrl || "–"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {dl.order}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dl.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {dl.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ListActions
                    entityId={dl.id}
                    entityName={dl.title}
                    apiEndpoint="/api/admin/downloads"
                    editHref={`/admin/downloads/${dl.id}`}
                    deactivateAction={{ isActive: dl.isActive }}
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
