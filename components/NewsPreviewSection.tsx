export default function NewsPreviewSection() {
  const newsItems = [
    {
      date: "2027",
      tag: "Kollektion",
      title: "Neue Kollektionen Saison 2027",
      description: "Sieben Farbwelten, drei Stoffqualitäten – die neuen MOSAROMA-Kollektionen sind da.",
    },
    {
      date: "2027",
      tag: "Technologie",
      title: "Mackintosh® Technology im Detail",
      description: "Was macht unsere Olefin-Stoffe so besonders? Ein Blick hinter die Kulissen der Spinnfärbung.",
    },
    {
      date: "2027",
      tag: "Nachhaltigkeit",
      title: "NERIO Oceana – recycelt und wetterfest",
      description: "Die neue NERIO-Linie aus OceanCycle rPP: 50–70 % recyceltes Polypropylen für den Outdoor-Bereich.",
    },
  ];

  return (
    <section id="neuigkeiten" className="section-padding bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Aktuelles
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
              Neuigkeiten
            </h2>
          </div>
          <a
            href="#"
            className="font-heading text-[12px] font-semibold uppercase tracking-[0.15em] text-pumpkin hover:text-burnt-orange transition-colors duration-300"
          >
            Alle Beiträge →
          </a>
        </div>

        {/* TODO: Platzhalter – echte News-Inhalte einfügen, wenn verfügbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <a
              key={item.title}
              href="#"
              className="group block bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-pumpkin">
                  {item.tag}
                </span>
                <span className="font-body text-text-gray/50 text-xs">
                  {item.date}
                </span>
              </div>

              <h3 className="font-heading text-anthracite text-lg font-bold leading-snug mb-3 group-hover:text-pumpkin transition-colors duration-300">
                {item.title}
              </h3>

              <p className="font-body text-text-gray text-sm leading-[1.8]">
                {item.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-pumpkin">
                <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Weiterlesen
                </span>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
