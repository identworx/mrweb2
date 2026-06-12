import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { revalidateFooter } from "@/lib/server/revalidate-cms";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

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

    const data = {
      logoMediaId: body.logoMediaId || null,
      description: body.description || null,
      copyrightText: body.copyrightText || null,
      socialLinks: body.socialLinks ? body.socialLinks : Prisma.JsonNull,
      ctaEnabled: typeof body.ctaEnabled === "boolean" ? body.ctaEnabled : true,
      ctaEyebrow: body.ctaEyebrow || null,
      ctaTitle: body.ctaTitle || null,
      ctaText: body.ctaText || null,
      ctaPrimaryLabel: body.ctaPrimaryLabel || null,
      ctaPrimaryHref: body.ctaPrimaryHref || null,
      ctaSecondaryLabel: body.ctaSecondaryLabel || null,
      ctaSecondaryHref: body.ctaSecondaryHref || null,
      contactTitle: body.contactTitle || null,
      companyName: body.companyName || null,
      addressLine1: body.addressLine1 || null,
      addressLine2: body.addressLine2 || null,
      postalCity: body.postalCity || null,
      country: body.country || null,
      email: body.email || null,
      phone: body.phone || null,
      contactButtonLabel: body.contactButtonLabel || null,
      contactButtonHref: body.contactButtonHref || null,
      bottomNote: body.bottomNote || null,
    };

    const settings = await prisma.footerSettings.upsert({
      where: { id: "footer-settings" },
      update: data,
      create: { id: "footer-settings", ...data },
    });

    revalidateFooter();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Footer settings update error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Footer-Einstellungen" },
      { status: 500 },
    );
  }
}
