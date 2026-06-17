/**
 * Scrape fabric swatch images from axroma.com.cn and match to FabricSwatches.
 *
 * Deep-crawl workflow with three phases:
 *   1. Dry-run (default) — crawl pages, detect images, match to DB swatches, write report
 *   2. --download         — also download matched images to staging + optimize to WebP
 *   3. --apply            — import READY_FOR_IMPORT images into CMS (MediaAsset + FabricSwatch link)
 *
 * Safety:
 *   - Only fetches from axroma.com.cn (domain allowlist)
 *   - Rate-limited (800ms between requests)
 *   - Max pages / max depth limits
 *   - Never overwrites existing swatch images (unless --replace-existing)
 *   - Never deletes/modifies families, product types, availabilities, navigation
 *   - Staging directory: data/import/axroma-images/
 *   - Report: data/import/axroma-images-report.json + .csv
 *   - Idempotent at every phase
 *
 * Usage:
 *   npx tsx scripts/scrape-axroma-fabric-images.ts                          # dry-run (full crawl)
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --download               # + download images
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --download --apply       # + import to CMS
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --url "<url>"            # start from specific URL
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --url "<url>" --detail-only  # single page only
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --max-pages 200 --max-depth 4
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --download-uncertain     # also download UNCERTAIN
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --replace-existing       # overwrite existing images
 *   npx tsx scripts/scrape-axroma-fabric-images.ts --resume-report <path>   # resume from report
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { resolve, join, extname } from "node:path";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ALLOWED_DOMAIN = "axroma.com.cn";
const DEFAULT_START_URL = `http://${ALLOWED_DOMAIN}/en/product/product.html`;
const REQUEST_DELAY_MS = 800;
const REQUEST_TIMEOUT_MS = 15_000;
const USER_AGENT =
  "MosaromaFabricScraper/2.0 (+https://mosaroma.de; internal use)";
const MAX_IMAGE_WIDTH = 2000;
const WEBP_QUALITY = 84;

const STAGING_DIR = resolve("data/import/axroma-images");
const ORIGINAL_DIR = join(STAGING_DIR, "original");
const OPTIMIZED_DIR = join(STAGING_DIR, "optimized");
const REPORT_JSON = join(STAGING_DIR, "axroma-images-report.json");
const REPORT_CSV = join(STAGING_DIR, "axroma-images-report.csv");
const UPLOAD_DIR = resolve("public/uploads/fabrics");

const SKIP_EXTENSIONS = new Set([
  ".pdf", ".zip", ".rar", ".doc", ".docx", ".xls", ".xlsx",
  ".mp4", ".mp3", ".avi", ".mov", ".css", ".js",
]);

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function flagValue(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

function flagInt(name: string, fallback: number): number {
  const v = flagValue(name);
  return v ? parseInt(v, 10) || fallback : fallback;
}

const doDownload = args.includes("--download");
const doApply = args.includes("--apply");
const replaceExisting = args.includes("--replace-existing");
const downloadUncertain = args.includes("--download-uncertain");
const detailOnly = args.includes("--detail-only");
const startUrl = flagValue("--url") || DEFAULT_START_URL;
const maxPages = flagInt("--max-pages", 100);
const maxDepth = flagInt("--max-depth", 3);
const resumeFrom = flagValue("--resume-report");

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
  | "DUPLICATE_CANDIDATE"
  | "ALTERNATIVE_IMAGE"
  | "MISSING_IMAGE"
  | "ALREADY_HAS_IMAGE"
  | "READY_FOR_IMPORT"
  | "IMPORTED"
  | "SKIPPED"
  | "IGNORED"
  | "ERROR";

type ImageRole = "swatch" | "product" | "detail" | "gallery" | "unknown" | "ignored";

interface ScrapedImage {
  sourcePageUrl: string;
  imageUrl: string;
  detectedName: string;
  detectedArticleNumber: string;
  surroundingText: string;
  alt: string;
  title: string;
  matchedSwatchId: string | null;
  matchedSwatchName: string | null;
  matchedArticleNumber: string | null;
  matchedFamily: string | null;
  confidence: number;
  status: MatchStatus;
  imageRole: ImageRole;
  ignoredReason: string;
  localOriginalPath: string | null;
  localOptimizedPath: string | null;
  notes: string;
}

interface PageReport {
  pageUrl: string;
  depth: number;
  linksFound: number;
  detailLinksFound: number;
  imagesFound: number;
  detectedArticleNumbers: string[];
  detectedNames: string[];
}

interface ReportSummary {
  timestamp: string;
  sourceUrl: string;
  pagesQueued: number;
  pagesScraped: number;
  pagesSkipped: number;
  detailPagesScraped: number;
  imagesFound: number;
  imagesIgnored: number;
  imagesMatched: number;
  imagesUncertain: number;
  imagesNoMatch: number;
  alreadyHasImage: number;
  readyForImport: number;
  downloaded: number;
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
    return (
      parsed.hostname === ALLOWED_DOMAIN ||
      parsed.hostname.endsWith(`.${ALLOWED_DOMAIN}`)
    );
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

function buildStagingFilename(
  articleNumber: string,
  slug: string,
  ext: string,
): string {
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

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchWithGuards(url: string): Promise<Response> {
  if (!isAllowedUrl(url)) {
    throw new Error(
      `Blocked: URL "${url}" is not on allowed domain ${ALLOWED_DOMAIN}`,
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    if (resp.url && !isAllowedUrl(resp.url)) {
      throw new Error(`Redirect to disallowed domain: ${resp.url}`);
    }
    return resp;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Article number extraction (extended patterns)
// ---------------------------------------------------------------------------

// Matches: 405.813, 999.234.06, 201.804, 501.818, 601.208.13
const ART_DOTTED = /\b(\d{2,4}\.\d{2,4}(?:\.\d{1,4})?)\b/g;
// Matches: 15815809, 15815834 (8-digit)
const ART_8DIGIT = /\b(\d{8})\b/g;
// Matches: B15815826 (letter prefix + digits)
const ART_PREFIXED = /\b([A-Z]\d{7,8})\b/g;

function extractAllArticleNumbers(text: string): string[] {
  const results = new Set<string>();
  let m;
  for (const re of [ART_DOTTED, ART_8DIGIT, ART_PREFIXED]) {
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      results.add(m[1]);
    }
  }
  return [...results];
}

function extractFirstArticleNumber(text: string): string {
  const all = extractAllArticleNumbers(text);
  return all[0] ?? "";
}

// ---------------------------------------------------------------------------
// Link extraction
// ---------------------------------------------------------------------------

function resolveHref(href: string, baseUrl: URL): string | null {
  if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) {
    return null;
  }
  try {
    const abs = href.startsWith("http") ? href : new URL(href, baseUrl).href;
    if (!isAllowedUrl(abs)) return null;
    const ext = extname(new URL(abs).pathname).toLowerCase();
    if (SKIP_EXTENSIONS.has(ext)) return null;
    return abs.split("#")[0]; // remove fragment
  } catch {
    return null;
  }
}

function isProductDetailUrl(url: string): boolean {
  return /\/product_\w+\.html/i.test(url);
}

function isProductSectionUrl(url: string): boolean {
  try {
    const p = new URL(url).pathname.toLowerCase();
    return p.includes("/product") || p.includes("/fabric") || p.includes("/textile");
  } catch {
    return false;
  }
}

interface ExtractedLinks {
  detailLinks: string[];
  paginationLinks: string[];
  categoryLinks: string[];
}

function extractLinks(html: string, pageUrl: string): ExtractedLinks {
  const baseUrl = new URL(pageUrl);
  const detailLinks: string[] = [];
  const paginationLinks: string[] = [];
  const categoryLinks: string[] = [];

  const hrefPattern = /<a[^>]*href="([^"]*)"[^>]*>/gi;
  let m;
  while ((m = hrefPattern.exec(html)) !== null) {
    const abs = resolveHref(m[1], baseUrl);
    if (!abs || abs === pageUrl) continue;

    if (isProductDetailUrl(abs)) {
      if (!detailLinks.includes(abs)) detailLinks.push(abs);
    } else if (
      /[?&](?:page|p)=\d/i.test(abs) ||
      /\/product\.html\?/i.test(abs) ||
      /\/index[_-]?\d+\.html/i.test(abs)
    ) {
      if (!paginationLinks.includes(abs)) paginationLinks.push(abs);
    } else if (isProductSectionUrl(abs) && abs !== pageUrl) {
      if (!categoryLinks.includes(abs)) categoryLinks.push(abs);
    }
  }

  return { detailLinks, paginationLinks, categoryLinks };
}

// ---------------------------------------------------------------------------
// Image extraction & classification
// ---------------------------------------------------------------------------

const IGNORE_PATTERNS = [
  /logo/i, /icon/i, /banner/i, /favicon/i, /sprite/i,
  /social/i, /wechat/i, /weibo/i, /qq\./i, /share/i,
  /arrow/i, /close/i, /search/i, /menu/i, /nav/i,
  /header[-_]?bg/i, /footer[-_]?bg/i, /bg[-_]?img/i,
  /loading/i, /spinner/i, /placeholder\.(gif|png)/i,
  /\b1x1\b/i, /pixel\./i, /blank\./i, /spacer/i,
];

interface ExtractedImage {
  url: string;
  alt: string;
  title: string;
  context: string;
  role: ImageRole;
  ignoredReason: string;
}

function extractImages(html: string, pageUrl: string): ExtractedImage[] {
  const baseUrl = new URL(pageUrl);
  const results: ExtractedImage[] = [];
  const seen = new Set<string>();

  // Match all img tags including lazy-load attributes
  const imgRe =
    /<img\b[^>]*>/gi;
  let m;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];

    // Extract image URL from multiple possible attributes
    const srcAttrs = ["data-src", "data-original", "data-lazy", "data-url", "src"];
    let imgUrl = "";
    for (const attr of srcAttrs) {
      const attrMatch = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
      if (attrMatch && attrMatch[1] && !attrMatch[1].startsWith("data:")) {
        imgUrl = attrMatch[1];
        break;
      }
    }

    // Also check srcset for high-res
    if (!imgUrl) {
      const srcsetMatch = tag.match(/srcset\s*=\s*["']([^"']+)["']/i);
      if (srcsetMatch) {
        const parts = srcsetMatch[1].split(",").map((s) => s.trim().split(/\s+/)[0]);
        imgUrl = parts[parts.length - 1] || "";
      }
    }

    if (!imgUrl) continue;

    const absoluteUrl = imgUrl.startsWith("http")
      ? imgUrl
      : new URL(imgUrl, baseUrl).href;

    if (!isAllowedUrl(absoluteUrl)) continue;
    if (seen.has(absoluteUrl)) continue;
    seen.add(absoluteUrl);

    // Extract alt and title
    const altMatch = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
    const titleMatch = tag.match(/title\s*=\s*["']([^"']*)["']/i);
    const alt = altMatch?.[1]?.trim() ?? "";
    const title = titleMatch?.[1]?.trim() ?? "";

    // Get surrounding context (800 chars before and after)
    const start = Math.max(0, m.index - 800);
    const end = Math.min(html.length, m.index + tag.length + 800);
    const context = html.slice(start, end);

    // Classify image
    let role: ImageRole = "unknown";
    let ignoredReason = "";

    const urlLower = absoluteUrl.toLowerCase();
    const combinedText = `${urlLower} ${alt.toLowerCase()} ${title.toLowerCase()}`;

    // Check ignore patterns
    for (const pat of IGNORE_PATTERNS) {
      if (pat.test(combinedText)) {
        role = "ignored";
        ignoredReason = `matches pattern: ${pat.source}`;
        break;
      }
    }

    // Check for very small images (width/height in attributes)
    if (role !== "ignored") {
      const widthMatch = tag.match(/width\s*=\s*["']?(\d+)["']?/i);
      const heightMatch = tag.match(/height\s*=\s*["']?(\d+)["']?/i);
      const w = widthMatch ? parseInt(widthMatch[1]) : 0;
      const h = heightMatch ? parseInt(heightMatch[1]) : 0;
      if ((w > 0 && w < 50) || (h > 0 && h < 50)) {
        role = "ignored";
        ignoredReason = `too small: ${w}x${h}`;
      }
    }

    // Positive classification
    if (role === "unknown") {
      if (/swatch|fabric|textile|pattern|cloth/i.test(combinedText)) {
        role = "swatch";
      } else if (/product/i.test(combinedText)) {
        role = "product";
      } else if (/detail|zoom|large|big|full/i.test(combinedText)) {
        role = "detail";
      } else if (/gallery|slide|carousel/i.test(combinedText)) {
        role = "gallery";
      }
    }

    results.push({
      url: absoluteUrl,
      alt,
      title,
      context,
      role,
      ignoredReason,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Detail page parsing
// ---------------------------------------------------------------------------

interface PageData {
  pageTitle: string;
  headings: string[];
  allArticleNumbers: string[];
  allNames: string[];
  images: ExtractedImage[];
  links: ExtractedLinks;
}

function parsePage(html: string, pageUrl: string): PageData {
  // Page title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : "";

  // Headings
  const headings: string[] = [];
  const hRe = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let hm;
  while ((hm = hRe.exec(html)) !== null) {
    const text = stripHtml(hm[1]);
    if (text.length > 1 && text.length < 200) headings.push(text);
  }

  // Article numbers from full page text
  const plainText = stripHtml(html);
  const allArticleNumbers = extractAllArticleNumbers(plainText);

  // Also extract from alt/title attributes
  const attrTextRe = /(?:alt|title)\s*=\s*["']([^"']+)["']/gi;
  let attrM;
  while ((attrM = attrTextRe.exec(html)) !== null) {
    for (const a of extractAllArticleNumbers(attrM[1])) {
      if (!allArticleNumbers.includes(a)) allArticleNumbers.push(a);
    }
  }

  // Table cell content
  const tdRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  let tdM;
  while ((tdM = tdRe.exec(html)) !== null) {
    for (const a of extractAllArticleNumbers(stripHtml(tdM[1]))) {
      if (!allArticleNumbers.includes(a)) allArticleNumbers.push(a);
    }
  }

  // Detected names from headings, strong tags, and specific elements
  const allNames: string[] = [...headings];
  const namePatterns = [
    /<strong[^>]*>([^<]{3,80})<\/strong>/gi,
    /<span[^>]*class="[^"]*(?:name|title|product|fabric)[^"]*"[^>]*>([^<]{3,80})<\/span>/gi,
    /<p[^>]*class="[^"]*(?:name|title|product|fabric)[^"]*"[^>]*>([^<]{3,80})<\/p>/gi,
    /<div[^>]*class="[^"]*(?:name|title|product-name|fabric-name)[^"]*"[^>]*>([^<]{3,80})<\/div>/gi,
  ];
  for (const pat of namePatterns) {
    pat.lastIndex = 0;
    while ((hm = pat.exec(html)) !== null) {
      const t = stripHtml(hm[1]);
      if (t.length > 2 && !allNames.includes(t)) allNames.push(t);
    }
  }

  // Images
  const images = extractImages(html, pageUrl);

  // Links
  const links = extractLinks(html, pageUrl);

  return { pageTitle, headings, allArticleNumbers, allNames, images, links };
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
  method: string;
}

function matchArticleNumber(
  artNum: string,
  dbSwatches: DbSwatch[],
): MatchResult {
  if (!artNum) return { swatch: null, confidence: 0, method: "none" };

  const normalized = artNum.replace(/-/g, ".");
  const exact = dbSwatches.find(
    (s) => s.articleNumber && s.articleNumber === normalized,
  );
  if (exact) return { swatch: exact, confidence: 1.0, method: "article-exact" };

  // Without dots/separators
  const stripped = normalized.replace(/[.\-]/g, "");
  const loose = dbSwatches.find(
    (s) =>
      s.articleNumber && s.articleNumber.replace(/[.\-]/g, "") === stripped,
  );
  if (loose)
    return { swatch: loose, confidence: 0.9, method: "article-normalized" };

  return { swatch: null, confidence: 0, method: "none" };
}

function matchName(name: string, dbSwatches: DbSwatch[]): MatchResult {
  if (!name || name === "(unknown)") {
    return { swatch: null, confidence: 0, method: "none" };
  }

  const norm = normalizeForMatching(name);
  if (norm.length < 3) return { swatch: null, confidence: 0, method: "none" };

  const nameExact = dbSwatches.find(
    (s) => normalizeForMatching(s.name) === norm,
  );
  if (nameExact)
    return { swatch: nameExact, confidence: 0.85, method: "name-exact" };

  const namePartial = dbSwatches.find((s) => {
    const n = normalizeForMatching(s.name);
    return (
      (n.length > 4 && norm.includes(n)) ||
      (norm.length > 4 && n.includes(norm))
    );
  });
  if (namePartial)
    return { swatch: namePartial, confidence: 0.6, method: "name-partial" };

  return { swatch: null, confidence: 0, method: "none" };
}

function matchImageToSwatch(
  img: ExtractedImage,
  pageData: PageData,
  dbSwatches: DbSwatch[],
): MatchResult {
  // 1. Article number from image's surrounding context
  const contextArt = extractFirstArticleNumber(stripHtml(img.context));
  if (contextArt) {
    const r = matchArticleNumber(contextArt, dbSwatches);
    if (r.swatch) return { ...r, method: `context-${r.method}` };
  }

  // 2. Article number from alt/title
  const altArt = extractFirstArticleNumber(`${img.alt} ${img.title}`);
  if (altArt) {
    const r = matchArticleNumber(altArt, dbSwatches);
    if (r.swatch) return { ...r, method: `alt-${r.method}` };
  }

  // 3. Page-level article number (only if page has exactly one)
  if (pageData.allArticleNumbers.length === 1) {
    const r = matchArticleNumber(pageData.allArticleNumbers[0], dbSwatches);
    if (r.swatch)
      return {
        swatch: r.swatch,
        confidence: Math.min(r.confidence, 0.85),
        method: `page-single-${r.method}`,
      };
  }

  // 4. Name matching from alt/title
  const nameSource = img.alt || img.title || "";
  if (nameSource) {
    const r = matchName(nameSource, dbSwatches);
    if (r.swatch) return { ...r, method: `imgattr-${r.method}` };
  }

  // 5. Name matching from headings (only if page has one heading)
  if (pageData.headings.length > 0 && pageData.headings.length <= 2) {
    for (const h of pageData.headings) {
      const r = matchName(h, dbSwatches);
      if (r.swatch) return { ...r, method: `heading-${r.method}` };
    }
  }

  // 6. Name matching from page title
  if (pageData.pageTitle) {
    const r = matchName(pageData.pageTitle, dbSwatches);
    if (r.swatch) {
      return {
        swatch: r.swatch,
        confidence: Math.min(r.confidence, 0.7),
        method: `title-${r.method}`,
      };
    }
  }

  return { swatch: null, confidence: 0, method: "none" };
}

// ---------------------------------------------------------------------------
// Download & Optimize (unchanged logic)
// ---------------------------------------------------------------------------

async function downloadImage(
  imageUrl: string,
  originalPath: string,
): Promise<{
  ok: boolean;
  size: number;
  contentType: string;
  error?: string;
}> {
  if (existsSync(originalPath)) {
    const buf = readFileSync(originalPath);
    return { ok: true, size: buf.length, contentType: "cached" };
  }
  try {
    const resp = await fetchWithGuards(imageUrl);
    if (!resp.ok) {
      return {
        ok: false,
        size: 0,
        contentType: "",
        error: `HTTP ${resp.status}`,
      };
    }
    const ct = resp.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) {
      return { ok: false, size: 0, contentType: ct, error: `Not an image: ${ct}` };
    }
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length > 15 * 1024 * 1024) {
      return {
        ok: false,
        size: buffer.length,
        contentType: ct,
        error: "Exceeds 15 MB",
      };
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
): Promise<{
  ok: boolean;
  width: number;
  height: number;
  size: number;
  error?: string;
}> {
  if (existsSync(optimizedPath)) {
    const meta = await sharp(optimizedPath).metadata();
    const buf = readFileSync(optimizedPath);
    return {
      ok: true,
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      size: buf.length,
    };
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
// CMS Import (unchanged logic)
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
    return {
      ok: false,
      error: "Swatch already has image (use --replace-existing)",
    };
  }
  const buffer = readFileSync(entry.localOptimizedPath);
  const meta = await sharp(buffer).metadata();
  const timestamp = Date.now();
  const filename = `${sanitizeFilename(entry.matchedSwatchName || "swatch")}-${timestamp}.webp`;
  ensureDir(UPLOAD_DIR);
  const uploadPath = join(UPLOAD_DIR, filename);
  writeFileSync(uploadPath, buffer);
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
  await prisma.fabricSwatch.update({
    where: { id: entry.matchedSwatchId },
    data: { swatchImageId: asset.id },
  });
  return { ok: true, mediaAssetId: asset.id };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function writeReports(
  images: ScrapedImage[],
  pages: PageReport[],
  summary: ReportSummary,
) {
  ensureDir(STAGING_DIR);

  writeFileSync(
    REPORT_JSON,
    JSON.stringify({ summary, pages, images }, null, 2),
  );
  console.log(`\nReport written: ${REPORT_JSON}`);

  const csvHeader = [
    "status",
    "confidence",
    "imageRole",
    "detectedName",
    "detectedArticleNumber",
    "matchedSwatchName",
    "matchedArticleNumber",
    "matchedFamily",
    "matchedSwatchId",
    "imageUrl",
    "sourcePageUrl",
    "alt",
    "title",
    "localOriginalPath",
    "localOptimizedPath",
    "ignoredReason",
    "notes",
  ].join(",");

  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;

  const csvRows = images.map((img) =>
    [
      img.status,
      img.confidence.toFixed(2),
      img.imageRole,
      esc(img.detectedName),
      esc(img.detectedArticleNumber),
      esc(img.matchedSwatchName || ""),
      esc(img.matchedArticleNumber || ""),
      esc(img.matchedFamily || ""),
      img.matchedSwatchId || "",
      esc(img.imageUrl),
      esc(img.sourcePageUrl),
      esc(img.alt),
      esc(img.title),
      img.localOriginalPath || "",
      img.localOptimizedPath || "",
      esc(img.ignoredReason),
      esc(img.notes),
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
  console.log("║  Axroma Fabric Image Scraper v2 (Deep Crawl)            ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log();
  console.log(
    `Mode:       ${doApply ? "APPLY (import to CMS)" : doDownload ? "DOWNLOAD (staging only)" : "DRY-RUN (scrape + match only)"}`,
  );
  console.log(
    `Replace:    ${replaceExisting ? "YES" : "NO (skip swatches with images)"}`,
  );
  console.log(`Start URL:  ${startUrl}`);
  console.log(`Detail only:${detailOnly ? " YES (single page)" : " NO (deep crawl)"}`);
  console.log(`Max pages:  ${maxPages}`);
  console.log(`Max depth:  ${maxDepth}`);
  console.log(`Staging:    ${STAGING_DIR}`);
  console.log();

  // Ensure staging dirs exist upfront
  ensureDir(ORIGINAL_DIR);
  ensureDir(OPTIMIZED_DIR);

  // -------------------------------------------------------------------------
  // Load DB swatches
  // -------------------------------------------------------------------------
  const dbSwatches = await loadDbSwatches();
  console.log(`DB swatches loaded: ${dbSwatches.length}`);
  console.log(
    `  With image: ${dbSwatches.filter((s) => s.hasImage).length}`,
  );
  console.log(
    `  Without image: ${dbSwatches.filter((s) => !s.hasImage).length}`,
  );
  console.log();

  // -------------------------------------------------------------------------
  // Resume from existing report
  // -------------------------------------------------------------------------
  let images: ScrapedImage[] = [];
  const pageReports: PageReport[] = [];
  const errors: string[] = [];
  let pagesScraped = 0;
  let pagesSkipped = 0;
  let detailPagesScraped = 0;
  let totalQueued = 0;

  if (resumeFrom && existsSync(resumeFrom)) {
    console.log(`Resuming from report: ${resumeFrom}`);
    const existing = JSON.parse(readFileSync(resumeFrom, "utf-8"));
    images = existing.images || [];
    pagesScraped = existing.summary?.pagesScraped || 0;
    console.log(`  Loaded ${images.length} entries from previous report\n`);
  } else {
    // -----------------------------------------------------------------------
    // Phase 1: Deep Crawl
    // -----------------------------------------------------------------------
    console.log("--- Phase 1: Deep Crawl & Parse ---");

    const visitedPages = new Set<string>();
    // Queue: [url, depth]
    const queue: Array<[string, number]> = [[startUrl, 0]];
    totalQueued = 1;
    const globalSeenImages = new Set<string>();

    while (queue.length > 0) {
      if (pagesScraped >= maxPages) {
        console.log(`\n  Max pages (${maxPages}) reached. Stopping crawl.`);
        break;
      }

      const [pageUrl, depth] = queue.shift()!;
      if (visitedPages.has(pageUrl)) {
        pagesSkipped++;
        continue;
      }
      if (depth > maxDepth) {
        pagesSkipped++;
        continue;
      }
      visitedPages.add(pageUrl);

      const isDetail = isProductDetailUrl(pageUrl);
      const depthLabel = "  ".repeat(Math.min(depth, 4));
      console.log(
        `${depthLabel}[d${depth}] ${isDetail ? "DETAIL" : "LIST  "} ${pageUrl}`,
      );

      try {
        const resp = await fetchWithGuards(pageUrl);
        if (!resp.ok) {
          const msg = `HTTP ${resp.status} for ${pageUrl}`;
          console.log(`${depthLabel}  ERROR: ${msg}`);
          errors.push(msg);
          await sleep(REQUEST_DELAY_MS);
          continue;
        }

        const html = await resp.text();
        pagesScraped++;
        if (isDetail) detailPagesScraped++;

        // Parse the page
        const pageData = parsePage(html, pageUrl);

        const pageReport: PageReport = {
          pageUrl,
          depth,
          linksFound:
            pageData.links.detailLinks.length +
            pageData.links.paginationLinks.length +
            pageData.links.categoryLinks.length,
          detailLinksFound: pageData.links.detailLinks.length,
          imagesFound: pageData.images.length,
          detectedArticleNumbers: pageData.allArticleNumbers,
          detectedNames: pageData.allNames.slice(0, 10),
        };
        pageReports.push(pageReport);

        const nonIgnored = pageData.images.filter((i) => i.role !== "ignored");
        const ignored = pageData.images.filter((i) => i.role === "ignored");

        console.log(
          `${depthLabel}  imgs: ${nonIgnored.length} relevant, ${ignored.length} ignored | ` +
            `arts: [${pageData.allArticleNumbers.join(", ")}] | ` +
            `detail links: ${pageData.links.detailLinks.length}`,
        );

        // Determine the best image per matched swatch on this page
        // (to avoid multiple images mapping to the same swatch)
        const pageMatchedSwatches = new Map<
          string,
          { img: ScrapedImage; confidence: number }
        >();

        for (const img of pageData.images) {
          if (img.role === "ignored") {
            images.push({
              sourcePageUrl: pageUrl,
              imageUrl: img.url,
              detectedName: "",
              detectedArticleNumber: "",
              surroundingText: "",
              alt: img.alt,
              title: img.title,
              matchedSwatchId: null,
              matchedSwatchName: null,
              matchedArticleNumber: null,
              matchedFamily: null,
              confidence: 0,
              status: "IGNORED",
              imageRole: img.role,
              ignoredReason: img.ignoredReason,
              localOriginalPath: null,
              localOptimizedPath: null,
              notes: img.ignoredReason,
            });
            continue;
          }

          if (globalSeenImages.has(img.url)) {
            images.push({
              sourcePageUrl: pageUrl,
              imageUrl: img.url,
              detectedName: img.alt || img.title || "",
              detectedArticleNumber: extractFirstArticleNumber(
                stripHtml(img.context),
              ),
              surroundingText: stripHtml(img.context).slice(0, 200),
              alt: img.alt,
              title: img.title,
              matchedSwatchId: null,
              matchedSwatchName: null,
              matchedArticleNumber: null,
              matchedFamily: null,
              confidence: 0,
              status: "DUPLICATE",
              imageRole: img.role,
              ignoredReason: "",
              localOriginalPath: null,
              localOptimizedPath: null,
              notes: "Duplicate image URL (seen on earlier page)",
            });
            continue;
          }
          globalSeenImages.add(img.url);

          // Match
          const { swatch, confidence, method } = matchImageToSwatch(
            img,
            pageData,
            dbSwatches,
          );

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

          const entry: ScrapedImage = {
            sourcePageUrl: pageUrl,
            imageUrl: img.url,
            detectedName: img.alt || img.title || "",
            detectedArticleNumber: extractFirstArticleNumber(
              stripHtml(img.context),
            ),
            surroundingText: stripHtml(img.context).slice(0, 200),
            alt: img.alt,
            title: img.title,
            matchedSwatchId: swatch?.id ?? null,
            matchedSwatchName: swatch?.name ?? null,
            matchedArticleNumber: swatch?.articleNumber ?? null,
            matchedFamily: swatch ? `${swatch.familyName} (${swatch.familySlug})` : null,
            confidence,
            status,
            imageRole: img.role,
            ignoredReason: "",
            localOriginalPath: null,
            localOptimizedPath: null,
            notes: swatch ? `match: ${method}` : "No matching swatch found",
          };

          // Track best match per swatch to mark duplicates
          if (swatch && (status === "MATCHED" || status === "UNCERTAIN")) {
            const existing = pageMatchedSwatches.get(swatch.id);
            if (existing) {
              if (confidence > existing.confidence) {
                existing.img.status = "ALTERNATIVE_IMAGE";
                existing.img.notes += "; superseded by higher-confidence match";
                pageMatchedSwatches.set(swatch.id, {
                  img: entry,
                  confidence,
                });
              } else {
                entry.status = "ALTERNATIVE_IMAGE";
                entry.notes += "; lower confidence than primary match";
              }
            } else {
              pageMatchedSwatches.set(swatch.id, { img: entry, confidence });
            }
          }

          images.push(entry);
        }

        // Queue child links (unless detail-only)
        if (!detailOnly) {
          const nextDepth = depth + 1;
          // Detail pages are highest priority
          for (const link of pageData.links.detailLinks) {
            if (!visitedPages.has(link)) {
              queue.push([link, nextDepth]);
              totalQueued++;
            }
          }
          // Then pagination
          for (const link of pageData.links.paginationLinks) {
            if (!visitedPages.has(link)) {
              queue.push([link, nextDepth]);
              totalQueued++;
            }
          }
          // Then category links (lower priority)
          for (const link of pageData.links.categoryLinks) {
            if (!visitedPages.has(link)) {
              queue.push([link, nextDepth]);
              totalQueued++;
            }
          }
        }

        await sleep(REQUEST_DELAY_MS);
      } catch (e) {
        const msg = `Error fetching ${pageUrl}: ${e}`;
        console.log(`${depthLabel}  ERROR: ${msg}`);
        errors.push(msg);
        await sleep(REQUEST_DELAY_MS);
      }
    }
  }

  const nonIgnored = images.filter((i) => i.status !== "IGNORED");
  console.log(`\n  Total images: ${images.length} (${nonIgnored.length} relevant, ${images.length - nonIgnored.length} ignored)`);

  // -------------------------------------------------------------------------
  // Phase 2: Download (if --download)
  // -------------------------------------------------------------------------
  if (doDownload) {
    console.log("\n--- Phase 2: Download & Optimize ---");

    const downloadable = images.filter((i) => {
      if (i.status === "MATCHED") return true;
      if (i.status === "READY_FOR_IMPORT") return true;
      if (i.status === "UNCERTAIN" && downloadUncertain) return true;
      if (i.status === "ALREADY_HAS_IMAGE" && replaceExisting) return true;
      return false;
    });
    console.log(`  Downloadable entries: ${downloadable.length}`);

    for (const entry of downloadable) {
      const slug =
        dbSwatches.find((s) => s.id === entry.matchedSwatchId)?.slug ??
        sanitizeFilename(entry.detectedName || "unknown");
      const artNum =
        entry.matchedArticleNumber || entry.detectedArticleNumber || "no-art";
      const ext = extname(new URL(entry.imageUrl).pathname) || ".jpg";
      const baseName = buildStagingFilename(artNum, slug, ext);
      const originalPath = join(ORIGINAL_DIR, baseName);
      const optimizedPath = join(
        OPTIMIZED_DIR,
        baseName.replace(/\.[^.]+$/, ".webp"),
      );

      console.log(
        `  Downloading: ${entry.matchedSwatchName || entry.detectedName || entry.imageUrl}`,
      );

      const dl = await downloadImage(entry.imageUrl, originalPath);
      if (!dl.ok) {
        entry.status = "ERROR";
        entry.notes += `; download failed: ${dl.error}`;
        console.log(`    FAILED: ${dl.error}`);
        await sleep(REQUEST_DELAY_MS);
        continue;
      }
      entry.localOriginalPath = originalPath;
      console.log(
        `    Saved: ${originalPath} (${(dl.size / 1024).toFixed(0)} KB)`,
      );

      const opt = await optimizeImage(originalPath, optimizedPath);
      if (!opt.ok) {
        entry.notes += `; optimize failed: ${opt.error}`;
        console.log(`    Optimize FAILED: ${opt.error}`);
      } else {
        entry.localOptimizedPath = optimizedPath;
        console.log(
          `    Optimized: ${opt.width}×${opt.height}, ${(opt.size / 1024).toFixed(0)} KB`,
        );
      }

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
      console.log(
        "  Nothing to import. Run with --download first, then review the report.",
      );
    }
    for (const entry of importable) {
      console.log(
        `  Importing: ${entry.matchedSwatchName} (${entry.matchedArticleNumber})`,
      );
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
    sourceUrl: startUrl,
    pagesQueued: totalQueued,
    pagesScraped,
    pagesSkipped,
    detailPagesScraped,
    imagesFound: images.length,
    imagesIgnored: images.filter((i) => i.status === "IGNORED").length,
    imagesMatched: images.filter(
      (i) =>
        i.status === "MATCHED" ||
        i.status === "READY_FOR_IMPORT" ||
        i.status === "IMPORTED",
    ).length,
    imagesUncertain: images.filter((i) => i.status === "UNCERTAIN").length,
    imagesNoMatch: images.filter((i) => i.status === "NO_MATCH").length,
    alreadyHasImage: images.filter((i) => i.status === "ALREADY_HAS_IMAGE")
      .length,
    readyForImport: images.filter((i) => i.status === "READY_FOR_IMPORT")
      .length,
    downloaded: images.filter((i) => i.localOriginalPath).length,
    imported: images.filter((i) => i.status === "IMPORTED").length,
    errors,
  };

  writeReports(images, pageReports, summary);

  console.log("\n========== Summary ==========");
  console.log(`Pages queued:        ${summary.pagesQueued}`);
  console.log(`Pages scraped:       ${summary.pagesScraped}`);
  console.log(`Pages skipped:       ${summary.pagesSkipped}`);
  console.log(`Detail pages:        ${summary.detailPagesScraped}`);
  console.log(`Images found:        ${summary.imagesFound}`);
  console.log(`Images ignored:      ${summary.imagesIgnored}`);
  console.log(`Images matched:      ${summary.imagesMatched}`);
  console.log(`Images uncertain:    ${summary.imagesUncertain}`);
  console.log(`Images no match:     ${summary.imagesNoMatch}`);
  console.log(`Already has image:   ${summary.alreadyHasImage}`);
  console.log(`Ready for import:    ${summary.readyForImport}`);
  console.log(`Downloaded:          ${summary.downloaded}`);
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
