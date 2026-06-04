export default function CatalogsSection() {
  const catalogs = [
    {
      title: "MOSAROMA Katalog 2027",
      description: "Vollständiger Produktkatalog mit allen Kollektionen, Maßen und Stoffqualitäten der Saison 2027.",
      type: "PDF",
      language: "Deutsch",
    },
    {
      title: "MOSAROMA Catalogue 2027",
      description: "Complete product catalogue with all collections, dimensions and fabric qualities for season 2027.",
      type: "PDF",
      language: "English",
    },
  ];

  return (
    <section id="kataloge" className="section-padding bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-14 md:mb-20">
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
              Downloads
            </p>
          </div>
          <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
            Kataloge & Downloads
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {catalogs.map((catalog) => (
            <a
              key={catalog.title}
              href="#"
              className="group flex items-start gap-5 p-6 bg-light-gray hover:bg-anthracite transition-all duration-500"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pumpkin/10 text-pumpkin group-hover:bg-pumpkin group-hover:text-white transition-all duration-500">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                  <path d="M7 3h10a2 2 0 012 2v2H5V5a2 2 0 012-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-anthracite text-base font-bold group-hover:text-white transition-colors duration-500 mb-1">
                  {catalog.title}
                </h3>
                <p className="font-body text-text-gray text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500 mb-2">
                  {catalog.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-1 border border-anthracite/15 text-anthracite/50 group-hover:border-white/20 group-hover:text-white/50 transition-colors duration-500">
                    {catalog.type}
                  </span>
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-1 border border-anthracite/15 text-anthracite/50 group-hover:border-white/20 group-hover:text-white/50 transition-colors duration-500">
                    {catalog.language}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* TODO: Placeholder – Katalog-Download-Links ergänzen, sobald URLs verfügbar */}
        <p className="font-body text-text-gray/40 text-xs mt-6">
          Downloads werden in Kürze aktiviert.
        </p>
      </div>
    </section>
  );
}
