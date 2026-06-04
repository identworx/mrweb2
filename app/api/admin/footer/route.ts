import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const settings = await prisma.footerSettings.findUnique({
      where: { id: "footer-settings" },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Footer-Einstellungen" },
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
    const { description, copyrightText, socialLinks } = body;

    const settings = await prisma.footerSettings.upsert({
      where: { id: "footer-settings" },
      update: {
        description: description || null,
        copyrightText: copyrightText || null,
        socialLinks: socialLinks ? socialLinks : Prisma.JsonNull,
      },
      create: {
        id: "footer-settings",
        description: description || null,
        copyrightText: copyrightText || null,
        socialLinks: socialLinks ? socialLinks : Prisma.JsonNull,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Footer settings update error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Footer-Einstellungen" },
      { status: 500 },
    );
  }
}
