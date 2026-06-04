import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
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
