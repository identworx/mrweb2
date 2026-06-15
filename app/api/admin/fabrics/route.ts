import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { revalidateMaterials } from "@/lib/server/revalidate-cms";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function sanitize(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = stripHtml(value);
  return cleaned || null;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity") || "swatches";

    if (entity === "families") {
      const families = await prisma.fabricFamily.findMany({
        orderBy: { order: "asc" },
      });
      return NextResponse.json(families);
    }

    if (entity === "product-types") {
      const productTypes = await prisma.fabricProductType.findMany({
        orderBy: { order: "asc" },
      });
      return NextResponse.json(productTypes);
    }

    const id = searchParams.get("id");
    if (id) {
      const swatch = await prisma.fabricSwatch.findUnique({
        where: { id },
        include: {
          family: true,
          swatchImage: true,
          availabilities: { include: { productType: true } },
        },
      });
      if (!swatch) {
        return NextResponse.json({ error: "Swatch nicht gefunden" }, { status: 404 });
      }
      return NextResponse.json(swatch);
    }

    const familyId = searchParams.get("familyId");
    const swatches = await prisma.fabricSwatch.findMany({
      where: familyId ? { familyId } : undefined,
      orderBy: [
        { family: { order: "asc" } },
        { order: "asc" },
      ],
      include: {
        family: true,
        swatchImage: true,
        availabilities: { include: { productType: true } },
      },
    });
    return NextResponse.json(swatches);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Stoffe" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  if (user.role === "VIEWER")
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });

  try {
    const body = await request.json();
    const { entity, id, ...data } = body;

    if (entity === "family") {
      const name = sanitize(data.name);
      if (!name) return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });

      const slug = sanitize(data.slug) || generateSlug(name);

      const existing = await prisma.fabricFamily.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Slug bereits vergeben" }, { status: 409 });
      }

      const fields = {
        name,
        slug,
        description: sanitize(data.description),
        eyebrow: sanitize(data.eyebrow),
        subtitle: sanitize(data.subtitle),
        material: sanitize(data.material),
        weight: sanitize(data.weight),
        dyeing: sanitize(data.dyeing),
        comfort: sanitize(data.comfort),
        cushionThickness: sanitize(data.cushionThickness),
        hubHighlights: typeof data.hubHighlights === "string" ? data.hubHighlights.trim() || null : null,
        isHighlighted: data.isHighlighted === true,
        order: typeof data.order === "number" ? data.order : 0,
        isActive: data.isActive !== false,
      };

      const family = id
        ? await prisma.fabricFamily.upsert({
            where: { id },
            update: fields,
            create: { ...fields, id },
          })
        : await prisma.fabricFamily.create({ data: fields });

      revalidateMaterials();
      return NextResponse.json(family);
    }

    if (entity === "product-type") {
      const name = sanitize(data.name);
      if (!name) return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });

      const slug = sanitize(data.slug) || generateSlug(name);

      const existing = await prisma.fabricProductType.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Slug bereits vergeben" }, { status: 409 });
      }

      const fields = {
        name,
        slug,
        iconKey: sanitize(data.iconKey),
        order: typeof data.order === "number" ? data.order : 0,
        isActive: data.isActive !== false,
      };

      const productType = id
        ? await prisma.fabricProductType.upsert({
            where: { id },
            update: fields,
            create: { ...fields, id },
          })
        : await prisma.fabricProductType.create({ data: fields });

      revalidateMaterials();
      return NextResponse.json(productType);
    }

    const name = sanitize(data.name);
    if (!name) return NextResponse.json({ error: "Name ist erforderlich" }, { status: 400 });

    const slug = sanitize(data.slug) || generateSlug(name);

    const existing = await prisma.fabricSwatch.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Slug bereits vergeben" }, { status: 409 });
    }

    const fields = {
      name,
      slug,
      familyId: data.familyId,
      articleNumber: sanitize(data.articleNumber),
      subtitle: sanitize(data.subtitle),
      description: sanitize(data.description),
      swatchImageId: data.swatchImageId || null,
      colorHex: sanitize(data.colorHex),
      patternType: sanitize(data.patternType),
      order: typeof data.order === "number" ? data.order : 0,
      isActive: data.isActive !== false,
    };

    const swatch = id
      ? await prisma.fabricSwatch.upsert({
          where: { id },
          update: fields,
          create: { ...fields, id },
        })
      : await prisma.fabricSwatch.create({ data: fields });

    if (Array.isArray(data.availabilities)) {
      await prisma.fabricAvailability.deleteMany({ where: { swatchId: swatch.id } });
      if (data.availabilities.length > 0) {
        await prisma.fabricAvailability.createMany({
          data: data.availabilities.map(
            (a: { productTypeId: string; isAvailable?: boolean; note?: string }) => ({
              swatchId: swatch.id,
              productTypeId: a.productTypeId,
              isAvailable: a.isAvailable !== false,
              note: sanitize(a.note),
            }),
          ),
        });
      }
    }

    revalidateMaterials();
    return NextResponse.json(swatch);
  } catch (error) {
    console.error("Fabric upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
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
    const entity = searchParams.get("entity") || "swatches";
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const body = await request.json();
    const { isActive } = body;

    if (entity === "families") {
      const family = await prisma.fabricFamily.update({
        where: { id },
        data: { isActive: Boolean(isActive) },
      });
      revalidateMaterials();
      return NextResponse.json(family);
    }

    if (entity === "product-types") {
      const productType = await prisma.fabricProductType.update({
        where: { id },
        data: { isActive: Boolean(isActive) },
      });
      revalidateMaterials();
      return NextResponse.json(productType);
    }

    const swatch = await prisma.fabricSwatch.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    revalidateMaterials();
    return NextResponse.json(swatch);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity") || "swatches";
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    if (entity === "families") {
      await prisma.fabricFamily.delete({ where: { id } });
      revalidateMaterials();
      return NextResponse.json({ success: true });
    }

    if (entity === "product-types") {
      await prisma.fabricProductType.delete({ where: { id } });
      revalidateMaterials();
      return NextResponse.json({ success: true });
    }

    await prisma.fabricSwatch.delete({ where: { id } });
    revalidateMaterials();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
