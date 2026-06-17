/**
 * Backfill missing FabricProductType entries from the Stoffe & Muster catalog.
 *
 * The catalog has 8 product types, but only 4 exist in the DB.
 * This script adds the missing 4: Sitzpolster, Bankauflagen, Poufs,
 * Tischsets & Tischläufer.
 *
 * Idempotent: skips product types that already exist (matched by slug).
 *
 * Usage:
 *   npx tsx scripts/backfill-fabric-product-types.ts          # dry-run
 *   npx tsx scripts/backfill-fabric-product-types.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

const PRODUCT_TYPES = [
  { name: "Sitzpolster", slug: "sitzpolster", iconKey: "sitzpolster", order: 5 },
  { name: "Bankauflagen", slug: "bankauflagen", iconKey: "bankauflagen", order: 6 },
  { name: "Poufs", slug: "poufs", iconKey: "poufs", order: 7 },
  { name: "Tischsets & Tischläufer", slug: "tischsets-tischlaeufer", iconKey: "tischsets", order: 8 },
];

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  let created = 0;
  let skipped = 0;

  for (const pt of PRODUCT_TYPES) {
    const existing = await prisma.fabricProductType.findUnique({
      where: { slug: pt.slug },
    });

    if (existing) {
      console.log(`  SKIP "${pt.name}" (slug: ${pt.slug}) — already exists (id: ${existing.id})`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`  CREATE "${pt.name}" (slug: ${pt.slug}, icon: ${pt.iconKey}, order: ${pt.order})`);
      created++;
      continue;
    }

    const record = await prisma.fabricProductType.create({
      data: {
        name: pt.name,
        slug: pt.slug,
        iconKey: pt.iconKey,
        order: pt.order,
      },
    });
    console.log(`  CREATED "${pt.name}" (id: ${record.id})`);
    created++;
  }

  console.log(`\n========== Summary ==========`);
  if (dryRun) console.log("(dry-run — no changes were written)\n");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
