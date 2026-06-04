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
      defaultSeoTitle: "Mosaroma | Design trifft Performance",
    },
  });
  console.log(`✔ SiteSettings: ${siteSettings.siteName}`);

  // ---------------------------------------------------------------------------
  // 3. Pages
  // ---------------------------------------------------------------------------
  const pages = [
    { slug: "home", title: "Startseite", type: "HOME" as const },
    { slug: "kollektionen", title: "Kollektionen", type: "COLLECTION_INDEX" as const },
    { slug: "materialien", title: "Materialien", type: "MATERIAL_INDEX" as const },
    { slug: "ueber-uns", title: "Über uns", type: "STANDARD" as const },
    { slug: "kataloge", title: "Kataloge", type: "CATALOG_INDEX" as const },
    { slug: "neuigkeiten", title: "Neuigkeiten", type: "NEWS_INDEX" as const },
    { slug: "kontakt", title: "Kontakt", type: "CONTACT" as const },
    { slug: "produktmasse", title: "Produktmaße", type: "SERVICE" as const },
    { slug: "pflege-garantie", title: "Pflege & Garantie", type: "SERVICE" as const },
    { slug: "stoff-technische-daten", title: "Stoff- & technische Daten", type: "SERVICE" as const },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, type: p.type, status: "PUBLISHED" },
      create: { slug: p.slug, title: p.title, type: p.type, status: "PUBLISHED" },
    });
  }
  console.log(`✔ Pages: ${pages.length} seeded`);

  // ---------------------------------------------------------------------------
  // 4. Navigation menus
  // ---------------------------------------------------------------------------

  // -- HEADER -----------------------------------------------------------------
  const headerMenu = await prisma.navigationMenu.create({
    data: {
      name: "Header",
      location: "HEADER",
      items: {
        create: [
          { label: "Kollektionen", href: "/kollektionen", order: 1 },
          { label: "Materialien", href: "/materialien", order: 2 },
          { label: "Über uns", href: "/ueber-uns", order: 3 },
          { label: "Kataloge", href: "/kataloge", order: 4 },
          { label: "Neuigkeiten", href: "/neuigkeiten", order: 5 },
          { label: "Kontakt", href: "/kontakt", order: 6 },
        ],
      },
    },
  });
  console.log(`✔ Navigation: ${headerMenu.name}`);

  // -- FOOTER "Kollektionen" --------------------------------------------------
  const footerMenu = await prisma.navigationMenu.create({
    data: {
      name: "Kollektionen",
      location: "FOOTER",
      items: {
        create: [
          { label: "Green", href: "/kollektionen/green", order: 1 },
          { label: "Blue", href: "/kollektionen/blue", order: 2 },
          { label: "Red", href: "/kollektionen/red", order: 3 },
          { label: "Golden", href: "/kollektionen/golden", order: 4 },
          { label: "Earth & Grey", href: "/kollektionen/earth-grey", order: 5 },
          { label: "NERIO · Oceana", href: "/kollektionen/nerio-oceana", order: 6 },
          { label: "Basic", href: "/kollektionen/basic", order: 7 },
        ],
      },
    },
  });
  console.log(`✔ Navigation: ${footerMenu.name}`);

  // -- SERVICE ----------------------------------------------------------------
  const serviceMenu = await prisma.navigationMenu.create({
    data: {
      name: "Service",
      location: "SERVICE",
      items: {
        create: [
          { label: "Kataloge", href: "/kataloge", order: 1 },
          { label: "Produktmaße", href: "/kataloge/produktmasse", order: 2 },
          { label: "Pflege & Garantie", href: "/kataloge/pflege-garantie", order: 3 },
          { label: "Stoff- & technische Daten", href: "/kataloge/stoff-technische-daten", order: 4 },
          { label: "Kontakt", href: "/kontakt", order: 5 },
        ],
      },
    },
  });
  console.log(`✔ Navigation: ${serviceMenu.name}`);

  // -- LEGAL ------------------------------------------------------------------
  const legalMenu = await prisma.navigationMenu.create({
    data: {
      name: "Rechtliches",
      location: "LEGAL",
      items: {
        create: [
          { label: "Impressum", href: "/impressum", order: 1 },
          { label: "Datenschutz", href: "/datenschutz", order: 2 },
          { label: "AGB", href: "/agb", order: 3 },
        ],
      },
    },
  });
  console.log(`✔ Navigation: ${legalMenu.name}`);

  // ---------------------------------------------------------------------------
  // 5. Collections
  // ---------------------------------------------------------------------------
  const collections = [
    {
      slug: "green",
      name: "Green",
      number: 1,
      moodColors: ["#42523F", "#69785C", "#9AA381", "#D8D2B8"],
      fabric: "Mackintosh®",
    },
    {
      slug: "blue",
      name: "Blue",
      number: 2,
      moodColors: ["#2C5F7C", "#4A8BAD", "#7AB3CC", "#B5D5E2"],
      fabric: "Mackintosh®",
    },
    {
      slug: "red",
      name: "Red",
      number: 3,
      moodColors: ["#8B2500", "#C0392B", "#E67E73", "#F5C6C1"],
      fabric: "Mackintosh®",
    },
    {
      slug: "golden",
      name: "Golden",
      number: 4,
      moodColors: ["#B8860B", "#DAA520", "#F0C75E", "#F5E1A4"],
      fabric: "Mackintosh®",
    },
    {
      slug: "earth-grey",
      name: "Earth & Grey",
      number: 5,
      moodColors: ["#6B5B4B", "#8B7D6B", "#A69B8D", "#C4BEB5"],
      fabric: "Mackintosh®",
    },
    {
      slug: "nerio-oceana",
      name: "NERIO · Oceana",
      number: 6,
      moodColors: ["#1B6B6D", "#2E8B8B", "#5CACAC", "#96D4D4"],
      fabric: "Nerio",
    },
    {
      slug: "basic",
      name: "Basic",
      number: 7,
      moodColors: ["#555555", "#888888", "#AAAAAA", "#D5D5D5"],
      fabric: "Basic",
    },
  ];

  for (const [i, c] of collections.entries()) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        number: c.number,
        moodColors: c.moodColors,
        fabric: c.fabric,
        status: "PUBLISHED",
        order: i + 1,
      },
      create: {
        slug: c.slug,
        name: c.name,
        number: c.number,
        moodColors: c.moodColors,
        fabric: c.fabric,
        status: "PUBLISHED",
        order: i + 1,
      },
    });
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
    { slug: "dekokissen", name: "Dekokissen", order: 1 },
    { slug: "hochlehner", name: "Hochlehner", order: 2 },
    { slug: "niedriglehner", name: "Niedriglehner", order: 3 },
    { slug: "sitzkissen", name: "Sitzkissen", order: 4 },
    { slug: "sitzpolster", name: "Sitzpolster", order: 5 },
    { slug: "bankauflagen", name: "Bankauflagen", order: 6 },
    { slug: "poufs", name: "Poufs", order: 7 },
    { slug: "tischsets-tischlaufer", name: "Tischsets & Tischläufer", order: 8 },
    { slug: "decken", name: "Decken", order: 9 },
  ];

  for (const pg of productGroups) {
    await prisma.productGroup.upsert({
      where: { slug: pg.slug },
      update: { name: pg.name, order: pg.order },
      create: { slug: pg.slug, name: pg.name, order: pg.order },
    });
  }
  console.log(`✔ ProductGroups: ${productGroups.length} seeded`);

  // ---------------------------------------------------------------------------
  // 8. Footer settings
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
