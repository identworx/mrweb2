import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { products as staticProducts } from "../lib/mosaroma/products";
import { measurements as staticMeasurements } from "../lib/mosaroma/measurements";
import { newsItems as staticNews } from "../lib/mosaroma/news";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ---------------------------------------------------------------------------
  // 1. Admin user
  // ---------------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env – " +
        "please set both values before running the seed.",
    );
  }

  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "ADMIN", name: "Administrator" },
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      name: "Administrator",
    },
  });
  console.log(`✔ Admin user: ${admin.email}`);

  // ---------------------------------------------------------------------------
  // 2. Site settings
  // ---------------------------------------------------------------------------
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {},
    create: {
      id: "site-settings",
      siteName: "Mosaroma",
      primaryColor: "#E07B12",
      secondaryColor: "#2D2D2D",
      contactEmail: "info@mosaroma.de",
      phone: "+49 (0) 4207 / XXXX",
      address: "Rudolf-Diesel-Str. 11–13, 28876 Oyten",
      defaultSeoTitle: "Mosaroma | Design trifft Performance",
      defaultSeoDescription: "Hochwertige Outdoor-Textilien, Sitzauflagen, Kissen, Poufs und Kollektionen für Garten, Terrasse, Hospitality und Fachhandel.",
    },
  });
  console.log(`✔ SiteSettings: ${siteSettings.siteName}`);

  // ---------------------------------------------------------------------------
  // 3. Pages
  // ---------------------------------------------------------------------------
  const pages = [
    { slug: "home", title: "Startseite", type: "HOME" as const, headline: "Design trifft Performance", eyebrow: null, introText: null, seoTitle: "Mosaroma | Design trifft Performance", seoDescription: "Hochwertige Outdoor-Textilien, Sitzauflagen, Kissen, Poufs und Kollektionen für Garten, Terrasse, Hospitality und Fachhandel." },
    { slug: "kollektionen", title: "Kollektionen", type: "COLLECTION_INDEX" as const, eyebrow: "Saison 2027", headline: "Unsere Kollektionen", introText: "Sieben kuratierte Farbwelten für den Außenbereich — jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung.", seoTitle: "Kollektionen 2027 | Mosaroma", seoDescription: "Entdecken Sie die 7 Kollektionen von MOSAROMA — kuratierte Farbwelten für den Außenbereich." },
    { slug: "materialien", title: "Materialien", type: "MATERIAL_INDEX" as const, eyebrow: "Material & Technologie", headline: "Materialien, die draußen bestehen.", introText: "Outdoor-Textilien, entwickelt für Komfort, Beständigkeit und zuverlässige Performance im Freien.", seoTitle: "Materialien & Technologie | Mosaroma", seoDescription: "Mackintosh® Technology: spinndüsengefärbtes Olefin für höchste Lichtechtheit und UV-Beständigkeit." },
    { slug: "ueber-uns", title: "Über uns", type: "STANDARD" as const, eyebrow: "Über Mosaroma", headline: "Das sind wir.", introText: "Design, Performance und verantwortungsvolles Handeln für langlebige Outdoor-Textilien.", seoTitle: "Über uns | Mosaroma", seoDescription: "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien." },
    { slug: "kataloge", title: "Kataloge", type: "CATALOG_INDEX" as const, eyebrow: "Downloads", headline: "Kataloge & Downloads", introText: "Dokumente rund um Produkte, Stoffe, Kollektionen, Pflege und technische Daten.", seoTitle: "Kataloge & Downloads | Mosaroma", seoDescription: "Mosaroma Katalog 2027, Produktmaße, Pflegehinweise und technische Stoffdaten." },
    { slug: "neuigkeiten", title: "Neuigkeiten", type: "NEWS_INDEX" as const, eyebrow: "Aktuelles", headline: "Neuigkeiten", introText: "Aktuelle Themen rund um Kollektionen, Materialien und Outdoor-Textilien.", seoTitle: "Neuigkeiten | Mosaroma", seoDescription: "Aktuelle Neuigkeiten, Kollektionen und Materialinnovationen von MOSAROMA." },
    { slug: "kontakt", title: "Kontakt", type: "CONTACT" as const, eyebrow: "Kontakt", headline: "Sprechen Sie uns an.", introText: "Wir unterstützen Sie bei Fragen zu Kollektionen, Materialien, Katalogen und Produkten.", seoTitle: "Kontakt | Mosaroma", seoDescription: "Kontaktieren Sie MOSAROMA — Mosaroma Industries GmbH in Oyten bei Bremen." },
    { slug: "produktmasse", title: "Produktmaße", type: "SERVICE" as const, eyebrow: "Übersicht · Bemaßung am Produkt", headline: "Produktmaße", introText: "Alle relevanten Maße und Abmessungen der Mosaroma Produktformen auf einen Blick.", seoTitle: "Produktmaße | Mosaroma", seoDescription: "Übersicht der wichtigsten Mosaroma Produktmaße." },
    { slug: "pflege-garantie", title: "Pflege & Garantie", type: "SERVICE" as const, eyebrow: "Service", headline: "Pflege & Garantie", introText: "Hinweise zur Reinigung, Lagerung und Garantie von Mosaroma Outdoor-Produkten.", seoTitle: "Pflege & Garantie | Mosaroma", seoDescription: "Hinweise zur Reinigung, Lagerung und Garantie von Mosaroma Outdoor-Produkten." },
    { slug: "stoff-technische-daten", title: "Stoff- & technische Daten", type: "SERVICE" as const, eyebrow: "Service", headline: "Stoff- & technische Daten", introText: "Technische Informationen zu Stoffqualitäten, Materialaufbau und Prüfwerten.", seoTitle: "Stoff- & technische Daten | Mosaroma", seoDescription: "Technische Informationen zu Mosaroma Stoffqualitäten." },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, type: p.type, status: "PUBLISHED" },
      create: {
        slug: p.slug,
        title: p.title,
        type: p.type,
        status: "PUBLISHED",
        eyebrow: p.eyebrow,
        headline: p.headline,
        introText: p.introText,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
      },
    });
  }
  console.log(`✔ Pages: ${pages.length} seeded`);

  // ---------------------------------------------------------------------------
  // 3b. PageSections for service pages
  // ---------------------------------------------------------------------------
  const pflegePage = await prisma.page.findUnique({ where: { slug: "pflege-garantie" } });
  const stoffPage = await prisma.page.findUnique({ where: { slug: "stoff-technische-daten" } });

  if (pflegePage) {
    const existingSections = await prisma.pageSection.count({ where: { pageId: pflegePage.id } });
    if (existingSections === 0) {
      await prisma.pageSection.createMany({
        data: [
          {
            pageId: pflegePage.id,
            type: "CUSTOM",
            eyebrow: "Reinigung",
            title: "Reinigung",
            order: 0,
            settings: {
              style: "care-list",
              items: [
                "Regelmäßig abbürsten oder absaugen, um Staub und Schmutz zu entfernen.",
                "Bei Bedarf mit lauwarmem Wasser und milder Seifenlösung reinigen.",
                "Mackintosh®-Stoffe sind bleichfest — bei Bedarf mit verdünnter Chlorbleiche behandelbar.",
                "Nicht in der Waschmaschine waschen, sofern nicht ausdrücklich angegeben.",
                "Nach der Reinigung an der Luft trocknen lassen.",
              ],
            },
          },
          {
            pageId: pflegePage.id,
            type: "CUSTOM",
            eyebrow: "Lagerung",
            title: "Lagerung",
            order: 1,
            settings: {
              style: "care-list",
              items: [
                "Bei längerer Nichtnutzung trocken und geschützt lagern.",
                "Auflagen und Kissen vor der Lagerung vollständig trocknen lassen.",
                "Direkte Sonneneinstrahlung bei der Lagerung vermeiden.",
                "Belüftete Aufbewahrung bevorzugen, um Schimmelbildung vorzubeugen.",
              ],
            },
          },
          {
            pageId: pflegePage.id,
            type: "CUSTOM",
            eyebrow: "Garantie",
            title: "Garantie",
            order: 2,
            settings: {
              style: "care-list",
              items: [
                "3 Jahre begrenzte Garantie auf Bezugsstoffe.",
                "Schutz vor Verlust von Festigkeit oder Farbe.",
                "Schutz vor Pilling.",
                "Schutz vor Abrieb durch normale Nutzung und Witterungseinflüsse.",
              ],
            },
          },
          {
            pageId: pflegePage.id,
            type: "CUSTOM",
            eyebrow: "Hinweise",
            title: "Hinweise für langlebige Nutzung",
            order: 3,
            settings: {
              style: "care-list",
              items: [
                "Verschüttete Flüssigkeiten zeitnah entfernen.",
                "Bei starkem Regen Polster nach Möglichkeit geschützt aufbewahren.",
                "Olefin-Stoffe trocknen schnell und nehmen kaum Wasser auf.",
                "Regelmäßige Pflege verlängert die Lebensdauer der Produkte.",
              ],
            },
          },
          {
            pageId: pflegePage.id,
            type: "CUSTOM",
            title: "Mehr über unsere Materialien",
            content: "Detaillierte Informationen zu den Stoffqualitäten und deren Pflegeeigenschaften finden Sie auf unserer Materialseite.",
            buttonLabel: "Materialien entdecken",
            buttonHref: "/materialien",
            order: 4,
            settings: { style: "cross-link" },
          },
          {
            pageId: pflegePage.id,
            type: "CTA",
            title: "Fragen zu Pflege oder Garantie?",
            content: "Wir beraten Sie gerne zu Reinigung, Lagerung und Garantiebedingungen.",
            buttonLabel: "Kontakt aufnehmen",
            buttonHref: "/kontakt",
            order: 5,
            settings: {
              style: "cta",
              secondaryHref: "/kataloge",
              secondaryLabel: "Zurück zu Kataloge",
            },
          },
        ],
      });
      console.log("✔ PageSections: pflege-garantie (6 sections)");
    } else {
      console.log(`✔ PageSections: pflege-garantie already has ${existingSections} sections, skipping`);
    }
  }

  if (stoffPage) {
    const existingSections = await prisma.pageSection.count({ where: { pageId: stoffPage.id } });
    if (existingSections === 0) {
      await prisma.pageSection.createMany({
        data: [
          {
            pageId: stoffPage.id,
            type: "CUSTOM",
            eyebrow: "Stoffqualitäten",
            title: "Material & Gewicht",
            order: 0,
            settings: {
              style: "fabric-cards",
              cards: [
                {
                  name: "Mackintosh®",
                  material: "100 % Olefin",
                  weight: "ab 260 g/m²",
                  dyeing: "spinndüsengefärbt",
                  comfort: "hoher Sitzkomfort",
                  cushionThickness: "5–6 cm starke Auflagen",
                },
                {
                  name: "Mackintosh® Lite",
                  material: "100 % Olefin",
                  weight: "ca. 170–300 g/m²",
                  dyeing: "spinndüsengefärbt",
                  comfort: "hoher Sitzkomfort",
                  cushionThickness: "3,5–6 cm Auflagen",
                  description: "etwas leichterer Stoff",
                },
                {
                  name: "Nerio",
                  subtitle: "OceanCycle rPP",
                  material: "100 % Olefin (50 % recycelt)",
                  weight: "ca. 250 g/m²",
                  dyeing: "spinndüsengefärbt",
                  comfort: "hoher Sitzkomfort",
                  cushionThickness: "5–6 cm Auflagen",
                },
                {
                  name: "Basic",
                  material: "100 % Polyester",
                  weight: "ca. 280 g/m²",
                  dyeing: "stückgefärbt",
                  comfort: "bequemer Sitzkomfort",
                  description: "weiche Haptik",
                },
              ],
            },
          },
          {
            pageId: stoffPage.id,
            type: "TECHNICAL_TABLE",
            eyebrow: "Vergleich",
            title: "Eigenschaften im Vergleich",
            order: 1,
            settings: {
              style: "comparison-table",
              columns: ["Olefin", "Acryl", "Polyester"],
              rows: [
                { property: "Lichtechtheit", olefin: "7–8", acryl: "6–7", polyester: "4–6" },
                { property: "UV-Beständigkeit", olefin: "★★★★★", acryl: "★★★★", polyester: "★★★" },
                { property: "Wasseraufnahme", olefin: "< 0,1 %", acryl: "1–2 %", polyester: "0,4 %" },
                { property: "Bleichfest", olefin: "Ja", acryl: "Ja", polyester: "Nein" },
                { property: "Schimmelfest", olefin: "Ja", acryl: "Ja", polyester: "Bedingt" },
                { property: "Gewicht/m²", olefin: "Leicht", acryl: "Mittel", polyester: "Mittel" },
                { property: "CO₂-Bilanz", olefin: "Niedrig", acryl: "Mittel", polyester: "Mittel" },
              ],
            },
          },
          {
            pageId: stoffPage.id,
            type: "CUSTOM",
            eyebrow: "Highlights",
            title: "Mackintosh® im Detail",
            buttonLabel: "Alle Materialien entdecken",
            buttonHref: "/materialien",
            order: 2,
            settings: {
              style: "highlight-cards",
              items: [
                "Höchste Lichtechtheit (7–8)",
                "UV-Beständigkeit 5/5",
                "Wasseraufnahme < 0,1 %",
                "Bleichfest",
                "Schimmelfest",
                "PFAS-frei",
                "5 Jahre Garantie auf Stoff",
              ],
            },
          },
          {
            pageId: stoffPage.id,
            type: "CTA",
            title: "Fragen zu Stoffen oder technischen Daten?",
            content: "Wir beraten Sie gerne zu Materialien, Prüfwerten und Stoffqualitäten.",
            buttonLabel: "Kontakt aufnehmen",
            buttonHref: "/kontakt",
            order: 3,
            settings: {
              style: "cta",
              secondaryHref: "/kataloge",
              secondaryLabel: "Zurück zu Kataloge",
            },
          },
        ],
      });
      console.log("✔ PageSections: stoff-technische-daten (4 sections)");
    } else {
      console.log(`✔ PageSections: stoff-technische-daten already has ${existingSections} sections, skipping`);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Navigation menus
  // ---------------------------------------------------------------------------

  const navMenus = [
    {
      name: "Header",
      location: "HEADER" as const,
      items: [
        { label: "Kollektionen", href: "/kollektionen", linkType: "SYSTEM_ROUTE", order: 1 },
        { label: "Materialien", href: "/materialien", linkType: "SYSTEM_ROUTE", order: 2 },
        { label: "Über uns", href: "/ueber-uns", linkType: "SYSTEM_ROUTE", order: 3 },
        { label: "Kataloge", href: "/kataloge", linkType: "SYSTEM_ROUTE", order: 4 },
        { label: "Neuigkeiten", href: "/neuigkeiten", linkType: "SYSTEM_ROUTE", order: 5 },
        { label: "Kontakt", href: "/kontakt", linkType: "SYSTEM_ROUTE", order: 6 },
      ],
    },
    {
      name: "Kollektionen",
      location: "FOOTER" as const,
      items: [
        { label: "Green", href: "/kollektionen/green", linkType: "CUSTOM_URL", order: 1 },
        { label: "Blue", href: "/kollektionen/blue", linkType: "CUSTOM_URL", order: 2 },
        { label: "Red", href: "/kollektionen/red", linkType: "CUSTOM_URL", order: 3 },
        { label: "Golden", href: "/kollektionen/golden", linkType: "CUSTOM_URL", order: 4 },
        { label: "Earth & Grey", href: "/kollektionen/earth-grey", linkType: "CUSTOM_URL", order: 5 },
        { label: "NERIO · Oceana", href: "/kollektionen/nerio-oceana", linkType: "CUSTOM_URL", order: 6 },
        { label: "Basic", href: "/kollektionen/basic", linkType: "CUSTOM_URL", order: 7 },
      ],
    },
    {
      name: "Service",
      location: "SERVICE" as const,
      items: [
        { label: "Kataloge", href: "/kataloge", linkType: "SYSTEM_ROUTE", order: 1 },
        { label: "Produktmaße", href: "/kataloge/produktmasse", linkType: "SYSTEM_ROUTE", order: 2 },
        { label: "Pflege & Garantie", href: "/kataloge/pflege-garantie", linkType: "SYSTEM_ROUTE", order: 3 },
        { label: "Stoff- & technische Daten", href: "/kataloge/stoff-technische-daten", linkType: "SYSTEM_ROUTE", order: 4 },
        { label: "Kontakt", href: "/kontakt", linkType: "SYSTEM_ROUTE", order: 5 },
      ],
    },
    {
      name: "Rechtliches",
      location: "LEGAL" as const,
      items: [
        { label: "Impressum", href: "/impressum", linkType: "CUSTOM_URL", order: 1 },
        { label: "Datenschutz", href: "/datenschutz", linkType: "CUSTOM_URL", order: 2 },
        { label: "AGB", href: "/agb", linkType: "CUSTOM_URL", order: 3 },
      ],
    },
  ];

  for (const nav of navMenus) {
    const existing = await prisma.navigationMenu.findFirst({
      where: { location: nav.location },
    });
    if (!existing) {
      await prisma.navigationMenu.create({
        data: {
          name: nav.name,
          location: nav.location,
          items: { create: nav.items },
        },
      });
    }
    console.log(`✔ Navigation: ${nav.name}`);
  }

  // ---------------------------------------------------------------------------
  // 5. Collections
  // ---------------------------------------------------------------------------
  const collections = [
    {
      slug: "green",
      name: "Green",
      number: 1,
      eyebrow: "Kollektion 01",
      shortDescription: "Grüne Nuancen für natürliche Rückzugsorte im Freien.",
      longDescription: "Inspiriert von Olivenlaub, Schattenplätzen und gealtertem Stein. Eine Farbwelt für Gärten, die Ruhe ausstrahlen und lange schön bleiben.",
      moodColors: ["#4A7C59", "#6B8F71", "#8FB996", "#C5D5C5"],
      fabric: "Mackintosh® & Lite",
      seoTitle: "Green Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Grüne Nuancen für natürliche Rückzugsorte im Freien — kuratierte Farbwelten in Mackintosh® Qualität.",
    },
    {
      slug: "blue",
      name: "Blue",
      number: 2,
      eyebrow: "Kollektion 02",
      shortDescription: "Kühle Blautöne für klare, frische Outdoor-Looks.",
      longDescription: "Inspiriert von Wasser, Himmel und hellen Terrassen am Meer.",
      moodColors: ["#2C5F7C", "#4A8BAD", "#7AB3CC", "#B5D5E2"],
      fabric: "Mackintosh® & Lite",
      seoTitle: "Blue Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Kühle Blautöne für klare, frische Outdoor-Looks — kuratierte Farbwelten in Mackintosh® Qualität.",
    },
    {
      slug: "red",
      name: "Red",
      number: 3,
      eyebrow: "Kollektion 03",
      shortDescription: "Warme Rot-, Terracotta- und Rosétöne für lebendige Outdoor-Akzente.",
      longDescription: "Inspiriert von Abendsonne, gebranntem Ton und mediterranen Blüten.",
      moodColors: ["#8B2500", "#C0392B", "#E67E73", "#F5C6C1"],
      fabric: "Mackintosh® & Lite",
      seoTitle: "Red Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Warme Rot- und Terracottatöne für lebendige Outdoor-Akzente — kuratierte Farbwelten in Mackintosh® Qualität.",
    },
    {
      slug: "golden",
      name: "Golden",
      number: 4,
      eyebrow: "Kollektion 04",
      shortDescription: "Sonnige Gelb- und Citron-Töne für helle, freundliche Outdoor-Bereiche.",
      longDescription: "Inspiriert von Sommerlicht, Zitronenhainen und warmem Sandstein.",
      moodColors: ["#B8860B", "#DAA520", "#F0C75E", "#F5E1A4"],
      fabric: "Mackintosh® & Lite",
      seoTitle: "Golden Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Sonnige Gelb- und Citron-Töne für helle Outdoor-Bereiche — kuratierte Farbwelten in Mackintosh® Qualität.",
    },
    {
      slug: "earth-grey",
      name: "Earth & Grey",
      number: 5,
      eyebrow: "Kollektion 05",
      shortDescription: "Erdige Naturtöne und ruhige Graunuancen für zeitlose Outdoor-Konzepte.",
      longDescription: "Inspiriert von Sandstein, Leinen, Kies, Schatten und verwittertem Holz.",
      moodColors: ["#6B5B4B", "#8B7D6B", "#A69B8D", "#C4BEB5"],
      fabric: "Mackintosh® & Lite",
      seoTitle: "Earth & Grey Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Erdige Naturtöne und ruhige Graunuancen für zeitlose Outdoor-Konzepte — kuratierte Farbwelten in Mackintosh® Qualität.",
    },
    {
      slug: "nerio-oceana",
      name: "NERIO · Oceana",
      number: 6,
      eyebrow: "Kollektion 06",
      subtitle: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
      shortDescription: "Performance-Outdoorstoffe auf Basis von OceanCycle recyceltem Polypropylen. Solution-dyed, PFAS-frei und entwickelt für hohe Anforderungen im Außenbereich.",
      longDescription: "Aus dem Ozean geboren. Für die Zukunft gemacht.",
      moodColors: ["#1B6B6D", "#2E8B8B", "#5CACAC", "#96D4D4"],
      fabric: "Nerio",
      seoTitle: "NERIO Oceana Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Performance-Outdoorstoffe aus OceanCycle recyceltem Polypropylen — nachhaltige Farbwelten von Mosaroma.",
    },
    {
      slug: "basic",
      name: "Basic",
      number: 7,
      eyebrow: "Kollektion 07",
      shortDescription: "Unkomplizierte Outdoor-Textilien für starke Saisonflächen.",
      longDescription: "Leichte Polyesterqualitäten, vielseitig kombinierbar und angenehm pflegeleicht im Alltag.",
      moodColors: ["#555555", "#888888", "#AAAAAA", "#D5D5D5"],
      fabric: "Basic (100 % Polyester, ca. 280 g/m², stückgefärbt)",
      seoTitle: "Basic Collection | Mosaroma Kollektionen 2027",
      seoDescription: "Unkomplizierte Outdoor-Textilien für starke Saisonflächen — pflegeleichte Qualitäten von Mosaroma.",
    },
  ];

  for (const [i, c] of collections.entries()) {
    const existing = await prisma.collection.findUnique({ where: { slug: c.slug } });
    const data = {
      name: c.name,
      number: c.number,
      eyebrow: c.eyebrow,
      subtitle: "subtitle" in c ? c.subtitle : null,
      shortDescription: c.shortDescription,
      longDescription: c.longDescription,
      moodColors: c.moodColors,
      fabric: c.fabric,
      seoTitle: c.seoTitle,
      seoDescription: c.seoDescription,
      status: "PUBLISHED" as const,
      order: i + 1,
    };
    if (existing) {
      await prisma.collection.update({
        where: { slug: c.slug },
        data: {
          ...data,
          shortDescription: existing.shortDescription || data.shortDescription,
          longDescription: existing.longDescription || data.longDescription,
          seoTitle: existing.seoTitle || data.seoTitle,
          seoDescription: existing.seoDescription || data.seoDescription,
          eyebrow: existing.eyebrow || data.eyebrow,
        },
      });
    } else {
      await prisma.collection.create({ data: { slug: c.slug, ...data } });
    }
  }
  console.log(`✔ Collections: ${collections.length} seeded`);

  // ---------------------------------------------------------------------------
  // 6. Materials
  // ---------------------------------------------------------------------------
  const materials = [
    {
      slug: "mackintosh",
      name: "Mackintosh®",
      materialComp: "100 % Olefin",
      weight: "ab 260 g/m²",
      dyeing: "spinndüsengefärbt",
      comfort: "hoher Sitzkomfort",
      order: 1,
    },
    {
      slug: "mackintosh-lite",
      name: "Mackintosh® Lite",
      materialComp: "100 % Olefin",
      weight: "ca. 170–300 g/m²",
      order: 2,
    },
    {
      slug: "nerio",
      name: "Nerio",
      subtitle: "OceanCycle rPP",
      materialComp: "100 % Olefin (50 % recycelt)",
      weight: "ca. 250 g/m²",
      order: 3,
    },
    {
      slug: "basic",
      name: "Basic",
      materialComp: "100 % Polyester",
      weight: "ca. 280 g/m²",
      dyeing: "stückgefärbt",
      order: 4,
    },
    {
      slug: "bambusfaser",
      name: "Bambusfaser",
      materialComp: "Bambusfaser",
      weight: "",
      order: 5,
    },
    {
      slug: "acryl",
      name: "Acryl",
      materialComp: "100 % Acryl",
      weight: "",
      order: 6,
    },
  ];

  for (const m of materials) {
    await prisma.material.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        subtitle: m.subtitle ?? null,
        materialComp: m.materialComp,
        weight: m.weight,
        dyeing: m.dyeing ?? null,
        comfort: m.comfort ?? null,
        order: m.order,
      },
      create: {
        slug: m.slug,
        name: m.name,
        subtitle: m.subtitle ?? null,
        materialComp: m.materialComp,
        weight: m.weight,
        dyeing: m.dyeing ?? null,
        comfort: m.comfort ?? null,
        order: m.order,
      },
    });
  }
  console.log(`✔ Materials: ${materials.length} seeded`);

  // ---------------------------------------------------------------------------
  // 7. Product groups
  // ---------------------------------------------------------------------------
  const productGroups = [
    { slug: "dekokissen", name: "Dekokissen", order: 1, description: "Dekorative Akzentkissen für den Außenbereich — vielseitig kombinierbar in allen Stoffqualitäten." },
    { slug: "hochlehner", name: "Hochlehner", order: 2, description: "Auflagen für Hochlehner-Gartenstühle — komfortable Polsterung mit durchgehender Rückenlehne." },
    { slug: "niedriglehner", name: "Niedriglehner", order: 3, description: "Auflagen für Niedriglehner-Stühle — komfortabel gepolstert mit kürzerer Rückenlehne." },
    { slug: "sitzkissen", name: "Sitzkissen", order: 4, description: "Vielseitige Sitzkissen für Gartenstühle — bequem gepolstert und outdoor-tauglich." },
    { slug: "sitzpolster", name: "Sitzpolster", order: 5, description: "Flache Sitzpolster für Stühle und Bänke — schlank, leicht und unkompliziert im Einsatz." },
    { slug: "bankauflagen", name: "Bankauflagen", order: 6, description: "Maßgefertigte Bankauflagen in vier Längen — von der Gartenbank bis zur XXL-Sitzfläche." },
    { slug: "poufs", name: "Poufs", order: 7, description: "Vielseitige Outdoor-Poufs — als Sitzgelegenheit, Beistelltisch oder Fußablage einsetzbar." },
    { slug: "tischsets-tischlaeufer", name: "Tischsets & Tischläufer", order: 8, description: "Elegante Tischsets und Tischläufer für den gedeckten Tisch im Freien — wetterfest und stilvoll." },
    { slug: "decken", name: "Decken", order: 9, description: "Weiche Outdoor-Decken für kühle Abende — in Bambusfaser und Acryl erhältlich." },
  ];

  // Fix old slug if it exists
  const oldTischsets = await prisma.productGroup.findUnique({ where: { slug: "tischsets-tischlaufer" } });
  if (oldTischsets) {
    await prisma.productGroup.update({
      where: { slug: "tischsets-tischlaufer" },
      data: { slug: "tischsets-tischlaeufer", name: "Tischsets & Tischläufer", description: "Elegante Tischsets und Tischläufer für den gedeckten Tisch im Freien — wetterfest und stilvoll.", order: 8 },
    });
    console.log("✔ Fixed tischsets slug: tischsets-tischlaufer → tischsets-tischlaeufer");
  }

  for (const pg of productGroups) {
    await prisma.productGroup.upsert({
      where: { slug: pg.slug },
      update: { name: pg.name, order: pg.order, description: pg.description },
      create: { slug: pg.slug, name: pg.name, order: pg.order, description: pg.description },
    });
  }
  console.log(`✔ ProductGroups: ${productGroups.length} seeded`);

  // ---------------------------------------------------------------------------
  // 8. Products — full import from static data (lib/mosaroma/products.ts)
  // ---------------------------------------------------------------------------
  const collectionMap = new Map<string, string>();
  const allCollections = await prisma.collection.findMany({ select: { id: true, slug: true } });
  for (const c of allCollections) collectionMap.set(c.slug, c.id);

  const groupMap = new Map<string, string>();
  const allGroups = await prisma.productGroup.findMany({ select: { id: true, slug: true } });
  for (const g of allGroups) groupMap.set(g.slug, g.id);

  const materialMap = new Map<string, string>();
  const allMaterials = await prisma.material.findMany({ select: { id: true, slug: true } });
  for (const m of allMaterials) materialMap.set(m.slug, m.id);

  let productCreated = 0;
  let productUpdated = 0;
  let productSkipped = 0;

  for (const sp of staticProducts) {
    const collectionId = collectionMap.get(sp.collectionSlug);
    const productGroupId = groupMap.get(sp.categorySlug);
    const materialId = materialMap.get(sp.materialSlug) ?? null;

    if (!collectionId || !productGroupId) {
      console.warn(`⚠ Skipping ${sp.slug}: missing collection (${sp.collectionSlug}) or group (${sp.categorySlug})`);
      productSkipped++;
      continue;
    }

    const existing = await prisma.product.findUnique({
      where: { slug: sp.slug },
      select: { id: true, seoTitle: true, seoDescription: true, heroImageId: true, mainImageId: true },
    });

    if (existing) {
      await prisma.product.update({
        where: { slug: sp.slug },
        data: {
          name: sp.name,
          collectionId,
          productGroupId,
          materialId,
          description: sp.description,
          code: sp.code,
          size: sp.size,
          colorName: sp.colorName ?? null,
          patternName: sp.patternName ?? null,
          features: sp.features,
          status: "PUBLISHED",
          // Preserve admin-edited fields if already set
          seoTitle: existing.seoTitle,
          seoDescription: existing.seoDescription,
          heroImageId: existing.heroImageId,
          mainImageId: existing.mainImageId,
        },
      });
      productUpdated++;
    } else {
      await prisma.product.create({
        data: {
          slug: sp.slug,
          name: sp.name,
          collectionId,
          productGroupId,
          materialId,
          description: sp.description,
          code: sp.code,
          size: sp.size,
          colorName: sp.colorName ?? null,
          patternName: sp.patternName ?? null,
          features: sp.features,
          status: "PUBLISHED",
        },
      });
      productCreated++;
    }
  }
  console.log(`✔ Products: ${productCreated} created, ${productUpdated} updated, ${productSkipped} skipped (${staticProducts.length} total static)`);

  // ---------------------------------------------------------------------------
  // 9. Footer settings
  // ---------------------------------------------------------------------------
  const footer = await prisma.footerSettings.upsert({
    where: { id: "footer-settings" },
    update: {},
    create: {
      id: "footer-settings",
      description:
        "Design trifft Performance. Hochwertige Outdoor-Textilien für langlebige Momente im Freien.",
      copyrightText: "© 2026 MOSAROMA GmbH. Alle Rechte vorbehalten.",
    },
  });
  console.log(`✔ FooterSettings: ${footer.id}`);

  // ---------------------------------------------------------------------------
  // 9. Contact form
  // ---------------------------------------------------------------------------
  const contactFormFields = [
    { label: "Name", name: "name", type: "TEXT", placeholder: "Ihr Name", required: true, order: 1 },
    { label: "Unternehmen", name: "company", type: "TEXT", placeholder: "Ihr Unternehmen", required: false, order: 2 },
    { label: "E-Mail", name: "email", type: "EMAIL", placeholder: "Ihre E-Mail-Adresse", required: true, order: 3 },
    { label: "Telefon", name: "phone", type: "PHONE", placeholder: "Ihre Telefonnummer", required: false, order: 4 },
    { label: "Betreff", name: "subject", type: "TEXT", placeholder: "Betreff Ihrer Nachricht", required: false, order: 5 },
    { label: "Nachricht", name: "message", type: "TEXTAREA", placeholder: "Ihre Nachricht", required: true, order: 6 },
    { label: "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Angaben zu.", name: "privacy", type: "CONSENT", helpText: "datenschutz", required: true, order: 7 },
  ] as const;

  const contactForm = await prisma.form.upsert({
    where: { slug: "contact" },
    update: {
      name: "Kontaktformular",
      title: "Kontakt aufnehmen",
      submitLabel: "Nachricht senden",
      successMessage:
        "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze.",
      errorMessage:
        "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      recipientEmail: "sales@mosaroma.de",
      privacyText:
        "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Angaben zu.",
    },
    create: {
      slug: "contact",
      name: "Kontaktformular",
      title: "Kontakt aufnehmen",
      submitLabel: "Nachricht senden",
      successMessage:
        "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze.",
      errorMessage:
        "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      recipientEmail: "sales@mosaroma.de",
      privacyText:
        "Ich habe die Datenschutzerklärung gelesen und stimme der Verarbeitung meiner Angaben zu.",
      fields: {
        create: contactFormFields.map((f) => ({ ...f })),
      },
    },
  });

  await prisma.formField.deleteMany({ where: { formId: contactForm.id } });
  await prisma.formField.createMany({
    data: contactFormFields.map((f) => ({ ...f, formId: contactForm.id })),
  });
  console.log(`✔ ContactForm: ${contactForm.slug}`);

  // ---------------------------------------------------------------------------
  // 10. Downloads
  // ---------------------------------------------------------------------------
  const downloadSeeds = [
    {
      title: "Mosaroma Katalog 2027 Deutsch",
      description: "Vollständiger Produktkatalog mit allen Kollektionen, Maßen und Stoffqualitäten der Saison 2027.",
      type: "catalog",
      language: "de",
      externalUrl: "https://katalog.mosaroma.de/",
      buttonLabel: "Deutsch ansehen",
      opensInNewTab: true,
      order: 1,
    },
    {
      title: "Mosaroma Catalog 2027 English",
      description: "Complete product catalog with all collections, dimensions and fabric qualities for the 2027 season.",
      type: "catalog",
      language: "en",
      externalUrl: "https://catalog.mosaroma.de/",
      buttonLabel: "English ansehen",
      opensInNewTab: true,
      order: 2,
    },
  ];

  for (const dl of downloadSeeds) {
    const existing = await prisma.download.findFirst({ where: { type: dl.type, language: dl.language } });
    if (!existing) {
      await prisma.download.create({ data: dl });
    } else {
      await prisma.download.update({
        where: { id: existing.id },
        data: { title: dl.title, description: dl.description, externalUrl: dl.externalUrl, buttonLabel: dl.buttonLabel, opensInNewTab: dl.opensInNewTab, order: dl.order },
      });
    }
  }
  console.log(`✔ Downloads: ${downloadSeeds.length} seeded`);

  // ---------------------------------------------------------------------------
  // 11. Measurements
  // ---------------------------------------------------------------------------
  const deprecatedMeasurementSlugs = [
    "deko-kissen-mackintosh", "deko-kissen-basic", "deko-kissen", "decken",
  ];
  for (const slug of deprecatedMeasurementSlugs) {
    const existing = await prisma.measurement.findUnique({ where: { slug } });
    if (existing) {
      await prisma.measurement.update({ where: { slug }, data: { isActive: false } });
    }
  }

  for (let i = 0; i < staticMeasurements.length; i++) {
    const m = staticMeasurements[i];
    const variants = JSON.parse(JSON.stringify(m.variants));
    const notes = m.notes ? JSON.parse(JSON.stringify(m.notes)) : [];
    await prisma.measurement.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        groupSlug: m.group,
        drawingType: m.drawingType,
        variants,
        notes,
        sourceNote: null,
        isActive: true,
      },
      create: {
        slug: m.slug,
        title: m.title,
        groupSlug: m.group,
        drawingType: m.drawingType,
        variants,
        notes,
        sourceNote: null,
        order: i,
        isActive: true,
      },
    });
  }
  console.log(`✔ Measurements: ${staticMeasurements.length} active, ${deprecatedMeasurementSlugs.length} deprecated`);

  // ---------------------------------------------------------------------------
  // 12. News Articles
  // ---------------------------------------------------------------------------
  for (const n of staticNews) {
    await prisma.newsArticle.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        category: n.tag,
        excerpt: n.description,
      },
      create: {
        slug: n.slug,
        title: n.title,
        eyebrow: n.tag,
        excerpt: n.description,
        content: "",
        category: n.tag,
        status: "PUBLISHED",
        publishedAt: new Date("2027-01-01"),
      },
    });
  }
  console.log(`✔ NewsArticles: ${staticNews.length} seeded`);

  // ---------------------------------------------------------------------------
  // 13. Branding media — ensure logo exists as MediaAsset
  // ---------------------------------------------------------------------------
  const logoUrl = "/mosaroma_logo.png";
  let logoAsset = await prisma.mediaAsset.findFirst({ where: { url: logoUrl } });
  if (!logoAsset) {
    logoAsset = await prisma.mediaAsset.create({
      data: {
        filename: "mosaroma_logo.png",
        originalName: "Mosaroma Logo",
        url: logoUrl,
        mimeType: "image/png",
        size: 19945,
        width: 754,
        height: 190,
        alt: "Mosaroma Logo",
        title: "Mosaroma Logo",
        folder: "branding",
      },
    });
    console.log(`✔ Branding: logo MediaAsset created`);
  } else {
    console.log(`✔ Branding: logo MediaAsset already exists`);
  }

  const currentSettings = await prisma.siteSettings.findUnique({
    where: { id: "site-settings" },
    select: { logoMediaId: true },
  });
  if (currentSettings && !currentSettings.logoMediaId) {
    await prisma.siteSettings.update({
      where: { id: "site-settings" },
      data: { logoMediaId: logoAsset.id },
    });
    console.log(`✔ Branding: SiteSettings.logoMediaId set`);
  } else {
    console.log(`✔ Branding: SiteSettings.logoMediaId already set or settings missing`);
  }

  const currentFooter = await prisma.footerSettings.findUnique({
    where: { id: "footer-settings" },
    select: { logoMediaId: true },
  });
  if (currentFooter && !currentFooter.logoMediaId) {
    await prisma.footerSettings.update({
      where: { id: "footer-settings" },
      data: { logoMediaId: logoAsset.id },
    });
    console.log(`✔ Branding: FooterSettings.logoMediaId set`);
  } else {
    console.log(`✔ Branding: FooterSettings.logoMediaId already set or footer missing`);
  }

  console.log("\n🌱 Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
