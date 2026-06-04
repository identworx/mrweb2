import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: "desc" },
      include: { form: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Anfragen" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
    }

    await prisma.formSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Löschen der Anfrage" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
    }

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: { isRead: isRead ?? true },
    });

    return NextResponse.json(submission);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Anfrage" },
      { status: 500 },
    );
  }
}
