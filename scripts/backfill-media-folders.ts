/**
 * Backfill default media folders and assign unassigned assets to "Allgemein".
 *
 * Usage:
 *   npx tsx scripts/backfill-media-folders.ts
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const DEFAULT_FOLDERS = [
  { name: "Allgemein", slug: "general", path: "/uploads/general", order: 0 },
  { name: "Produkte", slug: "produkte", path: "/uploads/produkte", order: 1 },
  { name: "Stoffe & Muster", slug: "stoffe-muster", path: "/uploads/stoffe-muster", order: 2 },
  { name: "News", slug: "news", path: "/uploads/news", order: 3 },
  { name: "Downloads", slug: "downloads", path: "/uploads/downloads", order: 4 },
  { name: "Icons", slug: "icons", path: "/uploads/icons", order: 5 },
  { name: "Seiten", slug: "seiten", path: "/uploads/seiten", order: 6 },
];

async function main() {
  console.log("Backfilling default media folders...\n");

  let created = 0;
  let skipped = 0;

  for (const folder of DEFAULT_FOLDERS) {
    const existing = await prisma.mediaFolder.findUnique({
      where: { slug: folder.slug },
    });

    if (existing) {
      console.log(`  ✓ "${folder.name}" already exists (${existing.id})`);
      skipped++;
      continue;
    }

    const result = await prisma.mediaFolder.create({ data: folder });
    console.log(`  + Created "${folder.name}" (${result.id})`);
    created++;
  }

  const generalFolder = await prisma.mediaFolder.findUnique({
    where: { slug: "general" },
  });

  if (generalFolder) {
    const unassigned = await prisma.mediaAsset.count({ where: { folderId: null } });
    if (unassigned > 0) {
      await prisma.mediaAsset.updateMany({
        where: { folderId: null },
        data: { folderId: generalFolder.id },
      });
      console.log(`\n  → Assigned ${unassigned} unassigned assets to "Allgemein"`);
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
