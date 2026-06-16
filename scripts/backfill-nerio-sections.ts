/**
 * Backfill Page + PageSection helpers for the NERIO sustainability landing page at /nerio.
 *
 * Creates:
 *   1. Page "nerio" (if not exists, status = PUBLISHED)
 *   2. nerio-story          — intro text + optional image
 *   3. nerio-oceancycle      — OceanCycle process steps + highlights
 *   4. nerio-promise         — sustainability promise cards
 *   5. nerio-highlights      — key stats / metrics
 *   6. nerio-technical-facts — technical data table
 *   7. nerio-products-preview — fabric swatch preview config
 *   8. nerio-final-cta       — closing CTA block
 *
 * Idempotent: skips creation if a section with that style already exists.
 *
 * Usage:
 *   npx tsx scripts/backfill-nerio-sections.ts          # dry-run
 *   npx tsx scripts/backfill-nerio-sections.ts --apply   # write to DB
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

  let page = await prisma.page.findUnique({ where: { slug: "nerio" } });

  if (!page) {
    console.log("[page] Page 'nerio' not found. Will create.");
    if (!dryRun) {
      page = await prisma.page.create({
        data: {
          slug: "nerio",
          title: "NERIO Nachhaltigkeit",
          eyebrow: "Nachhaltigkeit · OceanCycle®",
          headline: "NERIO — Aus dem Ozean geboren.",
          introText:
            "Performance-Stoffe aus recyceltem Ozean-Polypropylen. OceanCycle® zertifiziert, PFAS-frei und spinndüsengefärbt.",
          status: "PUBLISHED",
          type: "STANDARD",
          seoTitle: "NERIO — Nachhaltige Outdoor-Stoffe | Mosaroma",
          seoDescription:
            "NERIO: Performance-Stoffe aus 50 % recyceltem Ozean-Polypropylen. OceanCycle® zertifiziert, PFAS-frei und spinndüsengefärbt für höchste Farbechtheit.",
        },
      });
      console.log(`  -> Created page (id: ${page.id}).\n`);
    } else {
      console.log("  -> Would create (dry run).\n");
      console.log("Cannot continue dry run without page ID. Exiting.\n");
      return;
    }
  } else {
    console.log(`[page] Page 'nerio' already exists (id: ${page.id}).\n`);
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
      style: "nerio-story",
      type: "CUSTOM",
      eyebrow: "Die Geschichte",
      title: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
      content: [
        "NERIO verbindet hochwertige Outdoor-Performance mit echter Nachhaltigkeit. Jeder Stoff der NERIO-Linie enthält mindestens 50 % recyceltes Polypropylen, gewonnen aus ozeangebundenem Plastik.",
        "Die Faser wird spinndüsengefärbt — Farbe und UV-Schutz sind im Kern verankert. Kein nachträgliches Färben, kein Wasserverbrauch, keine chemischen Bäder. Das Ergebnis: langlebige Stoffe mit exzellenter Farbechtheit und messbarer CO₂-Einsparung.",
      ].join("\n\n"),
      settings: { style: "nerio-story", helper: true },
    },
    {
      style: "nerio-oceancycle",
      type: "CUSTOM",
      eyebrow: "OceanCycle®",
      title: "OceanCycle Kreislauf",
      content:
        "Ozeangebundenes Plastik wird im Umkreis von 50 km der Küsten oder an größeren Wasserwegen gesammelt, die in die Ozeane münden. Durch ein zertifiziertes Verfahren wird es zu hochwertigem Material für unsere NERIO-Stoffe.",
      settings: {
        style: "nerio-oceancycle",
        helper: true,
        steps: [
          { title: "Sammlung", description: "Ozeangebundenes Plastik wird in Küstennähe und an Wasserwegen eingesammelt, bevor es die Meere erreicht." },
          { title: "Sortierung", description: "Die gesammelten Materialien werden nach Polymertyp und Qualität getrennt und für die Weiterverarbeitung vorbereitet." },
          { title: "Reinigung", description: "Gründliche Reinigung und Aufbereitung des Materials zur Entfernung von Verunreinigungen und Fremdstoffen." },
          { title: "Recycling", description: "Verarbeitung zu hochwertigem recyceltem Polypropylen (rPP), das als Basis für NERIO-Garne dient." },
        ],
        highlights: [
          "Min. 50 % OceanCycle recyceltem Polypropylen",
          "PFAS-frei — sicherer für Mensch und Planet",
          "Solution-Dyed für exzellente Farbechtheit",
          "Auf Langlebigkeit und lange Produktlebensdauer ausgelegt",
          "Reduziert ozeangebundene Plastikverschmutzung",
        ],
      },
    },
    {
      style: "nerio-promise",
      type: "CUSTOM",
      eyebrow: "Unser Versprechen",
      title: "Nachhaltigkeit ohne Kompromisse",
      content: null,
      settings: {
        style: "nerio-promise",
        helper: true,
        items: [
          { iconKey: "recycle", title: "50 % recycelt", text: "Mindestens die Hälfte des Materials stammt aus OceanCycle® zertifiziertem, recyceltem Ozean-Polypropylen." },
          { iconKey: "droplet", title: "PFAS-frei", text: "Komplett frei von Per- und Polyfluoralkylsubstanzen — sicherer für Mensch, Tier und Umwelt." },
          { iconKey: "sun", title: "Solution-Dyed", text: "Spinndüsengefärbt für exzellente Farbechtheit bei drastisch reduziertem Wasser- und Energieverbrauch." },
          { iconKey: "shield", title: "Langlebig", text: "Auf lange Produktlebensdauer ausgelegt — weniger Abfall, mehr Nutzungsjahre." },
        ],
      },
    },
    {
      style: "nerio-highlights",
      type: "CUSTOM",
      eyebrow: "Auf einen Blick",
      title: "NERIO Highlights",
      content: null,
      settings: {
        style: "nerio-highlights",
        helper: true,
        stats: [
          { value: "50 %", label: "recyceltes Ozean-PP", detail: "OceanCycle® zertifiziert" },
          { value: "0", label: "PFAS", detail: "Komplett fluorfreie Produktion" },
          { value: "7–8", label: "Lichtechtheit", detail: "Höchste Stufe der Bewertungsskala" },
          { value: "< 0,1 %", label: "Wasseraufnahme", detail: "Praktisch wasserabweisend" },
        ],
      },
    },
    {
      style: "nerio-technical-facts",
      type: "CUSTOM",
      eyebrow: "Technische Daten",
      title: "NERIO im Detail",
      content: null,
      settings: {
        style: "nerio-technical-facts",
        helper: true,
        facts: [
          { label: "Material", value: "100 % Olefin (50 % recycelt)" },
          { label: "Gewicht", value: "ca. 200–230 g/m²" },
          { label: "Färbung", value: "spinndüsengefärbt" },
          { label: "Zertifizierung", value: "OceanCycle®" },
          { label: "Lichtechtheit", value: "7–8 (BS EN ISO 105-B02)" },
          { label: "UV-Beständigkeit", value: "5/5" },
          { label: "PFAS", value: "Nicht nachgewiesen" },
          { label: "Schimmelbeständigkeit", value: "Bestanden (AATCC 147)" },
        ],
      },
    },
    {
      style: "nerio-products-preview",
      type: "CUSTOM",
      eyebrow: "Stoffbibliothek",
      title: "NERIO Stoffe entdecken",
      content: null,
      settings: { style: "nerio-products-preview", helper: true },
    },
    {
      style: "nerio-final-cta",
      type: "CTA",
      eyebrow: null,
      title: "NERIO erleben",
      content:
        "Entdecken Sie die vollständige NERIO-Kollektion und fordern Sie Ihr persönliches Musterset an.",
      settings: { style: "nerio-final-cta", helper: true },
      buttonLabel: "Musterset anfragen",
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
