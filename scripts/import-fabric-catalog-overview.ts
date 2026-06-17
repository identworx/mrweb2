/**
 * Import fabric catalog overview data from JSON into the FabricLibrary DB.
 *
 * Reads `data/import/fabric-catalog-overview.example.json` (or --file path).
 * Creates missing ProductTypes, Families, Swatches, and Availabilities.
 * Never deletes or overwrites existing data. Existing swatches matched by slug.
 * colorHex values of "TODO" are skipped (set to null).
 *
 * Idempotent: safe to run multiple times.
 *
 * Usage:
 *   npx tsx scripts/import-fabric-catalog-overview.ts              # dry-run
 *   npx tsx scripts/import-fabric-catalog-overview.ts --apply       # write to DB
 *   npx tsx scripts/import-fabric-catalog-overview.ts --file path   # custom file
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dryRun = !apply;

function flagValue(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

const filePath = resolve(
  flagValue("--file") ?? "data/import/fabric-catalog-overview.example.json",
);

interface AvailabilityEntry {
  productTypeSlug: string;
  note?: string;
}

interface SwatchEntry {
  name: string;
  slug: string;
  familySlug: string;
  articleNumber?: string;
  colorHex?: string;
  patternType?: string;
  order?: number;
  availabilities?: AvailabilityEntry[];
  _section?: string;
  _note?: string;
}

interface ImportData {
  productTypes?: { name: string; slug: string; iconKey?: string; order?: number }[];
  families?: { name: string; slug: string; description?: string; eyebrow?: string; order?: number }[];
  swatches?: SwatchEntry[];
}

const stats = {
  productTypes: { created: 0, skipped: 0 },
  families: { created: 0, skipped: 0 },
  swatches: { created: 0, skipped: 0, todoColor: 0 },
  availabilities: { created: 0, skipped: 0 },
  warnings: [] as string[],
};

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}`);
  console.log(`File: ${filePath}\n`);

  const json = readFileSync(filePath, "utf-8");
  const data: ImportData = JSON.parse(json);

  // 1. Product types
  if (data.productTypes?.length) {
    console.log(`--- Product Types (${data.productTypes.length}) ---`);
    for (const pt of data.productTypes) {
      const existing = await prisma.fabricProductType.findUnique({ where: { slug: pt.slug } });
      if (existing) {
        console.log(`  SKIP "${pt.name}" — exists (id: ${existing.id})`);
        stats.productTypes.skipped++;
        continue;
      }
      if (dryRun) {
        console.log(`  CREATE "${pt.name}" (slug: ${pt.slug})`);
      } else {
        const created = await prisma.fabricProductType.create({
          data: { name: pt.name, slug: pt.slug, iconKey: pt.iconKey ?? null, order: pt.order ?? 0 },
        });
        console.log(`  CREATED "${pt.name}" (id: ${created.id})`);
      }
      stats.productTypes.created++;
    }
  }

  // 2. Families
  if (data.families?.length) {
    console.log(`\n--- Families (${data.families.length}) ---`);
    for (const fam of data.families) {
      const existing = await prisma.fabricFamily.findUnique({ where: { slug: fam.slug } });
      if (existing) {
        console.log(`  SKIP "${fam.name}" — exists (id: ${existing.id})`);
        stats.families.skipped++;
        continue;
      }
      if (dryRun) {
        console.log(`  CREATE "${fam.name}" (slug: ${fam.slug})`);
      } else {
        const created = await prisma.fabricFamily.create({
          data: { name: fam.name, slug: fam.slug, description: fam.description ?? null, eyebrow: fam.eyebrow ?? null, order: fam.order ?? 0 },
        });
        console.log(`  CREATED "${fam.name}" (id: ${created.id})`);
      }
      stats.families.created++;
    }
  }

  // 3. Swatches + Availabilities
  if (data.swatches?.length) {
    console.log(`\n--- Swatches (${data.swatches.length}) ---`);

    // Pre-load lookup maps
    const allFamilies = await prisma.fabricFamily.findMany();
    const familyMap = new Map(allFamilies.map((f) => [f.slug, f]));

    const allPTs = await prisma.fabricProductType.findMany();
    const ptMap = new Map(allPTs.map((p) => [p.slug, p]));

    for (const sw of data.swatches) {
      const family = familyMap.get(sw.familySlug);
      if (!family) {
        stats.warnings.push(`SKIP swatch "${sw.name}": family "${sw.familySlug}" not found`);
        console.log(`  SKIP "${sw.name}" — family "${sw.familySlug}" not found`);
        continue;
      }

      const hasTodoColor = sw.colorHex === "TODO";
      if (hasTodoColor) stats.swatches.todoColor++;

      const existingSwatch = await prisma.fabricSwatch.findUnique({ where: { slug: sw.slug } });

      if (existingSwatch) {
        console.log(`  SKIP "${sw.name}" (slug: ${sw.slug}) — exists (id: ${existingSwatch.id})`);
        stats.swatches.skipped++;

        // Still check for missing availabilities on existing swatches
        if (sw.availabilities?.length) {
          const existingAvails = await prisma.fabricAvailability.findMany({
            where: { swatchId: existingSwatch.id },
          });
          const existingPairs = new Set(existingAvails.map((a) => a.productTypeId));

          for (const av of sw.availabilities) {
            const pt = ptMap.get(av.productTypeSlug);
            if (!pt) {
              stats.warnings.push(`  SKIP availability "${sw.name}" -> "${av.productTypeSlug}": product type not found`);
              continue;
            }
            if (existingPairs.has(pt.id)) {
              stats.availabilities.skipped++;
              continue;
            }
            if (dryRun) {
              console.log(`    + ADD availability: ${av.productTypeSlug}${av.note ? ` (${av.note})` : ""}`);
            } else {
              await prisma.fabricAvailability.create({
                data: { swatchId: existingSwatch.id, productTypeId: pt.id, note: av.note ?? null },
              });
              console.log(`    + CREATED availability: ${av.productTypeSlug}${av.note ? ` (${av.note})` : ""}`);
            }
            stats.availabilities.created++;
          }
        }
        continue;
      }

      // Create new swatch
      const swatchData = {
        name: sw.name,
        slug: sw.slug,
        familyId: family.id,
        articleNumber: sw.articleNumber ?? null,
        colorHex: hasTodoColor ? null : (sw.colorHex ?? null),
        patternType: sw.patternType === "TODO" ? null : (sw.patternType ?? null),
        order: sw.order ?? 0,
      };

      if (dryRun) {
        console.log(`  CREATE "${sw.name}" (slug: ${sw.slug}, family: ${sw.familySlug}, art: ${sw.articleNumber || "?"}${hasTodoColor ? ", TODO: colorHex" : ""})`);
      } else {
        const created = await prisma.fabricSwatch.create({ data: swatchData });
        console.log(`  CREATED "${sw.name}" (id: ${created.id})`);

        // Create availabilities
        if (sw.availabilities?.length) {
          for (const av of sw.availabilities) {
            const pt = ptMap.get(av.productTypeSlug);
            if (!pt) {
              stats.warnings.push(`  SKIP availability "${sw.name}" -> "${av.productTypeSlug}": product type not found`);
              continue;
            }
            await prisma.fabricAvailability.create({
              data: { swatchId: created.id, productTypeId: pt.id, note: av.note ?? null },
            });
            stats.availabilities.created++;
          }
          console.log(`    + ${sw.availabilities.length} availabilities`);
        }
      }
      stats.swatches.created++;

      if (dryRun && sw.availabilities?.length) {
        for (const av of sw.availabilities) {
          console.log(`    + availability: ${av.productTypeSlug}${av.note ? ` (${av.note})` : ""}`);
          stats.availabilities.created++;
        }
      }
    }
  }

  // Summary
  console.log("\n========== Summary ==========");
  if (dryRun) console.log("(dry-run — no changes were written)\n");
  console.log(`Product Types: ${stats.productTypes.created} created, ${stats.productTypes.skipped} skipped`);
  console.log(`Families:      ${stats.families.created} created, ${stats.families.skipped} skipped`);
  console.log(`Swatches:      ${stats.swatches.created} new, ${stats.swatches.skipped} existing`);
  console.log(`  TODO colors: ${stats.swatches.todoColor} (colorHex set to null, needs manual input)`);
  console.log(`Availabilities: ${stats.availabilities.created} new, ${stats.availabilities.skipped} existing`);

  if (stats.warnings.length > 0) {
    console.log(`\n--- Warnings (${stats.warnings.length}) ---`);
    for (const w of stats.warnings) console.log(`  ${w}`);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
