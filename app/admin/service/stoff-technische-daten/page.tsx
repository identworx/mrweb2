import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

const PAGE_SLUG = "stoff-technische-daten";

export default async function StoffTechnischeDatenPage() {
  const page = await prisma.page.findUnique({ where: { slug: PAGE_SLUG } });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          Stoff- &amp; technische Daten
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Stoff- &amp; technische Daten</h1>
        <p className="text-sm text-gray-500 mt-1">
          Service-Seite für Stoff- und technische Daten.
        </p>
      </div>

      {page ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Titel</p>
              <p className="text-sm text-gray-900 mt-1">{page.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</p>
              <p className="text-sm text-gray-500 mt-1">/{page.slug}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  page.status === "PUBLISHED"
                    ? "bg-green-100 text-green-800"
                    : page.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {page.status}
              </span>
            </div>
            {page.headline && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Headline</p>
                <p className="text-sm text-gray-900 mt-1">{page.headline}</p>
              </div>
            )}
            {page.seoTitle && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO-Titel</p>
                <p className="text-sm text-gray-500 mt-1">{page.seoTitle}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <Link
              href={`/admin/pages/${page.id}`}
              className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Im Seiteneditor bearbeiten
            </Link>
            <a
              href="/kataloge/stoff-technische-daten"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors"
            >
              Öffentliche Seite ansehen ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm text-yellow-800">
            Service-Seite &bdquo;Stoff- &amp; technische Daten&ldquo; wurde noch nicht in der Datenbank gefunden (Slug: {PAGE_SLUG}).
          </p>
          <Link
            href="/admin/pages"
            className="inline-flex items-center mt-4 px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Zur Seitenverwaltung
          </Link>
        </div>
      )}
    </div>
  );
}
