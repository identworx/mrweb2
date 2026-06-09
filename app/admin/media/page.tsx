import Link from "next/link";
import MediaBrowser from "@/components/admin/media/MediaBrowser";
import { getSessionUser } from "@/lib/auth/session";

export default async function MediaListPage() {
  const user = await getSessionUser();
  const userRole = user?.role ?? "VIEWER";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          Medien
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Medien</h1>
      </div>

      <MediaBrowser userRole={userRole} />
    </div>
  );
}
