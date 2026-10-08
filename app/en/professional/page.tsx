import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfessionalPageView from "@/components/professional/ProfessionalPageView";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug, getSectionImage } from "@/lib/cms/service-pages";
import { resolveSectionBackground } from "@/lib/cms/section-background";
import {
  PROFESSIONAL_STYLES as STYLES,
  contentSectionsOf,
  downloadFor,
  enBodyContent,
  enButton,
  enText,
  findSection,
  loadProfessionalAssets,
  mediaFor,
  professionalDeItems,
  str,
} from "@/lib/cms/professional-page";
import {
  professionalCopyDe as copyDe,
  professionalCopyEn as copy,
} from "@/lib/mosaroma/professional-copy";
import { getTranslations } from "@/lib/i18n/get-translation";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, seoT] = await Promise.all([
    getPageHeroData("professional", "professional", "en"),
    getTranslations("page", "professional", "en"),
  ]);
  return {
    title: seoT.seoTitle || hero.seoTitle || copy.seo.title,
    description: seoT.seoDescription || hero.seoDescription || copy.seo.description,
  };
}

export default async function ProfessionalPageEn() {
  if (!(await isPublicPathEnabled("/professional"))) notFound();

  const [layout, hero, result, heroImage, ctaImage, heroT, appsT, materialsT, serviceT, ctaT] =
    await Promise.all([
      getPublicLayoutData("en"),
      getPageHeroData("professional", "professional", "en"),
      getServicePageBySlug("professional"),
      getSectionImage("professional", STYLES.hero),
      getSectionImage("professional", STYLES.cta),
      getTranslations("pageSection", STYLES.hero, "en"),
      getTranslations("pageSection", STYLES.applications, "en"),
      getTranslations("pageSection", STYLES.materials, "en"),
      getTranslations("pageSection", STYLES.service, "en"),
      getTranslations("pageSection", STYLES.cta, "en"),
    ]);

  const heroData = findSection(result, STYLES.hero);
  const appsData = findSection(result, STYLES.applications);
  const materialsData = findSection(result, STYLES.materials);
  const serviceData = findSection(result, STYLES.service);
  const ctaData = findSection(result, STYLES.cta);

  /* Items: count/images/icons from CMS (DE); texts: translation → (DE unchanged ? EN copy : DE) */
  const deItems = professionalDeItems(
    { applications: appsData, materials: materialsData, service: serviceData },
    copyDe,
  );
  const appItems = deItems.applications.map((it, i) => ({
    ...it,
    title: enText(
      appsT[`item.${i + 1}.title`],
      it.title,
      copyDe.applications.items[i]?.title,
      copy.applications.items[i]?.title,
    ),
    recommendation: enText(
      appsT[`item.${i + 1}.recommendation`],
      it.recommendation,
      copyDe.applications.items[i]?.recommendation,
      copy.applications.items[i]?.recommendation,
    ),
  }));
  const materialItems = deItems.materials.map((it, i) => ({
    ...it,
    title: enText(
      materialsT[`item.${i + 1}.title`],
      it.title,
      copyDe.materials.items[i]?.title,
      copy.materials.items[i]?.title,
    ),
    subtitle: enText(
      materialsT[`item.${i + 1}.subtitle`],
      it.subtitle,
      copyDe.materials.items[i]?.subtitle,
      copy.materials.items[i]?.subtitle,
    ),
    description: enText(
      materialsT[`item.${i + 1}.description`],
      it.description,
      copyDe.materials.items[i]?.description,
      copy.materials.items[i]?.description,
    ),
    /* No copy defaults for specs: translation || DE value */
    specs: it.specs.map((spec, j) => ({
      label: materialsT[`item.${i + 1}.spec.${j + 1}.label`] || spec.label,
      value: materialsT[`item.${i + 1}.spec.${j + 1}.value`] || spec.value,
    })),
  }));
  const serviceItems = deItems.service.map((it, i) => ({
    ...it,
    title: enText(
      serviceT[`item.${i + 1}.title`],
      it.title,
      copyDe.service.items[i]?.title,
      copy.service.items[i]?.title,
    ),
    detail: enText(
      serviceT[`item.${i + 1}.detail`],
      it.detail,
      copyDe.service.items[i]?.detail,
      copy.service.items[i]?.detail,
    ),
  }));

  const { icons, appImages, materialImages, materialDownloads, serviceIconImages } = await loadProfessionalAssets({
    appImageIds: appItems.map((a) => a.imageId),
    materialImageIds: materialItems.map((m) => m.imageId),
    materialDownloadIds: materialItems.map((m) => m.downloadId),
    serviceIconImageIds: serviceItems.map((s) => s.iconImageId),
    serviceIconKeys: serviceItems.map((s) => s.iconKey),
  });

  /** Section-level text: DE value as the DE page shows it, then EN precedence. */
  const sectionText = (
    t: Record<string, string>,
    field: "title",
    cmsValue: string | null | undefined,
    deCopy: string,
    enCopy: string,
  ) => enText(t[field], cmsValue || deCopy, deCopy, enCopy);

  return (
    <ProfessionalPageView
      locale="en"
      layout={layout}
      icons={icons}
      hero={{
        eyebrow: hero.eyebrow || copy.hero.eyebrow,
        title: hero.title || copy.hero.title,
        description: hero.description || copy.hero.description,
        image: hero.image && !hero.image.includes("placeholder") ? hero.image : null,
        alt: hero.alt,
        videoUrl: str(heroData?.settings?.videoUrl) || null,
        posterUrl: heroImage?.url || null,
        button: enButton(heroData, heroT.buttonLabel, copyDe.hero, copy.hero),
      }}
      applications={{
        background: resolveSectionBackground(appsData?.settings?.background, "white"),
        title: sectionText(appsT, "title", appsData?.title, copyDe.applications.title, copy.applications.title),
        content: enBodyContent(appsT.content, appsData?.content, copyDe.applications.content, copy.applications.content),
        items: appItems.map((a) => ({
          title: a.title,
          recommendation: a.recommendation,
          image: mediaFor(appImages, a.imageId),
        })),
      }}
      materials={{
        background: resolveSectionBackground(materialsData?.settings?.background, "cream"),
        title: sectionText(materialsT, "title", materialsData?.title, copyDe.materials.title, copy.materials.title),
        content: enBodyContent(materialsT.content, materialsData?.content, copyDe.materials.content, copy.materials.content),
        datasheetLabel: materialsT.datasheetLabel || copy.materials.datasheetLabel,
        items: materialItems.map((m) => ({
          title: m.title,
          subtitle: m.subtitle,
          description: m.description,
          specs: m.specs,
          datasheet: downloadFor(materialDownloads, m.downloadId),
          image: mediaFor(materialImages, m.imageId),
        })),
      }}
      service={{
        background: resolveSectionBackground(serviceData?.settings?.background, "anthracite"),
        title: sectionText(serviceT, "title", serviceData?.title, copyDe.service.title, copy.service.title),
        items: serviceItems.map((s) => ({
          title: s.title,
          detail: s.detail,
          iconKey: s.iconKey,
          iconImage: mediaFor(serviceIconImages, s.iconImageId),
        })),
      }}
      contentSections={contentSectionsOf(result)}
      cta={{
        background: resolveSectionBackground(ctaData?.settings?.background, "white"),
        title: sectionText(ctaT, "title", ctaData?.title, copyDe.cta.title, copy.cta.title),
        subtitle: enText(
          ctaT.subtitle,
          str(ctaData?.settings?.subtitle) || copyDe.cta.subtitle,
          copyDe.cta.subtitle,
          copy.cta.subtitle,
        ),
        content: enBodyContent(ctaT.content, ctaData?.content, copyDe.cta.content, copy.cta.content),
        button: enButton(ctaData, ctaT.buttonLabel, copyDe.cta, copy.cta),
        image: ctaImage,
        contact: {
          phone: layout.footer.phone || layout.siteSettings.phone || null,
          email: layout.footer.email || layout.siteSettings.contactEmail || "info@mosaroma.de",
        },
      }}
    />
  );
}
