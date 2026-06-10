import type { ReactNode } from "react";
import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";

interface ValueCard {
  iconKey: string;
  title: string;
  text: string;
}

interface Props {
  section: HomepageSection;
}

const ICON_MAP: Record<string, ReactNode> = {
  comfort: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  quality: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  sustainability: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  design: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V7.5M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125H12m-5.25 0V7.5m0 0h5.25" />
    </svg>
  ),
};

function getFallbackIcon() {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function HomepageValueProps({ section }: Props) {
  const cards = (section.settings.cards as ValueCard[]) || [];
  const eyebrow = section.eyebrow || "Warum Mosaroma";
  const title = section.title || "Was uns ausmacht.";
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-5 justify-center">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white p-7 md:p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-pumpkin/10 text-pumpkin mb-5">
                {ICON_MAP[card.iconKey] || getFallbackIcon()}
              </div>
              <h3 className="font-heading text-anthracite text-lg font-bold mb-3">
                {card.title}
              </h3>
              <p className="font-body text-text-gray text-sm leading-[1.8]">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-12 md:mt-16 text-center">
            <Link href={ctaHref} className="btn-primary">
              {ctaLabel}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
