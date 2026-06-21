/**
 * Backfill script for Ambiente Gallery.
 *
 * Tries to find MediaAssets in an "ambiente" folder and creates
 * AmbienteImage records for them.
 *
 * Usage:
 *   npx tsx scripts/backfill-ambiente-gallery.ts          # dry-run
 *   npx tsx scripts/backfill-ambiente-gallery.ts --apply   # apply changes
 */

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");

async function main() {
  console.log(`\n=== Ambiente Gallery Backfill (${apply ? "APPLY" : "DRY-RUN"}) ===\n`);

  // Check existing records
  const existing = await prisma.ambienteImage.count();
  if (existing > 0) {
    console.log(`ALREADY_CONFIGURED: ${existing} AmbienteImage record(s) already exist.`);
    console.log("Skipping backfill to avoid duplicates.\n");
    return;
  }

  // Look for an "ambiente" media folder
  const folder = await prisma.mediaFolder.findFirst({
    where: {
      OR: [
        { slug: { contains: "ambiente" } },
        { name: { contains: "Ambiente" } },
        { name: { contains: "ambiente" } },
      ],
    },
  });

  let candidates: Array<{
    id: string;
    filename: string;
    url: string;
    alt: string | null;
    title: string | null;
  }> = [];

  if (folder) {
    console.log(`FOUND: Media folder "${folder.name}" (${folder.id})`);
    candidates = await prisma.mediaAsset.findMany({
      where: {
        folderId: folder.id,
        mimeType: { startsWith: "image/" },
      },
      orderBy: { filename: "asc" },
      select: { id: true, filename: true, url: true, alt: true, title: true },
    });
  } else {
    // Fallback: look for assets with "ambiente" in filename
    candidates = await prisma.mediaAsset.findMany({
      where: {
        OR: [
          { filename: { contains: "ambiente" } },
          { originalName: { contains: "ambiente" } },
          { originalName: { contains: "Ambiente" } },
        ],
        mimeType: { startsWith: "image/" },
      },
      orderBy: { filename: "asc" },
      select: { id: true, filename: true, url: true, alt: true, title: true },
    });

    if (candidates.length > 0) {
      console.log(`FOUND: ${candidates.length} asset(s) matching "ambiente" in filename`);
    }
  }

  if (candidates.length === 0) {
    console.log("SKIP: No matching MediaAssets found for ambiente gallery.");
    console.log("→ Use the admin at /admin/ambiente to add images manually.\n");
    return;
  }

  console.log(`\nWill create ${candidates.length} AmbienteImage record(s):\n`);

  for (let i = 0; i < candidates.length; i++) {
    const asset = candidates[i];
    const title = asset.title || asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const isFeatured = i < 5;

    console.log(
      `  ${apply ? "CREATE" : "WOULD CREATE"}: "${title}" (asset: ${asset.id}) ${isFeatured ? "[FEATURED]" : ""}`,
    );

    if (apply) {
      await prisma.ambienteImage.create({
        data: {
          title,
          alt: asset.alt || title,
          caption: null,
          colorWorlds: [],
          featured: isFeatured,
          isActive: true,
          order: i,
          mediaAssetId: asset.id,
        },
      });
    }
  }

  if (apply) {
    console.log(`\n✓ Created ${candidates.length} AmbienteImage record(s).`);
    console.log("→ Set colorWorlds and captions in the admin at /admin/ambiente.\n");
  } else {
    console.log(`\nDry run complete. Run with --apply to create records.\n`);
  }
}

main()
  .catch((err) => {
    console.error("Backfill error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
