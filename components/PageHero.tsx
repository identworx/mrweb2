interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  accent?: string;
}

export default function PageHero({
  title,
  subtitle,
  description,
  accent,
}: PageHeroProps) {
  return (
    <section className="section-padding bg-cream pt-40 md:pt-48 lg:pt-52">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {accent && (
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
              {accent}
            </p>
          </div>
        )}

        <h1 className="font-heading text-anthracite text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08]">
          {title}
        </h1>

        {subtitle && (
          <p className="font-heading text-anthracite/60 text-xl md:text-2xl lg:text-[1.75rem] font-medium tracking-tight leading-snug mt-4">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-6 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
