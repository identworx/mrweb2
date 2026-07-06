import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
import { ZipArchive } from "archiver";
import { PassThrough } from "node:stream";

export const runtime = "nodejs";
export const maxDuration = 300;

const PRODUCT_TYPES = [
  "Hochlehner",
  "Niedriglehner",
  "Sitzkissen",
  "Bankauflage",
  "Bankauflagen",
  "Dekokissen",
  "Deko-Kissen",
  "Tischset",
  "Tischläufer",
  "Decke",
  "Pouf",
];

function sanitizeFilename(raw: string): string {
  let s = raw;
  s = s.replace(/ä/g, "ae").replace(/Ä/g, "Ae");
  s = s.replace(/ö/g, "oe").replace(/Ö/g, "Oe");
  s = s.replace(/ü/g, "ue").replace(/Ü/g, "Ue");
  s = s.replace(/ß/g, "ss");
  s = s.replace(/\.\s+/g, ".");
  s = s.replace(/\s+/g, "_");
  s = s.replace(/[^a-zA-Z0-9._-]/g, "");
  s = s.replace(/_+/g, "_");
  s = s.replace(/^_|_$/g, "");
  return s;
}

function buildProductPrefix(code: string | null, name: string): string {
  const productName = name.trim();
  let typePart = "";
  let namePart = productName;

  for (const pt of PRODUCT_TYPES) {
    const escaped = pt.replace("-", "\\-");
    const regex = new RegExp(`\\s+${escaped}(\\s|$)`, "i");
    const match = productName.match(regex);
    if (match) {
      typePart = pt;
      const idx = match.index!;
      const before = productName.slice(0, idx).trim();
      const after = productName.slice(idx + match[0].length).trim();
      namePart = after ? `${before}_${after}` : before;
      break;
    }
  }

  const displayName = typePart ? `${typePart}_${namePart}` : namePart;
  const codeStr = code ? sanitizeFilename(code) : "no-code";
  return `${codeStr}_${sanitizeFilename(displayName)}`;
}

function resolveFilePath(url: string): string {
  const cleaned = url.startsWith("/") ? url.slice(1) : url;
  return path.join(process.cwd(), "public", cleaned);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role === "VIEWER") {
    return new Response(JSON.stringify({ error: "Nicht autorisiert" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: {
    mainOnly?: boolean;
    publishedOnly?: boolean;
    collectionId?: string;
    productGroupId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültige Anfrage" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const where: Record<string, unknown> = {};
  if (body.publishedOnly) {
    where.status = "PUBLISHED";
  }
  if (body.collectionId) {
    where.collectionId = body.collectionId;
  }
  if (body.productGroupId) {
    where.productGroupId = body.productGroupId;
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      code: true,
      mainImage: { select: { url: true, normalizedUrl: true } },
      images: {
        select: {
          url: true,
          order: true,
          mediaAsset: { select: { url: true, normalizedUrl: true } },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) {
    return new Response(
      JSON.stringify({ error: "Keine Produkte gefunden" }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  const passthrough = new PassThrough();
  const archive = new ZipArchive({ zlib: { level: 5 } });

  archive.on("error", (err) => {
    console.error("archiver error:", err);
    passthrough.destroy(err);
  });

  archive.pipe(passthrough);

  const usedFilenames = new Set<string>();
  let exported = 0;
  let skipped = 0;
  const missing: string[] = [];

  function uniqueName(base: string): string {
    let candidate = base;
    let i = 1;
    while (usedFilenames.has(candidate.toLowerCase())) {
      candidate = base.replace(/\.png$/, `_${String(i).padStart(2, "0")}.png`);
      i++;
    }
    usedFilenames.add(candidate.toLowerCase());
    return candidate;
  }

  async function addImage(
    imageUrl: string,
    filenameBase: string,
    suffix: string | null,
  ): Promise<boolean> {
    const filePath = resolveFilePath(imageUrl);
    if (!fs.existsSync(filePath)) {
      missing.push(`${filenameBase}: ${imageUrl}`);
      skipped++;
      return false;
    }

    try {
      const pngBuffer = await sharp(filePath).png().toBuffer();
      const name = suffix
        ? `${filenameBase}_${suffix}.png`
        : `${filenameBase}.png`;
      const finalName = uniqueName(name);
      archive.append(pngBuffer, { name: finalName });
      exported++;
      return true;
    } catch (err) {
      console.error(`sharp conversion failed for ${filePath}:`, err);
      missing.push(`${filenameBase}: conversion error (${imageUrl})`);
      skipped++;
      return false;
    }
  }

  for (const product of products) {
    const prefix = buildProductPrefix(product.code, product.name);
    const imageUrls: string[] = [];

    const mainUrl =
      product.mainImage?.normalizedUrl || product.mainImage?.url;
    if (mainUrl) {
      imageUrls.push(mainUrl);
    }

    if (!body.mainOnly && product.images.length > 0) {
      for (const img of product.images) {
        const url =
          img.mediaAsset?.normalizedUrl ||
          img.mediaAsset?.url ||
          img.url;
        if (url && !imageUrls.includes(url)) {
          imageUrls.push(url);
        }
      }
    }

    if (imageUrls.length === 0) {
      skipped++;
      missing.push(`${prefix}: kein Bild vorhanden`);
      continue;
    }

    if (imageUrls.length === 1) {
      await addImage(imageUrls[0], prefix, null);
    } else {
      for (let i = 0; i < imageUrls.length; i++) {
        await addImage(
          imageUrls[i],
          prefix,
          String(i + 1).padStart(2, "0"),
        );
      }
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    exported,
    skipped,
    missing,
  };

  archive.append(JSON.stringify(report, null, 2), {
    name: "export-report.json",
  });

  await archive.finalize();

  const readableStream = new ReadableStream({
    start(controller) {
      passthrough.on("data", (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      passthrough.on("end", () => {
        controller.close();
      });
      passthrough.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      passthrough.destroy();
    },
  });

  return new Response(readableStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition":
        'attachment; filename="mosaroma-product-images-png.zip"',
      "Cache-Control": "no-store",
    },
  });
}
