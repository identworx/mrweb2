export default function SplitHighlightSection() {
  return (
    <section id="kollektion" className="bg-cream overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[720px]">
          {/* Image - full bleed left */}
          <div className="relative overflow-hidden min-h-[450px] lg:min-h-full">
            <div
              className="absolute inset-0 bg-cover bg-center img-zoom"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&h=800&fit=crop&q=85')",
              }}
            />
            {/* Decorative accent overlay */}
            <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-white/50" />
                <p className="font-accent text-white/50 text-[10px] tracking-[0.3em] uppercase">
                  Since 2020
                </p>
              </div>
              <p className="font-accent text-white/80 text-lg italic leading-relaxed">
                Komfort. Design.
                <br />
                Qualität.
              </p>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-20 xl:px-28 lg:py-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                MOSAROMA
              </p>
            </div>

            <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.1] tracking-tight mb-8">
              Mediterranean
              <br />
              Outdoor Living
            </h2>

            <div className="space-y-5 mb-10">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-md">
                MOSAROMA steht für die Verbindung von mediterranem Lebensgefühl
                und zeitlosem Design. Unsere Kollektion vereint organische
                Formen, natürliche Materialien und sorgfältig abgestimmte
                Farben.
              </p>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-md">
                Jedes Produkt wird mit dem Anspruch entwickelt, Komfort und
                Ästhetik in Ihrem Außenbereich auf höchstem Niveau zu
                vereinen.
              </p>
            </div>

            <div>
              <a href="#" className="btn-primary">
                Kollektion entdecken
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="ml-1">
                  <path d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
