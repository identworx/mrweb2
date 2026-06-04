import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { canDeleteMaterial } from "@/lib/admin/delete-guards";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const materials = await prisma.material.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(materials);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Materialien" },
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

    const materialData = {
      name: data.name,
      slug: data.slug,
      subtitle: data.subtitle || null,
      materialComp: data.materialComp,
      weight: data.weight,
      dyeing: data.dyeing || null,
      comfort: data.comfort || null,
      order: typeof data.order === "number" ? data.order : 0,
    };

    let material;

    if (id) {
      material = await prisma.material.upsert({
        where: { id },
        update: materialData,
        create: { ...materialData, id },
      });
    } else {
      material = await prisma.material.create({
        data: materialData,
      });
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error("Material upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Materials" },
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

    const material = await prisma.material.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    return NextResponse.json(material);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Materialien löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const guard = await canDeleteMaterial(id);
    if (!guard.allowed) {
      return NextResponse.json({ error: guard.reason }, { status: 409 });
    }

    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Materials" }, { status: 500 });
  }
}
