import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  normalizeProductImage,
  buildNormalizedFilename,
} from "../lib/server/product-image-normalizer.js";
import { readFile, writeFile, mkdir, access } from "fs/promises";
import path from "path";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const mode = process.argv.includes("--apply") ? "apply" : "dry-run";
const NORMALIZED_DIR = path.join(process.cwd(), "public", "uploads", "normalized");

interface ProductMediaAsset {
  id: string;
  filename: string;
  url: string;
  normalizedUrl: string | null;
  mimeType: string;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveFilePath(url: string): string {
  const cleaned = url.startsWith("/") ? url.slice(1) : url;
  return path.join(process.cwd(), "public", cleaned);
}

async function collectProductMediaAssets(): Promise<ProductMediaAsset[]> {
  const mainImages = await prisma.product.findMany({
    where: { mainImageId: { not: null } },
    select: { mainImage: { select: { id: true, filename: true, url: true, normalizedUrl: true, mimeType: true } } },
  });

  const galleryImages = await prisma.productImage.findMany({
    where: { mediaAssetId: { not: null } },
    select: { mediaAsset: { select: { id: true, filename: true, url: true, normalizedUrl: true, mimeType: true } } },
  });

  const seen = new Map<string, ProductMediaAsset>();

  for (const row of mainImages) {
    const asset = row.mainImage;
    if (asset && !seen.has(asset.id)) {
      seen.set(asset.id, asset);
    }
  }

  for (const row of galleryImages) {
    const asset = row.mediaAsset;
    if (asset && !seen.has(asset.id)) {
      seen.set(asset.id, asset);
    }
  }

  return Array.from(seen.values());
}

async function run() {
  console.log(`\n=== Product Image Normalization (${mode}) ===\n`);

  const assets = await collectProductMediaAssets();
  console.log(`Found ${assets.length} product media asset(s).\n`);

  if (assets.length === 0) {
    console.log("Nothing to process.");
    return;
  }

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const asset of assets) {
    const sourcePath = resolveFilePath(asset.url);
    const sourceExists = await fileExists(sourcePath);

    if (!sourceExists) {
      console.log(`  SKIP ${asset.filename} — source file not found at ${sourcePath}`);
      skipped++;
      continue;
    }

    if (asset.normalizedUrl) {
      const normalizedPath = resolveFilePath(asset.normalizedUrl);
      const normalizedExists = await fileExists(normalizedPath);
      if (normalizedExists) {
        console.log(`  SKIP ${asset.filename} — already normalized`);
        skipped++;
        continue;
      }
    }

    const normalizedFilename = buildNormalizedFilename(asset.filename);
    const normalizedPath = path.join(NORMALIZED_DIR, normalizedFilename);
    const normalizedUrl = `/uploads/normalized/${normalizedFilename}`;

    if (mode === "dry-run") {
      console.log(`  WOULD ${asset.filename}`);
      console.log(`    Source:     ${asset.url}`);
      console.log(`    Normalized: ${normalizedUrl}`);
      processed++;
      continue;
    }

    try {
      const inputBuffer = await readFile(sourcePath);
      const result = await normalizeProductImage(inputBuffer);

      await mkdir(NORMALIZED_DIR, { recursive: true });
      await writeFile(normalizedPath, result.buffer);

      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: { normalizedUrl },
      });

      const inputSizeKB = Math.round(inputBuffer.length / 1024);
      const outputSizeKB = Math.round(result.buffer.length / 1024);
      console.log(`  OK   ${asset.filename} → ${normalizedFilename} (${inputSizeKB}KB → ${outputSizeKB}KB)`);
      processed++;
    } catch (err) {
      console.error(`  ERR  ${asset.filename}: ${err instanceof Error ? err.message : err}`);
      errors++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Errors:    ${errors}`);
  console.log(`  Mode:      ${mode}\n`);

  if (mode === "dry-run" && processed > 0) {
    console.log("Run with --apply to write normalized images and update the database.\n");
  }
}

run()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
