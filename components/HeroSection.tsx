export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('/Luxury-Outdoor-Space-with-Premium-Garden-Furniture.jpg')",
          backgroundPosition: "center 45%",
        }}
      />

      {/* Overlay 1: Strong bottom-to-top scrim — covers text zone densely */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 22%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.08) 65%, transparent 80%)",
        }}
      />
      {/* Overlay 2: Left scrim — localized behind text column */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 30%, transparent 55%)",
        }}
      />
      {/* Overlay 3: Top scrim for header */}
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/30 to-transparent"
        style={{ height: "28%" }}
      />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 lg:px-12 pb-20 md:pb-28 lg:pb-32">
          <div className="max-w-xl lg:max-w-[620px]">

            {/* Headline */}
            <h1 className="font-heading text-white text-[2.75rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] font-extrabold leading-[1.02] tracking-[-0.02em] mb-6 md:mb-8">
              Stilvolles Leben
              <br />
              im Freien
            </h1>

            {/* Subline */}
            <p className="font-body text-white/80 text-lg md:text-xl lg:text-[1.375rem] leading-[1.65] mb-10 md:mb-12 max-w-[26rem] md:max-w-[30rem]">
              Hochwertige Textilien, Kissen und Möbel für Terrasse,
              Garten und Balkon – mediterran inspiriert, zeitlos designt.
            </p>

            {/* Single CTA */}
            <a href="#kollektion" className="btn-primary">
              Kollektion entdecken
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
      </div>

      {/* Side accent */}
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
