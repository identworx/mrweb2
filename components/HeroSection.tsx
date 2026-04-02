export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      {/* Background Image — luxury outdoor space with premium garden furniture */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('/Luxury-Outdoor-Space-with-Premium-Garden-Furniture.jpg')",
          backgroundPosition: "center 45%",
        }}
      />

      {/* Gradient overlays */}
      {/* Bottom-left: strong localized scrim behind text area */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.50) 28%, rgba(0,0,0,0.18) 55%, transparent 75%)",
        }}
      />
      {/* Left edge: subtle side scrim for text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 35%, transparent 60%)",
        }}
      />
      {/* Top: header scrim */}
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/25 to-transparent"
        style={{ height: "28%" }}
      />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 lg:px-12 pb-24 md:pb-32 lg:pb-36">
          <div className="max-w-xl lg:max-w-[600px]">

            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="w-10 h-px bg-pumpkin" />
              <p className="font-accent text-white/60 text-[10px] md:text-[11px] tracking-[0.3em] uppercase">
                Outdoor Textilien &amp; Möbel
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-white text-[2.5rem] md:text-[3.5rem] lg:text-[4.25rem] xl:text-[4.75rem] font-bold leading-[1.06] tracking-[-0.015em] mb-5 md:mb-7">
              Stilvolles Leben
              <br />
              im Freien
            </h1>

            {/* Subline */}
            <p className="font-body text-white/70 text-[0.9375rem] md:text-[1.0625rem] leading-[1.75] mb-8 md:mb-11 max-w-sm md:max-w-[26rem]">
              Hochwertige Textilien, Kissen und Möbel für Terrasse,
              Garten und Balkon – mediterran inspiriert, zeitlos designt.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-5 md:gap-6">
              <a href="#kollektion" className="btn-primary">
                Kollektion entdecken
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </a>
              <a
                href="#produkte"
                className="group inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white transition-colors duration-400"
              >
                Alle Produkte
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform duration-300">
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
      </div>

      {/* Side accent — brand watermark */}
      <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="w-px h-12 bg-white/[0.08]" />
        <span className="font-accent text-white/[0.12] text-[9px] tracking-[0.35em] uppercase" style={{ writingMode: "vertical-rl" }}>
          MOSAROMA
        </span>
        <div className="w-px h-12 bg-white/[0.08]" />
      </div>
    </section>
  );
}
