export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      {/* Background Image — outdoor lounge with cushions and textiles */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=1200&fit=crop&crop=center&q=85')",
          backgroundPosition: "center 40%",
        }}
      />

      {/* Gradient overlays — refined for text readability without killing the image */}
      {/* Bottom: text backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
      {/* Top: header scrim, constrained height */}
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/25 to-transparent"
        style={{ height: "30%" }}
      />

      {/* Content — bottom-aligned with generous breathing room */}
      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 lg:px-12 pb-28 md:pb-36 lg:pb-40">
          <div className="max-w-xl lg:max-w-2xl">

            {/* Eyebrow — accent line + label */}
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="w-10 h-px bg-pumpkin" />
              <p className="font-accent text-white/50 text-[10px] md:text-[11px] tracking-[0.35em] uppercase">
                Outdoor Textilien &amp; Möbel
              </p>
            </div>

            {/* Headline — two-line, strong typographic weight */}
            <h1 className="font-heading text-white text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1.04] tracking-[-0.015em] mb-6 md:mb-8">
              Stilvolles Leben
              <br />
              <span className="text-white/85">im Freien</span>
            </h1>

            {/* Subline — concise, brand-positioning */}
            <p className="font-body text-white/50 text-base md:text-lg leading-[1.75] mb-10 md:mb-14 max-w-sm md:max-w-md">
              Hochwertige Textilien, Kissen und Möbel für Terrasse,
              Garten und Balkon – mediterran inspiriert, zeitlos designt.
            </p>

            {/* CTA — single primary for clarity, secondary as text link */}
            <div className="flex flex-wrap items-center gap-6">
              <a href="#kollektion" className="btn-primary">
                Kollektion entdecken
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </a>
              <a
                href="#produkte"
                className="group inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 hover:text-white/80 transition-colors duration-400"
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

      {/* Scroll indicator — minimal */}
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
