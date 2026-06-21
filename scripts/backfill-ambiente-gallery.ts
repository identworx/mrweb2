/**
 * Backfill script for Ambiente Gallery.
 *
 * Phase 1: Creates AmbienteImage records from MediaAssets in an "ambiente" folder.
 * Phase 2: Assigns teaserSlot to the first 5 active images (by order) that
 *          don't already have a slot, without overwriting existing assignments.
 *
 * Usage:
 *   npx tsx scripts/backfill-ambiente-gallery.ts          # dry-run
 *   npx tsx scripts/backfill-ambiente-gallery.ts --apply   # apply changes
 */

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");

const TEASER_SLOTS = ["hero", "portrait", "wide", "smallA", "smallB"] as const;

async function backfillRecords() {
  const existing = await prisma.ambienteImage.count();
  if (existing > 0) {
    console.log(`ALREADY_CONFIGURED: ${existing} AmbienteImage record(s) already exist.`);
    console.log("Skipping record creation to avoid duplicates.");
    return;
  }

  const folder = await prisma.mediaFolder.findFirst({
    where: {
      OR: [
        { slug: { contains: "ambiente" } },
        { name: { contains: "Ambiente" } },
        { name: { contains: "ambiente" } },
      ],
    },
  });

  let candidates: Array<{
    id: string;
    filename: string;
    url: string;
    alt: string | null;
    title: string | null;
  }> = [];

  if (folder) {
    console.log(`FOUND: Media folder "${folder.name}" (${folder.id})`);
    candidates = await prisma.mediaAsset.findMany({
      where: {
        folderId: folder.id,
        mimeType: { startsWith: "image/" },
      },
      orderBy: { filename: "asc" },
      select: { id: true, filename: true, url: true, alt: true, title: true },
    });
  } else {
    candidates = await prisma.mediaAsset.findMany({
      where: {
        OR: [
          { filename: { contains: "ambiente" } },
          { originalName: { contains: "ambiente" } },
          { originalName: { contains: "Ambiente" } },
        ],
        mimeType: { startsWith: "image/" },
      },
      orderBy: { filename: "asc" },
      select: { id: true, filename: true, url: true, alt: true, title: true },
    });

    if (candidates.length > 0) {
      console.log(`FOUND: ${candidates.length} asset(s) matching "ambiente" in filename`);
    }
  }

  if (candidates.length === 0) {
    console.log("SKIP: No matching MediaAssets found for ambiente gallery.");
    console.log("→ Use the admin at /admin/ambiente to add images manually.");
    return;
  }

  console.log(`\nWill create ${candidates.length} AmbienteImage record(s):\n`);

  for (let i = 0; i < candidates.length; i++) {
    const asset = candidates[i];
    const title = asset.title || asset.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const isFeatured = i < 5;

    console.log(
      `  ${apply ? "CREATE" : "WOULD CREATE"}: "${title}" (asset: ${asset.id}) ${isFeatured ? "[FEATURED]" : ""}`,
    );

    if (apply) {
      await prisma.ambienteImage.create({
        data: {
          title,
          alt: asset.alt || title,
          caption: null,
          colorWorlds: [],
          featured: isFeatured,
          isActive: true,
          order: i,
          mediaAssetId: asset.id,
        },
      });
    }
  }

  if (apply) {
    console.log(`\n✓ Created ${candidates.length} AmbienteImage record(s).`);
  } else {
    console.log(`\nDry run — run with --apply to create records.`);
  }
}

async function backfillTeaserSlots() {
  console.log("\n--- Teaser Slot Assignment ---\n");

  const occupied = await prisma.ambienteImage.findMany({
    where: { teaserSlot: { not: null } },
    select: { id: true, title: true, teaserSlot: true },
  });

  const takenSlots = new Set(occupied.map((r) => r.teaserSlot));
  const freeSlots = TEASER_SLOTS.filter((s) => !takenSlots.has(s));

  if (freeSlots.length === 0) {
    console.log("ALL_SLOTS_FILLED: All 5 teaser slots are already assigned.");
    return;
  }

  if (occupied.length > 0) {
    console.log("Existing slot assignments:");
    for (const r of occupied) {
      console.log(`  ${r.teaserSlot} → "${r.title}" (${r.id})`);
    }
  }

  console.log(`Free slots: ${freeSlots.join(", ")}`);

  const candidates = await prisma.ambienteImage.findMany({
    where: { isActive: true, teaserSlot: null },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    take: freeSlots.length,
    select: { id: true, title: true },
  });

  if (candidates.length === 0) {
    console.log("SKIP: No unassigned active images available for slot assignment.");
    return;
  }

  console.log(`\nAssigning ${Math.min(candidates.length, freeSlots.length)} slot(s):\n`);

  for (let i = 0; i < candidates.length && i < freeSlots.length; i++) {
    const img = candidates[i];
    const slot = freeSlots[i];
    console.log(`  ${apply ? "ASSIGN" : "WOULD ASSIGN"}: ${slot} → "${img.title}" (${img.id})`);

    if (apply) {
      await prisma.ambienteImage.update({
        where: { id: img.id },
        data: { teaserSlot: slot },
      });
    }
  }

  if (apply) {
    console.log(`\n✓ Assigned ${Math.min(candidates.length, freeSlots.length)} teaser slot(s).`);
  } else {
    console.log(`\nDry run — run with --apply to assign slots.`);
  }
}

async function main() {
  console.log(`\n=== Ambiente Gallery Backfill (${apply ? "APPLY" : "DRY-RUN"}) ===\n`);
  await backfillRecords();
  await backfillTeaserSlots();
  console.log("");
}

main()
  .catch((err) => {
    console.error("Backfill error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
