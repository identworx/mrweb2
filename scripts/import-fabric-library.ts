import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

// ── CLI args ───────────────────────────────────────────────
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dryRun = !apply;

function flagValue(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

const filePath = resolve(
  flagValue("--file") ?? "data/import/fabric-library.json",
);

// ── Types ──────────────────────────────────────────────────
interface ProductTypeEntry {
  name: string;
  slug: string;
  iconKey?: string;
  order?: number;
}

interface FamilyEntry {
  name: string;
  slug: string;
  description?: string;
  eyebrow?: string;
  order?: number;
}

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
  subtitle?: string;
  description?: string;
  order?: number;
  availabilities?: AvailabilityEntry[];
}

interface ImportData {
  productTypes?: ProductTypeEntry[];
  families?: FamilyEntry[];
  swatches?: SwatchEntry[];
}

// ── Stats ──────────────────────────────────────────────────
const stats = {
  productTypes: { created: 0, updated: 0, skipped: 0, errors: 0 },
  families: { created: 0, updated: 0, skipped: 0, errors: 0 },
  swatches: { created: 0, updated: 0, skipped: 0, errors: 0 },
  availabilities: { created: 0, deleted: 0, errors: 0 },
};

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}`);
  console.log(`File: ${filePath}\n`);

  const json = readFileSync(filePath, "utf-8");
  const data: ImportData = JSON.parse(json);

  // 1. Product types
  if (data.productTypes?.length) {
    console.log(`--- Product Types (${data.productTypes.length}) ---`);
    for (const pt of data.productTypes) {
      try {
        const existing = await prisma.fabricProductType.findUnique({
          where: { slug: pt.slug },
        });

        if (dryRun) {
          console.log(
            `  ${existing ? "UPDATE" : "CREATE"} productType: ${pt.name} (${pt.slug})`,
          );
          if (existing) stats.productTypes.updated++;
          else stats.productTypes.created++;
          continue;
        }

        await prisma.fabricProductType.upsert({
          where: { slug: pt.slug },
          create: {
            name: pt.name,
            slug: pt.slug,
            iconKey: pt.iconKey ?? null,
            order: pt.order ?? 0,
          },
          update: {
            name: pt.name,
            iconKey: pt.iconKey ?? null,
            order: pt.order ?? 0,
          },
        });

        if (existing) {
          stats.productTypes.updated++;
          console.log(`  UPDATED productType: ${pt.name}`);
        } else {
          stats.productTypes.created++;
          console.log(`  CREATED productType: ${pt.name}`);
        }
      } catch (err) {
        stats.productTypes.errors++;
        console.error(`  ERROR productType ${pt.slug}:`, err);
      }
    }
  }

  // 2. Families
  if (data.families?.length) {
    console.log(`\n--- Families (${data.families.length}) ---`);
    for (const fam of data.families) {
      try {
        const existing = await prisma.fabricFamily.findUnique({
          where: { slug: fam.slug },
        });

        if (dryRun) {
          console.log(
            `  ${existing ? "UPDATE" : "CREATE"} family: ${fam.name} (${fam.slug})`,
          );
          if (existing) stats.families.updated++;
          else stats.families.created++;
          continue;
        }

        await prisma.fabricFamily.upsert({
          where: { slug: fam.slug },
          create: {
            name: fam.name,
            slug: fam.slug,
            description: fam.description ?? null,
            eyebrow: fam.eyebrow ?? null,
            order: fam.order ?? 0,
          },
          update: {
            name: fam.name,
            description: fam.description ?? null,
            eyebrow: fam.eyebrow ?? null,
            order: fam.order ?? 0,
          },
        });

        if (existing) {
          stats.families.updated++;
          console.log(`  UPDATED family: ${fam.name}`);
        } else {
          stats.families.created++;
          console.log(`  CREATED family: ${fam.name}`);
        }
      } catch (err) {
        stats.families.errors++;
        console.error(`  ERROR family ${fam.slug}:`, err);
      }
    }
  }

  // 3. Swatches
  if (data.swatches?.length) {
    console.log(`\n--- Swatches (${data.swatches.length}) ---`);
    for (const sw of data.swatches) {
      try {
        // Resolve family
        const family = await prisma.fabricFamily.findUnique({
          where: { slug: sw.familySlug },
        });

        if (!family) {
          stats.swatches.skipped++;
          console.warn(
            `  SKIP swatch "${sw.name}": family "${sw.familySlug}" not found`,
          );
          continue;
        }

        const existing = await prisma.fabricSwatch.findUnique({
          where: { slug: sw.slug },
        });

        if (dryRun) {
          console.log(
            `  ${existing ? "UPDATE" : "CREATE"} swatch: ${sw.name} (${sw.slug}) -> family ${sw.familySlug}`,
          );
          if (existing) stats.swatches.updated++;
          else stats.swatches.created++;

          if (sw.availabilities?.length) {
            for (const av of sw.availabilities) {
              console.log(
                `    + availability: ${av.productTypeSlug}${av.note ? ` (${av.note})` : ""}`,
              );
            }
          }
          continue;
        }

        // Upsert the swatch
        const swatch = await prisma.fabricSwatch.upsert({
          where: { slug: sw.slug },
          create: {
            name: sw.name,
            slug: sw.slug,
            familyId: family.id,
            articleNumber: sw.articleNumber ?? null,
            colorHex: sw.colorHex ?? null,
            patternType: sw.patternType ?? null,
            subtitle: sw.subtitle ?? null,
            description: sw.description ?? null,
            order: sw.order ?? 0,
          },
          update: {
            name: sw.name,
            familyId: family.id,
            articleNumber: sw.articleNumber ?? null,
            colorHex: sw.colorHex ?? null,
            patternType: sw.patternType ?? null,
            subtitle: sw.subtitle ?? null,
            description: sw.description ?? null,
            order: sw.order ?? 0,
          },
        });

        if (existing) {
          stats.swatches.updated++;
          console.log(`  UPDATED swatch: ${sw.name}`);
        } else {
          stats.swatches.created++;
          console.log(`  CREATED swatch: ${sw.name}`);
        }

        // Handle availabilities: delete existing, then recreate
        if (sw.availabilities?.length) {
          const deleted = await prisma.fabricAvailability.deleteMany({
            where: { swatchId: swatch.id },
          });
          stats.availabilities.deleted += deleted.count;

          for (const av of sw.availabilities) {
            const productType = await prisma.fabricProductType.findUnique({
              where: { slug: av.productTypeSlug },
            });

            if (!productType) {
              stats.availabilities.errors++;
              console.warn(
                `    SKIP availability: productType "${av.productTypeSlug}" not found`,
              );
              continue;
            }

            await prisma.fabricAvailability.create({
              data: {
                swatchId: swatch.id,
                productTypeId: productType.id,
                note: av.note ?? null,
              },
            });
            stats.availabilities.created++;
            console.log(
              `    + availability: ${av.productTypeSlug}${av.note ? ` (${av.note})` : ""}`,
            );
          }
        }
      } catch (err) {
        stats.swatches.errors++;
        console.error(`  ERROR swatch ${sw.slug}:`, err);
      }
    }
  }

  // Summary
  console.log("\n========== Summary ==========");
  if (dryRun) console.log("(dry-run -- no changes were written)\n");
  console.log("Product Types:", JSON.stringify(stats.productTypes));
  console.log("Families:     ", JSON.stringify(stats.families));
  console.log("Swatches:     ", JSON.stringify(stats.swatches));
  console.log("Availabilities:", JSON.stringify(stats.availabilities));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
