/**
 * Backfill: PageSection for the Ambiente-Mosaik teaser on /kollektionen.
 *
 * Creates a section with style "collections-ambiente-teaser" on the
 * kollektionen page if it doesn't already exist. Does not overwrite
 * existing values.
 *
 * Usage:
 *   npx tsx scripts/backfill-collections-ambiente-section.ts          # dry-run
 *   npx tsx scripts/backfill-collections-ambiente-section.ts --apply   # apply
 */

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");

const STYLE = "collections-ambiente-teaser";
const PAGE_SLUG = "kollektionen";

const DEFAULTS = {
  type: "CUSTOM" as const,
  eyebrow: "Ambiente",
  title: "Mosaroma im Einsatz.",
  content: null as string | null,
  buttonLabel: "Alle Ambiente-Bilder",
  buttonHref: "/kollektionen/ambiente",
  order: 10,
  isActive: true,
};

async function main() {
  console.log(`\n=== Collections Ambiente Section Backfill (${apply ? "APPLY" : "DRY-RUN"}) ===\n`);

  const page = await prisma.page.findUnique({
    where: { slug: PAGE_SLUG },
    select: { id: true, slug: true, title: true, status: true },
  });

  if (!page) {
    console.log(`ERROR: Page with slug "${PAGE_SLUG}" not found.`);
    console.log("→ Create the page first via /admin/pages.\n");
    return;
  }

  console.log(`FOUND: Page "${page.title}" (${page.id}), status: ${page.status}`);

  const allSections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    select: {
      id: true,
      title: true,
      eyebrow: true,
      content: true,
      buttonLabel: true,
      buttonHref: true,
      order: true,
      isActive: true,
      settings: true,
    },
  });

  const existing = allSections.find((s) => {
    const settings = s.settings as Record<string, unknown> | null;
    return settings && settings.style === STYLE;
  });

  if (existing) {
    console.log(`ALREADY_CONFIGURED: Section "${STYLE}" exists (${existing.id})`);
    console.log(`  title: "${existing.title}"`);
    console.log(`  eyebrow: "${existing.eyebrow}"`);
    console.log(`  order: ${existing.order}`);
    console.log(`  isActive: ${existing.isActive}`);
    console.log("\nSkipping — no changes needed.\n");
    return;
  }

  console.log(`\n${apply ? "CREATE" : "WOULD CREATE"}: PageSection "${STYLE}"`);
  console.log(`  eyebrow: "${DEFAULTS.eyebrow}"`);
  console.log(`  title: "${DEFAULTS.title}"`);
  console.log(`  content: ${DEFAULTS.content ?? "(empty)"}`);
  console.log(`  buttonLabel: "${DEFAULTS.buttonLabel}"`);
  console.log(`  buttonHref: "${DEFAULTS.buttonHref}"`);
  console.log(`  order: ${DEFAULTS.order}`);
  console.log(`  isActive: ${DEFAULTS.isActive}`);

  if (apply) {
    const created = await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: DEFAULTS.type,
        eyebrow: DEFAULTS.eyebrow,
        title: DEFAULTS.title,
        content: DEFAULTS.content,
        buttonLabel: DEFAULTS.buttonLabel,
        buttonHref: DEFAULTS.buttonHref,
        order: DEFAULTS.order,
        isActive: DEFAULTS.isActive,
        settings: { style: STYLE },
      },
    });
    console.log(`\n✓ Created section ${created.id}`);
    console.log("→ Edit via /admin/pages → Kollektionen → Sections.\n");
  } else {
    console.log(`\nDry run — run with --apply to create.\n`);
  }
}

main()
  .catch((err) => {
    console.error("Backfill error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
