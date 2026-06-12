/**
 * Idempotent backfill for premium footer settings.
 * Sets new fields only if they are null/empty. Never overwrites admin changes.
 * Safe for production — run: npx tsx scripts/backfill-premium-footer-settings.ts
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
  });

  if (!existing) {
    await prisma.footerSettings.create({
      data: {
        id: "footer-settings",
        ctaEnabled: false,
        ctaEyebrow: "Beratung & Muster",
        ctaTitle: "Unsicher bei Farbe, Material oder Format?",
        ctaText: "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Formen und Sondermaßen beraten.",
        ctaPrimaryLabel: "Muster anfordern",
        ctaPrimaryHref: "/kontakt",
        ctaSecondaryLabel: "Kataloge ansehen",
        ctaSecondaryHref: "/kataloge",
        contactTitle: "Kontakt",
        companyName: "Mosaroma Industries GmbH",
        addressLine1: "Rudolf-Diesel-Str. 11–13",
        postalCity: "28876 Oyten",
        country: "Deutschland",
        email: "info@mosaroma.de",
        contactButtonLabel: "Kontakt aufnehmen",
        contactButtonHref: "/kontakt",
      },
    });
    console.log("✔ Footer-Settings erstellt mit Premium-Defaults.");
    return;
  }

  const updates: Record<string, string | boolean> = {};

  function setIfEmpty(field: string, value: string | boolean) {
    const current = (existing as Record<string, unknown>)[field];
    if (current === null || current === undefined || current === "") {
      updates[field] = value;
    }
  }

  setIfEmpty("ctaEyebrow", "Beratung & Muster");
  setIfEmpty("ctaTitle", "Unsicher bei Farbe, Material oder Format?");
  setIfEmpty("ctaText", "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Formen und Sondermaßen beraten.");
  setIfEmpty("ctaPrimaryLabel", "Muster anfordern");
  setIfEmpty("ctaPrimaryHref", "/kontakt");
  setIfEmpty("ctaSecondaryLabel", "Kataloge ansehen");
  setIfEmpty("ctaSecondaryHref", "/kataloge");
  setIfEmpty("contactTitle", "Kontakt");
  setIfEmpty("companyName", "Mosaroma Industries GmbH");
  setIfEmpty("addressLine1", "Rudolf-Diesel-Str. 11–13");
  setIfEmpty("postalCity", "28876 Oyten");
  setIfEmpty("country", "Deutschland");
  setIfEmpty("email", "info@mosaroma.de");
  setIfEmpty("contactButtonLabel", "Kontakt aufnehmen");
  setIfEmpty("contactButtonHref", "/kontakt");

  if (Object.keys(updates).length === 0) {
    console.log("✔ Keine Änderungen nötig — alle Premium-Felder bereits befüllt.");
    return;
  }

  await prisma.footerSettings.update({
    where: { id: "footer-settings" },
    data: updates,
  });

  console.log(`✔ ${Object.keys(updates).length} Felder befüllt:`, Object.keys(updates).join(", "));
}

main()
  .catch((e) => {
    console.error("Fehler:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
