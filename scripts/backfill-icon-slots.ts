/**
 * Backfill IconSlot records from the icon registry.
 *
 * Idempotent: creates missing slots and refreshes label/description/defaultIcon
 * of existing ones from the registry (admin overrides stay untouched).
 *
 * Usage:
 *   npx tsx scripts/backfill-icon-slots.ts          # dry-run
 *   npx tsx scripts/backfill-icon-slots.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
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
    select: { key: true, label: true, description: true, defaultIcon: true },
  });
  const existingByKey = new Map(existing.map((e) => [e.key, e]));
  console.log(`Database has ${existingByKey.size} existing icon slots.`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const def of registry) {
    const row = existingByKey.get(def.key);
    if (row) {
      // Keep admin overrides (libraryIcon / media) untouched; only refresh the registry default.
      if (
        row.defaultIcon === def.defaultIcon &&
        row.label === def.label &&
        row.description === def.description
      ) {
        skipped++;
        continue;
      }
      console.log(`  ~ ${def.key} (${def.groupName}) default icon/label refreshed`);
      if (!dryRun) {
        await prisma.iconSlot.update({
          where: { key: def.key },
          data: { label: def.label, description: def.description, defaultIcon: def.defaultIcon },
        });
      }
      updated++;
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

  console.log(`\nDone: ${created} created, ${updated} updated, ${skipped} skipped.`);
  if (dryRun) {
    console.log("Run with --apply to write to the database.");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
