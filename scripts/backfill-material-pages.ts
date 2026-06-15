/**
 * Backfill CMS Page records for new material sub-pages.
 *
 * Usage:
 *   npx tsx scripts/backfill-material-pages.ts          # dry-run
 *   npx tsx scripts/backfill-material-pages.ts --apply   # write to DB
 *
 * Idempotent: skips pages that already exist.
 * Does NOT touch the existing "materialien" page.
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

interface PageDef {
  slug: string;
  title: string;
  headline: string;
  eyebrow: string;
  introText: string;
  seoTitle: string;
  seoDescription: string;
  type: string;
}

const PAGES: PageDef[] = [
  {
    slug: "stoffe-muster",
    title: "Stoffe & Muster",
    headline: "Stoffe & Muster",
    eyebrow: "Stoffbibliothek",
    introText:
      "Filtern Sie nach Materialfamilie, Produktart oder suchen Sie gezielt nach Stoffname und Artikelnummer.",
    seoTitle: "Stoffe & Muster | Mosaroma",
    seoDescription:
      "Entdecken Sie alle Mosaroma Stoffe und Muster. Filtern Sie nach Materialfamilie, Produktart oder Artikelnummer.",
    type: "MATERIAL_INDEX",
  },
  {
    slug: "technische-daten",
    title: "Technische Daten",
    headline: "Technische Daten",
    eyebrow: "Materialvergleich",
    introText:
      "Materialeigenschaften, Prüfwerte und Outdoor-Performance unserer Stoffqualitäten im Vergleich.",
    seoTitle: "Technische Daten | Mosaroma",
    seoDescription:
      "Technische Materialeigenschaften, Prüfwerte und Outdoor-Performance der Mosaroma Stoffqualitäten im Vergleich.",
    type: "MATERIAL_INDEX",
  },
];

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const existing = await prisma.page.findMany({
    where: { slug: { in: PAGES.map((p) => p.slug) } },
    select: { slug: true, id: true, status: true },
  });

  const existingSlugs = new Set(existing.map((p) => p.slug));

  console.log("Existing pages:");
  if (existing.length === 0) {
    console.log("  (none)");
  } else {
    for (const p of existing) {
      console.log(`  ✓ ${p.slug} (${p.status}) — id: ${p.id}`);
    }
  }

  const toCreate = PAGES.filter((p) => !existingSlugs.has(p.slug));

  if (toCreate.length === 0) {
    console.log("\nAll pages already exist. Nothing to do.");
    return;
  }

  console.log("\nPages to create:");
  for (const p of toCreate) {
    console.log(`  + ${p.slug} — "${p.title}"`);
  }

  if (dryRun) {
    console.log("\nDry run — no changes written. Use --apply to write.\n");
    return;
  }

  for (const p of toCreate) {
    const created = await prisma.page.create({
      data: {
        slug: p.slug,
        title: p.title,
        headline: p.headline,
        eyebrow: p.eyebrow,
        introText: p.introText,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        type: p.type as never,
        status: "PUBLISHED" as never,
      },
    });
    console.log(`  Created: ${p.slug} — id: ${created.id}`);
  }

  console.log("\nDone.\n");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
