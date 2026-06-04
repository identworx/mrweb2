import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const measurements = await prisma.measurement.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(measurements);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Produktmaße" },
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

    // Parse variants and notes from JSON strings if needed
    let variants = data.variants;
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch {
        return NextResponse.json(
          { error: "Ungültiges JSON im Feld Varianten" },
          { status: 400 },
        );
      }
    }

    let notes = data.notes;
    if (typeof notes === "string") {
      try {
        notes = JSON.parse(notes);
      } catch {
        return NextResponse.json(
          { error: "Ungültiges JSON im Feld Hinweise" },
          { status: 400 },
        );
      }
    }

    const measurementData = {
      title: data.title,
      slug: data.slug,
      groupSlug: data.groupSlug || null,
      drawingType: data.drawingType || null,
      sourceNote: data.sourceNote || null,
      order: typeof data.order === "number" ? data.order : 0,
      variants: variants ?? undefined,
      notes: notes ?? undefined,
    };

    let measurement;

    if (id) {
      measurement = await prisma.measurement.upsert({
        where: { id },
        update: measurementData,
        create: { ...measurementData, id },
      });
    } else {
      measurement = await prisma.measurement.create({
        data: measurementData,
      });
    }

    return NextResponse.json(measurement);
  } catch (error) {
    console.error("Measurement upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Produktmaßes" },
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

    const measurement = await prisma.measurement.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    return NextResponse.json(measurement);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Produktmaße löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.measurement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Produktmaßes" }, { status: 500 });
  }
}
