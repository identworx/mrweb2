import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import ListActions from "@/components/admin/ListActions";
import StatusFilter from "@/components/admin/StatusFilter";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  PUBLISHED: "Veröffentlicht",
  DRAFT: "Entwurf",
  ARCHIVED: "Archiviert",
};

const typeLabels: Record<string, string> = {
  HOME: "Startseite",
  STANDARD: "Standardseite",
  COLLECTION_INDEX: "Kollektionsübersicht",
  COLLECTION_DETAIL: "Kollektionsdetail",
  MATERIAL_INDEX: "Materialübersicht",
  CATALOG_INDEX: "Katalogübersicht",
  SERVICE: "Serviceseite",
  NEWS_INDEX: "Neuigkeiten",
  CONTACT: "Kontaktseite",
  LEGAL: "Rechtliche Seite",
};

const STATUS_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "PUBLISHED", label: "Veröffentlicht" },
  { value: "DRAFT", label: "Entwurf" },
  { value: "ARCHIVED", label: "Archiviert" },
];

export default async function PagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const where = statusFilter && statusFilter !== "all"
    ? { status: statusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
    : {};

  const [pages, sessionUser] = await Promise.all([
    prisma.page.findMany({
      where,
      orderBy: { title: "asc" },
      include: {
        _count: { select: { sections: true } },
        sections: { where: { isActive: true }, select: { id: true } },
      },
    }),
    getSessionUser(),
  ]);
  const userRole = sessionUser?.role ?? "VIEWER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seiten</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pages.length} Seiten verwalten und bearbeiten.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neue Seite
        </Link>
      </div>

      <StatusFilter
        basePath="/admin/pages"
        current={statusFilter || "all"}
        options={STATUS_OPTIONS}
      />

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
                Typ
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sektionen
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
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
            {pages.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Seiten vorhanden.
                </td>
              </tr>
            )}
            {pages.map((page) => (
              <tr
                key={page.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {page.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  /{page.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {typeLabels[page.type] ?? page.type}
                  {page.type === "LEGAL" && (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800" title="Rechtlich erforderliche Seite — kann nicht archiviert oder gelöscht werden">
                      Geschützt
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {page._count.sections > 0 ? (
                    <span>
                      {page.sections.length} / {page._count.sections}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[page.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {statusLabels[page.status] ?? page.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {page.updatedAt.toLocaleDateString("de-DE")}
                </td>
                <td className="px-6 py-4">
                  <ListActions
                    entityId={page.id}
                    entityName={page.title}
                    apiEndpoint="/api/admin/pages"
                    editHref={`/admin/pages/${page.id}`}
                    archiveAction={page.type !== "LEGAL" ? { currentStatus: page.status } : undefined}
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
