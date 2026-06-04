import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        collection: true,
        productGroup: true,
      },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Produkte" },
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

    let features = data.features;
    if (typeof features === "string") {
      features = features
        .split("\n")
        .map((f: string) => f.trim())
        .filter(Boolean);
    }

    const fields = {
      name: data.name,
      slug: data.slug,
      collectionId: data.collectionId,
      productGroupId: data.productGroupId,
      materialId: data.materialId || null,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      code: data.code || null,
      size: data.size || null,
      colorName: data.colorName || null,
      patternName: data.patternName || null,
      features: features || null,
      heroImageId: data.heroImageId || null,
      mainImageId: data.mainImageId || null,
      status: data.status || "DRAFT",
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    };

    const product = id
      ? await prisma.product.update({ where: { id }, data: fields })
      : await prisma.product.create({ data: fields });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Produkts" },
      { status: 500 },
    );
  }
}
