/**
 * Backfill `imageId: null` on existing OceanCycle step objects in the
 * "nerio-oceancycle" PageSection settings.
 *
 * Idempotent: skips steps that already carry an `imageId` field (even if null).
 * Never overwrites existing non-null `imageId` values.
 * Never deletes or modifies any other fields.
 *
 * Usage:
 *   npx tsx scripts/backfill-nerio-oceancycle-images.ts          # dry-run
 *   npx tsx scripts/backfill-nerio-oceancycle-images.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

interface OceanCycleStep {
  imageId?: string | null;
  [key: string]: unknown;
}

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  // 1. Find the nerio page
  const page = await prisma.page.findUnique({ where: { slug: "nerio" } });

  if (!page) {
    console.log("[page] Page 'nerio' not found. Exiting.\n");
    return;
  }

  console.log(`[page] Page 'nerio' found (id: ${page.id}).\n`);

  // 2. Find the nerio-oceancycle section
  const sections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });

  function getSettings(section: (typeof sections)[number]): Record<string, unknown> {
    if (typeof section.settings === "object" && section.settings !== null) {
      return section.settings as Record<string, unknown>;
    }
    return {};
  }

  const section = sections.find((s) => getSettings(s).style === "nerio-oceancycle");

  if (!section) {
    console.log("[nerio-oceancycle] Section not found. Exiting.\n");
    return;
  }

  console.log(`[nerio-oceancycle] Section found (id: ${section.id}).\n`);

  const settings = getSettings(section);
  const steps = settings.steps as OceanCycleStep[] | undefined;

  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    console.log("[steps] No steps found in section settings. Exiting.\n");
    return;
  }

  console.log(`[steps] Found ${steps.length} step(s).\n`);

  // 3. Check which steps are missing imageId
  const missingIndices: number[] = [];
  for (let i = 0; i < steps.length; i++) {
    if (!("imageId" in steps[i])) {
      missingIndices.push(i);
    }
  }

  // 4. If all steps already have imageId, skip
  if (missingIndices.length === 0) {
    console.log("[steps] SKIP — all steps already have an imageId field.");
    console.log("\nDone.");
    return;
  }

  // 5. Add imageId: null to steps that are missing it
  console.log(`[steps] UPDATE — ${missingIndices.length} step(s) missing imageId:`);

  const updatedSteps = steps.map((step, i) => {
    if (missingIndices.includes(i)) {
      const title = (step.title as string) ?? `(index ${i})`;
      console.log(`  [${i}] "${title}" — adding imageId: null`);
      return { ...step, imageId: null };
    }
    return step;
  });

  const updatedSettings = { ...settings, steps: updatedSteps };

  if (!dryRun) {
    await prisma.pageSection.update({
      where: { id: section.id },
      data: { settings: updatedSettings as any },
    });
    console.log("\n  -> Updated.");
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
