import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import FooterEditForm from "@/components/admin/FooterEditForm";

export default async function FooterPage() {
  const settings = await prisma.footerSettings.findUnique({
    where: { id: "footer-settings" },
    include: { logoMedia: { select: { id: true, url: true, alt: true } } },
  });

  const socialLinks: { platform: string; url: string }[] = settings?.socialLinks
    ? (settings.socialLinks as { platform: string; url: string }[])
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          Footer
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Footer</h1>
        <p className="text-sm text-gray-500 mt-1">
          Footer-Einstellungen bearbeiten.
        </p>
      </div>

      <FooterEditForm
        settings={{
          logoMediaId: settings?.logoMediaId ?? "",
          logoMediaUrl: settings?.logoMedia?.url ?? null,
          logoMediaAlt: settings?.logoMedia?.alt ?? null,
          description: settings?.description ?? "",
          copyrightText: settings?.copyrightText ?? "",
          socialLinks,
        }}
      />
    </div>
  );
}
