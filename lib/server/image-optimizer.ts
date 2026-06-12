import sharp from "sharp";

const WEBP_QUALITY = 84;
const MAX_WIDTH = 2880;

const OPTIMIZABLE_MIMES = new Set(["image/jpeg", "image/png"]);
const RECOMPRESS_MIMES = new Set(["image/webp"]);
const PASSTHROUGH_MIMES = new Set(["image/gif", "image/avif", "image/svg+xml"]);

export function isOptimizableImage(mimeType: string): boolean {
  return OPTIMIZABLE_MIMES.has(mimeType);
}

export function isRecompressableImage(mimeType: string): boolean {
  return RECOMPRESS_MIMES.has(mimeType);
}

export function isPassthroughImage(mimeType: string): boolean {
  return PASSTHROUGH_MIMES.has(mimeType);
}

interface ImageMetadata {
  width: number;
  height: number;
}

export async function readImageMetadata(buffer: Buffer): Promise<ImageMetadata | null> {
  try {
    const meta = await sharp(buffer).metadata();
    if (meta.width && meta.height) {
      return { width: meta.width, height: meta.height };
    }
    return null;
  } catch {
    return null;
  }
}

interface OptimizeResult {
  buffer: Buffer;
  width: number;
  height: number;
  mimeType: string;
  extension: string;
}

export async function optimizeToWebP(
  inputBuffer: Buffer,
): Promise<OptimizeResult> {
  let pipeline = sharp(inputBuffer, { failOn: "none" }).rotate();

  const meta = await pipeline.metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Cannot read image dimensions");
  }

  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  const outputBuffer = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const outputMeta = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    width: outputMeta.width ?? meta.width,
    height: outputMeta.height ?? meta.height,
    mimeType: "image/webp",
    extension: ".webp",
  };
}

export async function recompressWebP(
  inputBuffer: Buffer,
): Promise<OptimizeResult> {
  let pipeline = sharp(inputBuffer, { failOn: "none" });

  const meta = await pipeline.metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Cannot read image dimensions");
  }

  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  const outputBuffer = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const outputMeta = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    width: outputMeta.width ?? meta.width,
    height: outputMeta.height ?? meta.height,
    mimeType: "image/webp",
    extension: ".webp",
  };
}

export function buildOptimizedFilename(sanitizedName: string, newExtension: string): string {
  const baseName = sanitizedName.replace(/\.[^.]+$/, "");
  return `${baseName}${newExtension}`;
}
