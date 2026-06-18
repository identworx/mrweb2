import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const folders = await prisma.mediaFolder.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { assets: true } } },
    });

    const total = await prisma.mediaAsset.count();
    const unassigned = await prisma.mediaAsset.count({ where: { folderId: null } });

    return NextResponse.json({
      folders: folders.map((f) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        path: f.path,
        order: f.order,
        assetCount: f._count.assets,
      })),
      totalAssets: total,
      unassignedCount: unassigned,
    });
  } catch {
    return NextResponse.json({ error: "Fehler beim Laden der Ordner" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  if (user.role === "VIEWER") return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });

  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });
    }

    const trimmed = name.trim().slice(0, 100);
    const slug = slugify(trimmed);
    if (!slug) {
      return NextResponse.json({ error: "Ungültiger Ordnername" }, { status: 400 });
    }

    const existing = await prisma.mediaFolder.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Ein Ordner mit diesem Namen existiert bereits" }, { status: 409 });
    }

    const maxOrder = await prisma.mediaFolder.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order ?? 0) + 1;

    const folder = await prisma.mediaFolder.create({
      data: {
        name: trimmed,
        slug,
        path: `/uploads/${slug}`,
        order,
      },
    });

    return NextResponse.json(folder);
  } catch {
    return NextResponse.json({ error: "Fehler beim Erstellen des Ordners" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  if (user.role === "VIEWER") return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });
    }

    const trimmed = name.trim().slice(0, 100);
    const folder = await prisma.mediaFolder.update({
      where: { id },
      data: { name: trimmed },
    });

    return NextResponse.json(folder);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Ordners" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nur Administratoren können Ordner löschen" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const assetCount = await prisma.mediaAsset.count({ where: { folderId: id } });
    if (assetCount > 0) {
      return NextResponse.json(
        { error: `Ordner enthält noch ${assetCount} Medien. Bitte zuerst alle Medien verschieben.` },
        { status: 409 },
      );
    }

    await prisma.mediaFolder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Ordners" }, { status: 500 });
  }
}
