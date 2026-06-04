import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "site-settings" },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Einstellungen" },
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
    const { siteName, primaryColor, secondaryColor, contactEmail, defaultSeoTitle, defaultSeoDescription } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "site-settings" },
      update: {
        siteName: siteName || null,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        contactEmail: contactEmail || null,
        defaultSeoTitle: defaultSeoTitle || null,
        defaultSeoDescription: defaultSeoDescription || null,
      },
      create: {
        id: "site-settings",
        siteName: siteName || null,
        primaryColor: primaryColor || null,
        secondaryColor: secondaryColor || null,
        contactEmail: contactEmail || null,
        defaultSeoTitle: defaultSeoTitle || null,
        defaultSeoDescription: defaultSeoDescription || null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Einstellungen" },
      { status: 500 },
    );
  }
}
