import { fabricQualities } from "@/lib/data";

export default function FabricQualitiesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              Stoffqualitäten
            </p>
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            Vier Qualitäten, ein Anspruch
          </h2>
          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-5 max-w-2xl">
            Von Premium-Olefin bis zur bewährten Einstiegsqualität – jeder
            MOSAROMA-Stoff wird auf Langlebigkeit, Komfort und Farbechtheit
            geprüft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fabricQualities.map((fabric, index) => (
            <div
              key={fabric.name}
              className={`group relative p-8 transition-all duration-500 hover:-translate-y-1 ${
                index === 0
                  ? "bg-anthracite text-white"
                  : "bg-light-gray hover:bg-anthracite hover:text-white"
              }`}
            >
              <div className={`flex items-center gap-3 mb-6 ${
                index === 0 ? "text-pumpkin" : "text-pumpkin group-hover:text-pumpkin"
              }`}>
                <div className="w-6 h-px bg-current" />
                <span className="font-accent text-[10px] tracking-[0.3em] uppercase">
                  {fabric.material}
                </span>
              </div>

              <h3 className={`font-heading text-xl font-bold mb-2 ${
                index === 0 ? "" : "text-anthracite group-hover:text-white"
              }`}>
                {fabric.name}
              </h3>

              <p className={`font-body text-sm mb-1 ${
                index === 0 ? "text-white/50" : "text-text-gray group-hover:text-white/50"
              }`}>
                {fabric.weight}
              </p>

              <p className={`font-body text-sm leading-[1.8] mb-6 ${
                index === 0 ? "text-white/60" : "text-text-gray group-hover:text-white/60"
              }`}>
                {fabric.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {fabric.highlights.map((tag) => (
                  <span
                    key={tag}
                    className={`font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors duration-500 ${
                      index === 0
                        ? "border-white/20 text-white/70"
                        : "border-anthracite/15 text-anthracite/70 group-hover:border-white/20 group-hover:text-white/70"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
