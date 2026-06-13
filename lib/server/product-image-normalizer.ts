import sharp from "sharp";

const CANVAS_SIZE = 1600;
const PRODUCT_FILL = 0.80;
const WEBP_QUALITY = 86;
const TRIM_THRESHOLD = 20;

const CANVAS_BG = { r: 250, g: 248, b: 245, alpha: 255 };

interface NormalizeResult {
  buffer: Buffer;
  width: number;
  height: number;
}

export async function normalizeProductImage(
  inputBuffer: Buffer,
): Promise<NormalizeResult> {
  const maxProductSize = Math.floor(CANVAS_SIZE * PRODUCT_FILL);

  let trimmed: { data: Buffer; info: sharp.OutputInfo };
  try {
    trimmed = await sharp(inputBuffer, { failOn: "none" })
      .rotate()
      .trim({ threshold: TRIM_THRESHOLD })
      .toBuffer({ resolveWithObject: true });
  } catch {
    trimmed = await sharp(inputBuffer, { failOn: "none" })
      .rotate()
      .toBuffer({ resolveWithObject: true });
  }

  const resized = await sharp(trimmed.data)
    .resize(maxProductSize, maxProductSize, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer({ resolveWithObject: true });

  const productW = resized.info.width;
  const productH = resized.info.height;
  const left = Math.round((CANVAS_SIZE - productW) / 2);
  const top = Math.round((CANVAS_SIZE - productH) / 2);

  const canvas = await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: CANVAS_BG,
    },
  })
    .composite([{ input: resized.data, left, top }])
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return {
    buffer: canvas,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  };
}

export function buildNormalizedFilename(originalFilename: string): string {
  const base = originalFilename.replace(/\.[^.]+$/, "");
  return `${base}-normalized.webp`;
}
