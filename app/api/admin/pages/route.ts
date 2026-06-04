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
