import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const forms = await prisma.form.findMany({
      include: { fields: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(forms);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Formulare" },
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
    const { id, slug, name, title, submitLabel, successMessage, errorMessage, recipientEmail, privacyText, fields } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "Name und Slug sind erforderlich" },
        { status: 400 },
      );
    }

    const form = await prisma.$transaction(async (tx) => {
      const updated = await tx.form.upsert({
        where: { slug },
        update: {
          name,
          title: title || null,
          submitLabel: submitLabel || null,
          successMessage: successMessage || null,
          errorMessage: errorMessage || null,
          recipientEmail: recipientEmail || null,
          privacyText: privacyText || null,
        },
        create: {
          id: id || undefined,
          slug,
          name,
          title: title || null,
          submitLabel: submitLabel || null,
          successMessage: successMessage || null,
          errorMessage: errorMessage || null,
          recipientEmail: recipientEmail || null,
          privacyText: privacyText || null,
        },
      });

      await tx.formField.deleteMany({ where: { formId: updated.id } });

      if (fields && fields.length > 0) {
        await tx.formField.createMany({
          data: fields.map((f: { label: string; name: string; type: string; required: boolean; options?: string; order: number }, i: number) => ({
            label: f.label,
            name: f.name,
            type: f.type,
            required: f.required ?? false,
            options: f.options || null,
            order: f.order ?? i,
            formId: updated.id,
          })),
        });
      }

      return tx.form.findUnique({
        where: { id: updated.id },
        include: { fields: { orderBy: { order: "asc" } } },
      });
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Form upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Formulars" },
      { status: 500 },
    );
  }
}
