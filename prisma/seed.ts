import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";

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
  // 4. Navigation menus
  // ---------------------------------------------------------------------------

  const navMenus = [
    {
      name: "Header",
      location: "HEADER" as const,
      items: [
        { label: "Kollektionen", href: "/kollektionen", order: 1 },
        { label: "Materialien", href: "/materialien", order: 2 },
        { label: "Über uns", href: "/ueber-uns", order: 3 },
        { label: "Kataloge", href: "/kataloge", order: 4 },
        { label: "Neuigkeiten", href: "/neuigkeiten", order: 5 },
        { label: "Kontakt", href: "/kontakt", order: 6 },
      ],
    },
    {
      name: "Kollektionen",
      location: "FOOTER" as const,
      items: [
        { label: "Green", href: "/kollektionen/green", order: 1 },
        { label: "Blue", href: "/kollektionen/blue", order: 2 },
        { label: "Red", href: "/kollektionen/red", order: 3 },
        { label: "Golden", href: "/kollektionen/golden", order: 4 },
        { label: "Earth & Grey", href: "/kollektionen/earth-grey", order: 5 },
        { label: "NERIO · Oceana", href: "/kollektionen/nerio-oceana", order: 6 },
        { label: "Basic", href: "/kollektionen/basic", order: 7 },
      ],
    },
    {
      name: "Service",
      location: "SERVICE" as const,
      items: [
        { label: "Kataloge", href: "/kataloge", order: 1 },
        { label: "Produktmaße", href: "/kataloge/produktmasse", order: 2 },
        { label: "Pflege & Garantie", href: "/kataloge/pflege-garantie", order: 3 },
        { label: "Stoff- & technische Daten", href: "/kataloge/stoff-technische-daten", order: 4 },
        { label: "Kontakt", href: "/kontakt", order: 5 },
      ],
    },
    {
      name: "Rechtliches",
      location: "LEGAL" as const,
      items: [
        { label: "Impressum", href: "/impressum", order: 1 },
        { label: "Datenschutz", href: "/datenschutz", order: 2 },
        { label: "AGB", href: "/agb", order: 3 },
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
  // 8. Sample products (Green, Blue, Basic)
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

  const sampleProducts = [
    // Green — Dekokissen
    { slug: "longitude-olive-dekokissen-401226", name: "Longitude Olive", categorySlug: "dekokissen", collectionSlug: "green", materialSlug: "mackintosh", size: "48 × 48 cm", code: "401.226", features: [], description: "Longitude Olive Dekokissen aus der Green Collection. Material: Mackintosh®.", colorName: "Olive", patternName: "Longitude" },
    { slug: "palmway-olive-dekokissen-401223", name: "Palmway Olive", categorySlug: "dekokissen", collectionSlug: "green", materialSlug: "mackintosh", size: "48 × 48 cm", code: "401.223", features: [], description: "Palmway Olive Dekokissen aus der Green Collection. Material: Mackintosh®.", colorName: "Olive", patternName: "Palmway" },
    { slug: "st-tropez-olive-dekokissen-403804", name: "St. Tropez Olive", categorySlug: "dekokissen", collectionSlug: "green", materialSlug: "mackintosh-lite", size: "48 × 48 cm", code: "403.804", features: ["mit Keder"], description: "St. Tropez Olive Dekokissen aus der Green Collection. Material: Mackintosh® Lite.", colorName: "Olive", patternName: "St. Tropez" },
    // Green — Hochlehner
    { slug: "rocky-mountain-olive-hochlehner-405813", name: "Rocky Mountain Olive", categorySlug: "hochlehner", collectionSlug: "green", materialSlug: "mackintosh", size: "120 × 48 × 6 cm", code: "405.813", features: ["mit Keder"], description: "Rocky Mountain Olive Hochlehner aus der Green Collection. Material: Mackintosh®.", colorName: "Olive", patternName: "Rocky Mountain" },
    { slug: "st-tropez-olive-hochlehner-403804", name: "St. Tropez Olive", categorySlug: "hochlehner", collectionSlug: "green", materialSlug: "mackintosh-lite", size: "120 × 48 × 6 cm", code: "403.804", features: ["mit Keder"], description: "St. Tropez Olive Hochlehner aus der Green Collection. Material: Mackintosh® Lite.", colorName: "Olive", patternName: "St. Tropez" },
    // Green — Sitzkissen
    { slug: "rocky-mountain-olive-sitzkissen-405813", name: "Rocky Mountain Olive", categorySlug: "sitzkissen", collectionSlug: "green", materialSlug: "mackintosh", size: "46 × 45 × 7 cm", code: "405.813", features: ["mit Keder"], description: "Rocky Mountain Olive Sitzkissen aus der Green Collection. Material: Mackintosh®.", colorName: "Olive", patternName: "Rocky Mountain" },
    // Blue — Dekokissen
    { slug: "caribbean-midnight-dekokissen-502209", name: "Caribbean Midnight", categorySlug: "dekokissen", collectionSlug: "blue", materialSlug: "mackintosh", size: "48 × 48 cm", code: "502.209", features: [], description: "Caribbean Midnight Dekokissen aus der Blue Collection. Material: Mackintosh®.", colorName: "Midnight", patternName: "Caribbean" },
    { slug: "bean-azure-dekokissen-504203", name: "Bean Azure", categorySlug: "dekokissen", collectionSlug: "blue", materialSlug: "mackintosh", size: "48 × 48 cm", code: "504.203", features: [], description: "Bean Azure Dekokissen aus der Blue Collection. Material: Mackintosh®.", colorName: "Azure", patternName: "Bean" },
    { slug: "longitude-dazzling-blue-dekokissen-501226", name: "Longitude Dazzling Blue", categorySlug: "dekokissen", collectionSlug: "blue", materialSlug: "mackintosh", size: "48 × 48 cm", code: "501.226", features: [], description: "Longitude Dazzling Blue Dekokissen aus der Blue Collection. Material: Mackintosh®.", colorName: "Dazzling Blue", patternName: "Longitude" },
    // Basic — Dekokissen
    { slug: "creme-au-lait-dekokissen-15815809", name: "Creme au Lait", categorySlug: "dekokissen", collectionSlug: "basic", materialSlug: "basic", size: "45 × 45 cm", code: "15815809", features: [], description: "Creme au Lait Dekokissen aus der Basic Collection. Material: Basic.", colorName: "Creme au Lait" },
    { slug: "stone-blue-dekokissen-15815834", name: "Stone Blue", categorySlug: "dekokissen", collectionSlug: "basic", materialSlug: "basic", size: "45 × 45 cm", code: "15815834", features: [], description: "Stone Blue Dekokissen aus der Basic Collection. Material: Basic.", colorName: "Stone Blue" },
    { slug: "boletus-brown-dekokissen-15815530", name: "Boletus Brown", categorySlug: "dekokissen", collectionSlug: "basic", materialSlug: "basic", size: "45 × 45 cm", code: "15815530", features: [], description: "Boletus Brown Dekokissen aus der Basic Collection. Material: Basic.", colorName: "Boletus Brown" },
  ];

  let productCount = 0;
  for (const sp of sampleProducts) {
    const collectionId = collectionMap.get(sp.collectionSlug);
    const productGroupId = groupMap.get(sp.categorySlug);
    const materialId = materialMap.get(sp.materialSlug) ?? null;

    if (!collectionId || !productGroupId) {
      console.warn(`⚠ Skipping ${sp.slug}: missing collection (${sp.collectionSlug}) or group (${sp.categorySlug})`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: sp.slug },
      update: {
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
      create: {
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
    productCount++;
  }
  console.log(`✔ Products: ${productCount} sample products seeded`);

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
      recipientEmail: "info@mosaroma.de",
      privacyText:
        "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.",
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
      recipientEmail: "info@mosaroma.de",
      privacyText:
        "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.",
      fields: {
        create: [
          {
            label: "Name",
            name: "name",
            type: "TEXT",
            required: true,
            order: 1,
          },
          {
            label: "E-Mail",
            name: "email",
            type: "EMAIL",
            required: true,
            order: 2,
          },
          {
            label: "Telefon",
            name: "phone",
            type: "PHONE",
            required: false,
            order: 3,
          },
          {
            label: "Nachricht",
            name: "message",
            type: "TEXTAREA",
            required: true,
            order: 4,
          },
          {
            label: "Datenschutz",
            name: "privacy",
            type: "CONSENT",
            required: true,
            order: 5,
          },
        ],
      },
    },
  });
  console.log(`✔ ContactForm: ${contactForm.slug}`);

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
