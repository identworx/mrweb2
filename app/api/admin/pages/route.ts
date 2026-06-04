import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const pages = await prisma.page.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Seiten" },
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
      title: data.title,
      slug: data.slug,
      eyebrow: data.eyebrow || null,
      headline: data.headline || null,
      introText: data.introText || null,
      status: data.status || "DRAFT",
      type: data.type || "STANDARD",
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    };

    const page = id
      ? await prisma.page.update({ where: { id }, data: fields })
      : await prisma.page.create({ data: fields });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Page upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Seite" },
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
    const { status } = body;

    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }

    const page = await prisma.page.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Seiten löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen der Seite" }, { status: 500 });
  }
}
