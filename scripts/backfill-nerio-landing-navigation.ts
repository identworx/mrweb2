/**
 * Update the existing NERIO navigation item in the HEADER menu
 * to point to the new /nerio landing page instead of /kollektionen/nerio-oceana.
 *
 * Changes:
 *   - linkType: "CUSTOM_URL" → "PAGE"
 *   - href: "/kollektionen/nerio-oceana" → "/nerio"
 *   - linkedPageId: null → <Page "nerio" id>
 *
 * Preserves:
 *   - label, badgeText ("NEU"), badgeVariant ("blue"), order, isActive, target
 *
 * Does NOT touch any other navigation items (Kontakt, Kollektionen, etc.).
 *
 * Idempotent: if already pointing to /nerio with linkType PAGE, skips.
 *
 * Usage:
 *   npx tsx scripts/backfill-nerio-landing-navigation.ts          # dry-run
 *   npx tsx scripts/backfill-nerio-landing-navigation.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  // 1. Find the HEADER navigation menu
  const headerMenu = await prisma.navigationMenu.findFirst({
    where: { location: "HEADER" },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { linkedPage: { select: { slug: true, status: true } } },
      },
    },
  });

  if (!headerMenu) {
    console.log("ERROR: No HEADER navigation menu found. Nothing to do.");
    return;
  }

  console.log(`[menu] Found HEADER menu: "${headerMenu.name}" (id: ${headerMenu.id})`);
  console.log(`[menu] ${headerMenu.items.length} items total.\n`);

  // 2. Find the NERIO navigation item (case-insensitive label match)
  const nerioItems = headerMenu.items.filter(
    (item) => item.label.toLowerCase() === "nerio",
  );

  if (nerioItems.length === 0) {
    console.log("WARNING: No navigation item with label 'Nerio' / 'NERIO' found in HEADER menu.");
    console.log("Available items:");
    for (const item of headerMenu.items) {
      console.log(`  - "${item.label}" → ${item.href} (linkType: ${item.linkType})`);
    }
    console.log("\nNo changes made. If NERIO should be added, do so via Admin → Navigation.");
    return;
  }

  if (nerioItems.length > 1) {
    console.log(`WARNING: ${nerioItems.length} items with label 'Nerio' found. This is unexpected.`);
    console.log("Only updating the first match to avoid confusion.\n");
  }

  const nerioItem = nerioItems[0];

  console.log(`[nerio] Found navigation item:`);
  console.log(`  id:           ${nerioItem.id}`);
  console.log(`  label:        "${nerioItem.label}"`);
  console.log(`  linkType:     ${nerioItem.linkType}`);
  console.log(`  href:         ${nerioItem.href}`);
  console.log(`  badgeText:    ${nerioItem.badgeText || "(none)"}`);
  console.log(`  badgeVariant: ${nerioItem.badgeVariant}`);
  console.log(`  linkedPageId: ${nerioItem.linkedPageId || "(none)"}`);
  console.log(`  linkedPage:   ${nerioItem.linkedPage ? nerioItem.linkedPage.slug : "(none)"}`);
  console.log(`  order:        ${nerioItem.order}`);
  console.log(`  isActive:     ${nerioItem.isActive}\n`);

  // 3. Check if already correctly configured
  if (
    nerioItem.linkType === "PAGE" &&
    nerioItem.linkedPage?.slug === "nerio" &&
    nerioItem.linkedPage?.status === "PUBLISHED"
  ) {
    console.log("[nerio] Already linked to Page 'nerio' with linkType PAGE. No changes needed.\n");
    console.log("Done.");
    return;
  }

  // 4. Find the NERIO page
  const nerioPage = await prisma.page.findUnique({
    where: { slug: "nerio" },
    select: { id: true, slug: true, status: true },
  });

  if (!nerioPage) {
    console.log("ERROR: Page with slug 'nerio' not found in database.");
    console.log("Run `npx tsx scripts/backfill-nerio-sections.ts --apply` first to create the page.");
    return;
  }

  if (nerioPage.status !== "PUBLISHED") {
    console.log(`WARNING: Page 'nerio' exists (id: ${nerioPage.id}) but status is '${nerioPage.status}', not PUBLISHED.`);
    console.log("The navigation link will work but the page may not render. Consider publishing it first.\n");
  }

  console.log(`[page] Found Page 'nerio' (id: ${nerioPage.id}, status: ${nerioPage.status})\n`);

  // 5. Update the navigation item
  console.log("[nerio] Will update:");
  console.log(`  linkType:     ${nerioItem.linkType} → PAGE`);
  console.log(`  href:         ${nerioItem.href} → /nerio`);
  console.log(`  linkedPageId: ${nerioItem.linkedPageId || "(null)"} → ${nerioPage.id}`);
  console.log(`  badgeText:    "${nerioItem.badgeText}" (preserved)`);
  console.log(`  badgeVariant: "${nerioItem.badgeVariant}" (preserved)`);
  console.log(`  label:        "${nerioItem.label}" (preserved)`);
  console.log(`  order:        ${nerioItem.order} (preserved)`);

  if (!dryRun) {
    await prisma.navigationItem.update({
      where: { id: nerioItem.id },
      data: {
        linkType: "PAGE",
        href: "/nerio",
        linkedPageId: nerioPage.id,
      },
    });
    console.log("\n  -> Updated successfully.");
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
