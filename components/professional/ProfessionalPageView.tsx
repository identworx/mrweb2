import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import HeroVideo from "@/components/HeroVideo";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import CmsIcon from "@/components/cms/CmsIcon";
import type { getPublicLayoutData } from "@/lib/cms/public-layout";
import type { ResolvedIcon } from "@/lib/cms/icons";
import type {
  FrontendServiceSection,
  ResolvedMedia,
  SectionImage,
} from "@/lib/cms/service-pages";
import type { ResolvedSectionBackground, SectionTone } from "@/lib/cms/section-background";
import type { BodyContent } from "@/lib/cms/professional-page";
import type { Locale } from "@/lib/i18n/config";

/* ── View-model ──────────────────────────────────────────── */

export type { BodyContent };

export interface ProfessionalButton {
  label: string;
  href: string;
}

export interface ProfessionalHeroView {
  eyebrow: string;
  title: string;
  description: string;
  /** Hero image from the page hero (null if missing/placeholder). */
  image: string | null;
  alt: string;
  videoUrl: string | null;
  posterUrl: string | null;
  button: ProfessionalButton | null;
}

export interface ProfessionalSectionView<Item> {
  background: ResolvedSectionBackground;
  title: string;
  content: BodyContent;
  items: Item[];
}

/** Service is a compact band: title rendered as label, no body text. */
export interface ProfessionalServiceView {
  background: ResolvedSectionBackground;
  title: string;
  items: ProfessionalServiceItem[];
}

export interface ProfessionalApplicationItem {
  title: string;
  image: ResolvedMedia | null;
}

export interface ProfessionalMaterialItem {
  title: string;
  description: string;
  image: ResolvedMedia | null;
}

export interface ProfessionalServiceItem {
  title: string;
  iconKey: string;
  iconImage: ResolvedMedia | null;
}

export interface ProfessionalCtaContact {
  phone: string | null;
  email: string | null;
}

export interface ProfessionalCtaView {
  background: ResolvedSectionBackground;
  title: string;
  subtitle: string;
  content: BodyContent;
  button: ProfessionalButton | null;
  image: SectionImage | null;
  contact: ProfessionalCtaContact;
}

export interface ProfessionalPageViewProps {
  locale: Locale;
  layout: Awaited<ReturnType<typeof getPublicLayoutData>>;
  hero: ProfessionalHeroView;
  applications: ProfessionalSectionView<ProfessionalApplicationItem>;
  materials: ProfessionalSectionView<ProfessionalMaterialItem>;
  service: ProfessionalServiceView;
  contentSections: FrontendServiceSection[];
  cta: ProfessionalCtaView;
  icons: Record<string, ResolvedIcon>;
}

/* ── Helpers ─────────────────────────────────────────────── */

const SECTION_IDS: Record<Locale, { applications: string; materials: string; service: string; contact: string }> = {
  de: { applications: "anwendungen", materials: "materialien", service: "service", contact: "kontakt" },
  en: { applications: "applications", materials: "materials", service: "service", contact: "contact" },
};

const TONE_CLASSES: Record<
  SectionTone,
  {
    label: string;
    heading: string;
    body: string;
    muted: string;
    strong: string;
    icon: string;
    link: string;
    divider: string;
  }
> = {
  light: {
    label: "text-text-muted",
    heading: "text-anthracite",
    body: "text-text-gray",
    muted: "text-text-muted",
    strong: "text-anthracite",
    icon: "text-pumpkin",
    link: "text-anthracite hover:text-pumpkin-accessible",
    divider: "border-anthracite/10",
  },
  dark: {
    label: "text-white/60",
    heading: "text-white",
    body: "text-white/70",
    muted: "text-white/55",
    strong: "text-white",
    icon: "text-white/70",
    link: "text-white/80 hover:text-white",
    divider: "border-white/10",
  },
};

/** Custom service icon images are tinted white on dark backgrounds, untouched on light ones. */
const SERVICE_ICON_IMAGE_CLASSES: Record<SectionTone, string> = {
  light: "w-10 h-10 object-contain",
  dark: "w-10 h-10 object-contain [filter:brightness(0)_invert(1)]",
};

/**
 * Keeps a suspended hyphen together with the following conjunction
 * ("Sonnen- und", "sun- and") so balanced headlines never end a line on "Sonnen-".
 */
function keepSuspendedHyphen(text: string): ReactNode {
  const parts = text.split(/(\S+- (?:und|oder|bis|and|or|to)(?=\s|$))/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function Body({ content, className }: { content: BodyContent; className: string }) {
  if (!content) return null;
  if ("html" in content) return <RichTextRenderer html={content.html} className={className} />;
  return <p className={className}>{content.text}</p>;
}

function SectionIntro({
  tone,
  title,
  content,
}: {
  tone: SectionTone;
  title: string;
  content: BodyContent;
}) {
  const t = TONE_CLASSES[tone];
  return (
    <div className="max-w-2xl">
      <div className="accent-line mb-5" />
      <h2
        className={`font-heading ${t.heading} text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15] [text-wrap:balance]`}
      >
        {title}
      </h2>
      <Body
        content={content}
        className={`font-body ${t.body} text-[0.9375rem] md:text-base leading-[1.7] mt-3 max-w-[48ch] [text-wrap:pretty]`}
      />
    </div>
  );
}

const TEAL_GRADIENTS = [
  "linear-gradient(135deg, #0C3D40, #145A5C)",
  "linear-gradient(135deg, #145A5C, #1B6B6D)",
  "linear-gradient(135deg, #1B6B6D, #2E8B8B)",
];

const MATERIAL_GRADIENTS = [
  "linear-gradient(135deg, #8B7355, #A0926B)",
  "linear-gradient(135deg, #444444, #666666)",
];

const PLACEHOLDER_PATTERN =
  "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px)";

function Placeholder({ gradient }: { gradient: string }) {
  return (
    <div className="absolute inset-0" style={{ background: gradient }} aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundImage: PLACEHOLDER_PATTERN }} />
    </div>
  );
}

/* ── View ────────────────────────────────────────────────── */

export default function ProfessionalPageView({
  locale,
  layout,
  hero,
  applications: apps,
  materials,
  service,
  contentSections,
  cta,
  icons,
}: ProfessionalPageViewProps) {
  const ids = SECTION_IDS[locale];
  const appsT = TONE_CLASSES[apps.background.tone];
  const materialsT = TONE_CLASSES[materials.background.tone];
  const serviceT = TONE_CLASSES[service.background.tone];
  const ctaT = TONE_CLASSES[cta.background.tone];
  const ctaButtonClass = cta.background.value === "pumpkin" ? "btn-outline-white" : "btn-primary";
  const serviceIconImageClass = SERVICE_ICON_IMAGE_CLASSES[service.background.tone];
  const serviceLabelId = `${ids.service}-label`;
  const hasContact = Boolean(cta.contact.phone || cta.contact.email);

  return (
    <>
      <Header {...layout.header} locale={locale} />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden h-[400px] md:h-[480px] flex items-end">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0C3D40 0%, #145A5C 40%, #1B6B6D 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(120deg, transparent, transparent 80px, rgba(255,255,255,0.015) 80px, rgba(255,255,255,0.015) 81px)",
            }}
          />
          {hero.videoUrl ? (
            <HeroVideo src={hero.videoUrl} poster={hero.posterUrl || hero.image || undefined} />
          ) : (
            hero.image && (
              <Image
                src={hero.image}
                alt={hero.alt}
                fill
                className="object-cover"
                sizes="100vw"
                preload
              />
            )
          )}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(12,61,64,0.6) 0%, transparent 100%)",
            }}
          />
          <div className="relative z-10 w-full pb-10 md:pb-14">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              {hero.eyebrow && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-px bg-pumpkin" />
                  <p className="font-accent text-white/80 text-[11px] tracking-[0.3em] uppercase">
                    {hero.eyebrow}
                  </p>
                </div>
              )}

              <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.08] max-w-[680px] [text-wrap:balance]">
                {keepSuspendedHyphen(hero.title)}
              </h1>

              {hero.description && (
                <p className="font-body text-white/70 text-[0.9375rem] leading-[1.6] mt-3.5 max-w-[440px]">
                  {hero.description}
                </p>
              )}

              {hero.button && (
                <div className="mt-7">
                  <Link href={hero.button.href} className="btn-primary">
                    {hero.button.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <BreadcrumbBar items={[{ label: "Professional" }]} locale={locale} />

        {/* Anwendungen / Applications */}
        <section id={ids.applications} className={`py-20 lg:py-28 ${apps.background.className}`}>
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <SectionIntro
              tone={apps.background.tone}
              title={apps.title}
              content={apps.content}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 sm:gap-3 mt-8 md:mt-10">
              {apps.items.map((app, i) => (
                <ScrollReveal key={`${app.title}-${i}`} delay={i * 80}>
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {app.image ? (
                      <Image
                        src={app.image.url}
                        alt={app.image.alt || app.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1400px) 33vw, 450px"
                      />
                    ) : (
                      <Placeholder gradient={TEAL_GRADIENTS[i % TEAL_GRADIENTS.length]} />
                    )}
                  </div>
                  <h3 className={`font-heading ${appsT.strong} text-[0.9375rem] md:text-base font-bold mt-3`}>
                    {app.title}
                  </h3>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Materialien / Materials */}
        <section id={ids.materials} className={`py-20 lg:py-28 ${materials.background.className}`}>
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <SectionIntro
              tone={materials.background.tone}
              title={materials.title}
              content={materials.content}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 sm:gap-4 mt-8 md:mt-10">
              {materials.items.map((m, i) => (
                <ScrollReveal key={`${m.title}-${i}`} delay={i * 80}>
                  <div className="relative w-full aspect-[3/2] overflow-hidden">
                    {m.image ? (
                      <Image
                        src={m.image.url}
                        alt={m.image.alt || m.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 680px"
                      />
                    ) : (
                      <Placeholder gradient={MATERIAL_GRADIENTS[i % MATERIAL_GRADIENTS.length]} />
                    )}
                  </div>
                  <div className="pt-3.5 px-0.5">
                    <h3 className={`font-heading ${materialsT.strong} text-[0.9375rem] md:text-base font-bold`}>
                      {m.title}
                    </h3>
                    {m.description && (
                      <p className={`font-body ${materialsT.muted} text-[0.875rem] leading-[1.6] mt-1 max-w-[52ch]`}>
                        {m.description}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Service — kompaktes Band / compact band */}
        <section id={ids.service} className={service.background.className}>
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className={`border-t ${serviceT.divider} py-12 md:py-14`}>
              {service.title && (
                <p
                  id={serviceLabelId}
                  className={`font-accent ${serviceT.label} text-sm tracking-[0.12em] mb-6`}
                >
                  {service.title}
                </p>
              )}
              <ul
                aria-labelledby={service.title ? serviceLabelId : undefined}
                className="grid sm:grid-cols-3 gap-6 list-none p-0"
              >
                {service.items.map((s, i) => (
                  <li key={`${s.title}-${i}`}>
                    <ScrollReveal delay={i * 80}>
                      <div className="flex items-center gap-4">
                        <span className={`flex-shrink-0 w-10 h-10 ${serviceT.icon}`}>
                          {s.iconImage ? (
                            <Image
                              src={s.iconImage.url}
                              alt=""
                              width={40}
                              height={40}
                              className={serviceIconImageClass}
                            />
                          ) : (
                            <CmsIcon
                              icon={icons[s.iconKey]}
                              width={40}
                              height={40}
                              className={serviceT.icon}
                            />
                          )}
                        </span>
                        <span className={`font-body ${serviceT.strong} text-[0.9375rem] font-medium leading-[1.45]`}>
                          {s.title}
                        </span>
                      </div>
                    </ScrollReveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Zusätzliche CMS-Sektionen / Additional CMS sections */}
        {contentSections.map((section, i) => (
          <ServiceSectionRenderer
            key={section.id}
            section={section}
            background={i % 2 === 0 ? "white" : "cream"}
            icons={icons}
            locale={locale}
          />
        ))}

        {/* Kontakt / Contact (CTA) */}
        <section id={ids.contact} className={cta.background.className}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[340px]">
            <div className="flex flex-col justify-center px-5 py-14 md:py-16 md:pr-10 md:pl-[max(2.5rem,calc((100vw_-_1400px)/2_+_2.5rem))]">
              <div className="max-w-[560px]">
                <div className="accent-line mb-5" />
                <h2
                  className={`font-heading ${ctaT.heading} text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15] [text-wrap:balance]`}
                >
                  {cta.title}
                </h2>
                {cta.subtitle && (
                  <p className={`font-heading ${ctaT.body} text-[0.9375rem] font-semibold mt-1.5`}>
                    {cta.subtitle}
                  </p>
                )}
                <Body
                  content={cta.content}
                  className={`font-body ${ctaT.muted} text-[0.9375rem] leading-[1.6] mt-3`}
                />
                {cta.button && (
                  <div className="mt-6">
                    <Link href={cta.button.href} className={ctaButtonClass}>
                      {cta.button.label}
                    </Link>
                  </div>
                )}
                {hasContact && (
                  <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-body text-[0.9375rem]">
                    {cta.contact.phone && (
                      <a
                        href={`tel:${cta.contact.phone.replace(/[^\d+]/g, "")}`}
                        className={`${ctaT.link} transition-colors`}
                      >
                        {cta.contact.phone}
                      </a>
                    )}
                    {cta.contact.email && (
                      <a href={`mailto:${cta.contact.email}`} className={`${ctaT.link} transition-colors`}>
                        {cta.contact.email}
                      </a>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="relative min-h-[260px] overflow-hidden">
              {cta.image ? (
                <Image
                  src={cta.image.url}
                  alt={cta.image.alt || cta.subtitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <Placeholder gradient={MATERIAL_GRADIENTS[0]} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} locale={locale} />
    </>
  );
}
