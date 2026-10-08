import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfessionalPageView from "@/components/professional/ProfessionalPageView";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug, getSectionImage } from "@/lib/cms/service-pages";
import { resolveSectionBackground } from "@/lib/cms/section-background";
import {
  PROFESSIONAL_STYLES as STYLES,
  bodyContent,
  contentSectionsOf,
  deButton,
  downloadFor,
  findSection,
  loadProfessionalAssets,
  mediaFor,
  professionalDeItems,
  str,
} from "@/lib/cms/professional-page";
import { professionalCopyDe as copy } from "@/lib/mosaroma/professional-copy";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("professional", "professional");
  return {
    title: hero.seoTitle || copy.seo.title,
    description: hero.seoDescription || copy.seo.description,
  };
}

export default async function ProfessionalPage() {
  if (!(await isPublicPathEnabled("/professional"))) notFound();

  const [layout, hero, result, heroImage, ctaImage] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("professional", "professional"),
    getServicePageBySlug("professional"),
    getSectionImage("professional", STYLES.hero),
    getSectionImage("professional", STYLES.cta),
  ]);

  const heroData = findSection(result, STYLES.hero);
  const appsData = findSection(result, STYLES.applications);
  const materialsData = findSection(result, STYLES.materials);
  const serviceData = findSection(result, STYLES.service);
  const ctaData = findSection(result, STYLES.cta);

  /* Items (CMS → Copy) */
  const {
    applications: appItems,
    materials: materialItems,
    service: serviceItems,
  } = professionalDeItems(
    { applications: appsData, materials: materialsData, service: serviceData },
    copy,
  );

  const { icons, appImages, materialImages, materialDownloads, serviceIconImages } = await loadProfessionalAssets({
    appImageIds: appItems.map((a) => a.imageId),
    materialImageIds: materialItems.map((m) => m.imageId),
    materialDownloadIds: materialItems.map((m) => m.downloadId),
    serviceIconImageIds: serviceItems.map((s) => s.iconImageId),
    serviceIconKeys: serviceItems.map((s) => s.iconKey),
  });

  return (
    <ProfessionalPageView
      locale="de"
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
        button: deButton(heroData, copy.hero),
      }}
      applications={{
        background: resolveSectionBackground(appsData?.settings?.background, "white"),
        title: appsData?.title || copy.applications.title,
        content: bodyContent(appsData?.content, copy.applications.content),
        items: appItems.map((a) => ({
          title: a.title,
          recommendation: a.recommendation,
          image: mediaFor(appImages, a.imageId),
        })),
      }}
      materials={{
        background: resolveSectionBackground(materialsData?.settings?.background, "cream"),
        title: materialsData?.title || copy.materials.title,
        content: bodyContent(materialsData?.content, copy.materials.content),
        datasheetLabel: copy.materials.datasheetLabel,
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
        title: serviceData?.title || copy.service.title,
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
        title: ctaData?.title || copy.cta.title,
        subtitle: str(ctaData?.settings?.subtitle) || copy.cta.subtitle,
        content: bodyContent(ctaData?.content, copy.cta.content),
        button: deButton(ctaData, copy.cta),
        image: ctaImage,
        contact: {
          phone: layout.footer.phone || layout.siteSettings.phone || null,
          email: layout.footer.email || layout.siteSettings.contactEmail || "info@mosaroma.de",
        },
      }}
    />
  );
}
