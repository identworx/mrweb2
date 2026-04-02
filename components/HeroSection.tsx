export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      {/* Background Image — outdoor terrace / premium patio living */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1200&fit=crop&q=85')",
        }}
      />

      {/* Layered gradient overlays */}
      {/* Bottom: strong for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {/* Top: for header readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" style={{ height: "35%" }} />
      {/* Left: subtle text backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 lg:px-12 pb-24 md:pb-32 lg:pb-36">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-5 mb-7">
              <div className="w-12 h-px bg-pumpkin/80" />
              <p className="font-accent text-white/55 text-[11px] tracking-[0.35em] uppercase">
                Kollektion 2026
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-white text-[2.75rem] md:text-[3.75rem] lg:text-[5rem] xl:text-[5.5rem] font-bold leading-[1.02] tracking-[-0.02em] mb-7">
              Premium
              <br />
              <span className="text-white/90">Outdoor Living</span>
            </h1>

            {/* Subline */}
            <p className="font-body text-white/55 text-[1.125rem] md:text-xl leading-[1.7] mb-12 max-w-md">
              Stilvolle Textilien und Möbel für anspruchsvolle
              Außenbereiche – mediterran inspiriert, zeitlos designt.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="#kollektion" className="btn-primary">
                Kollektion entdecken
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </a>
              <a href="#produkte" className="btn-outline-white">
                Produkte ansehen
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
        <span className="font-heading text-white/25 text-[9px] tracking-[0.25em] uppercase">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent animate-pulse" />
      </div>

      {/* Side accent — brand watermark */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="w-px h-14 bg-white/10" />
        <span className="font-accent text-white/15 text-[9px] tracking-[0.35em] uppercase" style={{ writingMode: "vertical-rl" }}>
          MOSAROMA
        </span>
        <div className="w-px h-14 bg-white/10" />
      </div>
    </section>
  );
}
