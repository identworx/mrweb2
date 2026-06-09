import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
    include: { logoMedia: { select: { id: true, url: true, alt: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          Einstellungen
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Einstellungen</h1>
      </div>

      <SettingsForm
        settings={{
          siteName: settings?.siteName ?? "",
          logoMediaId: settings?.logoMediaId ?? "",
          logoMediaUrl: settings?.logoMedia?.url ?? null,
          logoMediaAlt: settings?.logoMedia?.alt ?? null,
          primaryColor: settings?.primaryColor ?? "#ea580c",
          secondaryColor: settings?.secondaryColor ?? "#1f2937",
          contactEmail: settings?.contactEmail ?? "",
          defaultSeoTitle: settings?.defaultSeoTitle ?? "",
          defaultSeoDescription: settings?.defaultSeoDescription ?? "",
        }}
      />
    </div>
  );
}
