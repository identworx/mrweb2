import Image from "next/image";
import Link from "next/link";
import { footerData } from "@/lib/mosaroma/footer";

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

  const showCta = ctaEnabled !== false;

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
                      className="text-white/30 hover:text-pumpkin transition-colors duration-400"
                    >
                      <SocialIcon name={s.platform} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation columns */}
            {footerColumns.map((column) => (
              <div key={column.title} className="lg:col-span-2">
                <h4 className="font-heading text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
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
              <h4 className="font-heading text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
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
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Tier 3: Bottom Bar ── */}
          <div className="border-t border-white/[0.06] py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span className="font-body text-white/40 text-[11px] tracking-wide">
                {copyright}
              </span>
              {bottomNote && (
                <span className="font-body text-white/30 text-[11px]">
                  {bottomNote}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-[11px]">
              {legal.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  {...(item.target === "_blank"
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="font-body text-white/40 hover:text-white/60 transition-colors duration-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    pinterest: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
      </svg>
    ),
    youtube: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    linkedin: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };
  return <>{icons[name] || null}</>;
}
