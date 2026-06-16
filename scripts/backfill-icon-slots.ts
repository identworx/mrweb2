/**
 * Backfill IconSlot records from the icon registry.
 *
 * Idempotent: skips creation if a slot with that key already exists.
 *
 * Usage:
 *   npx tsx scripts/backfill-icon-slots.ts          # dry-run
 *   npx tsx scripts/backfill-icon-slots.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

interface SlotDef {
  key: string;
  label: string;
  description: string;
  groupName: string;
  defaultIcon: string;
  sizeHint: string;
}

async function loadRegistry(): Promise<SlotDef[]> {
  const mod = await import("../lib/cms/icon-registry.js");
  return mod.ICON_REGISTRY;
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== APPLYING ===");

  const registry = await loadRegistry();
  console.log(`Registry has ${registry.length} icon slot definitions.`);

  const existing = await prisma.iconSlot.findMany({
    select: { key: true },
  });
  const existingKeys = new Set(existing.map((e) => e.key));
  console.log(`Database has ${existingKeys.size} existing icon slots.`);

  let created = 0;
  let skipped = 0;

  for (const def of registry) {
    if (existingKeys.has(def.key)) {
      skipped++;
      continue;
    }

    console.log(`  + ${def.key} (${def.groupName})`);

    if (!dryRun) {
      await prisma.iconSlot.create({
        data: {
          key: def.key,
          label: def.label,
          description: def.description,
          groupName: def.groupName,
          defaultIcon: def.defaultIcon,
          sizeHint: def.sizeHint,
          colorMode: "inherit",
          isActive: true,
        },
      });
    }
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped.`);
  if (dryRun) {
    console.log("Run with --apply to write to the database.");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
