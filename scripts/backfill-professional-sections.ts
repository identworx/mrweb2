/**
 * Backfill Page + PageSection helpers for the Mosaroma Professional page at /professional.
 *
 * Target structure (all sections helper sections on page slug "professional"):
 *   1. professional-hero          — video URL, poster image, hero button
 *   2. professional-applications  — application cards (title + image)
 *   3. professional-materials     — material cards (title + description + image)
 *   4. professional-service       — service items (title + icon)
 *   5. professional-cta           — contact CTA with image on the right
 *
 * Old styles professional-about / professional-oyten / professional-supply-chain
 * are deactivated (isActive = false), never deleted.
 *
 * All default texts come from lib/mosaroma/professional-copy.ts. EN translations
 * are upserted into ContentTranslation (entityType "pageSection" / "pageHero" / "page").
 *
 * Idempotent rules:
 *   - Texts are only replaced when they are empty or still equal to the old
 *     backfill defaults; manual edits are kept.
 *   - imageId / iconImageId / videoUrl are never overwritten.
 *   - Existing translatedText is never overwritten (unless it still equals a known
 *     old default); a changed sourceText marks the entry STALE.
 *
 * Usage:
 *   npx tsx scripts/backfill-professional-sections.ts          # dry-run
 *   npx tsx scripts/backfill-professional-sections.ts --apply  # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  professionalCopyDe as de,
  professionalCopyEn as en,
} from "../lib/mosaroma/professional-copy";

const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

let changes = 0;

function log(msg: string) {
  console.log(msg);
}

function action(msg: string) {
  changes += 1;
  console.log(`  ${dryRun ? "[would]" : "[done] "} ${msg}`);
}

function isBlank(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

/** True if the current value is empty or equals one of the known old defaults. */
function isReplaceable(current: unknown, oldValues: readonly string[]): boolean {
  if (isBlank(current)) return true;
  return typeof current === "string" && oldValues.includes(current.trim());
}

function short(v: unknown): string {
  if (v === null || v === undefined) return "∅";
  const s = String(v).replace(/\s+/g, " ");
  return `"${s.length > 70 ? `${s.slice(0, 67)}...` : s}"`;
}

/* ------------------------------------------------------------------ */
/*  Old defaults (from previous backfill / seed / fix scripts)        */
/* ------------------------------------------------------------------ */

const OLD_PAGE = {
  eyebrow: ["Mosaroma Industries GmbH"],
  headline: ["Mosaroma Professional"],
  introText: [
    "Technische Textilien. Lokaler Support. Professionelle Lösungen.",
    "Technical Textiles. Local Support. Professional Solutions.",
  ],
  seoTitle: [
    "Mosaroma Professional — Technische Textilien & B2B-Lösungen | Mosaroma",
    "Mosaroma Professional — Technical Textiles & B2B Solutions | Mosaroma",
  ],
  seoDescription: [
    "Technische Textilien für Sonnenschutz, Outdoor-Möbel und architektonische Anwendungen. Lokaler B2B-Support in Oyten, Deutschland.",
    "Technical Textiles für Sonnenschutz, Outdoor-Möbel und architektonische Anwendungen. Lokaler B2B-Support in Oyten, Deutschland.",
  ],
} as const;

const OLD_SECTION_TEXTS: Record<string, { eyebrow: string[]; title: string[]; content: string[] }> = {
  "professional-applications": {
    eyebrow: [],
    title: ["Anwendungsbereiche"],
    content: [
      "Von Sonnenschutz bis architektonische Textilien — unsere Lösungen für professionelle Outdoor-Projekte.",
    ],
  },
  "professional-cta": {
    eyebrow: [],
    title: ["Kontakt & Standort"],
    content: [
      "Wir freuen uns auf Ihre Anfrage — ob Projektberatung, Bemusterung oder technische Fragen.",
    ],
  },
};

const OLD_CTA_BUTTON = { label: ["Kontakt aufnehmen"], href: ["/kontakt"] };

const DEPRECATED_STYLES = [
  "professional-about",
  "professional-oyten",
  "professional-supply-chain",
];

/** Known old EN translations that may be replaced by the new copy. */
const OLD_TRANSLATIONS: Record<string, string[]> = {
  "pageHero/professional/eyebrow": ["Mosaroma Industries GmbH"],
  "pageHero/professional/title": ["Mosaroma Professional"],
  "pageHero/professional/description": [
    "Technical Textiles. Local Support. Professional Solutions.",
  ],
};

/* ------------------------------------------------------------------ */
/*  Target section definitions                                        */
/* ------------------------------------------------------------------ */

type SectionType = "CUSTOM" | "CTA";

interface TargetSection {
  style: string;
  type: SectionType;
  eyebrow: string | null;
  title: string | null;
  content: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  settings: Record<string, unknown>;
}

const TARGETS: TargetSection[] = [
  {
    style: "professional-hero",
    type: "CUSTOM",
    eyebrow: null,
    title: "Professional Hero-Medien",
    content: null,
    buttonLabel: de.hero.buttonLabel,
    buttonHref: de.hero.buttonHref,
    settings: { style: "professional-hero", helper: true, videoUrl: "" },
  },
  {
    style: "professional-applications",
    type: "CUSTOM",
    eyebrow: de.applications.eyebrow,
    title: de.applications.title,
    content: de.applications.content,
    buttonLabel: null,
    buttonHref: null,
    settings: {
      style: "professional-applications",
      helper: true,
      background: "white",
      items: de.applications.items.map((i) => ({ title: i.title, imageId: null })),
    },
  },
  {
    style: "professional-materials",
    type: "CUSTOM",
    eyebrow: de.materials.eyebrow,
    title: de.materials.title,
    content: de.materials.content,
    buttonLabel: null,
    buttonHref: null,
    settings: {
      style: "professional-materials",
      helper: true,
      background: "cream",
      items: de.materials.items.map((i) => ({
        title: i.title,
        description: i.description,
        imageId: null,
      })),
    },
  },
  {
    style: "professional-service",
    type: "CUSTOM",
    eyebrow: de.service.eyebrow,
    title: de.service.title,
    content: de.service.content,
    buttonLabel: null,
    buttonHref: null,
    settings: {
      style: "professional-service",
      helper: true,
      background: "anthracite",
      items: de.service.items.map((i) => ({
        title: i.title,
        iconKey: i.iconKey,
        iconImageId: null,
      })),
    },
  },
  {
    style: "professional-cta",
    type: "CTA",
    eyebrow: de.cta.eyebrow,
    title: de.cta.title,
    content: de.cta.content,
    buttonLabel: de.cta.buttonLabel,
    buttonHref: de.cta.buttonHref,
    settings: {
      style: "professional-cta",
      helper: true,
      background: "anthracite",
      subtitle: de.cta.subtitle,
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Translations                                                      */
/* ------------------------------------------------------------------ */

interface TranslationEntry {
  entityType: string;
  entityId: string;
  fieldName: string;
  sourceText: string;
  translatedText: string;
}

function buildTranslations(): TranslationEntry[] {
  const out: TranslationEntry[] = [];
  const add = (entityType: string, entityId: string, fieldName: string, src: string, tr: string) => {
    if (!src || !tr) return;
    out.push({ entityType, entityId, fieldName, sourceText: src, translatedText: tr });
  };
  const ps = (style: string, field: string, src: string, tr: string) =>
    add("pageSection", style, field, src, tr);

  // Hero section (button only; texts live on pageHero)
  ps("professional-hero", "buttonLabel", de.hero.buttonLabel, en.hero.buttonLabel);

  // Applications
  ps("professional-applications", "eyebrow", de.applications.eyebrow, en.applications.eyebrow);
  ps("professional-applications", "title", de.applications.title, en.applications.title);
  ps("professional-applications", "content", de.applications.content, en.applications.content);
  de.applications.items.forEach((item, i) => {
    ps("professional-applications", `item.${i + 1}.title`, item.title, en.applications.items[i]?.title ?? "");
  });

  // Materials
  ps("professional-materials", "eyebrow", de.materials.eyebrow, en.materials.eyebrow);
  ps("professional-materials", "title", de.materials.title, en.materials.title);
  ps("professional-materials", "content", de.materials.content, en.materials.content);
  de.materials.items.forEach((item, i) => {
    ps("professional-materials", `item.${i + 1}.title`, item.title, en.materials.items[i]?.title ?? "");
    ps(
      "professional-materials",
      `item.${i + 1}.description`,
      item.description,
      en.materials.items[i]?.description ?? "",
    );
  });

  // Service
  ps("professional-service", "eyebrow", de.service.eyebrow, en.service.eyebrow);
  ps("professional-service", "title", de.service.title, en.service.title);
  ps("professional-service", "content", de.service.content, en.service.content);
  de.service.items.forEach((item, i) => {
    ps("professional-service", `item.${i + 1}.title`, item.title, en.service.items[i]?.title ?? "");
  });

  // CTA
  ps("professional-cta", "eyebrow", de.cta.eyebrow, en.cta.eyebrow);
  ps("professional-cta", "title", de.cta.title, en.cta.title);
  ps("professional-cta", "content", de.cta.content, en.cta.content);
  ps("professional-cta", "subtitle", de.cta.subtitle, en.cta.subtitle);
  ps("professional-cta", "buttonLabel", de.cta.buttonLabel, en.cta.buttonLabel);

  // Page hero
  add("pageHero", "professional", "eyebrow", de.hero.eyebrow, en.hero.eyebrow);
  add("pageHero", "professional", "title", de.hero.title, en.hero.title);
  add("pageHero", "professional", "description", de.hero.description, en.hero.description);
  add("pageHero", "professional", "alt", "Mosaroma Professional Hero", "Mosaroma Professional Hero");

  // Page SEO
  add("page", "professional", "seoTitle", de.seo.title, en.seo.title);
  add("page", "professional", "seoDescription", de.seo.description, en.seo.description);

  return out;
}

async function upsertTranslations() {
  log("\n── Translations (EN) ─────────────────────────────────────────");
  const entries = buildTranslations();
  let created = 0;
  let skipped = 0;
  let stale = 0;
  let replaced = 0;

  for (const entry of entries) {
    const id = `${entry.entityType}/${entry.entityId}/${entry.fieldName}`;
    const existing = await prisma.contentTranslation.findFirst({
      where: {
        entityType: entry.entityType,
        entityId: entry.entityId,
        fieldName: entry.fieldName,
        locale: "en",
      },
    });

    if (!existing) {
      action(`CREATE ${id} = ${short(entry.translatedText)}`);
      if (!dryRun) {
        await prisma.contentTranslation.create({
          data: { ...entry, locale: "en", status: "PUBLISHED" },
        });
      }
      created++;
      continue;
    }

    const oldValues = OLD_TRANSLATIONS[id] ?? [];
    const translationIsOld = isReplaceable(existing.translatedText, oldValues);
    if (translationIsOld && existing.translatedText !== entry.translatedText) {
      action(`REPLACE old translation ${id}: ${short(existing.translatedText)} → ${short(entry.translatedText)}`);
      if (!dryRun) {
        await prisma.contentTranslation.update({
          where: { id: existing.id },
          data: {
            sourceText: entry.sourceText,
            translatedText: entry.translatedText,
            status: "PUBLISHED",
          },
        });
      }
      replaced++;
      continue;
    }

    if (existing.sourceText !== entry.sourceText) {
      action(`UPDATE sourceText ${id} → STALE (translatedText kept)`);
      if (!dryRun) {
        await prisma.contentTranslation.update({
          where: { id: existing.id },
          data: {
            sourceText: entry.sourceText,
            status: existing.status === "PUBLISHED" ? "STALE" : existing.status,
          },
        });
      }
      stale++;
      continue;
    }

    skipped++;
  }

  log(`  Translations: ${created} new, ${replaced} replaced, ${stale} → STALE, ${skipped} unchanged.`);
}

/* ------------------------------------------------------------------ */
/*  Main                                                              */
/* ------------------------------------------------------------------ */

function getSettings(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function main() {
  log(`Mode: ${dryRun ? "DRY-RUN (no changes will be written)" : "APPLY"}`);
  log(`Database: ${raw}\n`);

  /* ── Page ───────────────────────────────────────────────────────── */
  log("── Page 'professional' ───────────────────────────────────────");
  let page = await prisma.page.findUnique({ where: { slug: "professional" } });

  if (!page) {
    action(`CREATE page 'professional' (headline ${short(de.hero.title)})`);
    if (dryRun) {
      log("  Sections would all be created; translations would be created.");
      log("\nDry-run cannot continue without page id. Run with --apply.");
      await upsertTranslations();
      return;
    }
    page = await prisma.page.create({
      data: {
        slug: "professional",
        title: "Mosaroma Professional",
        eyebrow: de.hero.eyebrow,
        headline: de.hero.title,
        introText: de.hero.description,
        status: "PUBLISHED",
        type: "STANDARD",
        seoTitle: de.seo.title,
        seoDescription: de.seo.description,
      },
    });
    log(`  Created page id ${page.id}`);
  } else {
    log(`  Page exists (id ${page.id}).`);
    const target = {
      eyebrow: de.hero.eyebrow,
      headline: de.hero.title,
      introText: de.hero.description,
      seoTitle: de.seo.title,
      seoDescription: de.seo.description,
    };
    const updates: Record<string, string> = {};
    for (const key of Object.keys(target) as (keyof typeof target)[]) {
      const current = page[key];
      if (current === target[key]) continue;
      if (isReplaceable(current, OLD_PAGE[key])) {
        updates[key] = target[key];
        action(`page.${key}: ${short(current)} → ${short(target[key])}`);
      } else {
        log(`  keep page.${key} (manually edited): ${short(current)}`);
      }
    }
    if (!dryRun && Object.keys(updates).length > 0) {
      await prisma.page.update({ where: { id: page.id }, data: updates });
    }
  }

  /* ── Sections ───────────────────────────────────────────────────── */
  const existing = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });
  const findByStyle = (style: string) => existing.find((s) => getSettings(s.settings).style === style);
  // New sections are appended after all existing ones (fresh DB: hero, applications,
  // materials, service, cta) so they never collide with existing order values.
  let nextOrder = existing.reduce((max, s) => Math.max(max, s.order), 0) + 1;

  for (const target of TARGETS) {
    log(`\n── ${target.style} ${"─".repeat(Math.max(0, 50 - target.style.length))}`);
    const ex = findByStyle(target.style);

    if (!ex) {
      const order = nextOrder++;
      action(`CREATE section (type ${target.type}, order ${order}, title ${short(target.title)})`);
      if (!dryRun) {
        await prisma.pageSection.create({
          data: {
            pageId: page.id,
            type: target.type,
            eyebrow: target.eyebrow,
            title: target.title,
            content: target.content,
            buttonLabel: target.buttonLabel,
            buttonHref: target.buttonHref,
            settings: target.settings as object,
            order,
            isActive: true,
          },
        });
      }
      continue;
    }

    log(`  Exists (id ${ex.id}, order ${ex.order}, ${ex.isActive ? "active" : "inactive"}).`);
    const data: Record<string, unknown> = {};
    const settings = { ...getSettings(ex.settings) };
    let settingsChanged = false;

    const setSetting = (key: string, value: unknown, reason: string) => {
      settings[key] = value;
      settingsChanged = true;
      action(`settings.${key} ${reason}`);
    };

    // Helper flag must be set for the page to treat it as helper section
    if (settings.helper !== true) setSetting("helper", true, "= true");

    // Background
    if (target.style !== "professional-hero" && isBlank(settings.background)) {
      setSetting("background", target.settings.background, `= ${short(target.settings.background)} (missing)`);
    }

    // Text fields (only replace empty / old defaults)
    if (target.style !== "professional-hero") {
      const old = OLD_SECTION_TEXTS[target.style] ?? { eyebrow: [], title: [], content: [] };
      for (const field of ["eyebrow", "title", "content"] as const) {
        const current = ex[field];
        const next = target[field];
        if (current === next) continue;
        if (isReplaceable(current, old[field])) {
          data[field] = next;
          action(`${field}: ${short(current)} → ${short(next)}`);
        } else {
          log(`  keep ${field} (manually edited): ${short(current)}`);
        }
      }
    }

    // Buttons
    if (target.style === "professional-hero") {
      if (isBlank(ex.buttonLabel) && isBlank(ex.buttonHref)) {
        data.buttonLabel = target.buttonLabel;
        data.buttonHref = target.buttonHref;
        action(`buttonLabel/buttonHref = ${short(target.buttonLabel)} / ${short(target.buttonHref)} (were empty)`);
      }
      if (settings.videoUrl === undefined) setSetting("videoUrl", "", '= "" (missing)');
    }
    if (target.style === "professional-cta") {
      if (ex.buttonLabel !== target.buttonLabel && isReplaceable(ex.buttonLabel, OLD_CTA_BUTTON.label)) {
        data.buttonLabel = target.buttonLabel;
        action(`buttonLabel: ${short(ex.buttonLabel)} → ${short(target.buttonLabel)}`);
      }
      if (isBlank(ex.buttonHref)) {
        data.buttonHref = target.buttonHref;
        action(`buttonHref = ${short(target.buttonHref)} (was empty)`);
      }
      if (isBlank(settings.subtitle)) {
        setSetting("subtitle", target.settings.subtitle, `= ${short(target.settings.subtitle)} (missing)`);
      }
    }

    // Items
    if (target.style === "professional-applications") {
      if (!Array.isArray(settings.items)) {
        setSetting("items", target.settings.items, "→ default items (missing)");
      } else {
        // An empty array is a valid new-format value (all cards removed) and is kept.
        // Only the old item structure ({title, description, iconKey, imageId}) is
        // replaced by the 3 new defaults (confirmed by the customer). Existing
        // imageIds are carried over by position so no media reference gets lost.
        const items = settings.items as unknown[];
        const isOldFormat =
          items.length > 0 &&
          items.some(
            (it) =>
              typeof it === "object" &&
              it !== null &&
              ("iconKey" in it || "description" in it),
          );
        if (isOldFormat) {
          const nextItems = de.applications.items.map((item, i) => {
            const old = items[i] as Record<string, unknown> | undefined;
            return {
              title: item.title,
              imageId: typeof old?.imageId === "string" ? old.imageId : null,
            };
          });
          setSetting("items", nextItems, `→ ${nextItems.length} new default items (old format, ${items.length} items)`);
        }
      }
    } else if (target.style === "professional-materials" || target.style === "professional-service") {
      if (!Array.isArray(settings.items)) {
        setSetting("items", target.settings.items, "→ default items (missing)");
      }
    }

    // Section type
    if (ex.type !== target.type) {
      data.type = target.type;
      action(`type: ${ex.type} → ${target.type}`);
    }

    if (settingsChanged) data.settings = settings;

    if (Object.keys(data).length === 0) {
      log("  Nothing to do.");
    } else if (!dryRun) {
      await prisma.pageSection.update({ where: { id: ex.id }, data });
    }
  }

  /* ── Deprecated sections ────────────────────────────────────────── */
  log("\n── Deprecated sections ───────────────────────────────────────");
  for (const style of DEPRECATED_STYLES) {
    const sections = existing.filter((s) => getSettings(s.settings).style === style);
    if (sections.length === 0) {
      log(`  ${style}: not present.`);
      continue;
    }
    for (const s of sections) {
      if (!s.isActive) {
        log(`  ${style} (id ${s.id}): already inactive.`);
        continue;
      }
      action(`${style} (id ${s.id}): isActive → false (kept in DB)`);
      if (!dryRun) {
        await prisma.pageSection.update({ where: { id: s.id }, data: { isActive: false } });
      }
    }
  }

  await upsertTranslations();
}

main()
  .then(() => {
    log("");
    if (changes === 0) {
      log("Nichts zu tun — alles aktuell.");
    } else if (dryRun) {
      log(`${changes} Änderung(en) ausstehend. Mit --apply ausführen, um sie zu schreiben.`);
    } else {
      log(`${changes} Änderung(en) geschrieben.`);
    }
  })
  .catch((e) => {
    console.error("Error:", e);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
