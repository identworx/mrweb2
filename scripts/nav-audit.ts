import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const SYSTEM_ROUTES = ["/", "/kollektionen", "/produktkategorien", "/materialien", "/kataloge", "/kataloge/produktmasse", "/kataloge/pflege-garantie", "/kataloge/stoff-technische-daten", "/neuigkeiten", "/kontakt", "/ueber-uns"];
const PAGE_SLUG_TO_PATH: Record<string, string> = { home: "/", kollektionen: "/kollektionen", materialien: "/materialien", "ueber-uns": "/ueber-uns", kataloge: "/kataloge", produktmasse: "/kataloge/produktmasse", "pflege-garantie": "/kataloge/pflege-garantie", "stoff-technische-daten": "/kataloge/stoff-technische-daten", neuigkeiten: "/neuigkeiten", kontakt: "/kontakt" };
const PATH_TO_SLUG: Record<string, string> = {};
for (const [slug, path] of Object.entries(PAGE_SLUG_TO_PATH)) {
  PATH_TO_SLUG[path] = slug;
}

type PageRow = { id: string; slug: string; status: string; title: string };

function findMatchingPage(href: string, pages: PageRow[]): PageRow | null {
  const mappedSlug = PATH_TO_SLUG[href];
  if (mappedSlug) {
    const p = pages.find((pg) => pg.slug === mappedSlug);
    if (p) return p;
  }
  const directSlug = href.startsWith("/") ? href.substring(1) : null;
  if (directSlug) {
    const p = pages.find((pg) => pg.slug === directSlug);
    if (p) return p;
  }
  return null;
}

const mode = process.argv[2] || "audit";

async function audit() {
  const menus = await prisma.navigationMenu.findMany({
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { linkedPage: { select: { id: true, slug: true, status: true, title: true } } },
      },
    },
    orderBy: { location: "asc" },
  });
  const pages = await prisma.page.findMany({ select: { id: true, slug: true, status: true, title: true } });

  console.log("=== ALL CMS PAGES ===");
  for (const p of pages) {
    const publicPath = PAGE_SLUG_TO_PATH[p.slug] || `/${p.slug}`;
    console.log(`  ${p.slug.padEnd(30)} | ${String(p.status).padEnd(10)} | ${publicPath.padEnd(40)} | ${p.title}`);
  }
  console.log(`\nTotal pages: ${pages.length}\n`);

  let totalItems = 0;
  let problemCount = 0;

  for (const menu of menus) {
    console.log(`=== ${menu.name} (${menu.location}) — ${menu.items.length} items ===`);
    for (const item of menu.items) {
      totalItems++;
      const href = item.href || "";
      const isSystemRoute = SYSTEM_ROUTES.includes(href);
      const anyMatchPage = findMatchingPage(href, pages);

      let recommendation = "OK";
      let problem = false;

      if (item.linkType === "CUSTOM_URL") {
        if (anyMatchPage) {
          recommendation = `UPGRADE→PAGE (${anyMatchPage.slug}/${anyMatchPage.status})`;
        } else if (isSystemRoute) {
          recommendation = `UPGRADE→SYSTEM_ROUTE`;
        } else if (href.startsWith("/") && !href.startsWith("http")) {
          problem = true;
          problemCount++;
          recommendation = `PROBLEM: no page, no system route for "${href}"`;
        }
      } else if (item.linkType === "SYSTEM_ROUTE") {
        if (anyMatchPage) recommendation = `COULD→PAGE (${anyMatchPage.slug}/${anyMatchPage.status})`;
        else recommendation = "OK (system route)";
      } else if (item.linkType === "PAGE") {
        if (!item.linkedPageId) {
          problem = true;
          problemCount++;
          recommendation = "PROBLEM: PAGE but no linkedPageId";
        } else if (!item.linkedPage) {
          problem = true;
          problemCount++;
          recommendation = "PROBLEM: linkedPageId but page missing";
        } else {
          recommendation = `OK (page: ${item.linkedPage.slug}/${item.linkedPage.status})`;
        }
      } else if (item.linkType === "PAGE_SLUG") {
        recommendation = `PLANNED (slug: ${href})`;
      }

      console.log(`  #${item.order} | "${item.label}" | type=${item.linkType} | href=${href || "null"} | lpId=${item.linkedPageId?.substring(0, 8) || "null"} | lp=${item.linkedPage?.slug || "null"} | active=${item.isActive} | problem=${problem} | ${recommendation}`);
    }
    console.log("");
  }

  console.log(`=== SUMMARY ===`);
  console.log(`Total menus: ${menus.length}`);
  console.log(`Total items: ${totalItems}`);
  console.log(`Problems: ${problemCount}`);
  const allItems = menus.flatMap((m) => m.items);
  const byType: Record<string, number> = {};
  for (const r of allItems) byType[r.linkType] = (byType[r.linkType] || 0) + 1;
  console.log(`By linkType:`, JSON.stringify(byType));
}

async function backfill() {
  const pages = await prisma.page.findMany({ select: { id: true, slug: true, status: true, title: true } });
  const menus = await prisma.navigationMenu.findMany({
    include: { items: { orderBy: { order: "asc" } } },
    orderBy: { location: "asc" },
  });

  let upgraded = 0;
  let legalCreated = 0;

  for (const menu of menus) {
    console.log(`\n--- ${menu.name} (${menu.location}) ---`);
    for (const item of menu.items) {
      if (item.linkedPageId) {
        console.log(`  SKIP "${item.label}" — already has linkedPageId`);
        continue;
      }
      if (item.linkType !== "CUSTOM_URL") {
        console.log(`  SKIP "${item.label}" — linkType already ${item.linkType}`);
        continue;
      }

      const href = item.href || "";
      const matchPage = findMatchingPage(href, pages);

      if (matchPage) {
        await prisma.navigationItem.update({
          where: { id: item.id },
          data: { linkType: "PAGE", linkedPageId: matchPage.id },
        });
        console.log(`  UPGRADE "${item.label}" → PAGE (${matchPage.slug}/${matchPage.status})`);
        upgraded++;
        continue;
      }

      if (SYSTEM_ROUTES.includes(href)) {
        await prisma.navigationItem.update({
          where: { id: item.id },
          data: { linkType: "SYSTEM_ROUTE" },
        });
        console.log(`  UPGRADE "${item.label}" → SYSTEM_ROUTE (${href})`);
        upgraded++;
        continue;
      }

      if (menu.location === "LEGAL" && href.startsWith("/")) {
        const slug = href.substring(1);
        let page = pages.find((p) => p.slug === slug);
        if (!page) {
          const titleMap: Record<string, string> = {
            impressum: "Impressum",
            datenschutz: "Datenschutzerklärung",
            agb: "Allgemeine Geschäftsbedingungen",
          };
          const title = titleMap[slug] || slug;
          const created = await prisma.page.create({
            data: { slug, title, status: "DRAFT", type: "STANDARD" },
            select: { id: true, slug: true, status: true, title: true },
          });
          page = created;
          pages.push(created);
          console.log(`  CREATE DRAFT page "${title}" (/${slug})`);
          legalCreated++;
        }
        await prisma.navigationItem.update({
          where: { id: item.id },
          data: { linkType: "PAGE", linkedPageId: page.id },
        });
        console.log(`  UPGRADE "${item.label}" → PAGE (${page.slug}/${page.status})`);
        upgraded++;
        continue;
      }

      console.log(`  KEEP "${item.label}" as CUSTOM_URL (${href})`);
    }
  }

  console.log(`\n=== BACKFILL SUMMARY ===`);
  console.log(`Upgraded: ${upgraded}`);
  console.log(`Legal DRAFT pages created: ${legalCreated}`);
}

async function main() {
  if (mode === "backfill") {
    console.log("=== BACKFILL MODE ===\n");
    await backfill();
    console.log("\n=== POST-BACKFILL AUDIT ===\n");
    await audit();
  } else {
    await audit();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
