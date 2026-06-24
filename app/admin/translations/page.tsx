import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import TranslationsManager from "@/components/admin/TranslationsManager";

export default async function TranslationsPage() {
  const translations = await prisma.contentTranslation.findMany({
    where: { locale: "en" },
    orderBy: [{ entityType: "asc" }, { fieldName: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          Übersetzungen
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Übersetzungen</h1>
        <p className="text-sm text-gray-500 mt-1">
          Englische Übersetzungen für CMS-Inhalte verwalten. Deutsche Inhalte sind Master.
        </p>
      </div>

      <TranslationsManager
        initialTranslations={translations.map((t) => ({
          ...t,
          updatedAt: t.updatedAt.toISOString(),
          createdAt: undefined as never,
        }))}
      />
    </div>
  );
}
