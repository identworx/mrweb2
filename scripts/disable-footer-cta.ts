/**
 * Disables the footer CTA banner on production.
 * Sets ctaEnabled to false without touching any other data.
 * Idempotent — safe to run multiple times.
 *
 * Usage: npx tsx scripts/disable-footer-cta.ts
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.footerSettings.findUnique({
    where: { id: "footer-settings" },
    select: { ctaEnabled: true },
  });

  if (!existing) {
    console.log("⚠ Kein FooterSettings-Eintrag gefunden. Nichts geändert.");
    return;
  }

  if (existing.ctaEnabled === false) {
    console.log("✔ Footer CTA ist bereits deaktiviert. Keine Änderung nötig.");
    return;
  }

  await prisma.footerSettings.update({
    where: { id: "footer-settings" },
    data: { ctaEnabled: false },
  });

  console.log("✔ Footer CTA deaktiviert (ctaEnabled → false).");
}

main()
  .catch((e) => {
    console.error("Fehler:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
