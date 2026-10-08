/**
 * Backfill Page + PageSection helpers for the Mosaroma Professional page at /pro.
 *
 * Target structure (all sections helper sections on page slug "professional"):
 *   1. professional-hero          — video URL, poster image, hero button
 *   2. professional-applications  — application cards (title + recommendation + image)
 *   3. professional-materials     — material cards (title + subtitle + description +
 *                                   specs + datasheet downloadId + image)
 *   4. professional-service       — service items (title + detail + icon)
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
 *   - Stage 2 item keys (recommendation / subtitle / detail / specs / downloadId)
 *     are only added when missing on an existing item (texts and specs from the
 *     copy by index, downloadId = null); the number of items is never changed.
 *   - Item texts (applications: recommendation; materials: title / subtitle /
 *     description) are replaced by the current copy only when they still exactly
 *     equal a previous copy default (OLD_ITEM_TEXTS); manual edits are kept.
 *   - Material specs: a missing or empty `specs` array is filled with the copy
 *     specs (by index); non-empty arrays are never touched.
 *   - Existing translatedText is never overwritten (unless it still equals a known
 *     old default); a changed sourceText marks the entry STALE — except when the
 *     translatedText still equals a previous EN copy value (PREVIOUS_EN_COPY): then
 *     it is replaced by the new EN copy and the status is kept.
 *   - Spec translations (item.N.spec.M.label / .value) are seeded PUBLISHED with
 *     the EN copy when the DE value equals the DE copy, otherwise DRAFT with the
 *     DE text (editors translate them in the translation UI).
 *   - settings.background is only changed when missing or still equal to an old
 *     default (OLD_BACKGROUNDS).
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
    title: ["Kontakt & Standort", "Ihr Ansprechpartner in Oyten"],
    content: [
      "Wir freuen uns auf Ihre Anfrage — ob Projektberatung, Bemusterung oder technische Fragen.",
    ],
  },
};

/** Old default backgrounds that may be replaced by the current target background. */
const OLD_BACKGROUNDS: Record<string, string[]> = {
  "professional-service": ["cream"],
  "professional-cta": ["anthracite"],
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

/**
 * Previous EN copy values, keyed by `entityType/entityId/fieldName`. When the DE
 * sourceText changes and the stored translation still equals one of these values,
 * it was never edited manually and is replaced by the current EN copy (status kept).
 */
const PREVIOUS_EN_COPY: Record<string, string[]> = {
  "pageSection/professional-cta/title": ["Your Contact in Oyten"],
  // Applications: recommendations before the official material names
  "pageSection/professional-applications/item.1.recommendation": ["Recommended: SDP"],
  "pageSection/professional-applications/item.2.recommendation": ["Recommended: SDP or Topgun"],
  "pageSection/professional-applications/item.3.recommendation": ["Recommended: SDP or Topgun"],
  // Materials: texts before the official customer material texts
  "pageSection/professional-materials/item.1.title": ["SDP | Solution-Dyed Polyester"],
  "pageSection/professional-materials/item.1.subtitle": ["Spun-dyed polyester"],
  "pageSection/professional-materials/item.1.description": [
    "High tear strength, dimensionally stable and UV-resistant. Well suited to shade sails and awnings.",
  ],
  "pageSection/professional-materials/item.2.title": ["Topgun | Solution-Dyed Olefin"],
  "pageSection/professional-materials/item.2.subtitle": ["Spun-dyed polypropylene"],
  "pageSection/professional-materials/item.2.description": [
    "Very light, colourfast, water-repellent and quick-drying. Well suited to parasols and furniture.",
  ],
};

/**
 * Previous DE copy defaults of item texts, per section style and item index.
 * A stored item text that still exactly equals one of these is replaced by the
 * current DE copy; anything else counts as a manual edit and is kept.
 */
const OLD_ITEM_TEXTS: Record<string, Record<string, string[]>[]> = {
  "professional-applications": [
    { recommendation: ["Empfohlen: SDP"] },
    { recommendation: ["Empfohlen: SDP oder Topgun"] },
    { recommendation: ["Empfohlen: SDP oder Topgun"] },
  ],
  "professional-materials": [
    {
      title: ["SDP | Solution-Dyed Polyester"],
      subtitle: ["Spinndüsengefärbtes Polyester"],
      description: ["Hohe Reißfestigkeit, formstabil und UV-stabil. Geeignet für Sonnensegel und Markisen."],
    },
    {
      title: ["Topgun | Solution-Dyed Olefin"],
      subtitle: ["Spinndüsengefärbtes Polypropylen"],
      description: [
        "Sehr leicht, farbecht, wasserabweisend und schnell trocknend. Geeignet für Schirme und Möbel.",
      ],
    },
  ],
};

/** Current DE copy item texts for the fields covered by OLD_ITEM_TEXTS. */
function currentItemText(style: string, index: number, field: string): string | undefined {
  const items: readonly Record<string, unknown>[] =
    style === "professional-applications"
      ? de.applications.items
      : style === "professional-materials"
        ? de.materials.items
        : [];
  const value = items[index]?.[field];
  return typeof value === "string" ? value : undefined;
}

function copySpecsDe(index: number): { label: string; value: string }[] {
  return (de.materials.items[index]?.specs ?? []).map((spec) => ({ ...spec }));
}

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
      items: de.applications.items.map((i) => ({
        title: i.title,
        recommendation: i.recommendation,
        imageId: null,
      })),
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
        subtitle: i.subtitle,
        description: i.description,
        specs: i.specs.map((spec) => ({ ...spec })),
        downloadId: null,
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
        detail: i.detail,
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
      background: "white",
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
  /** Status for newly created entries (default PUBLISHED). */
  createStatus?: string;
  /** Copy text was removed: only clears an existing unedited translation, never creates one. */
  clearOnly?: boolean;
}

interface MaterialSpecSource {
  /** 1-based item index */
  item: number;
  /** 1-based spec index */
  spec: number;
  label: string;
  value: string;
}

/**
 * @param materialSpecs DE spec values currently stored in the materials section.
 *   A label/value that equals the DE copy is seeded PUBLISHED with the EN copy;
 *   anything else is seeded as DRAFT with the DE text (editors translate it in the
 *   translation UI). Only specs with a value are seeded.
 */
function buildTranslations(materialSpecs: MaterialSpecSource[] = []): TranslationEntry[] {
  const out: TranslationEntry[] = [];
  const add = (
    entityType: string,
    entityId: string,
    fieldName: string,
    src: string,
    tr: string,
    createStatus?: string,
  ) => {
    if (!src && !tr) {
      out.push({ entityType, entityId, fieldName, sourceText: "", translatedText: "", clearOnly: true });
      return;
    }
    if (!src || !tr) return;
    out.push({ entityType, entityId, fieldName, sourceText: src, translatedText: tr, createStatus });
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
    ps(
      "professional-applications",
      `item.${i + 1}.recommendation`,
      item.recommendation,
      en.applications.items[i]?.recommendation ?? "",
    );
  });

  // Materials
  ps("professional-materials", "eyebrow", de.materials.eyebrow, en.materials.eyebrow);
  ps("professional-materials", "title", de.materials.title, en.materials.title);
  ps("professional-materials", "content", de.materials.content, en.materials.content);
  ps("professional-materials", "datasheetLabel", de.materials.datasheetLabel, en.materials.datasheetLabel);
  de.materials.items.forEach((item, i) => {
    ps("professional-materials", `item.${i + 1}.title`, item.title, en.materials.items[i]?.title ?? "");
    ps(
      "professional-materials",
      `item.${i + 1}.subtitle`,
      item.subtitle,
      en.materials.items[i]?.subtitle ?? "",
    );
    ps(
      "professional-materials",
      `item.${i + 1}.description`,
      item.description,
      en.materials.items[i]?.description ?? "",
    );
  });
  for (const spec of materialSpecs) {
    const base = `item.${spec.item}.spec.${spec.spec}`;
    const copyDeSpec = de.materials.items[spec.item - 1]?.specs[spec.spec - 1];
    const copyEnSpec = en.materials.items[spec.item - 1]?.specs[spec.spec - 1];
    for (const field of ["label", "value"] as const) {
      const src = spec[field];
      const enCopy = copyEnSpec?.[field];
      if (copyDeSpec && src === copyDeSpec[field] && enCopy) {
        add("pageSection", "professional-materials", `${base}.${field}`, src, enCopy);
      } else {
        add("pageSection", "professional-materials", `${base}.${field}`, src, src, "DRAFT");
      }
    }
  }

  // Service
  ps("professional-service", "eyebrow", de.service.eyebrow, en.service.eyebrow);
  ps("professional-service", "title", de.service.title, en.service.title);
  ps("professional-service", "content", de.service.content, en.service.content);
  de.service.items.forEach((item, i) => {
    ps("professional-service", `item.${i + 1}.title`, item.title, en.service.items[i]?.title ?? "");
    ps("professional-service", `item.${i + 1}.detail`, item.detail, en.service.items[i]?.detail ?? "");
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

  // Navigation label of the menu item pointing to this page (fieldName = DE label)
  add("navigation", "", "Sonnenschutzstoffe", "Sonnenschutzstoffe", "Shade Fabrics");

  // Page SEO
  add("page", "professional", "seoTitle", de.seo.title, en.seo.title);
  add("page", "professional", "seoDescription", de.seo.description, en.seo.description);

  return out;
}

async function upsertTranslations(materialSpecs: MaterialSpecSource[] = []) {
  log("\n── Translations (EN) ─────────────────────────────────────────");
  const entries = buildTranslations(materialSpecs);
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

    if (!existing && entry.clearOnly) continue;

    if (!existing) {
      const { createStatus, clearOnly: _clearOnly, ...data } = entry;
      const status = createStatus ?? "PUBLISHED";
      action(`CREATE ${id} = ${short(entry.translatedText)}${status !== "PUBLISHED" ? ` (${status})` : ""}`);
      if (!dryRun) {
        await prisma.contentTranslation.create({
          data: { ...data, locale: "en", status },
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

    const previousEn = PREVIOUS_EN_COPY[id] ?? [];
    if (
      existing.sourceText !== entry.sourceText &&
      previousEn.includes(existing.translatedText.trim()) &&
      existing.translatedText !== entry.translatedText
    ) {
      action(
        `REPLACE unedited translation ${id}: ${short(existing.translatedText)} → ${short(entry.translatedText)} (status ${existing.status} kept)`,
      );
      if (!dryRun) {
        await prisma.contentTranslation.update({
          where: { id: existing.id },
          data: { sourceText: entry.sourceText, translatedText: entry.translatedText },
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

/** Stage 2 keys per item index (texts from the DE copy by index, empty when beyond the copy). */
const STAGE2_ITEM_DEFAULTS: Record<string, (index: number) => Record<string, unknown>> = {
  "professional-applications": (i) => ({
    recommendation: de.applications.items[i]?.recommendation ?? "",
  }),
  "professional-materials": (i) => ({
    subtitle: de.materials.items[i]?.subtitle ?? "",
    specs: copySpecsDe(i),
    downloadId: null,
  }),
  "professional-service": (i) => ({
    detail: de.service.items[i]?.detail ?? "",
  }),
};

/** DE spec label/value pairs with a non-empty value (1-based indices). */
function collectMaterialSpecs(items: unknown): MaterialSpecSource[] {
  if (!Array.isArray(items)) return [];
  const out: MaterialSpecSource[] = [];
  items.forEach((it, i) => {
    const specs = getSettings(it).specs;
    if (!Array.isArray(specs)) return;
    specs.forEach((spec, j) => {
      const s = getSettings(spec);
      const label = typeof s.label === "string" ? s.label.trim() : "";
      const value = typeof s.value === "string" ? s.value.trim() : "";
      if (!value) return;
      out.push({ item: i + 1, spec: j + 1, label, value });
    });
  });
  return out;
}

let materialSpecs: MaterialSpecSource[] = [];

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
      if (target.style === "professional-materials") {
        materialSpecs = collectMaterialSpecs(target.settings.items);
      }
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
    if (target.style !== "professional-hero") {
      if (isBlank(settings.background)) {
        setSetting("background", target.settings.background, `= ${short(target.settings.background)} (missing)`);
      } else if (
        settings.background !== target.settings.background &&
        isReplaceable(settings.background, OLD_BACKGROUNDS[target.style] ?? [])
      ) {
        setSetting(
          "background",
          target.settings.background,
          `: ${short(settings.background)} → ${short(target.settings.background)} (old default)`,
        );
      }
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
              recommendation: item.recommendation,
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

    // Stage 2: add missing item keys (never overwrite, never change item count)
    const stage2 = STAGE2_ITEM_DEFAULTS[target.style];
    if (stage2 && Array.isArray(settings.items) && settings.items !== target.settings.items) {
      const items = settings.items as unknown[];
      let itemsChanged = false;
      const nextItems = items.map((it, i) => {
        if (typeof it !== "object" || it === null || Array.isArray(it)) return it;
        const item = it as Record<string, unknown>;
        const defaults = stage2(i);
        const missing = Object.keys(defaults).filter((key) => !(key in item));
        if (missing.length === 0) return it;
        itemsChanged = true;
        for (const key of missing) {
          const shown = key === "specs" ? `${(defaults[key] as unknown[]).length} copy spec(s)` : short(defaults[key]);
          action(`settings.items[${i}].${key} = ${shown} (missing)`);
        }
        const added = Object.fromEntries(missing.map((key) => [key, defaults[key]]));
        return { ...item, ...added };
      });
      if (itemsChanged) {
        settings.items = nextItems;
        settingsChanged = true;
      }
    }

    // Item texts: replace only values that still equal a previous copy default
    const oldItemTexts = OLD_ITEM_TEXTS[target.style];
    if (oldItemTexts && Array.isArray(settings.items) && settings.items !== target.settings.items) {
      const items = settings.items as unknown[];
      let itemsChanged = false;
      const nextItems = items.map((it, i) => {
        if (typeof it !== "object" || it === null || Array.isArray(it)) return it;
        const item = { ...(it as Record<string, unknown>) };
        let changed = false;
        for (const [field, oldValues] of Object.entries(oldItemTexts[i] ?? {})) {
          const next = currentItemText(target.style, i, field);
          const current = item[field];
          if (next === undefined || typeof current !== "string" || current === next) continue;
          if (oldValues.includes(current.trim())) {
            action(`settings.items[${i}].${field}: ${short(current)} → ${short(next)} (old default)`);
            item[field] = next;
            changed = true;
          } else {
            log(`  keep items[${i}].${field} (manually edited): ${short(current)}`);
          }
        }
        if (!changed) return it;
        itemsChanged = true;
        return item;
      });
      if (itemsChanged) {
        settings.items = nextItems;
        settingsChanged = true;
      }
    }

    // Material specs: fill missing / empty arrays from the copy; non-empty arrays stay
    if (
      target.style === "professional-materials" &&
      Array.isArray(settings.items) &&
      settings.items !== target.settings.items
    ) {
      const items = settings.items as unknown[];
      let itemsChanged = false;
      const nextItems = items.map((it, i) => {
        if (typeof it !== "object" || it === null || Array.isArray(it)) return it;
        const item = it as Record<string, unknown>;
        const specs = item.specs;
        // An empty array on an item whose title was edited counts as deliberately cleared.
        const untouched = item.title === de.materials.items[i]?.title;
        const isEmpty =
          specs === undefined || (Array.isArray(specs) && specs.length === 0 && untouched);
        const next = copySpecsDe(i);
        if (!isEmpty || next.length === 0) return it;
        itemsChanged = true;
        action(
          `settings.items[${i}].specs = ${next.map((s) => `${s.label}: ${s.value}`).join("; ")} (${specs === undefined ? "missing" : "empty"})`,
        );
        return { ...item, specs: next };
      });
      if (itemsChanged) {
        settings.items = nextItems;
        settingsChanged = true;
      }
    }

    if (target.style === "professional-materials") {
      materialSpecs = collectMaterialSpecs(settings.items);
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

  await upsertTranslations(materialSpecs);
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
