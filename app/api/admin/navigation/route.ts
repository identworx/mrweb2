import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { revalidateNavigation } from "@/lib/server/revalidate-cms";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const menus = await prisma.navigationMenu.findMany({
      include: { items: { orderBy: { order: "asc" } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(menus);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Navigation" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, location, items } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Menu-ID fehlt" },
        { status: 400 },
      );
    }

    const menu = await prisma.$transaction(async (tx) => {
      await tx.navigationItem.deleteMany({ where: { menuId: id } });

      return tx.navigationMenu.update({
        where: { id },
        data: {
          name,
          location,
          items: {
            create: (items ?? []).map(
              (item: {
                label: string;
                linkType?: string;
                href: string;
                linkedPageId?: string;
                order: number;
                openInNewTab: boolean;
                isActive?: boolean;
              }) => ({
                label: item.label,
                linkType: item.linkType || "CUSTOM_URL",
                href: item.href || null,
                linkedPageId: item.linkedPageId || null,
                order: item.order,
                target: item.openInNewTab ? "_blank" : "_self",
                isActive: item.isActive ?? true,
              }),
            ),
          },
        },
        include: { items: { orderBy: { order: "asc" } } },
      });
    });

    revalidateNavigation();
    return NextResponse.json(menu);
  } catch (error) {
    console.error("Navigation update error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Navigation" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Navigationspunkte löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.$transaction(async (tx) => {
      await tx.navigationItem.updateMany({
        where: { parentId: id },
        data: { parentId: null },
      });
      await tx.navigationItem.delete({ where: { id } });
    });

    revalidateNavigation();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Navigationspunkts" }, { status: 500 });
  }
}
