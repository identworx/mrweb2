/**
 * Safe production script to update kollektionen page hero defaults.
 *
 * Only updates fields that still have the original default values:
 *   - headline: "Unsere Kollektionen" -> "Sieben Farbwelten."
 *   - eyebrow: "Saison 2027" -> "Saison 2027 · Outdoor Living"
 *
 * Does NOT touch introText, seoTitle, seoDescription, or any other data.
 * Idempotent: safe to run multiple times.
 *
 * Usage:
 *   npx tsx scripts/update-kollektionen-hero-defaults.ts
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: "kollektionen" },
  });

  if (!page) {
    console.log("Page 'kollektionen' not found — nothing to do.");
    return;
  }

  const updates: Record<string, string> = {};

  if (page.headline === "Unsere Kollektionen") {
    updates.headline = "Sieben Farbwelten.";
  }

  if (page.eyebrow === "Saison 2027") {
    updates.eyebrow = "Saison 2027 · Outdoor Living";
  }

  if (Object.keys(updates).length > 0) {
    await prisma.page.update({
      where: { slug: "kollektionen" },
      data: updates,
    });
    console.log("Updated:", updates);
  } else {
    console.log("Already customized, no changes.");
  }
}

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Update failed:", err);
    process.exit(1);
  });
