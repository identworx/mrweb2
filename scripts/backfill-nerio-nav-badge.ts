import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dryRun = !apply;

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const headerMenu = await prisma.navigationMenu.findFirst({
    where: { location: "HEADER" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!headerMenu) {
    console.log("ERROR: No HEADER menu found.");
    process.exit(1);
  }

  console.log(`Found HEADER menu: "${headerMenu.name}" (${headerMenu.items.length} items)`);
  for (const item of headerMenu.items) {
    console.log(`  #${item.order} "${item.label}" → ${item.href || "(no href)"} [linkType: ${item.linkType}, active: ${item.isActive}]${item.badgeText ? ` [badge: ${item.badgeText}]` : ""}`);
  }

  const nerio = await prisma.collection.findFirst({
    where: { slug: { contains: "nerio" } },
    select: { slug: true, name: true, status: true },
  });

  const targetHref = nerio ? `/kollektionen/${nerio.slug}` : "/kollektionen";
  console.log(`\nNerio collection: ${nerio ? `"${nerio.name}" (/${nerio.slug}, ${nerio.status})` : "NOT FOUND — using /kollektionen as fallback"}`);
  console.log(`Target href: ${targetHref}`);

  const existingNerio = headerMenu.items.find(
    (i) => i.label.toLowerCase().includes("nerio"),
  );
  if (existingNerio) {
    console.log(`\nNerio nav item already exists: "${existingNerio.label}" (badge: ${existingNerio.badgeText || "none"})`);
    if (existingNerio.badgeText === "NEU") {
      console.log("Badge already set to NEU. Nothing to do.");
      return;
    }
    if (!dryRun) {
      await prisma.navigationItem.update({
        where: { id: existingNerio.id },
        data: { badgeText: "NEU", badgeVariant: "blue" },
      });
      console.log("Updated badge to NEU.");
    } else {
      console.log("Would update badge to NEU.");
    }
    return;
  }

  const kontaktItem = headerMenu.items.find(
    (i) => i.label.toLowerCase() === "kontakt" && i.linkType !== "PAGE_SLUG",
  );

  if (!kontaktItem) {
    console.log('\nERROR: No "Kontakt" nav item found in HEADER menu.');
    console.log("Available items:");
    for (const item of headerMenu.items) {
      console.log(`  "${item.label}" (linkType: ${item.linkType})`);
    }
    process.exit(1);
  }

  console.log(`\nFound "Kontakt" item: #${kontaktItem.order} (linkType: ${kontaktItem.linkType}, href: ${kontaktItem.href})`);
  console.log("\nPlanned changes:");
  console.log(`  Label: "${kontaktItem.label}" → "Nerio"`);
  console.log(`  LinkType: "${kontaktItem.linkType}" → "CUSTOM_URL"`);
  console.log(`  Href: "${kontaktItem.href || ""}" → "${targetHref}"`);
  console.log(`  Badge: (none) → "NEU" (blue)`);
  console.log(`  Order: ${kontaktItem.order} (unchanged)`);
  console.log(`  isActive: ${kontaktItem.isActive} (unchanged)`);

  if (dryRun) {
    console.log("\nDry-run complete. Run with --apply to write changes.");
    return;
  }

  await prisma.navigationItem.update({
    where: { id: kontaktItem.id },
    data: {
      label: "Nerio",
      linkType: "CUSTOM_URL",
      href: targetHref,
      linkedPageId: null,
      badgeText: "NEU",
      badgeVariant: "blue",
    },
  });

  console.log("\nDone. Kontakt → Nerio with NEU badge applied.");
  console.log("Note: Revalidation must happen via admin save or rebuild.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
