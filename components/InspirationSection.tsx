import InspirationCard from "./InspirationCard";
import { inspirations } from "@/lib/data";

export default function InspirationSection() {
  const featured = inspirations[0];
  const rest = inspirations.slice(1);

  return (
    <section id="inspiration" className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Magazin
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight">
              Lass dich
              <br />
              inspirieren
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Alle", "Kataloge", "Trends", "Ratgeber", "Ideen"].map(
              (filter) => (
                <button
                  key={filter}
                  className={`font-heading text-[10px] font-semibold uppercase tracking-[0.15em] px-4 py-2 transition-all duration-300 ${
                    filter === "Alle"
                      ? "bg-anthracite text-white"
                      : "text-medium-gray hover:text-anthracite border border-light-gray hover:border-anthracite"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* Editorial layout: featured + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Featured card - large */}
          <a href="#" className="group block">
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[3/4] mb-5 bg-light-gray">
              <div
                className="absolute inset-0 bg-cover bg-center img-zoom"
                style={{ backgroundImage: `url('${featured.image.replace("w=600&h=400", "w=900&h=1100")}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-pumpkin/90 text-white text-[10px] font-heading font-semibold uppercase tracking-[0.15em] px-4 py-1.5 backdrop-blur-sm">
                  {featured.tag}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-heading text-white text-2xl md:text-3xl font-bold leading-tight">
                  {featured.title}
                </h3>
              </div>
            </div>
            <p className="font-body text-text-gray text-base leading-relaxed max-w-md">
              {featured.description}
            </p>
          </a>

          {/* Right side - stacked cards */}
          <div className="flex flex-col gap-6 md:gap-8">
            {rest.map((item) => (
              <InspirationCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
