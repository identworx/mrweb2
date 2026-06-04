import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function SubmissionsListPage() {
  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: { form: { select: { name: true } } },
  });

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <a href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </a>
          {" > "}
          <span className="text-gray-400">Formulare</span>
          {" > "}
          Anfragen
        </p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl font-bold text-gray-900">Anfragen</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {unreadCount} ungelesen
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                E-Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Anfragen vorhanden.
                </td>
              </tr>
            )}
            {submissions.map((submission) => {
              const data = JSON.parse(String(submission.data)) as Record<string, string>;
              return (
                <tr
                  key={submission.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <Link
                      href={`/admin/forms/submissions/${submission.id}`}
                      className="hover:text-orange-600 transition-colors"
                    >
                      {submission.createdAt.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/forms/submissions/${submission.id}`}
                      className={`text-sm transition-colors hover:text-orange-600 ${
                        submission.isRead
                          ? "text-gray-900"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {data.name || data.Name || "-"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {data.email || data.Email || data["e-mail"] || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.isRead
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {submission.isRead ? "gelesen" : "ungelesen"}
                    </span>
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
