/**
 * Backfill featuredOnMaterials for the first 6 active swatches.
 *
 * Sets featuredOnMaterials=true and materialsPreviewOrder=0..5 on the first
 * 6 swatches ordered by family.order → swatch.order, matching the default
 * behaviour before the field existed.
 *
 * Idempotent: skips swatches that already have featuredOnMaterials=true.
 *
 * Usage:
 *   npx tsx scripts/backfill-materials-preview-swatches.ts          # dry-run
 *   npx tsx scripts/backfill-materials-preview-swatches.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const alreadyFeatured = await prisma.fabricSwatch.findMany({
    where: { featuredOnMaterials: true },
    select: { id: true, name: true },
  });

  if (alreadyFeatured.length > 0) {
    console.log(`Already ${alreadyFeatured.length} swatch(es) with featuredOnMaterials=true:`);
    for (const s of alreadyFeatured) {
      console.log(`  - ${s.name}`);
    }
    console.log("\nNo changes needed — backfill already applied.\n");
    return;
  }

  const swatches = await prisma.fabricSwatch.findMany({
    where: { isActive: true },
    orderBy: [{ family: { order: "asc" } }, { order: "asc" }],
    take: 6,
    select: { id: true, name: true, slug: true },
  });

  console.log(`Found ${swatches.length} swatches to feature:\n`);
  for (let i = 0; i < swatches.length; i++) {
    console.log(`  ${i}. ${swatches[i].name} (${swatches[i].slug})`);
  }

  if (!dryRun) {
    for (let i = 0; i < swatches.length; i++) {
      await prisma.fabricSwatch.update({
        where: { id: swatches[i].id },
        data: {
          featuredOnMaterials: true,
          materialsPreviewOrder: i,
        },
      });
    }
    console.log(`\nUpdated ${swatches.length} swatches.\n`);
  } else {
    console.log("\nDry run — no changes written. Use --apply to write.\n");
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
