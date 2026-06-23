import Link from "next/link";

interface PageCtaProps {
  title: string;
  description?: string;
  eyebrow?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "dark" | "light" | "minimal";
}

export default function PageCta({
  title,
  description,
  eyebrow,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = "dark",
}: PageCtaProps) {
  const hasButtons =
    (primaryLabel && primaryHref) || (secondaryLabel && secondaryHref);

  if (variant === "minimal") {
    return (
      <section className="py-10 md:py-14 bg-white border-t border-light-gray">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="font-heading text-anthracite text-lg md:text-xl font-bold tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="font-body text-text-gray text-sm leading-relaxed mt-1.5 max-w-lg">
                  {description}
                </p>
              )}
            </div>
            {hasButtons && (
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {primaryLabel && primaryHref && (
                  <Link href={primaryHref} className="btn-primary">
                    {primaryLabel}
                  </Link>
                )}
                {secondaryLabel && secondaryHref && (
                  <Link href={secondaryHref} className="btn-outline">
                    {secondaryLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "light") {
    return (
      <section className="section-padding bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
          {eyebrow && (
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          {description && (
            <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              {description}
            </p>
          )}
          {hasButtons && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {primaryLabel && primaryHref && (
                <Link href={primaryHref} className="btn-primary">
                  {primaryLabel}
                </Link>
              )}
              {secondaryLabel && secondaryHref && (
                <Link href={secondaryHref} className="btn-outline">
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-anthracite">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
        {eyebrow && (
          <p className="font-accent text-white/70 text-xs tracking-[0.3em] uppercase mb-4">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        {description && (
          <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
            {description}
          </p>
        )}
        {hasButtons && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryLabel && primaryHref && (
              <Link href={primaryHref} className="btn-primary">
                {primaryLabel}
              </Link>
            )}
            {secondaryLabel && secondaryHref && (
              <Link href={secondaryHref} className="btn-outline-white">
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
