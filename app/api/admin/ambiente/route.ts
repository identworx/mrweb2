import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { revalidateAmbiente } from "@/lib/server/revalidate-cms";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const images = await prisma.ambienteImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { mediaAsset: { select: { id: true, url: true, alt: true, filename: true } } },
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Ambiente-Bilder" },
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
    const { id, ...data } = body;

    let colorWorlds = data.colorWorlds;
    if (typeof colorWorlds === "string") {
      try {
        colorWorlds = JSON.parse(colorWorlds);
      } catch {
        colorWorlds = [];
      }
    }
    if (!Array.isArray(colorWorlds)) colorWorlds = [];

    const fields = {
      title: data.title,
      caption: data.caption || null,
      alt: data.alt || null,
      colorWorlds,
      featured: Boolean(data.featured),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      order: typeof data.order === "number" ? data.order : 0,
      mediaAssetId: data.mediaAssetId,
    };

    if (!fields.title || !fields.mediaAssetId) {
      return NextResponse.json(
        { error: "Titel und Bild sind erforderlich" },
        { status: 400 },
      );
    }

    let image;
    if (id) {
      image = await prisma.ambienteImage.upsert({
        where: { id },
        update: fields,
        create: { ...fields, id },
      });
    } else {
      image = await prisma.ambienteImage.create({ data: fields });
    }

    revalidateAmbiente();
    return NextResponse.json(image);
  } catch (error) {
    console.error("AmbienteImage upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Ambiente-Bildes" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role === "VIEWER")
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const body = await request.json();
    const { isActive } = body;

    const image = await prisma.ambienteImage.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    revalidateAmbiente();
    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Nur Administratoren können Ambiente-Bilder löschen" },
      { status: 403 },
    );

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.ambienteImage.delete({ where: { id } });
    revalidateAmbiente();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Löschen des Ambiente-Bildes" },
      { status: 500 },
    );
  }
}
