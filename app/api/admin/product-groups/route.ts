import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const productGroups = await prisma.productGroup.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json(productGroups);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Produktgruppen" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;

    const fields = {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      iconId: data.iconId || null,
      imageId: data.imageId || null,
      order: typeof data.order === "number" ? data.order : parseInt(data.order, 10) || 0,
      isActive: data.isActive ?? true,
    };

    const productGroup = id
      ? await prisma.productGroup.update({ where: { id }, data: fields })
      : await prisma.productGroup.create({ data: fields });

    return NextResponse.json(productGroup);
  } catch (error) {
    console.error("ProductGroup upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Produktgruppe" },
      { status: 500 },
    );
  }
}
