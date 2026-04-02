export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1920&h=1200&fit=crop&q=85')",
        }}
      />

      {/* Layered gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="mx-auto max-w-[1400px] w-full px-6 md:px-10 pb-20 md:pb-28 lg:pb-32">
          <div className="max-w-2xl">
            {/* Accent line + label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-px bg-pumpkin" />
              <p className="font-accent text-white/60 text-[11px] tracking-[0.3em] uppercase">
                Kollektion 2026
              </p>
            </div>

            <h1 className="font-heading text-white text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1.05] tracking-tight mb-6">
              Premium
              <br />
              Outdoor Living
            </h1>

            <p className="font-body text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Design trifft Performance – stilvolle Lösungen für
              anspruchsvolle Außenbereiche.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#kollektion" className="btn-primary">
                Kollektion entdecken
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-heading text-white/30 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>

      {/* Side accent */}
      <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-3">
        <div className="w-px h-16 bg-white/15" />
        <span className="font-accent text-white/20 text-[10px] tracking-[0.3em] uppercase" style={{ writingMode: "vertical-rl" }}>
          MOSAROMA
        </span>
        <div className="w-px h-16 bg-white/15" />
      </div>
    </section>
  );
}
