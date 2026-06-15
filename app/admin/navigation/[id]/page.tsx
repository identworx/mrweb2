import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import NavigationEditForm from "@/components/admin/NavigationEditForm";
import type { LinkType } from "@/lib/cms/nav-constants";

export default async function NavigationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [menu, pages] = await Promise.all([
    prisma.navigationMenu.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
          include: { linkedPage: { select: { id: true, slug: true, title: true, status: true } } },
        },
      },
    }),
    prisma.page.findMany({
      select: { id: true, slug: true, title: true, status: true },
      orderBy: { title: "asc" },
    }),
  ]);

  if (!menu) {
    redirect("/admin/navigation");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/admin" className="hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          {" > "}
          <Link href="/admin/navigation" className="hover:text-orange-600 transition-colors">
            Navigation
          </Link>
          {" > "}
          Bearbeiten
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{menu.name}</h1>
      </div>

      <NavigationEditForm
        menu={{
          id: menu.id,
          name: menu.name,
          location: menu.location,
          items: menu.items.map((item) => ({
            id: item.id,
            label: item.label,
            linkType: (item.linkType || "CUSTOM_URL") as LinkType,
            href: item.href ?? "",
            linkedPageId: item.linkedPageId ?? "",
            order: item.order,
            openInNewTab: item.target === "_blank",
            isActive: item.isActive,
            pageStatus: item.linkedPage?.status ?? null,
            badgeText: item.badgeText ?? "",
            badgeVariant: item.badgeVariant ?? "blue",
          })),
        }}
        pages={pages}
      />
    </div>
  );
}
