/**
 * Backfill Page + PageSection helpers for the Mosaroma Professional page at /professional.
 *
 * Creates:
 *   1. Page "professional" (if not exists, status = PUBLISHED)
 *   2. professional-about          — introduction text + optional image
 *   3. professional-applications   — application area cards
 *   4. professional-oyten          — B2B support centre info + benefits
 *   5. professional-supply-chain   — supply chain nodes (Taiwan → Germany → International)
 *   6. professional-cta            — closing CTA block
 *
 * Idempotent: skips creation if a section with that style already exists.
 *
 * Usage:
 *   npx tsx scripts/backfill-professional-sections.ts          # dry-run
 *   npx tsx scripts/backfill-professional-sections.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  let page = await prisma.page.findUnique({ where: { slug: "professional" } });

  if (!page) {
    console.log("[page] Page 'professional' not found. Will create.");
    if (!dryRun) {
      page = await prisma.page.create({
        data: {
          slug: "professional",
          title: "Mosaroma Professional",
          eyebrow: "Mosaroma Industries GmbH",
          headline: "Mosaroma Professional",
          introText:
            "Technical Textiles. Local Support. Professional Solutions.",
          status: "PUBLISHED",
          type: "STANDARD",
          seoTitle: "Mosaroma Professional — Technical Textiles & B2B Solutions | Mosaroma",
          seoDescription:
            "Technical Textiles für Sonnenschutz, Outdoor-Möbel und architektonische Anwendungen. Lokaler B2B-Support in Oyten, Deutschland.",
        },
      });
      console.log(`  -> Created page (id: ${page.id}).\n`);
    } else {
      console.log("  -> Would create (dry run).\n");
      console.log("Cannot continue dry run without page ID. Exiting.\n");
      return;
    }
  } else {
    console.log(`[page] Page 'professional' already exists (id: ${page.id}).\n`);
  }

  const existing = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });

  function getSettings(section: (typeof existing)[number]): Record<string, unknown> {
    if (typeof section.settings === "object" && section.settings !== null) {
      return section.settings as Record<string, unknown>;
    }
    return {};
  }

  function findByStyle(style: string) {
    return existing.find((s) => getSettings(s).style === style);
  }

  let maxOrder = existing.reduce((max, s) => Math.max(max, s.order), 0);

  const sections = [
    {
      style: "professional-about",
      type: "CUSTOM",
      eyebrow: "Über uns",
      title: "About Mosaroma Professional",
      content: [
        "Mosaroma Professional steht für hochwertige technische und textile Lösungen für professionelle Outdoor-Anwendungen.",
        "Unser Produktportfolio basiert auf mehr als 30 Jahren Erfahrung in der Entwicklung von Outdoor-Textilien und verbindet bewährte Materialien, zuverlässige Lieferstrukturen und eine kontinuierliche Weiterentwicklung für anspruchsvolle Einsatzbereiche.",
        "Unsere Kollektionen umfassen Lösungen für Sonnenschutz, Beschattungssysteme, architektonische Textilien, Outdoor-Möbel sowie spezielle dekorative Außenanwendungen. Unterschiedliche Konstruktionen, Farben, Beschichtungen und Leistungsmerkmale ermöglichen eine flexible Anpassung an verschiedene Projektanforderungen.",
        "Design, Qualität und Funktionalität bilden dabei die Grundlage unserer Produktentwicklung. Gleichzeitig setzen wir auf langlebige Materialien, verlässliche Lieferketten und eine verantwortungsbewusste, nachhaltige Weiterentwicklung unserer Produkte.",
      ].join("\n\n"),
      settings: { style: "professional-about", helper: true },
    },
    {
      style: "professional-applications",
      type: "CUSTOM",
      eyebrow: null,
      title: "Anwendungsbereiche",
      content:
        "Von Sonnenschutz bis architektonische Textilien — unsere Lösungen für professionelle Outdoor-Projekte.",
      settings: {
        style: "professional-applications",
        helper: true,
        items: [
          {
            title: "Sonnenschutz & Beschattung",
            description:
              "Hochleistungstextilien für Markisen, Sonnensegel und Beschattungssysteme mit UV-Schutz und Wetterbeständigkeit.",
            iconKey: "sun",
          },
          {
            title: "Outdoor-Möbeltextilien",
            description:
              "Strapazierfähige, farbechte Stoffe für Gartenmöbel, Lounges und Hospitality-Einrichtungen im Außenbereich.",
            iconKey: "furniture",
          },
          {
            title: "Architektonische Textilien",
            description:
              "Textile Lösungen für Fassaden, Innenräume und baukonstruktive Anwendungen mit technischem Anspruch.",
            iconKey: "building",
          },
          {
            title: "Wetterfeste Dekor-Textilien",
            description:
              "Dekorative Outdoor-Materialien, die auch bei intensiver Witterung ihre Farbe und Form behalten.",
            iconKey: "palette",
          },
          {
            title: "Projektspezifische Entwicklungen",
            description:
              "Maßgeschneiderte textile Lösungen für individuelle Projektanforderungen — von der Materialauswahl bis zur Serie.",
            iconKey: "custom",
          },
        ],
      },
    },
    {
      style: "professional-oyten",
      type: "CUSTOM",
      eyebrow: "Oyten, Deutschland",
      title: "Technical & B2B Support Centre",
      content:
        "Mosaroma Professional ist nicht nur Fernsourcing aus Asien — wir bieten praktischen, lokalen Support in Deutschland. Unser Standort in Oyten ist die zentrale Anlaufstelle für B2B-Kunden in Europa: persönlich, direkt und praxisnah.",
      settings: {
        style: "professional-oyten",
        helper: true,
        benefits: [
          { text: "Persönliche Beratungstermine vor Ort" },
          { text: "Stoffkollektionen begutachten, Farben und Materialien vergleichen" },
          { text: "Technische Anforderungen besprechen und Lösungen entwickeln" },
          { text: "Bemusterung und Produktentwicklungsunterstützung" },
          { text: "Projektkoordination mit asiatischen Fertigungs- und Technikpartnern" },
        ],
      },
    },
    {
      style: "professional-supply-chain",
      type: "CUSTOM",
      eyebrow: null,
      title: "Von Taiwan nach Europa",
      content:
        "Unsere Wertschöpfungskette verbindet technische Kompetenz, lokale Nähe und internationale Fertigungskapazität.",
      settings: {
        style: "professional-supply-chain",
        helper: true,
        nodes: [
          {
            flag: "Taiwan",
            title: "axroma® Technical Textiles",
            description:
              "Technisches Textil-Know-how, Materialentwicklung und Fertigung hochleistungsfähiger Outdoor-Gewebe.",
          },
          {
            flag: "Deutschland",
            title: "Mosaroma Industries GmbH",
            description:
              "Lokaler B2B-Support, Beratung, Bemusterung, Qualitätssteuerung und Projektkoordination in Oyten.",
          },
          {
            flag: "International",
            title: "Produktion & Lieferung",
            description:
              "Internationale Produktions- und Lieferkapazitäten für europäische und globale Märkte.",
          },
        ],
      },
    },
    {
      style: "professional-cta",
      type: "CTA",
      eyebrow: null,
      title: "Kontakt & Standort",
      content:
        "Wir freuen uns auf Ihre Anfrage — ob Projektberatung, Bemusterung oder technische Fragen.",
      settings: { style: "professional-cta", helper: true },
      buttonLabel: "Kontakt aufnehmen",
      buttonHref: "/kontakt",
    },
  ];

  for (const sec of sections) {
    const ex = findByStyle(sec.style);
    if (ex) {
      console.log(`[${sec.style}] Already exists (id: ${ex.id}). Skipping.`);
      continue;
    }

    maxOrder += 1;
    console.log(`[${sec.style}] Will create:`);
    console.log(`  title = "${sec.title}"`);
    console.log(`  order = ${maxOrder}`);

    if (!dryRun) {
      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          type: sec.type as "CUSTOM" | "CTA",
          eyebrow: sec.eyebrow,
          title: sec.title,
          content: sec.content,
          buttonLabel: "buttonLabel" in sec ? sec.buttonLabel : null,
          buttonHref: "buttonHref" in sec ? sec.buttonHref : null,
          settings: sec.settings,
          order: maxOrder,
          isActive: true,
        },
      });
      console.log("  -> Created.");
    } else {
      console.log("  -> Would create (dry run).");
    }
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
