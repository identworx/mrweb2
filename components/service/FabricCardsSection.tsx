import type { FrontendServiceSection } from "@/lib/cms/service-pages";

interface FabricCard {
  name: string;
  subtitle?: string;
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness?: string;
  description?: string;
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-text-gray/50 w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-body text-anthracite text-sm">{value}</span>
    </div>
  );
}

export default function FabricCardsSection({
  section,
  className = "bg-white",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const cards = Array.isArray(section.settings.cards)
    ? (section.settings.cards as FabricCard[])
    : [];

  if (cards.length === 0) return null;

  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {section.eyebrow && (
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              {section.eyebrow}
            </p>
          </div>
        )}
        {section.title && (
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
            {section.title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-cream p-6 md:p-8 border border-light-gray"
            >
              <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-4">
                {card.name}
              </h3>
              {card.subtitle && (
                <span className="inline-block font-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1 border border-pumpkin/25 text-pumpkin/70 bg-pumpkin/5 mb-4">
                  {card.subtitle}
                </span>
              )}
              <div className="space-y-3">
                {card.material && <DataRow label="Material" value={card.material} />}
                {card.weight && <DataRow label="Gewicht" value={card.weight} />}
                {card.dyeing && <DataRow label="Färbung" value={card.dyeing} />}
                {card.comfort && <DataRow label="Komfort" value={card.comfort} />}
                {card.cushionThickness && <DataRow label="Auflagenstärke" value={card.cushionThickness} />}
              </div>
              {card.description && (
                <p className="font-body text-text-gray text-sm mt-4 italic">
                  {card.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
