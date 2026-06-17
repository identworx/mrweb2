/**
 * Import fabric swatch images from a local folder or ZIP file.
 * Matches images to FabricSwatches by article number in the filename.
 *
 * Usage:
 *   npx tsx scripts/import-swatch-images.ts <folder-or-zip>                  # dry-run
 *   npx tsx scripts/import-swatch-images.ts <folder-or-zip> --apply          # import to CMS
 *   npx tsx scripts/import-swatch-images.ts <folder-or-zip> --replace-existing --apply
 *
 * Filename conventions (article number at start):
 *   401.233.jpg              → dotted article number
 *   401-233-olive.png        → dash-separated (converted to 401.233)
 *   999-234-06-name.webp     → multi-segment (converted to 999.234.06)
 *   15815809.jpg             → 8-digit number
 *   B15815826.png            → letter-prefixed number
 *
 * Safety:
 *   - Dry-run by default (no DB changes without --apply)
 *   - Never overwrites existing swatch images (unless --replace-existing)
 *   - Never modifies families, product types, availabilities, navigation
 *   - Upload limit: 15 MB per file
 *   - Idempotent: re-running is safe
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  rmSync,
} from "node:fs";
import { resolve, join, extname, basename } from "node:path";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MAX_IMAGE_WIDTH = 2000;
const WEBP_QUALITY = 84;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const UPLOAD_DIR = resolve("public/uploads/fabrics");
const REPORT_DIR = resolve("data/import/swatch-images");
const REPORT_JSON = join(REPORT_DIR, "import-report.json");
const REPORT_CSV = join(REPORT_DIR, "import-report.csv");

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".tif", ".bmp",
]);

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const inputPath = args.find((a) => !a.startsWith("--"));
const doApply = args.includes("--apply");
const replaceExisting = args.includes("--replace-existing");

if (!inputPath) {
  console.error(
    "Usage: npx tsx scripts/import-swatch-images.ts <folder-or-zip> [--apply] [--replace-existing]",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ImportStatus =
  | "MATCHED"
  | "NO_MATCH"
  | "DUPLICATE"
  | "ALREADY_HAS_IMAGE"
  | "UNCERTAIN"
  | "IMPORTED"
  | "ERROR";

interface ImportEntry {
  filename: string;
  filePath: string;
  fileSize: number;
  detectedArticleNumbers: string[];
  matchedSwatchId: string | null;
  matchedSwatchName: string | null;
  matchedArticleNumber: string | null;
  matchedFamily: string | null;
  confidence: number;
  status: ImportStatus;
  importCandidate: boolean;
  optimizedPath: string | null;
  mediaAssetId: string | null;
  notes: string;
}

interface ImportSummary {
  timestamp: string;
  sourcePath: string;
  sourceType: "folder" | "zip";
  filesScanned: number;
  imagesFound: number;
  matched: number;
  noMatch: number;
  duplicate: number;
  alreadyHasImage: number;
  uncertain: number;
  importCandidates: number;
  imported: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Article number extraction from filename
// ---------------------------------------------------------------------------

function extractArticleNumbersFromFilename(filename: string): string[] {
  const name = basename(filename).replace(/\.[^.]+$/, "");
  const results: string[] = [];
  let m;

  // 1. Dotted: 401.233 or 999.234.06
  const dottedRe = /\b(\d{2,4}\.\d{2,4}(?:\.\d{1,4})?)\b/g;
  while ((m = dottedRe.exec(name)) !== null) {
    results.push(m[1]);
  }

  // 2. Dash-separated at filename start: 401-233 or 999-234-06
  const dashStart = name.match(/^(\d{2,4})-(\d{2,4})(?:-(\d{1,4}))?(?=-|$)/);
  if (dashStart) {
    const dotted = dashStart[3]
      ? `${dashStart[1]}.${dashStart[2]}.${dashStart[3]}`
      : `${dashStart[1]}.${dashStart[2]}`;
    if (!results.includes(dotted)) results.push(dotted);
  }

  // 3. 8-digit: 15815809
  const digit8Re = /\b(\d{8})\b/g;
  while ((m = digit8Re.exec(name)) !== null) {
    if (!results.includes(m[1])) results.push(m[1]);
  }

  // 4. Letter-prefixed: B15815826
  const prefixedRe = /\b([A-Z]\d{7,8})\b/g;
  while ((m = prefixedRe.exec(name)) !== null) {
    if (!results.includes(m[1])) results.push(m[1]);
  }

  return results;
}

// ---------------------------------------------------------------------------
// DB swatches
// ---------------------------------------------------------------------------

interface DbSwatch {
  id: string;
  slug: string;
  name: string;
  articleNumber: string | null;
  familySlug: string;
  familyName: string;
  hasImage: boolean;
}

async function loadDbSwatches(): Promise<DbSwatch[]> {
  const swatches = await prisma.fabricSwatch.findMany({
    include: { family: true },
  });
  return swatches.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    articleNumber: s.articleNumber,
    familySlug: s.family.slug,
    familyName: s.family.name,
    hasImage: !!s.swatchImageId,
  }));
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

interface MatchResult {
  swatch: DbSwatch | null;
  confidence: number;
  artNum: string;
}

function matchArticleNumber(
  artNum: string,
  dbSwatches: DbSwatch[],
): { swatch: DbSwatch | null; confidence: number } {
  if (!artNum) return { swatch: null, confidence: 0 };

  const exact = dbSwatches.find(
    (s) => s.articleNumber && s.articleNumber === artNum,
  );
  if (exact) return { swatch: exact, confidence: 1.0 };

  const stripped = artNum.replace(/[.\-]/g, "");
  const normalized = dbSwatches.find(
    (s) =>
      s.articleNumber && s.articleNumber.replace(/[.\-]/g, "") === stripped,
  );
  if (normalized) return { swatch: normalized, confidence: 0.9 };

  return { swatch: null, confidence: 0 };
}

interface ConfirmedMatch {
  swatch: DbSwatch;
  confidence: number;
  artNum: string;
}

function findBestMatch(
  artNumbers: string[],
  dbSwatches: DbSwatch[],
): ConfirmedMatch | null {
  let best: ConfirmedMatch | null = null;
  for (const artNum of artNumbers) {
    const { swatch, confidence } = matchArticleNumber(artNum, dbSwatches);
    if (swatch && (!best || confidence > best.confidence)) {
      best = { swatch, confidence, artNum };
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// File scanning
// ---------------------------------------------------------------------------

function scanFolder(folderPath: string): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".") && entry.name !== "__MACOSX") {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext) && !entry.name.startsWith(".")) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(folderPath);
  return files.sort();
}

function extractZip(zipPath: string): string {
  const tmpDir = join(tmpdir(), `swatch-import-${Date.now()}`);
  ensureDir(tmpDir);
  try {
    execSync(`unzip -o -q "${zipPath}" -d "${tmpDir}"`, { stdio: "pipe" });
  } catch (e) {
    rmSync(tmpDir, { recursive: true, force: true });
    throw new Error(`Failed to extract ZIP: ${e}`);
  }
  return tmpDir;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function writeReports(entries: ImportEntry[], summary: ImportSummary) {
  ensureDir(REPORT_DIR);

  writeFileSync(REPORT_JSON, JSON.stringify({ summary, entries }, null, 2));
  console.log(`\nReport: ${REPORT_JSON}`);

  const csvHeader = [
    "status",
    "confidence",
    "importCandidate",
    "filename",
    "detectedArticleNumbers",
    "matchedSwatchName",
    "matchedArticleNumber",
    "matchedFamily",
    "matchedSwatchId",
    "fileSize",
    "mediaAssetId",
    "notes",
  ].join(",");

  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;

  const csvRows = entries.map((e) =>
    [
      e.status,
      e.confidence.toFixed(2),
      e.importCandidate ? "YES" : "",
      esc(e.filename),
      esc(e.detectedArticleNumbers.join("; ")),
      esc(e.matchedSwatchName || ""),
      esc(e.matchedArticleNumber || ""),
      esc(e.matchedFamily || ""),
      e.matchedSwatchId || "",
      e.fileSize,
      e.mediaAssetId || "",
      esc(e.notes),
    ].join(","),
  );

  writeFileSync(REPORT_CSV, [csvHeader, ...csvRows].join("\n"));
  console.log(`CSV:    ${REPORT_CSV}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Swatch Image Importer                                  ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log();

  const absPath = resolve(inputPath!);
  if (!existsSync(absPath)) {
    console.error(`Error: Path not found: ${absPath}`);
    process.exit(1);
  }

  const isZip = absPath.toLowerCase().endsWith(".zip");
  const stat = statSync(absPath);
  const isDir = stat.isDirectory();

  if (!isZip && !isDir) {
    console.error("Error: Input must be a folder or .zip file");
    process.exit(1);
  }

  console.log(
    `Mode:    ${doApply ? "APPLY (import to CMS)" : "DRY-RUN (match only)"}`,
  );
  console.log(
    `Replace: ${replaceExisting ? "YES" : "NO (skip swatches with images)"}`,
  );
  console.log(`Source:  ${absPath} (${isZip ? "ZIP" : "folder"})`);
  console.log();

  let scanDir = absPath;
  let tmpDir: string | null = null;
  if (isZip) {
    console.log("Extracting ZIP...");
    tmpDir = extractZip(absPath);
    scanDir = tmpDir;
    console.log(`  Extracted to: ${tmpDir}\n`);
  }

  try {
    const imageFiles = scanFolder(scanDir);
    console.log(`Images found: ${imageFiles.length}`);

    if (imageFiles.length === 0) {
      console.log("No image files found. Exiting.");
      return;
    }

    const dbSwatches = await loadDbSwatches();
    console.log(`DB swatches: ${dbSwatches.length}`);
    console.log(
      `  With image: ${dbSwatches.filter((s) => s.hasImage).length}`,
    );
    console.log(
      `  Without image: ${dbSwatches.filter((s) => !s.hasImage).length}`,
    );
    console.log();

    // -----------------------------------------------------------------------
    // Phase 1: Match
    // -----------------------------------------------------------------------
    console.log("--- Matching ---");

    const entries: ImportEntry[] = [];
    const matchedSwatchIds = new Set<string>();
    const errors: string[] = [];

    for (const filePath of imageFiles) {
      const filename = basename(filePath);
      const fileSize = statSync(filePath).size;

      if (fileSize > MAX_FILE_SIZE) {
        entries.push({
          filename,
          filePath,
          fileSize,
          detectedArticleNumbers: [],
          matchedSwatchId: null,
          matchedSwatchName: null,
          matchedArticleNumber: null,
          matchedFamily: null,
          confidence: 0,
          status: "ERROR",
          importCandidate: false,
          optimizedPath: null,
          mediaAssetId: null,
          notes: `Exceeds 15 MB (${(fileSize / 1024 / 1024).toFixed(1)} MB)`,
        });
        console.log(`  SKIP   ${filename} — exceeds 15 MB`);
        continue;
      }

      const artNumbers = extractArticleNumbersFromFilename(filename);

      if (artNumbers.length === 0) {
        entries.push({
          filename,
          filePath,
          fileSize,
          detectedArticleNumbers: [],
          matchedSwatchId: null,
          matchedSwatchName: null,
          matchedArticleNumber: null,
          matchedFamily: null,
          confidence: 0,
          status: "NO_MATCH",
          importCandidate: false,
          optimizedPath: null,
          mediaAssetId: null,
          notes: "No article number found in filename",
        });
        console.log(`  MISS   ${filename} — no article number in filename`);
        continue;
      }

      const best = findBestMatch(artNumbers, dbSwatches);

      if (!best) {
        entries.push({
          filename,
          filePath,
          fileSize,
          detectedArticleNumbers: artNumbers,
          matchedSwatchId: null,
          matchedSwatchName: null,
          matchedArticleNumber: null,
          matchedFamily: null,
          confidence: 0,
          status: "NO_MATCH",
          importCandidate: false,
          optimizedPath: null,
          mediaAssetId: null,
          notes: `Detected [${artNumbers.join(", ")}] — no DB match`,
        });
        console.log(
          `  MISS   ${filename} — [${artNumbers.join(", ")}] not in DB`,
        );
        continue;
      }

      const { swatch, confidence, artNum } = best;

      if (matchedSwatchIds.has(swatch.id)) {
        entries.push({
          filename,
          filePath,
          fileSize,
          detectedArticleNumbers: artNumbers,
          matchedSwatchId: swatch.id,
          matchedSwatchName: swatch.name,
          matchedArticleNumber: swatch.articleNumber,
          matchedFamily: `${swatch.familyName} (${swatch.familySlug})`,
          confidence,
          status: "DUPLICATE",
          importCandidate: false,
          optimizedPath: null,
          mediaAssetId: null,
          notes: "Another file already matched this swatch",
        });
        console.log(
          `  DUP    ${filename} → ${swatch.name} (already matched)`,
        );
        continue;
      }

      if (swatch.hasImage && !replaceExisting) {
        entries.push({
          filename,
          filePath,
          fileSize,
          detectedArticleNumbers: artNumbers,
          matchedSwatchId: swatch.id,
          matchedSwatchName: swatch.name,
          matchedArticleNumber: swatch.articleNumber,
          matchedFamily: `${swatch.familyName} (${swatch.familySlug})`,
          confidence,
          status: "ALREADY_HAS_IMAGE",
          importCandidate: false,
          optimizedPath: null,
          mediaAssetId: null,
          notes: "Swatch already has image (use --replace-existing)",
        });
        console.log(
          `  HAS    ${filename} → ${swatch.name} (already has image)`,
        );
        continue;
      }

      const status: ImportStatus =
        confidence >= 0.85 ? "MATCHED" : "UNCERTAIN";
      const importCandidate = status === "MATCHED";

      matchedSwatchIds.add(swatch.id);

      entries.push({
        filename,
        filePath,
        fileSize,
        detectedArticleNumbers: artNumbers,
        matchedSwatchId: swatch.id,
        matchedSwatchName: swatch.name,
        matchedArticleNumber: swatch.articleNumber,
        matchedFamily: `${swatch.familyName} (${swatch.familySlug})`,
        confidence,
        status,
        importCandidate,
        optimizedPath: null,
        mediaAssetId: null,
        notes: importCandidate
          ? `Matched via ${artNum}`
          : `Low confidence (${confidence.toFixed(2)}) via ${artNum}`,
      });

      const icon = importCandidate ? "MATCH" : "UNSURE";
      console.log(
        `  ${icon.padEnd(6)} ${filename} → ${swatch.name} (${swatch.articleNumber}) [${confidence.toFixed(2)}]`,
      );
    }

    // -----------------------------------------------------------------------
    // Phase 2: Import (only with --apply)
    // -----------------------------------------------------------------------
    if (doApply) {
      console.log("\n--- Import ---");
      const importable = entries.filter((e) => e.importCandidate);

      if (importable.length === 0) {
        console.log("  No import candidates. Nothing to do.");
      }

      for (const entry of importable) {
        try {
          const input = readFileSync(entry.filePath);
          const result = await sharp(input, { failOn: "none" })
            .rotate()
            .resize(MAX_IMAGE_WIDTH, undefined, {
              withoutEnlargement: true,
              fit: "inside",
            })
            .webp({ quality: WEBP_QUALITY, effort: 4 })
            .toBuffer({ resolveWithObject: true });

          if (result.data.length > MAX_FILE_SIZE) {
            entry.status = "ERROR";
            entry.notes = `Optimized exceeds 15 MB (${(result.data.length / 1024 / 1024).toFixed(1)} MB)`;
            errors.push(`${entry.filename}: optimized too large`);
            console.log(`  ERROR  ${entry.filename} — optimized too large`);
            continue;
          }

          const timestamp = Date.now();
          const slug = sanitizeFilename(entry.matchedSwatchName || "swatch");
          const webpFilename = `${slug}-${timestamp}.webp`;
          ensureDir(UPLOAD_DIR);
          const uploadPath = join(UPLOAD_DIR, webpFilename);
          writeFileSync(uploadPath, result.data);
          entry.optimizedPath = uploadPath;

          const asset = await prisma.mediaAsset.create({
            data: {
              filename: webpFilename,
              originalName: entry.filename,
              url: `/uploads/fabrics/${webpFilename}`,
              mimeType: "image/webp",
              size: result.data.length,
              width: result.info.width ?? null,
              height: result.info.height ?? null,
              alt: entry.matchedSwatchName
                ? `${entry.matchedSwatchName} Stoffmuster`
                : "Stoffmuster",
              folder: "fabrics",
            },
          });

          await prisma.fabricSwatch.update({
            where: { id: entry.matchedSwatchId! },
            data: { swatchImageId: asset.id },
          });

          entry.status = "IMPORTED";
          entry.mediaAssetId = asset.id;
          entry.notes =
            `Imported: ${result.info.width}×${result.info.height}, ` +
            `${(result.data.length / 1024).toFixed(0)} KB`;
          console.log(
            `  OK     ${entry.filename} → ${entry.matchedSwatchName} ` +
              `(${result.info.width}×${result.info.height}, ${(result.data.length / 1024).toFixed(0)} KB)`,
          );
        } catch (e) {
          entry.status = "ERROR";
          entry.notes = `Import failed: ${e}`;
          errors.push(`${entry.filename}: ${e}`);
          console.log(`  ERROR  ${entry.filename} — ${e}`);
        }
      }
    }

    // -----------------------------------------------------------------------
    // Summary & Report
    // -----------------------------------------------------------------------
    const summary: ImportSummary = {
      timestamp: new Date().toISOString(),
      sourcePath: absPath,
      sourceType: isZip ? "zip" : "folder",
      filesScanned: imageFiles.length,
      imagesFound: imageFiles.length,
      matched: entries.filter(
        (e) => e.status === "MATCHED" || e.status === "IMPORTED",
      ).length,
      noMatch: entries.filter((e) => e.status === "NO_MATCH").length,
      duplicate: entries.filter((e) => e.status === "DUPLICATE").length,
      alreadyHasImage: entries.filter((e) => e.status === "ALREADY_HAS_IMAGE")
        .length,
      uncertain: entries.filter((e) => e.status === "UNCERTAIN").length,
      importCandidates: entries.filter((e) => e.importCandidate).length,
      imported: entries.filter((e) => e.status === "IMPORTED").length,
      errors,
    };

    writeReports(entries, summary);

    console.log("\n========== Summary ==========");
    console.log(`Files scanned:     ${summary.filesScanned}`);
    console.log(`Matched:           ${summary.matched}`);
    console.log(`No match:          ${summary.noMatch}`);
    console.log(`Duplicate:         ${summary.duplicate}`);
    console.log(`Already has image: ${summary.alreadyHasImage}`);
    console.log(`Uncertain:         ${summary.uncertain}`);
    console.log(`Import candidates: ${summary.importCandidates}`);
    console.log(`Imported:          ${summary.imported}`);
    if (errors.length > 0) {
      console.log(`Errors:            ${errors.length}`);
      for (const e of errors) console.log(`  - ${e}`);
    }
    if (!doApply && summary.importCandidates > 0) {
      console.log(
        `\nRun with --apply to import ${summary.importCandidates} matched image(s).`,
      );
    }
    console.log("\nDone.");
  } finally {
    if (tmpDir) {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
