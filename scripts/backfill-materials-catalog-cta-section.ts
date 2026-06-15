/**
 * Backfill a PageSection helper for the Katalog-CTA on /materialien.
 *
 * Creates a PageSection with settings.style = "materials-catalog-cta" and
 * settings.helper = true on the "materialien" page, pre-populated with the
 * current hardcoded CTA content.
 *
 * Idempotent: skips if a section with that style already exists.
 *
 * Usage:
 *   npx tsx scripts/backfill-materials-catalog-cta-section.ts          # dry-run
 *   npx tsx scripts/backfill-materials-catalog-cta-section.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

const STYLE = "materials-catalog-cta";

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const page = await prisma.page.findUnique({ where: { slug: "materialien" } });
  if (!page) {
    console.log("Page 'materialien' not found in DB. Nothing to do.\n");
    return;
  }

  const existing = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });

  const alreadyExists = existing.some((s) => {
    const settings = typeof s.settings === "object" && s.settings !== null
      ? (s.settings as Record<string, unknown>)
      : {};
    return settings.style === STYLE;
  });

  if (alreadyExists) {
    console.log(`Section with style "${STYLE}" already exists. No changes needed.\n`);
    return;
  }

  const maxOrder = existing.reduce((max, s) => Math.max(max, s.order), 0);
  const newOrder = maxOrder + 1;

  console.log(`Will create PageSection on page "${page.slug}" (id: ${page.id}):`);
  console.log(`  style = "${STYLE}"`);
  console.log(`  helper = true`);
  console.log(`  type = CTA`);
  console.log(`  title = "Alle Details im Katalog"`);
  console.log(`  content = "Entdecken Sie alle Stoffqualitäten, Farben und technischen Daten in unserem aktuellen Katalog."`);
  console.log(`  buttonLabel = "Katalog ansehen"`);
  console.log(`  buttonHref = "/kataloge"`);
  console.log(`  order = ${newOrder}`);

  if (!dryRun) {
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: "CTA",
        title: "Alle Details im Katalog",
        content: "Entdecken Sie alle Stoffqualitäten, Farben und technischen Daten in unserem aktuellen Katalog.",
        buttonLabel: "Katalog ansehen",
        buttonHref: "/kataloge",
        settings: { style: STYLE, helper: true },
        order: newOrder,
        isActive: true,
      },
    });
    console.log("\nSection created successfully.\n");
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
