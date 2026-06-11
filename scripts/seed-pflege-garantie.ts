/**
 * Seed script: Update pflege-garantie page sections to use new catalog-based layout.
 *
 * Usage: npx tsx scripts/seed-pflege-garantie.ts
 *
 * This replaces old care-list sections with the new section styles:
 * intro-columns, numbered-steps, care-symbols, guarantee-hero, cta
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: "pflege-garantie" },
    include: { sections: true },
  });

  if (!page) {
    console.log("Page 'pflege-garantie' not found. Skipping.");
    return;
  }

  console.log(`Found page: ${page.title} (${page.sections.length} sections)`);

  // Delete old sections
  await prisma.pageSection.deleteMany({
    where: { pageId: page.id },
  });
  console.log("Deleted old sections.");

  // Create new sections
  const sections = [
    {
      pageId: page.id,
      type: "CUSTOM" as const,
      title: "Einmal kaufen.",
      content:
        "<p>MACKINTOSH® Solution-Dyed Olefin ist für den dauerhaften Einsatz im Außenbereich gemacht. Mit unseren Stoffen werden die Kissen auch feuchtigkeitsresistent. Entfernen Sie Verschmutzungen am besten sofort und reinigen Sie die Bezüge mit Wasser und einem Schwamm. Wer seine Kissen und Auflagen von Zeit zu Zeit so pflegt, verlängert ihre Lebensdauer und lässt sie wie neu aussehen.</p>",
      settings: JSON.stringify({
        style: "intro-columns",
        subtitle: "Lange behalten.",
        columns: [
          {
            title: "Lagerung",
            text: "Den feuchten Bezug liegend oder hängend an der Luft trocknen — nicht in den Trockner, nicht in der prallen Sonne. Bezug feucht zurück über die Füllung ziehen, das vermeidet Knitter.",
          },
          {
            title: "Versiegelung",
            text: "Die Stoffe sind wasser- und schmutzabweisend — ganz ohne zusätzliche Versiegelung. Sollte einmal eine besondere Behandlung nötig sein, kontaktieren Sie uns gern.",
          },
        ],
      }),
      order: 1,
      isActive: true,
    },
    {
      pageId: page.id,
      type: "CUSTOM" as const,
      title: "In drei Schritten sauber.",
      eyebrow: "Waschanleitung",
      settings: JSON.stringify({
        style: "numbered-steps",
        steps: [
          {
            step: "01",
            title: "Waschen",
            text: "Nehmen Sie die Füllung aus dem Bezug heraus. Waschen Sie den Bezug mit der Hand oder in der Maschine. Wählen Sie das **Feinwäscheprogramm bei max. 30 °C** und benutzen Sie Feinwaschmittel.",
          },
          {
            step: "02",
            title: "Flecken behandeln",
            text: "Hartnäckige Flecken mit einer Lösung aus **15 ml Feinwaschmittel + 50 ml Haushaltsbleichmittel** in 1 Liter Warmwasser (max. 30 °C) entfernen. Fleck leicht abtupfen oder mit weicher Bürste lösen, dann wie in Schritt 1 waschen.",
          },
          {
            step: "03",
            title: "Trocknen",
            text: "Den feuchten Bezug **liegend oder hängend an der Luft trocknen** — nicht in den Trockner, nicht in der prallen Sonne. Bezug feucht zurück über die Füllung ziehen, das vermeidet Knitter.",
          },
        ],
      }),
      order: 2,
      isActive: true,
    },
    {
      pageId: page.id,
      type: "CUSTOM" as const,
      title: "Pflege auf einen Blick",
      settings: JSON.stringify({
        style: "care-symbols",
        symbols: [
          { key: "wash-30", label: "Feinwäsche, kein Weichspüler" },
          { key: "bleach-dilute", label: "Bleiche verdünnt möglich" },
          { key: "no-dryer", label: "Nicht in den Trockner" },
          { key: "line-dry", label: "Lufttrocknen" },
          { key: "no-heat", label: "Von Hitze fernhalten, trocken lagern" },
        ],
      }),
      order: 3,
      isActive: true,
    },
    {
      pageId: page.id,
      type: "CUSTOM" as const,
      title: "Jahre auf Mosaroma.",
      content:
        "<p>Wir wissen, wie wichtig Qualität und Zuverlässigkeit sind. Deshalb stehen wir mit umfassenden Garantien hinter allen Mosaroma-Stoffen.</p><p>Unsere Bezugsstoffe sind durch eine auf 3 Jahre begrenzte Garantie abgedeckt, die Schutz vor dem Verlust von Festigkeit oder Farbe, Pilling sowie Abrieb durch normale Nutzung und Witterungseinflüsse bietet.</p>",
      settings: JSON.stringify({
        style: "guarantee-hero",
        number: "3",
      }),
      order: 4,
      isActive: true,
    },
    {
      pageId: page.id,
      type: "CUSTOM" as const,
      title: "Mehr über unsere Materialien",
      content:
        "<p>Detaillierte Informationen zu Stoffqualitäten, Prüfwerten und Pflegeeigenschaften finden Sie auf unserer Materialseite.</p>",
      buttonLabel: "Materialien entdecken",
      buttonHref: "/materialien",
      settings: JSON.stringify({
        style: "cta",
        secondaryHref: "/kontakt",
        secondaryLabel: "Kontakt aufnehmen",
      }),
      order: 5,
      isActive: true,
    },
  ];

  for (const section of sections) {
    await prisma.pageSection.create({ data: section });
  }

  console.log(`Created ${sections.length} new sections.`);
  console.log("Done! The pflege-garantie page now uses the catalog-based layout.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
