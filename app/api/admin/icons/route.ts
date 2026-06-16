import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { revalidateIcons } from "@/lib/server/revalidate-cms";

export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const slots = await prisma.iconSlot.findMany({
      include: { media: true },
      orderBy: [{ groupName: "asc" }, { key: "asc" }],
    });
    return NextResponse.json(slots);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Icons" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      id,
      label,
      description,
      groupName,
      iconType,
      libraryIcon,
      mediaId,
      sizeHint,
      colorMode,
      isActive,
      defaultIcon,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID fehlt" },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {};
    if (label !== undefined) data.label = label;
    if (description !== undefined) data.description = description || null;
    if (groupName !== undefined) data.groupName = groupName;
    if (iconType !== undefined) data.iconType = iconType;
    if (libraryIcon !== undefined) data.libraryIcon = libraryIcon || null;
    if (mediaId !== undefined) data.mediaId = mediaId || null;
    if (sizeHint !== undefined) data.sizeHint = sizeHint;
    if (colorMode !== undefined) data.colorMode = colorMode;
    if (isActive !== undefined) data.isActive = isActive;
    if (defaultIcon !== undefined) data.defaultIcon = defaultIcon;

    const updated = await prisma.iconSlot.update({
      where: { id },
      data,
      include: { media: true },
    });

    revalidateIcons();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Icon slot update error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
      { status: 500 },
    );
  }
}
