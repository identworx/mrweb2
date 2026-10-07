/**
 * Fix German texts in Professional page CMS data.
 * Updates Page and PageSection records that were seeded with English text.
 *
 * Usage:
 *   npx tsx scripts/fix-professional-german-texts.ts          # dry-run
 *   npx tsx scripts/fix-professional-german-texts.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "APPLY"}\n`);

  const page = await prisma.page.findUnique({ where: { slug: "professional" } });
  if (!page) {
    console.log("Page 'professional' not found. Nothing to fix.");
    return;
  }
  console.log(`Page found (id: ${page.id})\n`);

  // Fix Page record
  const pageUpdates: Record<string, string> = {};
  if (page.introText?.includes("Technical Textiles. Local Support.")) {
    pageUpdates.introText = "Technische Textilien. Lokaler Support. Professionelle Lösungen.";
  }
  if (page.seoTitle?.includes("Technical Textiles & B2B Solutions")) {
    pageUpdates.seoTitle = "Mosaroma Professional — Technische Textilien & B2B-Lösungen | Mosaroma";
  }
  if (page.seoDescription?.includes("Technical Textiles für")) {
    pageUpdates.seoDescription = "Technische Textilien für Sonnenschutz, Outdoor-Möbel und architektonische Anwendungen. Lokaler B2B-Support in Oyten, Deutschland.";
  }

  if (Object.keys(pageUpdates).length > 0) {
    console.log("[page] Updates:");
    for (const [k, v] of Object.entries(pageUpdates)) {
      console.log(`  ${k}: "${v}"`);
    }
    if (!dryRun) {
      await prisma.page.update({ where: { id: page.id }, data: pageUpdates });
      console.log("  -> Updated.\n");
    } else {
      console.log("  -> Would update (dry run).\n");
    }
  } else {
    console.log("[page] Already correct.\n");
  }

  // Fix sections
  const sections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });

  const fixes: { style: string; title?: string; content?: string }[] = [
    {
      style: "professional-about",
      title: "Über Mosaroma Professional",
    },
    {
      style: "professional-oyten",
      title: "Technik- & B2B-Servicezentrum",
      content: "Mosaroma Professional ist nicht nur Fernsourcing aus Asien — wir bieten praktische, lokale Unterstützung in Deutschland. Unser Standort in Oyten ist die zentrale Anlaufstelle für B2B-Kunden in Europa: persönlich, direkt und praxisnah.",
    },
  ];

  for (const fix of fixes) {
    const section = sections.find((s) => {
      const settings = s.settings as Record<string, unknown> | null;
      return settings?.style === fix.style;
    });

    if (!section) {
      console.log(`[${fix.style}] Not found. Skipping.`);
      continue;
    }

    const updates: Record<string, string> = {};
    if (fix.title && section.title !== fix.title) {
      updates.title = fix.title;
    }
    if (fix.content && section.content !== fix.content) {
      updates.content = fix.content;
    }

    if (Object.keys(updates).length > 0) {
      console.log(`[${fix.style}] Updates:`);
      for (const [k, v] of Object.entries(updates)) {
        console.log(`  ${k}: "${v}"`);
      }
      if (!dryRun) {
        await prisma.pageSection.update({ where: { id: section.id }, data: updates });
        console.log("  -> Updated.");
      } else {
        console.log("  -> Would update (dry run).");
      }
    } else {
      console.log(`[${fix.style}] Already correct.`);
    }
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
