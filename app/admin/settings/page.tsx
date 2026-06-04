import { prisma } from "@/lib/db/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <a href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </a>
          {" > "}
          Einstellungen
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Einstellungen</h1>
      </div>

      <SettingsForm
        settings={{
          siteName: settings?.siteName ?? "",
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
