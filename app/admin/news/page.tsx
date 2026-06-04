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

const STATUS_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "PUBLISHED", label: "Veröffentlicht" },
  { value: "DRAFT", label: "Entwurf" },
  { value: "ARCHIVED", label: "Archiviert" },
];

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const where = statusFilter && statusFilter !== "all"
    ? { status: statusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
    : {};

  const [articles, sessionUser] = await Promise.all([
    prisma.newsArticle.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [
        { publishedAt: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
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
            Neuigkeiten
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Neuigkeiten</h1>
          <p className="text-sm text-gray-500 mt-1">
            {articles.length} News-Beiträge verwalten.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Neuer Artikel
        </Link>
      </div>

      <StatusFilter
        basePath="/admin/news"
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
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Veröffentlicht
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine News-Beiträge vorhanden.
                </td>
              </tr>
            )}
            {articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/news/${article.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  /{article.slug}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.category || "–"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[article.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.publishedAt
                    ? article.publishedAt.toLocaleDateString("de-DE")
                    : "–"}
                </td>
                <td className="px-6 py-4">
                  <ListActions
                    entityId={article.id}
                    entityName={article.title}
                    apiEndpoint="/api/admin/news"
                    editHref={`/admin/news/${article.id}`}
                    archiveAction={{ currentStatus: article.status }}
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
