/**
 * Backfill `cards` array on the "nerio-products-preview" PageSection settings.
 *
 * Idempotent: skips if section already has a non-empty `cards` array.
 * Never overwrites existing card data.
 *
 * Usage:
 *   npx tsx scripts/backfill-nerio-fabric-cards.ts          # dry-run
 *   npx tsx scripts/backfill-nerio-fabric-cards.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

const DEFAULT_CARDS = [
  { id: "dekokissen", title: "Deko-Kissen", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 1 },
  { id: "hochlehner", title: "Hochlehner", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 2 },
  { id: "niedriglehner", title: "Niedriglehner", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 3 },
  { id: "sitzkissen", title: "Sitzkissen", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 4 },
  { id: "bankauflagen", title: "Bankauflagen", href: "/kollektionen/nerio-oceana", imageId: null, isActive: true, order: 5 },
];

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const page = await prisma.page.findUnique({ where: { slug: "nerio" } });

  if (!page) {
    console.log("[page] Page 'nerio' not found. Exiting.\n");
    return;
  }

  console.log(`[page] FOUND — Page 'nerio' (id: ${page.id}).\n`);

  const sections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });

  function getSettings(section: (typeof sections)[number]): Record<string, unknown> {
    if (typeof section.settings === "object" && section.settings !== null) {
      return section.settings as Record<string, unknown>;
    }
    return {};
  }

  const section = sections.find((s) => getSettings(s).style === "nerio-products-preview");

  if (!section) {
    console.log("[nerio-products-preview] Section not found. Exiting.\n");
    return;
  }

  console.log(`[nerio-products-preview] FOUND — Section (id: ${section.id}).\n`);

  const settings = getSettings(section);
  const existingCards = settings.cards;

  if (Array.isArray(existingCards) && existingCards.length > 0) {
    console.log(`[cards] ALREADY_CONFIGURED — ${existingCards.length} card(s) already present. SKIP.`);
    console.log("\nDone.");
    return;
  }

  console.log(`[cards] UPDATE — No cards found. Adding ${DEFAULT_CARDS.length} default card(s):`);
  for (const card of DEFAULT_CARDS) {
    console.log(`  [${card.order}] "${card.title}" → ${card.href}`);
  }

  const updatedSettings = { ...settings, cards: DEFAULT_CARDS };

  if (!dryRun) {
    await prisma.pageSection.update({
      where: { id: section.id },
      data: { settings: updatedSettings as any },
    });
    console.log("\n  -> Updated.");
  } else {
    console.log("\n  -> Would update (dry run).");
  }

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
