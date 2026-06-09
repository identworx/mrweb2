import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filePath = path.join(process.cwd(), "public", "uploads", ...segments);

  const resolved = path.resolve(filePath);
  const uploadsDir = path.resolve(path.join(process.cwd(), "public", "uploads"));
  if (!resolved.startsWith(uploadsDir + path.sep) && resolved !== uploadsDir) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const fileStat = await stat(resolved);
    if (!fileStat.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const buffer = await readFile(resolved);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": `"${fileStat.mtimeMs.toString(36)}-${fileStat.size.toString(36)}"`,
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
