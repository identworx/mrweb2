/**
 * Backfill PageSection helpers for the three core content sections on /materialien:
 *   1. materials-technology  (Mackintosh® Technology)
 *   2. materials-olefin      (Warum Olefin? — updates existing section with text + tags)
 *   3. materials-oceancycle   (OceanCycle Kreislauf)
 *
 * Idempotent: skips creation if a section with that style already exists.
 * For materials-olefin, only updates title/content/tags if they are currently empty.
 *
 * Usage:
 *   npx tsx scripts/backfill-materials-core-sections.ts          # dry-run
 *   npx tsx scripts/backfill-materials-core-sections.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

async function main() {
  console.log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}\n`);

  const page = await prisma.page.findUnique({ where: { slug: "materialien" } });
  if (!page) {
    console.log("Page 'materialien' not found in DB. Nothing to do.\n");
    return;
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

  // --- 1. materials-technology ---
  const techStyle = "materials-technology";
  const techExisting = findByStyle(techStyle);

  if (techExisting) {
    console.log(`[technology] Section with style "${techStyle}" already exists (id: ${techExisting.id}). Skipping.\n`);
  } else {
    maxOrder += 1;
    const techSettings = {
      style: techStyle,
      helper: true,
      steps: [
        {
          title: "Granulat",
          label: "100 % PP",
          description: "Olefin-Granulat bildet die Rohstoffbasis. Das leichte, chemisch stabile Polymer ist die Grundlage für alle Mackintosh®-Stoffe.",
        },
        {
          title: "Additiv",
          label: "Additiv wasserabweisend",
          description: "Farbpigmente und UV-Stabilisatoren werden direkt in das geschmolzene Granulat eingemischt — noch bevor die Faser entsteht.",
        },
        {
          title: "Spinndüsenfärbung",
          label: "spin-dyed UV-Pigmente",
          description: "Die eingefärbte Schmelze wird durch Spinndüsen zu Fasern gezogen. Die Farbe sitzt im Faserkern — dauerhaft, lichtecht und bleichbeständig.",
        },
      ],
      benefits: [
        "Außergewöhnliche Lichtechtheit (7–8 auf der Skala)",
        "Höchste UV-Beständigkeit",
        "Wasseraufnahme unter 0,1 %",
        "Bleich- und schimmelfest",
        "PFAS-frei",
        "Niedrige CO₂-Bilanz durch wegfallende Nassveredlung",
      ],
    };

    const techContent = [
      "Mackintosh® Technology steht für spinndüsengefärbtes Olefin — ein Verfahren, bei dem die Farbe bereits bei der Faserherstellung in das Granulat eingebracht wird. Das Ergebnis: Fasern, die durchgefärbt sind und ihre Farbe nicht an der Oberfläche tragen, sondern im Kern.",
      "Dieses Verfahren macht nachträgliches Färben, Waschen und chemische Behandlung überflüssig. Der Wasser- und Energieverbrauch sinkt drastisch, die CO₂-Bilanz verbessert sich messbar — ohne Kompromisse bei Farbtreue und Haltbarkeit.",
    ].join("\n\n");

    console.log(`[technology] Will create PageSection:`);
    console.log(`  style = "${techStyle}"`);
    console.log(`  eyebrow = "Technologie"`);
    console.log(`  title = "Mackintosh® Technology"`);
    console.log(`  content = (2 paragraphs)`);
    console.log(`  steps = ${techSettings.steps.length} steps`);
    console.log(`  benefits = ${techSettings.benefits.length} items`);
    console.log(`  order = ${maxOrder}`);

    if (!dryRun) {
      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          type: "CUSTOM",
          eyebrow: "Technologie",
          title: "Mackintosh® Technology",
          content: techContent,
          settings: techSettings,
          order: maxOrder,
          isActive: true,
        },
      });
      console.log("  -> Created.\n");
    } else {
      console.log("  -> Would create (dry run).\n");
    }
  }

  // --- 2. materials-olefin (update existing) ---
  const olefinStyle = "materials-olefin";
  const olefinExisting = findByStyle(olefinStyle);

  if (!olefinExisting) {
    maxOrder += 1;
    const olefinContent = [
      "Polypropylen, seit vielen Jahren auch als Olefin bekannt, ist ein moderner Kunststoff, der durch die Polymerisation von Propylen entsteht. Zu seinen wichtigsten Eigenschaften zählen hohe Flexibilität, geringes Gewicht und eine sehr gute Hitzebeständigkeit.",
      "Olefin kann zu Fasern versponnen werden und wird sowohl in Industrie- als auch in Haushaltstextilien eingesetzt. Das Material teilt einige Eigenschaften mit Polyethylen, ist jedoch stärker, steifer und widerstandsfähiger. Bei höheren Temperaturen bleibt es formstabil und langlebig. Ein großer Teil der weltweiten Polypropylen-Produktion wird zu Fasern verarbeitet.",
      "Olefinfasern kommen in zahlreichen Produkten zum Einsatz, darunter Polstermöbel, Teppiche für den Innen- und Außenbereich, Seile, Taue, Fischfanggeräte sowie medizinische Anwendungen. Darüber hinaus werden Vliesstoffe aus Polypropylen zur Bodenstabilisierung und Bewehrung im Bauwesen und Straßenbau genutzt.",
      "Dank dieser Eigenschaften sind Olefinstoffe besonders für den Außenbereich geeignet. Die Mosaroma Kollektionen bestehen vollständig aus Polypropylen und sind daher dauerhaft für den Einsatz im Freien konzipiert.",
    ].join("\n\n");

    console.log(`[olefin] No existing section found. Will create new section:`);
    console.log(`  style = "${olefinStyle}"`);
    console.log(`  title = "Warum Olefin?"`);
    console.log(`  content = (4 paragraphs)`);
    console.log(`  tags = 4 items`);
    console.log(`  order = ${maxOrder}`);

    if (!dryRun) {
      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          type: "CUSTOM",
          title: "Warum Olefin?",
          content: olefinContent,
          settings: {
            style: olefinStyle,
            helper: true,
            tags: ["Flexibel", "Geringes Gewicht", "Hitzebeständig", "Formstabil"],
          },
          order: maxOrder,
          isActive: true,
        },
      });
      console.log("  -> Created.\n");
    } else {
      console.log("  -> Would create (dry run).\n");
    }
  } else {
    const olefinSettings = getSettings(olefinExisting);
    const needsTitle = !olefinExisting.title;
    const needsContent = !olefinExisting.content;
    const needsTags = !Array.isArray(olefinSettings.tags) || (olefinSettings.tags as string[]).length === 0;

    if (!needsTitle && !needsContent && !needsTags) {
      console.log(`[olefin] Section already has title, content, and tags. No update needed.\n`);
    } else {
      const updates: Record<string, unknown> = {};
      const settingsUpdate = { ...olefinSettings };

      if (needsTitle) {
        updates.title = "Warum Olefin?";
        console.log(`[olefin] Will set title = "Warum Olefin?"`);
      }
      if (needsContent) {
        updates.content = [
          "Polypropylen, seit vielen Jahren auch als Olefin bekannt, ist ein moderner Kunststoff, der durch die Polymerisation von Propylen entsteht. Zu seinen wichtigsten Eigenschaften zählen hohe Flexibilität, geringes Gewicht und eine sehr gute Hitzebeständigkeit.",
          "Olefin kann zu Fasern versponnen werden und wird sowohl in Industrie- als auch in Haushaltstextilien eingesetzt. Das Material teilt einige Eigenschaften mit Polyethylen, ist jedoch stärker, steifer und widerstandsfähiger. Bei höheren Temperaturen bleibt es formstabil und langlebig. Ein großer Teil der weltweiten Polypropylen-Produktion wird zu Fasern verarbeitet.",
          "Olefinfasern kommen in zahlreichen Produkten zum Einsatz, darunter Polstermöbel, Teppiche für den Innen- und Außenbereich, Seile, Taue, Fischfanggeräte sowie medizinische Anwendungen. Darüber hinaus werden Vliesstoffe aus Polypropylen zur Bodenstabilisierung und Bewehrung im Bauwesen und Straßenbau genutzt.",
          "Dank dieser Eigenschaften sind Olefinstoffe besonders für den Außenbereich geeignet. Die Mosaroma Kollektionen bestehen vollständig aus Polypropylen und sind daher dauerhaft für den Einsatz im Freien konzipiert.",
        ].join("\n\n");
        console.log(`[olefin] Will set content = (4 paragraphs)`);
      }
      if (needsTags) {
        settingsUpdate.tags = ["Flexibel", "Geringes Gewicht", "Hitzebeständig", "Formstabil"];
        updates.settings = settingsUpdate;
        console.log(`[olefin] Will set tags = 4 items`);
      }

      if (!dryRun) {
        await prisma.pageSection.update({
          where: { id: olefinExisting.id },
          data: updates,
        });
        console.log("  -> Updated.\n");
      } else {
        console.log("  -> Would update (dry run).\n");
      }
    }
  }

  // --- 3. materials-oceancycle ---
  const oceanStyle = "materials-oceancycle";
  const oceanExisting = findByStyle(oceanStyle);

  if (oceanExisting) {
    console.log(`[oceancycle] Section with style "${oceanStyle}" already exists (id: ${oceanExisting.id}). Skipping.\n`);
  } else {
    maxOrder += 1;
    const oceanSettings = {
      style: oceanStyle,
      helper: true,
      steps: [
        {
          title: "Sammlung",
          description: "Ozeangebundenes Plastik wird in Küstennähe und an Wasserwegen eingesammelt, bevor es die Meere erreicht.",
        },
        {
          title: "Sortierung",
          description: "Die gesammelten Materialien werden nach Polymertyp und Qualität getrennt und für die Weiterverarbeitung vorbereitet.",
        },
        {
          title: "Reinigung",
          description: "Gründliche Reinigung und Aufbereitung des Materials zur Entfernung von Verunreinigungen und Fremdstoffen.",
        },
        {
          title: "Recycling",
          description: "Verarbeitung zu hochwertigem recyceltem Polypropylen (rPP), das als Basis für NERIO-Garne dient.",
        },
      ],
      highlights: [
        "Min. 50 % OceanCycle recyceltem Polypropylen",
        "PFAS-frei — sicherer für Mensch und Planet",
        "Solution-Dyed für exzellente Farbechtheit",
        "Auf Langlebigkeit und lange Produktlebensdauer ausgelegt",
        "Reduziert ozeangebundene Plastikverschmutzung",
      ],
    };

    console.log(`[oceancycle] Will create PageSection:`);
    console.log(`  style = "${oceanStyle}"`);
    console.log(`  eyebrow = "Nachhaltigkeit"`);
    console.log(`  title = "OceanCycle Kreislauf"`);
    console.log(`  content = (1 paragraph)`);
    console.log(`  steps = ${oceanSettings.steps.length} steps`);
    console.log(`  highlights = ${oceanSettings.highlights.length} items`);
    console.log(`  order = ${maxOrder}`);

    if (!dryRun) {
      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          type: "CUSTOM",
          eyebrow: "Nachhaltigkeit",
          title: "OceanCycle Kreislauf",
          content: "Ozeangebundenes Plastik wird im Umkreis von 50 km der Küsten oder an größeren Wasserwegen gesammelt, die in die Ozeane münden. Durch ein zertifiziertes Verfahren wird es zu hochwertigem Material für unsere NERIO-Stoffe.",
          settings: oceanSettings,
          order: maxOrder,
          isActive: true,
        },
      });
      console.log("  -> Created.\n");
    } else {
      console.log("  -> Would create (dry run).\n");
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
