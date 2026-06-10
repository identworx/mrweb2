/**
 * Safe production backfill for homepage sections.
 *
 * This script ONLY touches the "home" page and its PageSections.
 * It does NOT modify any other data (products, collections, news,
 * downloads, contact form fields, users, etc.).
 *
 * Usage:
 *   npx tsx scripts/backfill-homepage-sections.ts
 *
 * Idempotent: safe to run multiple times. If homepage sections
 * already exist, it prints a message and exits without changes.
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

async function main() {
  let homePage = await prisma.page.findUnique({ where: { slug: "home" } });

  if (!homePage) {
    console.log("Page 'home' not found — creating...");
    homePage = await prisma.page.create({
      data: {
        slug: "home",
        title: "Startseite",
        status: "PUBLISHED",
        type: "HOME",
      },
    });
    console.log(`✔ Page 'home' created (id: ${homePage.id})`);
  } else {
    console.log(`✔ Page 'home' exists (id: ${homePage.id})`);
  }

  const existingCount = await prisma.pageSection.count({
    where: { pageId: homePage.id },
  });

  if (existingCount > 0) {
    console.log(
      `✔ Homepage already has ${existingCount} section(s) — nothing to do.`,
    );
    return;
  }

  console.log("Creating 7 homepage sections...");

  await prisma.pageSection.createMany({
    data: [
      {
        pageId: homePage.id,
        type: "HERO",
        eyebrow: "Hochwertige Outdoor-Textilien",
        title: "Design trifft\nPerformance.",
        content:
          "Mosaroma verbindet anspruchsvolles Design, langlebige Materialien und zuverlässige Outdoor-Performance für Garten, Terrasse, Hospitality und Fachhandel.",
        buttonLabel: "Kollektionen entdecken",
        buttonHref: "/kollektionen",
        order: 0,
        settings: {
          style: "home-hero",
          subheadline:
            "Hochwertige Outdoor-Textilien für Räume und Momente, die bleiben.",
          secondaryLabel: "Katalog ansehen",
          secondaryHref: "/kataloge",
        },
      },
      {
        pageId: homePage.id,
        type: "CUSTOM",
        eyebrow: "Warum Mosaroma",
        title: "Was uns ausmacht.",
        buttonLabel: "Mehr über Mosaroma",
        buttonHref: "/ueber-uns",
        order: 1,
        settings: {
          style: "value-props",
          cards: [
            {
              iconKey: "comfort",
              title: "Komfort",
              text: "Formstabile Polsterung und ergonomische Passformen für entspannte Stunden im Freien.",
            },
            {
              iconKey: "quality",
              title: "Qualität",
              text: "Spinndüsengefärbte Fasern, UV-beständig und farbecht — für Jahre, nicht Saisons.",
            },
            {
              iconKey: "sustainability",
              title: "Verantwortung",
              text: "Ressourcenschonende Fertigung mit 42 % weniger Wasser und 71 % Solarstrom.",
            },
            {
              iconKey: "design",
              title: "Design",
              text: "Sieben kuratierte Farbwelten und zeitlose Formen, die jedes Outdoor-Konzept veredeln.",
            },
          ],
        },
      },
      {
        pageId: homePage.id,
        type: "IMAGE_TEXT",
        eyebrow: "Material & Technologie",
        title: "Mackintosh® Technology.",
        content:
          "Unsere Mackintosh®-Stoffe basieren auf spinndüsengefärbtem Olefin — die Farbe wird bereits bei der Faserherstellung eingebracht. Das Ergebnis: außergewöhnliche Lichtechtheit, UV-Beständigkeit und eine niedrige CO₂-Bilanz.",
        buttonLabel: "Materialien entdecken",
        buttonHref: "/materialien",
        order: 2,
        settings: {
          style: "image-text-feature",
          bullets: [
            "Solution-Dyed Olefin — Farbe in der Faser",
            "Wasserabweisend & schnelltrocknend",
            "100 % outdoor-tauglich",
            "Langlebig & pflegeleicht",
            "Nachhaltig in der Herstellung",
          ],
        },
      },
      {
        pageId: homePage.id,
        type: "COLLECTION_GRID",
        eyebrow: "Farbwelten",
        title: "Kollektionen.",
        content:
          "Sieben kuratierte Farbwelten für die Saison 2027 — von frischem Grün bis zur nachhaltigen NERIO Oceana Linie.",
        buttonLabel: "Alle Kollektionen ansehen",
        buttonHref: "/kollektionen",
        order: 3,
        settings: { style: "collection-showcase" },
      },
      {
        pageId: homePage.id,
        type: "CUSTOM",
        eyebrow: "Nachhaltigkeit",
        title: "Grün gewebt. Vom Tropfen an.",
        content:
          "Spinndüsengefärbtes Polypropylen spart im Vergleich zu konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂.",
        buttonLabel: "Mehr zur Verantwortung",
        buttonHref: "/ueber-uns",
        order: 4,
        settings: {
          style: "sustainability-stats",
          stats: [
            {
              value: "42 %",
              label: "weniger Wasser",
              detail:
                "im Färbeprozess gegenüber konventionellen Verfahren",
            },
            {
              value: "38 %",
              label: "weniger Chemie",
              detail:
                "durch spinndüsengefärbte Fasern ohne Nachbehandlung",
            },
            {
              value: "71 %",
              label: "Solarstrom",
              detail:
                "unserer Fertigung läuft mit Photovoltaik-Energie",
            },
          ],
        },
      },
      {
        pageId: homePage.id,
        type: "DOWNLOAD_GRID",
        eyebrow: "Downloads",
        title: "Kataloge & Dokumente.",
        content:
          "Alle wichtigen Unterlagen zum Download — Produktkatalog, Maße und Pflegehinweise.",
        buttonLabel: "Alle Downloads ansehen",
        buttonHref: "/kataloge",
        order: 5,
        settings: { style: "downloads-teaser" },
      },
      {
        pageId: homePage.id,
        type: "CUSTOM",
        eyebrow: "Neuigkeiten",
        title: "Aktuelles.",
        content:
          "Neues aus der Welt von Mosaroma — Kollektionen, Materialien und mehr.",
        order: 6,
        settings: { style: "news-teaser" },
      },
    ],
  });

  console.log("✔ 7 homepage sections created successfully.");
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
