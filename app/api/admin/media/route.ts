import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { getMediaAssetUsage } from "@/lib/admin/delete-guards";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];

function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const name = path.basename(filename, path.extname(filename));
  const sanitized = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
  return `${sanitized || "datei"}-${Date.now()}${ext}`;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(assets);
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Laden der Medien" },
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

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { id, alt, caption } = body;

      if (!id) {
        return NextResponse.json(
          { error: "Medium-ID fehlt" },
          { status: 400 },
        );
      }

      const asset = await prisma.mediaAsset.update({
        where: { id },
        data: {
          alt: alt || null,
          caption: caption || null,
        },
      });

      return NextResponse.json(asset);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string) || null;
    const caption = (formData.get("caption") as string) || null;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Datei darf maximal 5 MB groß sein" },
        { status: 400 },
      );
    }

    const mimeType = file.type;
    if (!ALLOWED_MIME_TYPES.includes(mimeType) && !mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Dateityp nicht erlaubt. Nur Bilder, PDF und SVG sind zulässig." },
        { status: 400 },
      );
    }

    const filename = sanitizeFilename(file.name);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "general");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/general/${filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.name,
        url,
        alt,
        caption,
        mimeType,
        size: file.size,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Fehler beim Hochladen des Mediums" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Nur Administratoren können Medien löschen" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const usage = await getMediaAssetUsage(id);
    if (usage.length > 0) {
      const details = usage.map((u) => `${u.model}: ${u.count}x`).join(", ");
      return NextResponse.json(
        { error: `Medium wird noch verwendet: ${details}. Bitte zuerst alle Verknüpfungen entfernen.`, usage },
        { status: 409 },
      );
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id }, select: { url: true } });
    await prisma.mediaAsset.delete({ where: { id } });

    if (asset?.url?.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", asset.url);
      try {
        await unlink(filePath);
      } catch {
        // File may already be missing
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Löschen des Mediums" }, { status: 500 });
  }
}
