/**
 * Backfill a PageSection for the "Warum Olefin?" image on /materialien.
 *
 * Creates a CUSTOM section with settings.style = "materials-olefin"
 * on the "materialien" page. The admin can then attach an image via
 * the existing MediaPicker in the section editor.
 *
 * Usage:
 *   npx tsx scripts/backfill-materials-olefin-image-section.ts          # dry-run
 *   npx tsx scripts/backfill-materials-olefin-image-section.ts --apply   # write to DB
 *
 * Idempotent: skips if a section with style "materials-olefin" already exists.
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

const STYLE = "materials-olefin";
const PAGE_SLUG = "materialien";

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const page = await prisma.page.findUnique({
    where: { slug: PAGE_SLUG },
    select: { id: true, slug: true },
  });

  if (!page) {
    console.log(`Page "${PAGE_SLUG}" not found. Run backfill-material-pages.ts first or create the page in the CMS.`);
    return;
  }

  console.log(`Found page: ${page.slug} (id: ${page.id})`);

  const existing = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    select: { id: true, title: true, settings: true, order: true },
    orderBy: { order: "asc" },
  });

  const hasOlefin = existing.some((s) => {
    const settings = typeof s.settings === "string"
      ? (() => { try { return JSON.parse(s.settings); } catch { return {}; } })()
      : (s.settings as Record<string, unknown>) ?? {};
    return settings.style === STYLE;
  });

  if (hasOlefin) {
    console.log(`\nSection with style "${STYLE}" already exists. Nothing to do.`);
    return;
  }

  const maxOrder = existing.reduce((max, s) => Math.max(max, s.order), 0);
  const newOrder = maxOrder + 1;

  console.log(`\nWill create section:`);
  console.log(`  title: "Warum Olefin? — Bild"`);
  console.log(`  style: "${STYLE}"`);
  console.log(`  order: ${newOrder}`);
  console.log(`  imageId: null (attach via CMS admin)`);

  if (dryRun) {
    console.log("\nDry run — no changes written. Use --apply to write.\n");
    return;
  }

  const section = await prisma.pageSection.create({
    data: {
      pageId: page.id,
      type: "CUSTOM" as never,
      title: "Warum Olefin? — Bild",
      content: "CMS-gesteuertes Bild für den Olefin-Abschnitt auf der Materialien-Übersicht.",
      settings: JSON.stringify({ style: STYLE }),
      order: newOrder,
      isActive: true,
    },
  });

  console.log(`\nCreated section: id=${section.id}, order=${newOrder}`);
  console.log("Next step: Open /admin/pages, edit the 'materialien' page, and attach an image to this section.\n");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
