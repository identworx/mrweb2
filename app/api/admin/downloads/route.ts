import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const downloads = await prisma.download.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(downloads);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Downloads" },
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

    const downloadData = {
      title: data.title,
      description: data.description || null,
      type: data.type || null,
      fileUrl: data.fileUrl || null,
      externalUrl: data.externalUrl || null,
      language: data.language || null,
      imageId: data.imageId || null,
      buttonLabel: data.buttonLabel || null,
      opensInNewTab: Boolean(data.opensInNewTab),
      order: typeof data.order === "number" ? data.order : 0,
    };

    let download;

    if (id) {
      download = await prisma.download.upsert({
        where: { id },
        update: downloadData,
        create: { ...downloadData, id },
      });
    } else {
      download = await prisma.download.create({
        data: downloadData,
      });
    }

    return NextResponse.json(download);
  } catch (error) {
    console.error("Download upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Downloads" },
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

    const download = await prisma.download.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    return NextResponse.json(download);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Downloads löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.download.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Downloads" }, { status: 500 });
  }
}
