/**
 * Backfill FabricFamily hub fields from hardcoded fabricQualities data.
 *
 * Transfers material, weight, dyeing, comfort, cushionThickness, subtitle,
 * hubHighlights, and isHighlighted from lib/mosaroma/materials.ts into
 * existing FabricFamily records.
 *
 * Usage:
 *   npx tsx scripts/backfill-fabric-family-hub-fields.ts          # dry-run
 *   npx tsx scripts/backfill-fabric-family-hub-fields.ts --apply   # write to DB
 *
 * Idempotent: skips fields that already have values.
 * Does NOT delete or reset any existing data.
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

interface QualityData {
  slug: string;
  name: string;
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness?: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  isHighlighted: boolean;
}

const QUALITIES: QualityData[] = [
  {
    slug: "mackintosh",
    name: "Mackintosh®",
    material: "100 % Olefin",
    weight: "ab 260 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm starke Auflagen",
    highlights: [
      "Höchste Lichtechtheit (7–8)",
      "UV-Beständigkeit 5/5",
      "Wasseraufnahme < 0,1 %",
      "Bleichfest",
      "Schimmelfest",
      "PFAS-frei",
    ],
    isHighlighted: true,
  },
  {
    slug: "mackintosh-lite",
    name: "Mackintosh® Lite",
    material: "100 % Olefin",
    weight: "ca. 170–300 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    description: "etwas leichterer Stoff",
    isHighlighted: false,
  },
  {
    slug: "nerio",
    name: "Mackintosh® Nerio",
    material: "100 % Olefin (50 % recycelt)",
    weight: "ca. 200–230 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    subtitle: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
    isHighlighted: false,
  },
  {
    slug: "basic",
    name: "Basic",
    material: "100 % Polyester",
    weight: "ca. 180–230 g/m²",
    dyeing: "konventionell gefärbt",
    comfort: "guter Sitzkomfort",
    cushionThickness: "4–5 cm Auflagen",
    isHighlighted: false,
  },
];

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const families = await prisma.fabricFamily.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      material: true,
      weight: true,
      dyeing: true,
      comfort: true,
      cushionThickness: true,
      subtitle: true,
      hubHighlights: true,
      isHighlighted: true,
    },
  });

  console.log(`Found ${families.length} FabricFamily records in DB:\n`);
  for (const f of families) {
    console.log(`  ${f.slug} — "${f.name}" (material: ${f.material || "empty"})`);
  }

  const anyHighlighted = families.some((f) => f.isHighlighted);
  if (anyHighlighted) {
    console.log("\n  Note: At least one family already has isHighlighted=true. Will not override.");
  }

  console.log("");

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const q of QUALITIES) {
    const family = families.find((f) => f.slug === q.slug);

    if (!family) {
      console.log(`  ✗ "${q.name}" (slug: ${q.slug}) — NOT FOUND in DB`);
      notFound++;
      continue;
    }

    const updates: Record<string, unknown> = {};
    const skippedFields: string[] = [];

    function maybeSet(field: string, dbValue: unknown, newValue: unknown) {
      if (dbValue) {
        skippedFields.push(field);
      } else if (newValue) {
        updates[field] = newValue;
      }
    }

    maybeSet("material", family.material, q.material);
    maybeSet("weight", family.weight, q.weight);
    maybeSet("dyeing", family.dyeing, q.dyeing);
    maybeSet("comfort", family.comfort, q.comfort);
    maybeSet("cushionThickness", family.cushionThickness, q.cushionThickness);
    maybeSet("subtitle", family.subtitle, q.subtitle);

    if (family.hubHighlights) {
      skippedFields.push("hubHighlights");
    } else if (q.highlights && q.highlights.length > 0) {
      updates.hubHighlights = q.highlights.join("\n");
    }

    if (q.isHighlighted && !anyHighlighted && !family.isHighlighted) {
      updates.isHighlighted = true;
    } else if (q.isHighlighted && anyHighlighted) {
      skippedFields.push("isHighlighted (already set on another family)");
    }

    if (Object.keys(updates).length === 0) {
      console.log(`  ○ "${q.name}" — all fields already populated (skipped: ${skippedFields.join(", ")})`);
      skipped++;
      continue;
    }

    console.log(`  → "${q.name}" (slug: ${q.slug})`);
    for (const [key, val] of Object.entries(updates)) {
      const display = typeof val === "string" && val.length > 60 ? val.slice(0, 57) + "..." : val;
      console.log(`      SET ${key} = ${JSON.stringify(display)}`);
    }
    if (skippedFields.length > 0) {
      console.log(`      SKIP (already set): ${skippedFields.join(", ")}`);
    }

    if (!dryRun) {
      await prisma.fabricFamily.update({
        where: { id: family.id },
        data: updates as Record<string, string | boolean | null>,
      });
    }
    updated++;
  }

  console.log(`\nSummary: ${updated} updated, ${skipped} already complete, ${notFound} not found.`);

  if (dryRun) {
    console.log("\nDry run — no changes written. Use --apply to write.\n");
  } else {
    console.log("\nDone.\n");
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
