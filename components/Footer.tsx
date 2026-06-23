import Image from "next/image";
import Link from "next/link";
import { footerData } from "@/lib/mosaroma/footer";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import CookieSettingsButton from "@/components/consent/CookieSettingsButton";

export interface FooterNavColumn {
  title: string;
  links: { label: string; href: string; target?: string }[];
}

export interface FooterProps {
  description?: string | null;
  copyrightText?: string | null;
  logoUrl?: string | null;
  siteName?: string | null;
  columns?: FooterNavColumn[];
  legalLinks?: { label: string; href: string; target?: string }[];
  socialLinks?: { platform: string; url: string }[] | null;
  ctaEnabled?: boolean | null;
  ctaEyebrow?: string | null;
  ctaTitle?: string | null;
  ctaText?: string | null;
  ctaPrimaryLabel?: string | null;
  ctaPrimaryHref?: string | null;
  ctaSecondaryLabel?: string | null;
  ctaSecondaryHref?: string | null;
  contactTitle?: string | null;
  companyName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCity?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  contactButtonLabel?: string | null;
  contactButtonHref?: string | null;
  bottomNote?: string | null;
  icons?: Record<string, ResolvedIcon>;
}

const CTA_DEFAULTS = {
  eyebrow: "Beratung & Muster",
  title: "Unsicher bei Farbe, Material oder Format?",
  text: "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Formen und Sondermaßen beraten.",
  primaryLabel: "Muster anfordern",
  primaryHref: "/kontakt",
  secondaryLabel: "Kataloge ansehen",
  secondaryHref: "/kataloge",
};

const CONTACT_DEFAULTS = {
  title: "Kontakt",
  companyName: "Mosaroma Industries GmbH",
  addressLine1: "Rudolf-Diesel-Str. 11–13",
  postalCity: "28876 Oyten",
  country: "Deutschland",
  email: "info@mosaroma.de",
  buttonLabel: "Kontakt aufnehmen",
  buttonHref: "/kontakt",
};

export default function Footer({
  description,
  copyrightText,
  logoUrl,
  siteName,
  columns,
  legalLinks,
  socialLinks,
  ctaEnabled,
  ctaEyebrow,
  ctaTitle,
  ctaText,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  contactTitle,
  companyName,
  addressLine1,
  addressLine2,
  postalCity,
  country,
  email,
  phone,
  contactButtonLabel,
  contactButtonHref,
  bottomNote,
  icons = {},
}: FooterProps) {
  const brandDescription =
    description || footerData.brand.description;
  const copyright =
    copyrightText || "© 2026 MOSAROMA GmbH. Alle Rechte vorbehalten.";
  const footerColumns: FooterNavColumn[] =
    columns && columns.length > 0
      ? columns
      : footerData.columns.map((c) => ({
          title: c.title,
          links: c.links.map((l) => ({ label: l.label, href: l.href })),
        }));
  const legal: { label: string; href: string; target?: string }[] =
    legalLinks && legalLinks.length > 0
      ? legalLinks
      : footerData.legal.map((l) => ({ label: l.label, href: l.href }));
  const socials = socialLinks && socialLinks.length > 0 ? socialLinks : null;

  const showCta = ctaEnabled === true;

  const resolvedContact = {
    title: contactTitle || CONTACT_DEFAULTS.title,
    companyName: companyName || CONTACT_DEFAULTS.companyName,
    addressLine1: addressLine1 || CONTACT_DEFAULTS.addressLine1,
    addressLine2: addressLine2 || null,
    postalCity: postalCity || CONTACT_DEFAULTS.postalCity,
    country: country || CONTACT_DEFAULTS.country,
    email: email || CONTACT_DEFAULTS.email,
    phone: phone || null,
    buttonLabel: contactButtonLabel || CONTACT_DEFAULTS.buttonLabel,
    buttonHref: contactButtonHref || CONTACT_DEFAULTS.buttonHref,
  };

  return (
    <footer>
      {/* ── Tier 1: CTA Service Bar ── */}
      {showCta && (
        <div className="relative bg-[#1a1a1a] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
            }}
          />

          <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-20">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-accent text-pumpkin/70 text-[10px] tracking-[0.25em] uppercase mb-4">
                {ctaEyebrow || CTA_DEFAULTS.eyebrow}
              </p>
              <h2 className="font-heading text-white text-xl md:text-2xl font-bold tracking-tight leading-tight mb-4">
                {ctaTitle || CTA_DEFAULTS.title}
              </h2>
              <p className="font-body text-white/60 text-sm leading-[1.8] mb-8 max-w-lg mx-auto">
                {ctaText || CTA_DEFAULTS.text}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={ctaPrimaryHref || CTA_DEFAULTS.primaryHref}
                  className="btn-primary"
                >
                  {ctaPrimaryLabel || CTA_DEFAULTS.primaryLabel}
                </Link>
                {(ctaSecondaryLabel || CTA_DEFAULTS.secondaryLabel) && (
                  <Link
                    href={ctaSecondaryHref || CTA_DEFAULTS.secondaryHref}
                    className="btn-outline-white"
                  >
                    {ctaSecondaryLabel || CTA_DEFAULTS.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tier 2: Main Footer ── */}
      <div className="relative bg-anthracite overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pt-16 pb-14 md:pt-20 md:pb-16">
            {/* Brand column */}
            <div className="lg:col-span-3">
              <Image
                src={logoUrl || "/mosaroma_logo.png"}
                alt={siteName ? `${siteName} Logo` : "Mosaroma Logo"}
                width={180}
                height={45}
                className="h-9 w-auto mb-5 brightness-0 invert"
              />
              <p className="font-body text-white/55 text-[13px] leading-[1.8] max-w-[280px] mb-6">
                {brandDescription}
              </p>
              {socials && (
                <div className="flex items-center gap-3.5">
                  {socials.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="inline-flex items-center justify-center w-9 h-9 text-white/50 hover:text-pumpkin transition-colors duration-400"
                    >
                      <CmsIcon icon={icons[`social-${s.platform}`]} width={16} height={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation columns */}
            {footerColumns.map((column) => (
              <div key={column.title} className="lg:col-span-2">
                <h4 className="font-heading text-white/60 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
                  {column.title}
                </h4>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(link.target === "_blank"
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="font-body text-white/55 text-[13px] hover:text-white/80 transition-colors duration-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact column */}
            <div className="lg:col-span-3">
              <h4 className="font-heading text-white/60 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
                {resolvedContact.title}
              </h4>
              <address className="not-italic space-y-1 mb-5">
                <p className="font-body text-white/55 text-[13px] leading-[1.8]">
                  {resolvedContact.companyName}
                </p>
                <p className="font-body text-white/55 text-[13px] leading-[1.8]">
                  {resolvedContact.addressLine1}
                </p>
                {resolvedContact.addressLine2 && (
                  <p className="font-body text-white/55 text-[13px] leading-[1.8]">
                    {resolvedContact.addressLine2}
                  </p>
                )}
                <p className="font-body text-white/55 text-[13px] leading-[1.8]">
                  {resolvedContact.postalCity}
                </p>
                <p className="font-body text-white/55 text-[13px] leading-[1.8]">
                  {resolvedContact.country}
                </p>
              </address>

              <div className="space-y-1.5 mb-6">
                <a
                  href={`mailto:${resolvedContact.email}`}
                  className="block font-body text-white/55 text-[13px] hover:text-pumpkin transition-colors duration-400"
                >
                  {resolvedContact.email}
                </a>
                {resolvedContact.phone && (
                  <a
                    href={`tel:${resolvedContact.phone.replace(/\s/g, "")}`}
                    className="block font-body text-white/55 text-[13px] hover:text-pumpkin transition-colors duration-400"
                  >
                    {resolvedContact.phone}
                  </a>
                )}
              </div>

              <Link
                href={resolvedContact.buttonHref}
                className="inline-flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-pumpkin/70 hover:text-pumpkin transition-colors duration-400"
              >
                {resolvedContact.buttonLabel}
                <CmsIcon icon={icons["arrow-right"]} width={13} height={13} />
              </Link>
            </div>
          </div>

          {/* ── Tier 3: Bottom Bar ── */}
          <div className="border-t border-white/[0.06] py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span className="font-body text-white/60 text-[11px] tracking-wide">
                {copyright}
              </span>
              {bottomNote && (
                <span className="font-body text-white/70 text-[11px]">
                  {bottomNote}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-[11px]">
              {legal.map((item) =>
                item.label === "Cookie-Einstellungen" ? (
                  <CookieSettingsButton key={item.label} />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    {...(item.target === "_blank"
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="font-body text-white/60 hover:text-white/60 transition-colors duration-400"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

