/**
 * Scrape fabric swatch images from axroma.com.cn and match to FabricSwatches.
 *
 * Three-phase workflow:
 *   1. Dry-run (default) — scrape page, detect images, match to DB swatches, write report
 *   2. --download         — also download images to staging + optimize to WebP
 *   3. --apply            — import READY_FOR_IMPORT images into CMS (MediaAsset + FabricSwatch link)
 *
 * Safety:
 *   - Only fetches from axroma.com.cn (domain allowlist)
 *   - Rate-limited (configurable delay between requests)
 *   - Never overwrites existing swatch images (unless --replace-existing)
 *   - Never deletes/modifies families, product types, availabilities, navigation
 *   - Staging directory: data/import/axroma-images/
 *   - Report: data/import/axroma-images-report.json + .csv
 *   - Idempotent at every phase
 *
 * Usage:
 *   npx tsx scripts/scrape-axroma-fabric-images.ts                     # dry-run
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --download           # + download images
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --download --apply   # + import to CMS
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --replace-existing   # allow overwriting existing images
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, join, extname } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ALLOWED_DOMAIN = "axroma.com.cn";
const BASE_URL = `http://${ALLOWED_DOMAIN}/en/product/product.html`;
const REQUEST_DELAY_MS = 800;
const REQUEST_TIMEOUT_MS = 15_000;
const USER_AGENT =
  "MosaromaFabricScraper/1.0 (+https://mosaroma.de; internal use)";
const MAX_IMAGE_WIDTH = 2000;
const WEBP_QUALITY = 84;

const STAGING_DIR = resolve("data/import/axroma-images");
const ORIGINAL_DIR = join(STAGING_DIR, "original");
const OPTIMIZED_DIR = join(STAGING_DIR, "optimized");
const REPORT_JSON = join(STAGING_DIR, "axroma-images-report.json");
const REPORT_CSV = join(STAGING_DIR, "axroma-images-report.csv");
const UPLOAD_DIR = resolve("public/uploads/fabrics");

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const doDownload = args.includes("--download");
const doApply = args.includes("--apply");
const replaceExisting = args.includes("--replace-existing");
const resumeFrom = (() => {
  const idx = args.indexOf("--resume-report");
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
})();

// ---------------------------------------------------------------------------
// DB
// ---------------------------------------------------------------------------

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MatchStatus =
  | "MATCHED"
  | "UNCERTAIN"
  | "NO_MATCH"
  | "DUPLICATE"
  | "MISSING_IMAGE"
  | "ALREADY_HAS_IMAGE"
  | "READY_FOR_IMPORT"
  | "IMPORTED"
  | "SKIPPED"
  | "ERROR";

interface ScrapedImage {
  sourceUrl: string;
  imageUrl: string;
  detectedName: string;
  detectedArticleNumber: string;
  matchedSwatchId: string | null;
  matchedSwatchName: string | null;
  matchedArticleNumber: string | null;
  confidence: number;
  status: MatchStatus;
  localOriginalPath: string | null;
  localOptimizedPath: string | null;
  notes: string;
}

interface ReportSummary {
  timestamp: string;
  sourceUrl: string;
  pagesScraped: number;
  imagesFound: number;
  imagesDownloaded: number;
  exactMatches: number;
  uncertainMatches: number;
  noMatches: number;
  alreadyHasImage: number;
  readyForImport: number;
  imported: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === ALLOWED_DOMAIN || parsed.hostname.endsWith(`.${ALLOWED_DOMAIN}`);
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
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

function buildStagingFilename(articleNumber: string, slug: string, ext: string): string {
  const artPart = articleNumber.replace(/\./g, "-");
  return `${artPart}-${slug}${ext}`;
}

function normalizeForMatching(s: string): string {
  return s
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

async function fetchWithGuards(url: string): Promise<Response> {
  if (!isAllowedUrl(url)) {
    throw new Error(`Blocked: URL "${url}" is not on allowed domain ${ALLOWED_DOMAIN}`);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    // Validate final URL is still on allowed domain
    if (resp.url && !isAllowedUrl(resp.url)) {
      throw new Error(`Redirect to disallowed domain: ${resp.url}`);
    }
    return resp;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Phase 1: Scrape & Parse
// ---------------------------------------------------------------------------

interface ParsedProduct {
  name: string;
  articleNumber: string;
  imageUrl: string;
  detailUrl: string;
}

function extractProducts(html: string, pageUrl: string): ParsedProduct[] {
  const products: ParsedProduct[] = [];
  const baseUrl = new URL(pageUrl);

  // Strategy 1: Look for structured product items with images
  // Common patterns: <div class="product-item">, <li class="product">, etc.
  // We try multiple regex patterns to handle various HTML structures.

  // Pattern A: img tags with data-src or src near text with article numbers
  const imgPattern = /<img[^>]*(?:data-src|data-original|src)\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const allImages: Array<{ url: string; context: string }> = [];

  let imgMatch;
  while ((imgMatch = imgPattern.exec(html)) !== null) {
    const imgUrl = imgMatch[1];
    if (!imgUrl || imgUrl.startsWith("data:")) continue;

    // Get surrounding context (500 chars before and after)
    const start = Math.max(0, imgMatch.index - 500);
    const end = Math.min(html.length, imgMatch.index + imgMatch[0].length + 500);
    const context = html.slice(start, end);

    // Only care about product/fabric images (filter out icons, logos, banners)
    const lower = imgUrl.toLowerCase();
    if (lower.includes("logo") || lower.includes("icon") || lower.includes("banner")) continue;
    if (lower.includes("favicon") || lower.includes("sprite")) continue;

    const absoluteUrl = imgUrl.startsWith("http")
      ? imgUrl
      : new URL(imgUrl, baseUrl).href;

    if (!isAllowedUrl(absoluteUrl)) continue;

    allImages.push({ url: absoluteUrl, context });
  }

  // Pattern B: Try to extract product data from context around each image
  for (const { url: imageUrl, context } of allImages) {
    // Try to find article number patterns (e.g. 405.813, 999.234.06)
    const artMatch = context.match(/\b(\d{2,4}[.-]\d{2,4}(?:[.-]\d{1,4})?)\b/);
    const articleNumber = artMatch ? artMatch[1].replace(/-/g, ".") : "";

    // Try to extract product name from nearby headings or strong/span tags
    const namePatterns = [
      /<h[2-6][^>]*>([^<]{3,80})<\/h[2-6]>/i,
      /<strong[^>]*>([^<]{3,80})<\/strong>/i,
      /<span[^>]*class="[^"]*(?:name|title|product)[^"]*"[^>]*>([^<]{3,80})<\/span>/i,
      /<p[^>]*class="[^"]*(?:name|title|product)[^"]*"[^>]*>([^<]{3,60})<\/p>/i,
      /<a[^>]*title="([^"]{3,80})"[^>]*>/i,
      /alt="([^"]{3,80})"/i,
    ];

    let detectedName = "";
    for (const pat of namePatterns) {
      const m = context.match(pat);
      if (m) {
        detectedName = m[1].trim().replace(/\s+/g, " ");
        break;
      }
    }

    // Try to find a detail page link
    const linkMatch = context.match(/<a[^>]*href="([^"]*(?:product|detail|fabric)[^"]*)"[^>]*>/i);
    const detailUrl = linkMatch
      ? (linkMatch[1].startsWith("http") ? linkMatch[1] : new URL(linkMatch[1], baseUrl).href)
      : "";

    // Skip if this looks like a decorative/layout image (no name, no article)
    if (!detectedName && !articleNumber) continue;

    products.push({
      name: detectedName || "(unknown)",
      articleNumber,
      imageUrl,
      detailUrl: isAllowedUrl(detailUrl) ? detailUrl : "",
    });
  }

  return products;
}

function findPaginationLinks(html: string, pageUrl: string): string[] {
  const baseUrl = new URL(pageUrl);
  const links: string[] = [];
  const pattern = /<a[^>]*href="([^"]*)"[^>]*>[^<]*(?:\d+|next|Next|»|›)[^<]*<\/a>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const href = match[1].startsWith("http")
      ? match[1]
      : new URL(match[1], baseUrl).href;
    if (isAllowedUrl(href) && !links.includes(href) && href !== pageUrl) {
      links.push(href);
    }
  }
  return links;
}

// ---------------------------------------------------------------------------
// Phase 1b: Match against DB swatches
// ---------------------------------------------------------------------------

interface DbSwatch {
  id: string;
  slug: string;
  name: string;
  articleNumber: string | null;
  familySlug: string;
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
    hasImage: !!s.swatchImageId,
  }));
}

function matchToSwatch(
  scraped: ParsedProduct,
  dbSwatches: DbSwatch[],
): { swatch: DbSwatch | null; confidence: number; method: string } {
  // Priority 1: Exact article number match
  if (scraped.articleNumber) {
    const normalized = scraped.articleNumber.replace(/-/g, ".");
    const exact = dbSwatches.find(
      (s) => s.articleNumber && s.articleNumber === normalized,
    );
    if (exact) return { swatch: exact, confidence: 1.0, method: "article-exact" };

    // Try without dots
    const stripped = normalized.replace(/\./g, "");
    const loose = dbSwatches.find(
      (s) => s.articleNumber && s.articleNumber.replace(/\./g, "") === stripped,
    );
    if (loose) return { swatch: loose, confidence: 0.9, method: "article-normalized" };
  }

  // Priority 2: Normalized name match
  if (scraped.name && scraped.name !== "(unknown)") {
    const norm = normalizeForMatching(scraped.name);

    const nameExact = dbSwatches.find(
      (s) => normalizeForMatching(s.name) === norm,
    );
    if (nameExact) return { swatch: nameExact, confidence: 0.85, method: "name-exact" };

    // Check if scraped name contains the DB name or vice versa
    const namePartial = dbSwatches.find((s) => {
      const n = normalizeForMatching(s.name);
      return (n.length > 4 && norm.includes(n)) || (norm.length > 4 && n.includes(norm));
    });
    if (namePartial) return { swatch: namePartial, confidence: 0.6, method: "name-partial" };
  }

  return { swatch: null, confidence: 0, method: "none" };
}

// ---------------------------------------------------------------------------
// Phase 2: Download & Optimize
// ---------------------------------------------------------------------------

async function downloadImage(
  imageUrl: string,
  originalPath: string,
): Promise<{ ok: boolean; size: number; contentType: string; error?: string }> {
  if (existsSync(originalPath)) {
    const stat = readFileSync(originalPath);
    return { ok: true, size: stat.length, contentType: "cached" };
  }

  try {
    const resp = await fetchWithGuards(imageUrl);
    if (!resp.ok) {
      return { ok: false, size: 0, contentType: "", error: `HTTP ${resp.status}` };
    }

    const ct = resp.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) {
      return { ok: false, size: 0, contentType: ct, error: `Not an image: ${ct}` };
    }

    const buffer = Buffer.from(await resp.arrayBuffer());

    // Validate size (15 MB limit)
    if (buffer.length > 15 * 1024 * 1024) {
      return { ok: false, size: buffer.length, contentType: ct, error: "Exceeds 15 MB" };
    }

    ensureDir(ORIGINAL_DIR);
    writeFileSync(originalPath, buffer);
    return { ok: true, size: buffer.length, contentType: ct };
  } catch (e) {
    return { ok: false, size: 0, contentType: "", error: String(e) };
  }
}

async function optimizeImage(
  originalPath: string,
  optimizedPath: string,
): Promise<{ ok: boolean; width: number; height: number; size: number; error?: string }> {
  if (existsSync(optimizedPath)) {
    const meta = await sharp(optimizedPath).metadata();
    const buf = readFileSync(optimizedPath);
    return { ok: true, width: meta.width ?? 0, height: meta.height ?? 0, size: buf.length };
  }

  try {
    const input = readFileSync(originalPath);
    const result = await sharp(input, { failOn: "none" })
      .rotate()
      .resize(MAX_IMAGE_WIDTH, undefined, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    ensureDir(OPTIMIZED_DIR);
    writeFileSync(optimizedPath, result.data);

    return {
      ok: true,
      width: result.info.width,
      height: result.info.height,
      size: result.data.length,
    };
  } catch (e) {
    return { ok: false, width: 0, height: 0, size: 0, error: String(e) };
  }
}

// ---------------------------------------------------------------------------
// Phase 3: CMS Import
// ---------------------------------------------------------------------------

async function importToCms(
  entry: ScrapedImage,
): Promise<{ ok: boolean; mediaAssetId?: string; error?: string }> {
  if (!entry.localOptimizedPath || !existsSync(entry.localOptimizedPath)) {
    return { ok: false, error: "Optimized file not found" };
  }
  if (!entry.matchedSwatchId) {
    return { ok: false, error: "No matched swatch" };
  }

  const swatch = await prisma.fabricSwatch.findUnique({
    where: { id: entry.matchedSwatchId },
  });
  if (!swatch) {
    return { ok: false, error: "Swatch not found in DB" };
  }
  if (swatch.swatchImageId && !replaceExisting) {
    return { ok: false, error: "Swatch already has image (use --replace-existing)" };
  }

  const buffer = readFileSync(entry.localOptimizedPath);
  const meta = await sharp(buffer).metadata();
  const timestamp = Date.now();
  const filename = `${sanitizeFilename(entry.matchedSwatchName || "swatch")}-${timestamp}.webp`;

  // Copy to uploads
  ensureDir(UPLOAD_DIR);
  const uploadPath = join(UPLOAD_DIR, filename);
  writeFileSync(uploadPath, buffer);

  // Create MediaAsset
  const asset = await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: `${entry.detectedName || "fabric-swatch"}.webp`,
      url: `/uploads/fabrics/${filename}`,
      mimeType: "image/webp",
      size: buffer.length,
      width: meta.width ?? null,
      height: meta.height ?? null,
      alt: entry.matchedSwatchName
        ? `${entry.matchedSwatchName} Stoffmuster`
        : "Stoffmuster",
      folder: "fabrics",
    },
  });

  // Link to swatch
  await prisma.fabricSwatch.update({
    where: { id: entry.matchedSwatchId },
    data: { swatchImageId: asset.id },
  });

  return { ok: true, mediaAssetId: asset.id };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function writeReports(images: ScrapedImage[], summary: ReportSummary) {
  ensureDir(STAGING_DIR);

  // JSON report
  writeFileSync(REPORT_JSON, JSON.stringify({ summary, images }, null, 2));
  console.log(`\nReport written: ${REPORT_JSON}`);

  // CSV report
  const csvHeader = [
    "status",
    "confidence",
    "detectedName",
    "detectedArticleNumber",
    "matchedSwatchName",
    "matchedArticleNumber",
    "matchedSwatchId",
    "imageUrl",
    "sourceUrl",
    "localOriginalPath",
    "localOptimizedPath",
    "notes",
  ].join(",");

  const csvRows = images.map((img) =>
    [
      img.status,
      img.confidence.toFixed(2),
      `"${(img.detectedName || "").replace(/"/g, '""')}"`,
      `"${img.detectedArticleNumber || ""}"`,
      `"${(img.matchedSwatchName || "").replace(/"/g, '""')}"`,
      `"${img.matchedArticleNumber || ""}"`,
      img.matchedSwatchId || "",
      `"${img.imageUrl}"`,
      `"${img.sourceUrl}"`,
      img.localOriginalPath || "",
      img.localOptimizedPath || "",
      `"${(img.notes || "").replace(/"/g, '""')}"`,
    ].join(","),
  );

  writeFileSync(REPORT_CSV, [csvHeader, ...csvRows].join("\n"));
  console.log(`CSV written: ${REPORT_CSV}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Axroma Fabric Image Scraper                            ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`Mode:     ${doApply ? "APPLY (import to CMS)" : doDownload ? "DOWNLOAD (staging only)" : "DRY-RUN (scrape + match only)"}`);
  console.log(`Replace:  ${replaceExisting ? "YES (overwrite existing images)" : "NO (skip swatches with images)"}`);
  console.log(`Source:   ${BASE_URL}`);
  console.log(`Staging:  ${STAGING_DIR}`);
  console.log();

  // -------------------------------------------------------------------------
  // Load DB swatches
  // -------------------------------------------------------------------------
  const dbSwatches = await loadDbSwatches();
  console.log(`DB swatches loaded: ${dbSwatches.length}`);
  console.log(`  With image: ${dbSwatches.filter((s) => s.hasImage).length}`);
  console.log(`  Without image: ${dbSwatches.filter((s) => !s.hasImage).length}`);
  console.log();

  // -------------------------------------------------------------------------
  // Resume from existing report if requested
  // -------------------------------------------------------------------------
  let images: ScrapedImage[] = [];
  let pagesScraped = 0;
  const errors: string[] = [];

  if (resumeFrom && existsSync(resumeFrom)) {
    console.log(`Resuming from report: ${resumeFrom}`);
    const existing = JSON.parse(readFileSync(resumeFrom, "utf-8"));
    images = existing.images || [];
    pagesScraped = existing.summary?.pagesScraped || 0;
    console.log(`  Loaded ${images.length} entries from previous report\n`);
  } else {
    // -----------------------------------------------------------------------
    // Phase 1: Scrape
    // -----------------------------------------------------------------------
    console.log("--- Phase 1: Scrape & Parse ---");

    const visitedPages = new Set<string>();
    const pagesToVisit = [BASE_URL];

    while (pagesToVisit.length > 0) {
      const pageUrl = pagesToVisit.shift()!;
      if (visitedPages.has(pageUrl)) continue;
      visitedPages.add(pageUrl);

      console.log(`  Fetching: ${pageUrl}`);
      try {
        const resp = await fetchWithGuards(pageUrl);
        if (!resp.ok) {
          const msg = `HTTP ${resp.status} for ${pageUrl}`;
          console.log(`    ERROR: ${msg}`);
          errors.push(msg);
          continue;
        }

        const html = await resp.text();
        pagesScraped++;

        // Extract products
        const products = extractProducts(html, pageUrl);
        console.log(`    Found ${products.length} product images`);

        // Find pagination / category links
        const nextPages = findPaginationLinks(html, pageUrl);
        for (const np of nextPages) {
          if (!visitedPages.has(np)) pagesToVisit.push(np);
        }

        // Match products to DB swatches
        const seenImages = new Set(images.map((i) => i.imageUrl));
        for (const prod of products) {
          if (seenImages.has(prod.imageUrl)) {
            images.push({
              sourceUrl: pageUrl,
              imageUrl: prod.imageUrl,
              detectedName: prod.name,
              detectedArticleNumber: prod.articleNumber,
              matchedSwatchId: null,
              matchedSwatchName: null,
              matchedArticleNumber: null,
              confidence: 0,
              status: "DUPLICATE",
              localOriginalPath: null,
              localOptimizedPath: null,
              notes: "Duplicate image URL",
            });
            continue;
          }
          seenImages.add(prod.imageUrl);

          const { swatch, confidence, method } = matchToSwatch(prod, dbSwatches);

          let status: MatchStatus;
          if (!swatch) {
            status = "NO_MATCH";
          } else if (swatch.hasImage && !replaceExisting) {
            status = "ALREADY_HAS_IMAGE";
          } else if (confidence >= 0.85) {
            status = "MATCHED";
          } else {
            status = "UNCERTAIN";
          }

          images.push({
            sourceUrl: pageUrl,
            imageUrl: prod.imageUrl,
            detectedName: prod.name,
            detectedArticleNumber: prod.articleNumber,
            matchedSwatchId: swatch?.id ?? null,
            matchedSwatchName: swatch?.name ?? null,
            matchedArticleNumber: swatch?.articleNumber ?? null,
            confidence,
            status,
            localOriginalPath: null,
            localOptimizedPath: null,
            notes: swatch ? `match: ${method}` : "No matching swatch found",
          });
        }

        await sleep(REQUEST_DELAY_MS);
      } catch (e) {
        const msg = `Error fetching ${pageUrl}: ${e}`;
        console.log(`    ERROR: ${msg}`);
        errors.push(msg);
      }
    }
  }

  // Mark MATCHED entries as READY_FOR_IMPORT (if they haven't been downloaded yet, that happens in Phase 2)
  // For now, just report what we found.
  console.log(`\n  Total scraped images: ${images.length}`);

  // -------------------------------------------------------------------------
  // Phase 2: Download (if --download)
  // -------------------------------------------------------------------------
  if (doDownload) {
    console.log("\n--- Phase 2: Download & Optimize ---");

    const downloadable = images.filter(
      (i) => i.status === "MATCHED" || i.status === "UNCERTAIN" || (i.status === "ALREADY_HAS_IMAGE" && replaceExisting),
    );
    console.log(`  Downloadable entries: ${downloadable.length}`);

    for (const entry of downloadable) {
      if (!entry.matchedSwatchId || !entry.matchedArticleNumber) continue;

      const slug = dbSwatches.find((s) => s.id === entry.matchedSwatchId)?.slug ?? "unknown";
      const ext = extname(new URL(entry.imageUrl).pathname) || ".jpg";
      const baseName = buildStagingFilename(entry.matchedArticleNumber, slug, ext);
      const originalPath = join(ORIGINAL_DIR, baseName);
      const optimizedPath = join(OPTIMIZED_DIR, baseName.replace(/\.[^.]+$/, ".webp"));

      console.log(`  Downloading: ${entry.detectedName || entry.imageUrl}`);

      const dl = await downloadImage(entry.imageUrl, originalPath);
      if (!dl.ok) {
        entry.status = "ERROR";
        entry.notes += `; download failed: ${dl.error}`;
        console.log(`    FAILED: ${dl.error}`);
        await sleep(REQUEST_DELAY_MS);
        continue;
      }

      entry.localOriginalPath = originalPath;
      console.log(`    Saved: ${originalPath} (${(dl.size / 1024).toFixed(0)} KB)`);

      // Optimize
      const opt = await optimizeImage(originalPath, optimizedPath);
      if (!opt.ok) {
        entry.notes += `; optimize failed: ${opt.error}`;
        console.log(`    Optimize FAILED: ${opt.error}`);
      } else {
        entry.localOptimizedPath = optimizedPath;
        console.log(`    Optimized: ${opt.width}×${opt.height}, ${(opt.size / 1024).toFixed(0)} KB`);
      }

      // Update status
      if (entry.status === "MATCHED" && entry.localOptimizedPath) {
        entry.status = "READY_FOR_IMPORT";
      }

      await sleep(REQUEST_DELAY_MS);
    }
  }

  // -------------------------------------------------------------------------
  // Phase 3: Apply (if --apply)
  // -------------------------------------------------------------------------
  if (doApply) {
    console.log("\n--- Phase 3: CMS Import ---");

    const importable = images.filter((i) => i.status === "READY_FOR_IMPORT");
    console.log(`  Entries ready for import: ${importable.length}`);

    if (importable.length === 0) {
      console.log("  Nothing to import. Run with --download first, then review the report.");
    }

    for (const entry of importable) {
      console.log(`  Importing: ${entry.matchedSwatchName} (${entry.matchedArticleNumber})`);
      const result = await importToCms(entry);
      if (result.ok) {
        entry.status = "IMPORTED";
        entry.notes += `; mediaAssetId=${result.mediaAssetId}`;
        console.log(`    OK: MediaAsset ${result.mediaAssetId}`);
      } else {
        entry.status = "ERROR";
        entry.notes += `; import failed: ${result.error}`;
        console.log(`    FAILED: ${result.error}`);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Summary & Report
  // -------------------------------------------------------------------------
  const summary: ReportSummary = {
    timestamp: new Date().toISOString(),
    sourceUrl: BASE_URL,
    pagesScraped,
    imagesFound: images.length,
    imagesDownloaded: images.filter((i) => i.localOriginalPath).length,
    exactMatches: images.filter((i) => i.confidence >= 0.85 && i.status !== "NO_MATCH").length,
    uncertainMatches: images.filter((i) => i.status === "UNCERTAIN").length,
    noMatches: images.filter((i) => i.status === "NO_MATCH").length,
    alreadyHasImage: images.filter((i) => i.status === "ALREADY_HAS_IMAGE").length,
    readyForImport: images.filter((i) => i.status === "READY_FOR_IMPORT").length,
    imported: images.filter((i) => i.status === "IMPORTED").length,
    errors,
  };

  writeReports(images, summary);

  console.log("\n========== Summary ==========");
  console.log(`Pages scraped:       ${summary.pagesScraped}`);
  console.log(`Images found:        ${summary.imagesFound}`);
  console.log(`Images downloaded:   ${summary.imagesDownloaded}`);
  console.log(`Exact matches:       ${summary.exactMatches}`);
  console.log(`Uncertain matches:   ${summary.uncertainMatches}`);
  console.log(`No matches:          ${summary.noMatches}`);
  console.log(`Already has image:   ${summary.alreadyHasImage}`);
  console.log(`Ready for import:    ${summary.readyForImport}`);
  console.log(`Imported:            ${summary.imported}`);
  if (errors.length > 0) {
    console.log(`Errors:              ${errors.length}`);
    for (const e of errors) console.log(`  - ${e}`);
  }
  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
