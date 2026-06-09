import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { revalidateProduct } from "@/lib/server/revalidate-cms";

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

    if (Array.isArray(data.galleryImages)) {
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      if (data.galleryImages.length > 0) {
        await prisma.productImage.createMany({
          data: data.galleryImages.map(
            (img: { mediaAssetId: string; alt?: string | null; order: number }, i: number) => ({
              productId: product.id,
              mediaAssetId: img.mediaAssetId,
              alt: img.alt || null,
              order: img.order ?? i,
              isMain: false,
            }),
          ),
        });
      }
    }

    const related = await prisma.product.findUnique({
      where: { id: product.id },
      select: {
        collection: { select: { slug: true } },
        productGroup: { select: { slug: true } },
      },
    });
    revalidateProduct(
      product.slug,
      related?.collection?.slug,
      related?.productGroup?.slug,
    );
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product upsert error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern des Produkts" },
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
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const body = await request.json();
    const { status } = body;

    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: { status },
      include: {
        collection: { select: { slug: true } },
        productGroup: { select: { slug: true } },
      },
    });

    revalidateProduct(
      product.slug,
      product.collection?.slug,
      product.productGroup?.slug,
    );
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Produkte löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        slug: true,
        collection: { select: { slug: true } },
        productGroup: { select: { slug: true } },
      },
    });
    await prisma.product.delete({ where: { id } });
    revalidateProduct(
      product?.slug,
      product?.collection?.slug,
      product?.productGroup?.slug,
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Produkts" }, { status: 500 });
  }
}
