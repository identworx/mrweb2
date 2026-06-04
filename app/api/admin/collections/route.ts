import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const collections = await prisma.collection.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
        cardImage: { select: { url: true } },
      },
    });
    return NextResponse.json(collections);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Kollektionen" },
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
      number: data.number ? parseInt(data.number, 10) : null,
      eyebrow: data.eyebrow || null,
      subtitle: data.subtitle || null,
      shortDescription: data.shortDescription || null,
      longDescription: data.longDescription || null,
      heroImageId: data.heroImageId || null,
      cardImageId: data.cardImageId || null,
      moodColors: data.moodColors || null,
      fabric: data.fabric || null,
      status: data.status || "DRAFT",
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      order: data.order ? parseInt(data.order, 10) : 0,
    };

    const collection = id
      ? await prisma.collection.update({ where: { id }, data: fields })
      : await prisma.collection.create({ data: fields });

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Collection upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Kollektion" },
      { status: 500 },
    );
  }
}
