import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import StatusFilter from "@/components/admin/StatusFilter";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  EDITOR: "Redakteur",
  VIEWER: "Betrachter",
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800",
  EDITOR: "bg-blue-100 text-blue-800",
  VIEWER: "bg-gray-100 text-gray-700",
};

const ROLE_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "ADMIN", label: "Admin" },
  { value: "EDITOR", label: "Redakteur" },
  { value: "VIEWER", label: "Betrachter" },
];

export default async function UsersListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: roleFilter } = await searchParams;
  const where = roleFilter && roleFilter !== "all"
    ? { role: roleFilter as "ADMIN" | "EDITOR" | "VIEWER" }
    : {};

  const [users, sessionUser] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
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
            Benutzer
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Benutzer</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} Benutzer verwalten.
          </p>
        </div>
        {userRole === "ADMIN" && (
          <Link
            href="/admin/users/new"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Neuer Benutzer
          </Link>
        )}
      </div>

      <StatusFilter
        basePath="/admin/users"
        current={roleFilter || "all"}
        options={ROLE_OPTIONS}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                E-Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rolle
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Erstellt am
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Keine Benutzer vorhanden.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    {user.name || "-"}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] ?? "bg-gray-100 text-gray-700"}`}>
                    {roleLabels[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.createdAt.toLocaleDateString("de-DE")}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/users/${user.id}`}
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
