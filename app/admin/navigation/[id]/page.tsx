import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import NavigationEditForm from "@/components/admin/NavigationEditForm";

export default async function NavigationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const menu = await prisma.navigationMenu.findUnique({
    where: { id },
    include: { items: { orderBy: { order: "asc" } } },
  });

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
            href: item.href ?? "",
            order: item.order,
            openInNewTab: item.target === "_blank",
          })),
        }}
      />
    </div>
  );
}
