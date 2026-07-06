import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import path from "node:path";
import fs from "node:fs";
import { createWriteStream, createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import archiver from "archiver";

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

function resolveImageFile(rawUrl: string): string | null {
  if (!rawUrl || rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return null;
  }

  let cleaned = rawUrl;
  const qIdx = cleaned.indexOf("?");
  if (qIdx !== -1) cleaned = cleaned.slice(0, qIdx);

  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {}

  if (cleaned.startsWith("/")) cleaned = cleaned.slice(1);

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "public", cleaned),
    path.join(cwd, cleaned),
    path.join(cwd, "public", "uploads", path.basename(cleaned)),
    path.join(cwd, "uploads", path.basename(cleaned)),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {}
  }

  return null;
}

function cleanupDir(dirPath: string) {
  setTimeout(() => {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch {}
  }, 5000);
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

  let products;
  try {
    products = await prisma.product.findMany({
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
  } catch (err) {
    console.error("export-images: Prisma query failed", err);
    return new Response(
      JSON.stringify({ error: "Datenbankfehler beim Laden der Produkte" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (products.length === 0) {
    return new Response(
      JSON.stringify({ error: "Keine Produkte gefunden" }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  const tmpDir = path.join(
    process.cwd(),
    "tmp",
    "product-image-exports",
    `${Date.now()}-${randomUUID().slice(0, 8)}`,
  );
  const zipPath = path.join(tmpDir, "mosaroma-product-images-png.zip");

  try {
    fs.mkdirSync(tmpDir, { recursive: true });
  } catch (err) {
    console.error("export-images: failed to create tmp dir", err);
    return new Response(
      JSON.stringify({ error: "Temporäres Verzeichnis konnte nicht erstellt werden" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

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

  try {
    const archive = archiver("zip", { zlib: { level: 5 } });
    const output = createWriteStream(zipPath);

    const zipDone = new Promise<void>((resolve, reject) => {
      output.on("close", resolve);
      archive.on("error", (err) => {
        console.error("export-images: archiver error", err);
        reject(err);
      });
      output.on("error", (err) => {
        console.error("export-images: output stream error", err);
        reject(err);
      });
    });

    archive.pipe(output);

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

      const needsSuffix = imageUrls.length > 1;

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const filePath = resolveImageFile(imageUrl);

        if (!filePath) {
          const isExternal =
            imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
          missing.push(
            `${prefix}: ${isExternal ? "externe URL übersprungen" : "Datei nicht gefunden"} (${imageUrl})`,
          );
          skipped++;
          continue;
        }

        try {
          const pngBuffer = await sharp(filePath).png().toBuffer();
          const baseName = needsSuffix
            ? `${prefix}_${String(i + 1).padStart(2, "0")}.png`
            : `${prefix}.png`;
          const finalName = uniqueName(baseName);
          archive.append(pngBuffer, { name: finalName });
          exported++;
        } catch (err) {
          console.error(`export-images: sharp failed for ${filePath}`, err);
          missing.push(`${prefix}: Konvertierungsfehler (${imageUrl})`);
          skipped++;
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
    await zipDone;
  } catch (err) {
    console.error("export-images: ZIP creation failed", err);
    cleanupDir(tmpDir);
    return new Response(
      JSON.stringify({ error: "ZIP-Erzeugung fehlgeschlagen" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (exported === 0) {
    const reportOnly = { exported: 0, skipped, missing };
    cleanupDir(tmpDir);
    return new Response(
      JSON.stringify({
        error: "Keine Bilder konnten exportiert werden",
        report: reportOnly,
      }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  let zipStat;
  try {
    zipStat = fs.statSync(zipPath);
  } catch (err) {
    console.error("export-images: cannot stat ZIP file", err);
    cleanupDir(tmpDir);
    return new Response(
      JSON.stringify({ error: "ZIP-Datei nicht lesbar" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const fileStream = createReadStream(zipPath);

  const readableStream = new ReadableStream({
    start(controller) {
      fileStream.on("data", (chunk) => {
        controller.enqueue(new Uint8Array(Buffer.from(chunk)));
      });
      fileStream.on("end", () => {
        controller.close();
        cleanupDir(tmpDir);
      });
      fileStream.on("error", (err) => {
        console.error("export-images: file read error", err);
        controller.error(err);
        cleanupDir(tmpDir);
      });
    },
    cancel() {
      fileStream.destroy();
      cleanupDir(tmpDir);
    },
  });

  return new Response(readableStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(zipStat.size),
      "Content-Disposition":
        'attachment; filename="mosaroma-product-images-png.zip"',
      "Cache-Control": "no-store",
    },
  });
}
