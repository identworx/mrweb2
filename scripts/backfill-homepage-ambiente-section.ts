/**
 * Backfill: PageSection for the Ambiente-Mosaik on the homepage.
 *
 * Creates a section with style "homepage-ambiente-teaser" on the
 * home page at order 1 (right after the hero). Shifts existing
 * sections to make room. Does not overwrite existing values.
 *
 * Usage:
 *   npx tsx scripts/backfill-homepage-ambiente-section.ts          # dry-run
 *   npx tsx scripts/backfill-homepage-ambiente-section.ts --apply   # apply
 */

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");

const STYLE = "homepage-ambiente-teaser";
const PAGE_SLUG = "home";
const TARGET_ORDER = 1;

const DEFAULTS = {
  type: "CUSTOM" as const,
  eyebrow: null as string | null,
  title: null as string | null,
  content: null as string | null,
  buttonLabel: "Alle Ambiente-Bilder",
  buttonHref: "/kollektionen/ambiente",
  isActive: true,
};

async function main() {
  console.log(`\n=== Homepage Ambiente Section Backfill (${apply ? "APPLY" : "DRY-RUN"}) ===\n`);

  const page = await prisma.page.findUnique({
    where: { slug: PAGE_SLUG },
    select: { id: true, slug: true, title: true, status: true },
  });

  if (!page) {
    console.log(`ERROR: Page with slug "${PAGE_SLUG}" not found.`);
    return;
  }

  console.log(`FOUND: Page "${page.title}" (${page.id}), status: ${page.status}`);

  const allSections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    select: { id: true, title: true, order: true, settings: true },
    orderBy: { order: "asc" },
  });

  const existing = allSections.find((s) => {
    const settings = s.settings as Record<string, unknown> | null;
    return settings && settings.style === STYLE;
  });

  if (existing) {
    console.log(`ALREADY_CONFIGURED: Section "${STYLE}" exists (${existing.id})`);
    console.log(`  order: ${existing.order}`);
    console.log("\nSkipping — no changes needed.\n");
    return;
  }

  const needsShift = allSections.filter((s) => s.order >= TARGET_ORDER);

  if (needsShift.length > 0) {
    console.log(`\nShifting ${needsShift.length} section(s) to make room at order ${TARGET_ORDER}:`);
    for (const s of needsShift) {
      console.log(`  ${apply ? "SHIFT" : "WOULD SHIFT"}: "${s.title}" order ${s.order} → ${s.order + 1}`);
      if (apply) {
        await prisma.pageSection.update({
          where: { id: s.id },
          data: { order: s.order + 1 },
        });
      }
    }
  }

  console.log(`\n${apply ? "CREATE" : "WOULD CREATE"}: PageSection "${STYLE}"`);
  console.log(`  buttonLabel: "${DEFAULTS.buttonLabel}"`);
  console.log(`  buttonHref: "${DEFAULTS.buttonHref}"`);
  console.log(`  order: ${TARGET_ORDER}`);
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
        order: TARGET_ORDER,
        isActive: DEFAULTS.isActive,
        settings: { style: STYLE },
      },
    });
    console.log(`\n✓ Created section ${created.id}`);
    console.log("→ Edit via /admin/pages → Startseite → Sections.");
    console.log("→ Bilder werden unter /admin/ambiente gepflegt.\n");
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
