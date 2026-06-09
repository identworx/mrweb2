import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { sanitizeRichText } from "@/lib/server/sanitize-rich-text";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: [
        { publishedAt: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der News-Artikel" },
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
      slug: data.slug,
      title: data.title,
      eyebrow: data.eyebrow || null,
      excerpt: data.excerpt || null,
      content: data.content ? sanitizeRichText(data.content) : null,
      heroImageId: data.heroImageId || null,
      cardImageId: data.cardImageId || null,
      category: data.category || null,
      status: data.status || "DRAFT",
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    };

    const article = id
      ? await prisma.newsArticle.update({ where: { id }, data: fields })
      : await prisma.newsArticle.create({ data: fields });

    return NextResponse.json(article);
  } catch (error) {
    console.error("NewsArticle upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Artikels" },
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

    const article = await prisma.newsArticle.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Artikel löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    await prisma.newsArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Artikels" }, { status: 500 });
  }
}
