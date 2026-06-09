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

const MAX_ALT_LENGTH = 500;
const MAX_TITLE_LENGTH = 200;
const MAX_CAPTION_LENGTH = 1000;
const MAX_FOLDER_LENGTH = 100;

function validateImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return true;
  if (buffer.length >= 12 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46
    && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return true;
  if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) return true;
  return false;
}

function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const name = path.basename(filename, path.extname(filename));
  const sanitized = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "");
  return `${sanitized || "datei"}-${Date.now()}${ext}`;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function sanitizeString(str: unknown, maxLength: number): string | null {
  if (typeof str !== "string") return null;
  const cleaned = stripHtml(str).slice(0, maxLength);
  return cleaned || null;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    const folder = searchParams.get("folder");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    if (id) {
      const asset = await prisma.mediaAsset.findUnique({ where: { id } });
      if (!asset) return NextResponse.json({ error: "Medium nicht gefunden" }, { status: 404 });
      const usage = await getMediaAssetUsage(id);
      return NextResponse.json({ ...asset, usage });
    }

    const conditions: Record<string, unknown>[] = [];
    if (q) {
      conditions.push({
        OR: [
          { filename: { contains: q } },
          { originalName: { contains: q } },
          { alt: { contains: q } },
          { title: { contains: q } },
          { caption: { contains: q } },
        ],
      });
    }
    if (type === "image") {
      conditions.push({ mimeType: { startsWith: "image/" } });
    }
    if (folder) {
      conditions.push({ folder });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || "24") || 24));
      const skip = (page - 1) * limit;

      const [items, total, folderResults, mimeResults] = await Promise.all([
        prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
        prisma.mediaAsset.count({ where }),
        prisma.mediaAsset.findMany({
          where: { folder: { not: null } },
          select: { folder: true },
          distinct: ["folder"],
          orderBy: { folder: "asc" },
        }),
        prisma.mediaAsset.findMany({
          select: { mimeType: true },
          distinct: ["mimeType"],
          orderBy: { mimeType: "asc" },
        }),
      ]);

      return NextResponse.json({
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        folders: folderResults.map((f) => f.folder).filter(Boolean),
        mimeTypes: mimeResults.map((m) => m.mimeType),
      });
    }

    const assets = await prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" } });
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
    if (user.role === "VIEWER") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
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
          alt: sanitizeString(alt, MAX_ALT_LENGTH),
          caption: sanitizeString(caption, MAX_CAPTION_LENGTH),
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
        { error: "Dateityp nicht erlaubt. Nur Bilder sind zulässig." },
        { status: 400 },
      );
    }

    const filename = sanitizeFilename(file.name);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "general");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!validateImageMagicBytes(buffer)) {
      return NextResponse.json(
        { error: "Datei ist kein gültiges Bild." },
        { status: 400 },
      );
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/general/${filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.name,
        url,
        alt: sanitizeString(alt, MAX_ALT_LENGTH),
        caption: sanitizeString(caption, MAX_CAPTION_LENGTH),
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

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  if (user.role === "VIEWER") return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

    const body = await request.json();
    const data: Record<string, string | null> = {};
    if ("alt" in body) data.alt = sanitizeString(body.alt, MAX_ALT_LENGTH);
    if ("caption" in body) data.caption = sanitizeString(body.caption, MAX_CAPTION_LENGTH);
    if ("title" in body) data.title = sanitizeString(body.title, MAX_TITLE_LENGTH);
    if ("folder" in body) data.folder = sanitizeString(body.folder, MAX_FOLDER_LENGTH);

    const asset = await prisma.mediaAsset.update({ where: { id }, data });
    return NextResponse.json(asset);
  } catch {
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Mediums" }, { status: 500 });
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
