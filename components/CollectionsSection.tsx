import { collections2027 } from "@/lib/data";

export default function CollectionsSection() {
  return (
    <section id="kollektion" className="section-padding bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Saison 2027
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
              Unsere Kollektionen
            </h2>
          </div>
          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-md">
            Sieben sorgfältig kuratierte Farbwelten – von mediterranen Grüntönen
            bis zu warmen Erdnuancen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections2027.map((collection) => (
            <a
              key={collection.name}
              href="#"
              className="group block bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex gap-2 mb-5">
                {collection.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-20 transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-anthracite text-lg font-bold group-hover:text-pumpkin transition-colors duration-300">
                    {collection.name}
                  </h3>
                  <p className="font-body text-text-gray text-xs mt-1">
                    {collection.fabric}
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="text-medium-gray group-hover:text-pumpkin group-hover:translate-x-1 transition-all duration-300"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
