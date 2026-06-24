import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const translations = await prisma.contentTranslation.findMany({
      where: { locale: "en" },
      orderBy: [{ entityType: "asc" }, { fieldName: "asc" }],
    });
    return NextResponse.json(translations);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Übersetzungen" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const body = await request.json();
    const { entityType, entityId, fieldName, locale, sourceText, translatedText, status } = body;

    if (!entityType || !fieldName || !locale || !translatedText) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 },
      );
    }

    const existing = await prisma.contentTranslation.findFirst({
      where: {
        entityType,
        entityId: entityId || "",
        fieldName,
        locale,
      },
    });

    let translation;
    if (existing) {
      translation = await prisma.contentTranslation.update({
        where: { id: existing.id },
        data: {
          sourceText: sourceText || existing.sourceText,
          translatedText,
          status: status || existing.status,
        },
      });
    } else {
      translation = await prisma.contentTranslation.create({
        data: {
          entityType,
          entityId: entityId || "",
          fieldName,
          locale,
          sourceText: sourceText || "",
          translatedText,
          status: status || "DRAFT",
        },
      });
    }

    return NextResponse.json(translation);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Speichern der Übersetzung" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, translatedText, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
    }

    const translation = await prisma.contentTranslation.update({
      where: { id },
      data: {
        ...(translatedText !== undefined ? { translatedText } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return NextResponse.json(translation);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Übersetzung" },
      { status: 500 },
    );
  }
}
