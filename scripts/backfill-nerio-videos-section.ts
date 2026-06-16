/**
 * Backfill a "nerio-videos" helper section for the NERIO sustainability page.
 *
 * Creates:
 *   1. nerio-videos — process/recycling video showcase
 *
 * Idempotent: skips creation if a section with that style already exists.
 * Never deletes or overwrites existing sections.
 *
 * Usage:
 *   npx tsx scripts/backfill-nerio-videos-section.ts          # dry-run
 *   npx tsx scripts/backfill-nerio-videos-section.ts --apply   # write to DB
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

  const page = await prisma.page.findUnique({ where: { slug: "nerio" } });

  if (!page) {
    console.log("[page] Page 'nerio' not found. Cannot create section without a page. Exiting.\n");
    return;
  }

  console.log(`[page] Page 'nerio' found (id: ${page.id}).\n`);

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

  // Check if nerio-videos already exists
  const ex = findByStyle("nerio-videos");
  if (ex) {
    console.log(`[nerio-videos] SKIP — already exists (id: ${ex.id}).`);
    console.log("\nDone.");
    return;
  }

  // Determine the right order: after nerio-highlights, before nerio-technical-facts
  const highlights = findByStyle("nerio-highlights");
  let order: number;

  if (highlights) {
    order = highlights.order + 1;
    console.log(`[order] Placing after nerio-highlights (order ${highlights.order}) → order ${order}.`);
  } else {
    const maxOrder = existing.reduce((max, s) => Math.max(max, s.order), 0);
    order = maxOrder + 1;
    console.log(`[order] nerio-highlights not found. Placing after last existing section → order ${order}.`);
  }

  console.log(`[nerio-videos] CREATE:`);
  console.log(`  title = "Wie aus Verantwortung neues Material entsteht"`);
  console.log(`  order = ${order}`);

  if (!dryRun) {
    await prisma.pageSection.create({
      data: {
        pageId: page.id,
        type: "CUSTOM",
        eyebrow: "Prozesse & Kreisläufe",
        title: "Wie aus Verantwortung neues Material entsteht",
        content:
          "Die NERIO Materialstory wird greifbarer, wenn man die einzelnen Schritte sieht: vom gesammelten Rohstoff über Aufbereitung und Recycling bis hin zu neuen Anwendungen im Textilbereich.",
        settings: {
          style: "nerio-videos",
          helper: true,
          videos: [
            {
              enabled: true,
              order: 1,
              youtubeUrl: "https://www.youtube.com/watch?v=DzLeef6Mxak",
              title: "Vom Fischernetz zum neuen Rohstoff",
              description:
                "Der Film zeigt, wie recycelte Fischernetze zu Kunststoffgranulat verarbeitet werden. Dieser Schritt macht aus gesammeltem Material wieder einen nutzbaren Rohstoff für neue Anwendungen.",
              startSeconds: null,
              thumbnailMediaId: null,
              label: "Prozessvideo",
            },
            {
              enabled: true,
              order: 2,
              youtubeUrl: "https://www.youtube.com/watch?v=OwGfs0qwIlE&t=26s",
              title: "Textilkreisläufe neu gedacht",
              description:
                "Ein Einblick in neue Recyclingprozesse, bei denen textile Materialien effizienter wiederverwertet und für neue Produktkreisläufe vorbereitet werden.",
              startSeconds: 26,
              thumbnailMediaId: null,
              label: "Recycling",
            },
            {
              enabled: true,
              order: 3,
              youtubeUrl: "https://www.youtube.com/watch?v=xP6PFrg9IHY",
              title: "Ein Material. Ein klarerer Kreislauf.",
              description:
                "Das Video zeigt den Ansatz eines sortenreinen Polypropylen-Systems. Der Fokus liegt auf einfacherer Wiederverwertung, reduzierter Materialkomplexität und zukunftsfähigen Kreisläufen.",
              startSeconds: null,
              thumbnailMediaId: null,
              label: "Materialkreislauf",
            },
          ],
        },
        order,
        isActive: true,
      },
    });
    console.log("  -> Created.");
  } else {
    console.log("  -> Would create (dry run).");
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
