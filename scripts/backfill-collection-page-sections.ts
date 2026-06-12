/**
 * Safe production backfill for kollektionen page sections.
 *
 * This script ONLY touches the "kollektionen" page and its PageSections.
 * It does NOT modify any other data (products, collections, news,
 * downloads, contact form fields, users, etc.).
 *
 * Creates 3 sections if missing:
 *   - collection-consultation-card (Beratungskarte im Grid)
 *   - collection-benefits (Performance-Vorteile)
 *   - collection-cta (Musterset-CTA)
 *
 * Usage:
 *   npx tsx scripts/backfill-collection-page-sections.ts
 *
 * Idempotent: safe to run multiple times. Existing sections are
 * never overwritten; only missing ones are created.
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const SECTIONS = [
  {
    type: "CUSTOM",
    title: "Welche Farbwelt passt zu Ihnen?",
    content:
      "Wir beraten Sie persönlich und senden passende Muster für Ihr Projekt.",
    buttonLabel: "Muster & Beratung",
    buttonHref: "/kontakt",
    order: 100,
    settings: {
      style: "collection-consultation-card",
      secondaryLabel: "Kontakt aufnehmen",
      secondaryHref: "/kontakt",
    },
  },
  {
    type: "CUSTOM",
    title: "Eine Performance. Sieben Farbwelten.",
    content:
      "Unabhängig von der Farbe: Jede Mosaroma-Kollektion wird aus wetterfesten Outdoor-Stoffen gefertigt.",
    order: 101,
    settings: {
      style: "collection-benefits",
      items: [
        {
          iconKey: "sun",
          title: "UV-beständig",
          text: "Spinndüsengefärbte Fasern für höchste Lichtechtheit, auch bei dauerhafter Sonneneinstrahlung.",
        },
        {
          iconKey: "droplet",
          title: "Wasserabweisend",
          text: "Stoffe, die Regen und Feuchtigkeit abperlen lassen und schnell trocknen.",
        },
        {
          iconKey: "shield",
          title: "Schimmelfest",
          text: "Resistente Materialien, die auch in feuchten Umgebungen sauber bleiben.",
        },
        {
          iconKey: "star",
          title: "3 Jahre Garantie",
          text: "Qualitätsversprechen auf alle Mosaroma-Produkte gemäß Garantiebedingungen.",
        },
      ],
    },
  },
  {
    type: "CTA",
    eyebrow: "Noch unentschlossen?",
    title: "Lassen Sie sich ein Musterset schicken.",
    content:
      "Vergleichen Sie die Farbwelten in Ruhe zu Hause. Wir senden Ihnen Stoffmuster Ihrer Favoriten und beraten zu Formen und Sondermaßen.",
    buttonLabel: "Musterset anfordern",
    buttonHref: "/kontakt",
    order: 102,
    settings: {
      style: "collection-cta",
      secondaryLabel: "Kataloge ansehen",
      secondaryHref: "/kataloge",
    },
  },
] as const;

async function main() {
  let page = await prisma.page.findUnique({ where: { slug: "kollektionen" } });

  if (!page) {
    console.log("Page 'kollektionen' not found — creating...");
    page = await prisma.page.create({
      data: {
        slug: "kollektionen",
        title: "Kollektionen",
        status: "PUBLISHED",
        type: "COLLECTION_INDEX",
        eyebrow: "Saison 2027 · Outdoor Living",
        headline: "Sieben Farbwelten.",
        introText:
          "Sieben kuratierte Farbwelten für den Außenbereich — jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung.",
        seoTitle: "Kollektionen 2027 | Mosaroma",
        seoDescription:
          "Entdecken Sie die 7 Kollektionen von MOSAROMA — kuratierte Farbwelten für den Außenbereich.",
      },
    });
    console.log(`✔ Page 'kollektionen' created (id: ${page.id})`);
  } else {
    console.log(`✔ Page 'kollektionen' exists (id: ${page.id})`);
  }

  const existingSections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    select: { settings: true },
  });

  const existingStyles = new Set(
    existingSections.map(
      (s) => (s.settings as Record<string, unknown>)?.style as string,
    ),
  );

  let created = 0;

  for (const section of SECTIONS) {
    const style = section.settings.style;
    if (existingStyles.has(style)) {
      console.log(`✔ Section '${style}' already exists — skipping.`);
      continue;
    }

    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        ...section,
      },
    });
    console.log(`✔ Section '${style}' created.`);
    created++;
  }

  if (created === 0) {
    console.log("\nAll 3 sections already exist — nothing to do.");
  } else {
    console.log(`\n✔ ${created} section(s) created successfully.`);
  }
}

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
