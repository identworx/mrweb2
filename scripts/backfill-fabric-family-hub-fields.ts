/**
 * Backfill FabricFamily hub fields from hardcoded fabricQualities data.
 *
 * - Matches existing families by slug aliases or name aliases
 * - Creates missing families if no match found
 * - Fills hub fields (material, weight, dyeing, comfort, etc.)
 * - Does NOT overwrite manually populated fields
 * - Does NOT delete or reset any existing data
 *
 * Usage:
 *   npx tsx scripts/backfill-fabric-family-hub-fields.ts          # dry-run
 *   npx tsx scripts/backfill-fabric-family-hub-fields.ts --apply   # write to DB
 *
 * Idempotent: skips fields that already have values, skips families that exist.
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
  canonicalSlug: string;
  canonicalName: string;
  slugAliases: string[];
  nameAliases: string[];
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness?: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  highlights?: string[];
  isHighlighted: boolean;
  defaultOrder: number;
}

const QUALITIES: QualityData[] = [
  {
    canonicalSlug: "mackintosh",
    canonicalName: "Mackintosh®",
    slugAliases: ["mackintosh", "mackintosh-classic"],
    nameAliases: ["Mackintosh®", "Mackintosh"],
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
    defaultOrder: 0,
  },
  {
    canonicalSlug: "mackintosh-lite",
    canonicalName: "Mackintosh® Lite",
    slugAliases: ["mackintosh-lite", "lite"],
    nameAliases: ["Mackintosh® Lite", "Mackintosh Lite", "Mackintosh® & Lite"],
    material: "100 % Olefin",
    weight: "ca. 170–300 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    description: "etwas leichterer Stoff",
    isHighlighted: false,
    defaultOrder: 1,
  },
  {
    canonicalSlug: "nerio",
    canonicalName: "Mackintosh® Nerio",
    slugAliases: ["nerio", "nerio-oceana", "oceana", "mackintosh-nerio"],
    nameAliases: [
      "NERIO",
      "Nerio",
      "NERIO / Oceana",
      "NERIO · Oceana",
      "Mackintosh® Nério",
      "Mackintosh Nério",
      "Mackintosh® Nerio",
      "Mackintosh Nerio",
    ],
    material: "100 % Olefin (50 % recycelt)",
    weight: "ca. 200–230 g/m²",
    dyeing: "spinndüsengefärbt",
    comfort: "hoher Sitzkomfort",
    cushionThickness: "5–6 cm Auflagen",
    subtitle: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
    isHighlighted: false,
    defaultOrder: 2,
  },
  {
    canonicalSlug: "basic",
    canonicalName: "Basic",
    slugAliases: ["basic", "polyester"],
    nameAliases: ["Basic", "Basic Polyester"],
    material: "100 % Polyester",
    weight: "ca. 180–230 g/m²",
    dyeing: "konventionell gefärbt",
    comfort: "guter Sitzkomfort",
    cushionThickness: "4–5 cm Auflagen",
    isHighlighted: false,
    defaultOrder: 3,
  },
];

type DbFamily = {
  id: string;
  slug: string;
  name: string;
  order: number;
  material: string | null;
  weight: string | null;
  dyeing: string | null;
  comfort: string | null;
  cushionThickness: string | null;
  subtitle: string | null;
  hubHighlights: string | null;
  isHighlighted: boolean;
};

function findFamily(families: DbFamily[], q: QualityData): { family: DbFamily; matchType: string } | null {
  for (const alias of q.slugAliases) {
    const match = families.find((f) => f.slug === alias);
    if (match) return { family: match, matchType: `slug "${alias}"` };
  }
  for (const alias of q.nameAliases) {
    const matches = families.filter((f) => f.name === alias);
    if (matches.length === 1) return { family: matches[0], matchType: `name "${alias}"` };
    if (matches.length > 1) return null;
  }
  return null;
}

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const families = await prisma.fabricFamily.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      order: true,
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
  let created = 0;
  let skipped = 0;
  let ambiguous = 0;

  const usedSlugs = new Set(families.map((f) => f.slug));

  for (const q of QUALITIES) {
    const result = findFamily(families, q);

    if (result) {
      const { family, matchType } = result;
      const outcome = await updateFamily(family, q, anyHighlighted, matchType);
      if (outcome === "updated") updated++;
      else skipped++;
      continue;
    }

    const nameMatches = families.filter((f) =>
      q.nameAliases.some((alias) => f.name === alias),
    );
    if (nameMatches.length > 1) {
      console.log(`  ⚠ AMBIGUOUS: "${q.canonicalName}" matches multiple families:`);
      for (const m of nameMatches) {
        console.log(`      ${m.slug} — "${m.name}"`);
      }
      console.log(`      Skipping — please resolve manually.`);
      ambiguous++;
      continue;
    }

    if (usedSlugs.has(q.canonicalSlug)) {
      console.log(`  ⚠ CONFLICT: Slug "${q.canonicalSlug}" already taken but not matched to "${q.canonicalName}". Skipping.`);
      ambiguous++;
      continue;
    }

    console.log(`  + CREATE "${q.canonicalName}" (slug: ${q.canonicalSlug}, order: ${q.defaultOrder})`);
    console.log(`      material = ${JSON.stringify(q.material)}`);
    console.log(`      weight = ${JSON.stringify(q.weight)}`);
    console.log(`      dyeing = ${JSON.stringify(q.dyeing)}`);
    console.log(`      comfort = ${JSON.stringify(q.comfort)}`);
    if (q.cushionThickness) console.log(`      cushionThickness = ${JSON.stringify(q.cushionThickness)}`);
    if (q.subtitle) console.log(`      subtitle = ${JSON.stringify(q.subtitle)}`);
    if (q.description) console.log(`      description = ${JSON.stringify(q.description)}`);
    if (q.highlights && q.highlights.length > 0) console.log(`      hubHighlights = ${q.highlights.length} lines`);
    if (q.isHighlighted && !anyHighlighted) console.log(`      isHighlighted = true`);

    if (!dryRun) {
      const newFamily = await prisma.fabricFamily.create({
        data: {
          slug: q.canonicalSlug,
          name: q.canonicalName,
          description: q.description || null,
          eyebrow: q.eyebrow || null,
          subtitle: q.subtitle || null,
          material: q.material,
          weight: q.weight,
          dyeing: q.dyeing,
          comfort: q.comfort,
          cushionThickness: q.cushionThickness || null,
          hubHighlights: q.highlights ? q.highlights.join("\n") : null,
          isHighlighted: q.isHighlighted && !anyHighlighted,
          order: q.defaultOrder,
          isActive: true,
        },
      });
      families.push({
        id: newFamily.id,
        slug: newFamily.slug,
        name: newFamily.name,
        order: newFamily.order,
        material: newFamily.material,
        weight: newFamily.weight,
        dyeing: newFamily.dyeing,
        comfort: newFamily.comfort,
        cushionThickness: newFamily.cushionThickness,
        subtitle: newFamily.subtitle,
        hubHighlights: newFamily.hubHighlights,
        isHighlighted: newFamily.isHighlighted,
      });
      usedSlugs.add(q.canonicalSlug);
    }
    created++;
  }

  console.log(`\nSummary: ${created} created, ${updated} updated, ${skipped} already complete, ${ambiguous} ambiguous/skipped.`);

  if (dryRun) {
    console.log("\nDry run — no changes written. Use --apply to write.\n");
  } else {
    console.log("\nDone.\n");
  }
}

async function updateFamily(
  family: DbFamily,
  q: QualityData,
  anyHighlighted: boolean,
  matchType: string,
): Promise<"updated" | "skipped"> {
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
    console.log(`  ○ "${q.canonicalName}" — matched via ${matchType}, all fields populated (skipped: ${skippedFields.join(", ")})`);
    return "skipped";
  }

  console.log(`  → "${q.canonicalName}" — matched via ${matchType}`);
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
  return "updated";
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
