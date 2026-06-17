/**
 * Fix Rocky Mountain swatch family assignments.
 *
 * The Rocky Mountain series belongs to "Mackintosh®" (slug: mackintosh),
 * not "Mackintosh® Lite" (slug: mackintosh-lite). Rocky Mountain Olive
 * was created before the catalog import and assigned to the wrong family.
 *
 * Matches swatches by article number. Only updates familyId — no other
 * fields are touched (images, text, availabilities all preserved).
 *
 * Idempotent: safe to run multiple times.
 *
 * Usage:
 *   npx tsx scripts/fix-rocky-mountain-family.ts          # dry-run
 *   npx tsx scripts/fix-rocky-mountain-family.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

const TARGET_FAMILY_SLUG = "mackintosh";

const ROCKY_MOUNTAIN_SWATCHES = [
  { name: "Rocky Mountain Olive", articleNumber: "405.813" },
  { name: "Rocky Mountain Mist Gray", articleNumber: "703.813" },
  { name: "Rocky Mountain Crimson Red", articleNumber: "101.813" },
  { name: "Rocky Mountain Rosebloom", articleNumber: "104.813" },
  { name: "Rocky Mountain Yellow Jasmine", articleNumber: "802.813" },
  { name: "Rocky Mountain Navajo White", articleNumber: "603.813" },
];

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const targetFamily = await prisma.fabricFamily.findUnique({
    where: { slug: TARGET_FAMILY_SLUG },
  });

  if (!targetFamily) {
    console.error(`ERROR: Target family "${TARGET_FAMILY_SLUG}" not found in DB.`);
    process.exit(1);
  }

  console.log(`Target family: "${targetFamily.name}" (id: ${targetFamily.id}, slug: ${targetFamily.slug})\n`);

  let updated = 0;
  let alreadyCorrect = 0;
  let notFound = 0;

  for (const entry of ROCKY_MOUNTAIN_SWATCHES) {
    const swatch = await prisma.fabricSwatch.findFirst({
      where: { articleNumber: entry.articleNumber },
      include: { family: true },
    });

    if (!swatch) {
      console.log(`  NOT_FOUND  "${entry.name}" (art: ${entry.articleNumber})`);
      notFound++;
      continue;
    }

    if (swatch.familyId === targetFamily.id) {
      console.log(`  ALREADY_CORRECT  "${swatch.name}" (art: ${swatch.articleNumber}) → ${swatch.family.slug}`);
      alreadyCorrect++;
      continue;
    }

    const oldFamily = swatch.family;

    if (dryRun) {
      console.log(`  UPDATE  "${swatch.name}" (art: ${swatch.articleNumber}) → ${oldFamily.slug} ➜ ${TARGET_FAMILY_SLUG}`);
    } else {
      await prisma.fabricSwatch.update({
        where: { id: swatch.id },
        data: { familyId: targetFamily.id },
      });
      console.log(`  UPDATED  "${swatch.name}" (art: ${swatch.articleNumber}) → ${oldFamily.slug} ➜ ${TARGET_FAMILY_SLUG}`);
    }
    updated++;
  }

  console.log(`\n========== Summary ==========`);
  if (dryRun) console.log("(dry-run — no changes were written)\n");
  console.log(`Updated:          ${updated}`);
  console.log(`Already correct:  ${alreadyCorrect}`);
  console.log(`Not found:        ${notFound}`);
  console.log(`Total checked:    ${ROCKY_MOUNTAIN_SWATCHES.length}`);
  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
