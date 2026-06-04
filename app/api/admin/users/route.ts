import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth/session";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Benutzer" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getSessionUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Nur Administratoren können Benutzer verwalten" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { id, name, email, role, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail ist erforderlich" },
        { status: 400 },
      );
    }

    if (!id && !password) {
      return NextResponse.json(
        { error: "Passwort ist für neue Benutzer erforderlich" },
        { status: 400 },
      );
    }

    if (id) {
      const updateData: Record<string, unknown> = {
        name: name || null,
        email,
        role: role || "VIEWER",
      };

      if (password) {
        updateData.passwordHash = await hashPassword(password);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(user);
    } else {
      const passwordHash = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name: name || null,
          email,
          passwordHash,
          role: role || "VIEWER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(user);
    }
  } catch (error) {
    console.error("User upsert error:", error);
    const message = error instanceof Error && error.message.includes("Unique")
      ? "Ein Benutzer mit dieser E-Mail existiert bereits"
      : "Fehler beim Speichern des Benutzers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
