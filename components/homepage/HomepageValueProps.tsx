import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import { VALUE_PROP_KEY_MAP } from "@/lib/cms/icon-key-map";

interface ValueCard {
  iconKey: string;
  title: string;
  text: string;
}

interface Props {
  section: HomepageSection;
  icons?: Record<string, ResolvedIcon>;
}

export default function HomepageValueProps({ section, icons = {} }: Props) {
  const cards = (section.settings.cards as ValueCard[]) || [];
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {cards.map((card) => {
            const slotKey = VALUE_PROP_KEY_MAP[card.iconKey] ?? card.iconKey;
            return (
              <div
                key={card.title}
                className="flex items-start gap-5 p-6 md:p-7 transition-all duration-500 motion-safe:hover:-translate-y-0.5"
              >
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-pumpkin/10 text-pumpkin">
                  <CmsIcon icon={icons[slotKey]} width={28} height={28} />
                </div>
                <div>
                  <h2 className="font-heading text-anthracite text-base font-bold mb-1.5">
                    {card.title}
                  </h2>
                  <p className="font-body text-text-gray text-sm leading-[1.7]">
                    {card.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-10 md:mt-12 text-center">
            <Link href={ctaHref} className="btn-outline">
              {ctaLabel}
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
