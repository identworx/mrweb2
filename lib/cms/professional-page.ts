import "server-only";
import { getIconSlots, type ResolvedIcon } from "@/lib/cms/icons";
import {
  PROFESSIONAL_ICON_KEYS,
  SERVICE_SECTION_ICON_KEYS,
} from "@/lib/cms/icon-key-map";
import {
  resolveMediaIds,
  type FrontendServiceSection,
  type ResolvedMedia,
  type ServicePageResult,
} from "@/lib/cms/service-pages";
import { isHelperSection } from "@/lib/admin/page-section-schemas";
import { localizedHref } from "@/lib/i18n/routes";
import type { ProfessionalCopy } from "@/lib/mosaroma/professional-copy";

/* ── Data helpers shared by /professional and /en/professional ── */

export type RawItem = Record<string, unknown>;

/** Section style keys of the Professional helper sections. */
export const PROFESSIONAL_STYLES = {
  hero: "professional-hero",
  applications: "professional-applications",
  materials: "professional-materials",
  service: "professional-service",
  cta: "professional-cta",
} as const;

export function cmsItems(settings: Record<string, unknown> | undefined): RawItem[] {
  const items = settings?.items;
  if (!Array.isArray(items)) return [];
  return items.filter(
    (it): it is RawItem => typeof it === "object" && it !== null && !Array.isArray(it),
  );
}

export function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** CMS-HTML hat Vorrang, sonst Plaintext aus der Copy. Leer → nichts. */
export type BodyContent = { html: string } | { text: string } | null;

export function bodyContent(cmsHtml: string | null | undefined, fallback: string): BodyContent {
  const html = (cmsHtml ?? "").trim();
  if (html) return { html };
  const text = fallback.trim();
  return text ? { text } : null;
}

/** Active section with the given settings.style — only if the page is published. */
export function findSection(
  result: ServicePageResult,
  style: string,
): FrontendServiceSection | null {
  if (result.state !== "published") return null;
  return result.page.sections.find((s) => s.settings?.style === style) ?? null;
}

/** Additional (non-helper) CMS sections rendered between Service and CTA. */
export function contentSectionsOf(result: ServicePageResult): FrontendServiceSection[] {
  if (result.state !== "published") return [];
  return result.page.sections.filter((s) => !isHelperSection(s.settings ?? {}));
}

/**
 * EN text precedence: translation → (DE text unchanged from DE copy ? EN copy : DE text).
 * `deText` is the text the DE page shows (CMS value or DE copy fallback).
 */
export function enText(
  translation: string | undefined,
  deText: string,
  copyDeText: string | undefined,
  copyEnText: string | undefined,
): string {
  if (translation) return translation;
  if (copyDeText !== undefined && deText.trim() === copyDeText.trim()) return copyEnText ?? deText;
  return deText;
}

/** Same rule as `enText`, for section content (CMS-HTML vs. plain-text copy). */
export function enBodyContent(
  translation: string | undefined,
  cmsDeHtml: string | null | undefined,
  copyDeText: string,
  copyEnText: string,
): BodyContent {
  if (translation?.trim()) return { html: translation.trim() };
  const de = (cmsDeHtml ?? "").trim();
  if (de && de !== copyDeText.trim()) return { html: de };
  return bodyContent(null, copyEnText);
}

const EN_ANCHORS: Record<string, string> = {
  "#anwendungen": "#applications",
  "#materialien": "#materials",
  "#kontakt": "#contact",
};

function enAnchor(hash: string): string {
  return EN_ANCHORS[hash] ?? hash;
}

/** Localise internal CMS hrefs (DE paths/anchors) for EN; external and EN links stay untouched. */
export function enHref(href: string | null | undefined): string | null {
  const h = (href ?? "").trim();
  if (!h) return null;
  if (h.startsWith("#")) return enAnchor(h);
  if (!h.startsWith("/") || h.startsWith("//")) return h;
  if (h === "/en" || h.startsWith("/en/") || h.startsWith("/en#")) return h;
  const hashIndex = h.indexOf("#");
  const path = hashIndex >= 0 ? h.slice(0, hashIndex) : h;
  const hash = hashIndex >= 0 ? h.slice(hashIndex) : "";
  return localizedHref(path || "/", "en") + (hash ? enAnchor(hash) : "");
}

/**
 * Card items as the DE page shows them: CMS items (missing texts filled from the
 * DE copy by position) or, if the section has no items, the DE copy defaults.
 */
export function professionalDeItems(
  sections: {
    applications: FrontendServiceSection | null;
    materials: FrontendServiceSection | null;
    service: FrontendServiceSection | null;
  },
  copy: ProfessionalCopy,
) {
  const cmsApps = cmsItems(sections.applications?.settings);
  const applications =
    cmsApps.length > 0
      ? cmsApps.map((it, i) => ({
          title: str(it.title) || copy.applications.items[i]?.title || "",
          imageId: str(it.imageId) || null,
        }))
      : copy.applications.items.map((it) => ({ title: it.title, imageId: null as string | null }));

  const cmsMaterials = cmsItems(sections.materials?.settings);
  const materials =
    cmsMaterials.length > 0
      ? cmsMaterials.map((it, i) => ({
          title: str(it.title) || copy.materials.items[i]?.title || "",
          description: str(it.description) || copy.materials.items[i]?.description || "",
          imageId: str(it.imageId) || null,
        }))
      : copy.materials.items.map((it) => ({ ...it, imageId: null as string | null }));

  const cmsService = cmsItems(sections.service?.settings);
  const service =
    cmsService.length > 0
      ? cmsService.map((it, i) => ({
          title: str(it.title) || copy.service.items[i]?.title || "",
          iconKey: str(it.iconKey) || copy.service.items[i]?.iconKey || "",
          iconImageId: str(it.iconImageId) || null,
        }))
      : copy.service.items.map((it) => ({ ...it, iconImageId: null as string | null }));

  return { applications, materials, service };
}

export interface ResolvedButton {
  label: string;
  href: string;
}

function buttonOrNull(label: string, href: string | null): ResolvedButton | null {
  return label && href ? { label, href } : null;
}

/**
 * DE button: if the CMS section exists its values apply verbatim (empty label
 * or link → no button); only a missing section falls back to the copy.
 */
export function deButton(
  section: FrontendServiceSection | null,
  copy: { buttonLabel: string; buttonHref: string },
): ResolvedButton | null {
  if (!section) return buttonOrNull(copy.buttonLabel, copy.buttonHref);
  return buttonOrNull(str(section.buttonLabel), str(section.buttonHref));
}

/** EN button: same rule as `deButton`; label via translation/copy precedence, href via `enHref`. */
export function enButton(
  section: FrontendServiceSection | null,
  translatedLabel: string | undefined,
  copyDe: { buttonLabel: string },
  copyEn: { buttonLabel: string; buttonHref: string },
): ResolvedButton | null {
  if (!section) return buttonOrNull(copyEn.buttonLabel, copyEn.buttonHref);
  const deLabel = str(section.buttonLabel);
  const deHref = str(section.buttonHref);
  if (!deLabel || !deHref) return null;
  return buttonOrNull(
    translatedLabel || (deLabel === copyDe.buttonLabel ? copyEn.buttonLabel : deLabel),
    enHref(deHref),
  );
}

/** Icons + item media for the Professional page in one parallel round-trip. */
export async function loadProfessionalAssets(input: {
  appImageIds: (string | null)[];
  materialImageIds: (string | null)[];
  serviceIconImageIds: (string | null)[];
  serviceIconKeys: string[];
}): Promise<{
  icons: Record<string, ResolvedIcon>;
  appImages: Record<string, ResolvedMedia>;
  materialImages: Record<string, ResolvedMedia>;
  serviceIconImages: Record<string, ResolvedMedia>;
}> {
  const [icons, appImages, materialImages, serviceIconImages] = await Promise.all([
    getIconSlots(
      Array.from(
        new Set<string>([
          ...SERVICE_SECTION_ICON_KEYS,
          ...PROFESSIONAL_ICON_KEYS,
          ...input.serviceIconKeys.filter(Boolean),
        ]),
      ),
    ),
    resolveMediaIds(input.appImageIds),
    resolveMediaIds(input.materialImageIds),
    resolveMediaIds(input.serviceIconImageIds),
  ]);
  return { icons, appImages, materialImages, serviceIconImages };
}

export function mediaFor(
  map: Record<string, ResolvedMedia>,
  id: string | null,
): ResolvedMedia | null {
  return id ? map[id] ?? null : null;
}
