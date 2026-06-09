import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { sanitizeRichText } from "@/lib/server/sanitize-rich-text";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");
  if (!pageId)
    return NextResponse.json({ error: "pageId fehlt" }, { status: 400 });

  try {
    const sections = await prisma.pageSection.findMany({
      where: { pageId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sections);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Sektionen" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  if (user.role === "VIEWER")
    return NextResponse.json(
      { error: "Keine Berechtigung" },
      { status: 403 },
    );

  try {
    const body = await request.json();
    const { pageId, type, title, eyebrow, content, buttonLabel, buttonHref, settings, order, imageId } = body;

    if (!pageId)
      return NextResponse.json({ error: "pageId fehlt" }, { status: 400 });

    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page)
      return NextResponse.json(
        { error: "Seite nicht gefunden" },
        { status: 404 },
      );

    if (typeof order !== "number" || !Number.isFinite(order))
      return NextResponse.json(
        { error: "order muss eine Zahl sein" },
        { status: 400 },
      );

    if (settings !== undefined && settings !== null) {
      if (typeof settings !== "object" || Array.isArray(settings))
        return NextResponse.json(
          { error: "settings muss ein JSON-Objekt sein" },
          { status: 400 },
        );
    }

    const sanitizedSettings = settings ? sanitizeSettings(settings) : {};

    const section = await prisma.pageSection.create({
      data: {
        pageId,
        type: type || "CUSTOM",
        title: title || null,
        eyebrow: eyebrow || null,
        content: content ? sanitizeRichText(content) : null,
        buttonLabel: buttonLabel || null,
        buttonHref: buttonHref || null,
        settings: sanitizedSettings as Record<string, string | string[]>,
        order,
        imageId: imageId || null,
        isActive: true,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("PageSection create error:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Sektion" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  if (user.role === "VIEWER")
    return NextResponse.json(
      { error: "Keine Berechtigung" },
      { status: 403 },
    );

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if ("title" in body) data.title = body.title || null;
    if ("eyebrow" in body) data.eyebrow = body.eyebrow || null;
    if ("content" in body) data.content = body.content ? sanitizeRichText(body.content) : null;
    if ("type" in body) data.type = body.type;
    if ("buttonLabel" in body) data.buttonLabel = body.buttonLabel || null;
    if ("buttonHref" in body) data.buttonHref = body.buttonHref || null;
    if ("imageId" in body) data.imageId = body.imageId || null;

    if ("order" in body) {
      if (typeof body.order !== "number" || !Number.isFinite(body.order))
        return NextResponse.json(
          { error: "order muss eine Zahl sein" },
          { status: 400 },
        );
      data.order = body.order;
    }

    if ("isActive" in body) {
      if (typeof body.isActive !== "boolean")
        return NextResponse.json(
          { error: "isActive muss ein Boolean sein" },
          { status: 400 },
        );
      data.isActive = body.isActive;
    }

    if ("settings" in body) {
      if (
        body.settings !== null &&
        (typeof body.settings !== "object" || Array.isArray(body.settings))
      )
        return NextResponse.json(
          { error: "settings muss ein JSON-Objekt sein" },
          { status: 400 },
        );
      data.settings = body.settings ? sanitizeSettings(body.settings) : {};
    }

    const section = await prisma.pageSection.update({
      where: { id },
      data,
    });

    return NextResponse.json(section);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Sektion" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Nur Administratoren können Sektionen löschen" },
      { status: 403 },
    );

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.pageSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Löschen der Sektion" },
      { status: 500 },
    );
  }
}

function sanitizeSettings(settings: Record<string, unknown>): Record<string, unknown> {
  const result = { ...settings };
  if (Array.isArray(result.items)) {
    result.items = (result.items as string[]).map((item) =>
      typeof item === "string" ? sanitizeRichText(item) : item,
    );
  }
  return result;
}
