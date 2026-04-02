export default function SplitHighlightSection() {
  return (
    <section id="kollektion" className="section-padding bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-stretch">
          {/* Image */}
          <div className="relative overflow-hidden min-h-[400px] lg:min-h-[560px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=700&fit=crop')",
              }}
            />
            {/* Decorative accent */}
            <div className="absolute bottom-6 left-6">
              <p className="font-accent text-white/70 text-sm italic tracking-wide">
                Komfort.
                <br />
                Design.
                <br />
                Qualität.
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center lg:pl-16 xl:pl-24 py-8 lg:py-16">
            <p className="font-accent text-pumpkin text-sm tracking-[0.2em] uppercase mb-3">
              MOSAROMA
            </p>
            <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-6">
              Mediterranean
              <br />
              Outdoor Living
            </h2>
            <p className="font-body text-text-gray text-base md:text-lg leading-relaxed mb-4 max-w-md">
              MOSAROMA steht für die Verbindung von mediterranem Lebensgefühl
              und zeitlosem Design. Unsere Kollektion vereint organische
              Formen, natürliche Materialien und sorgfältig abgestimmte
              Farben.
            </p>
            <p className="font-body text-text-gray text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Jedes Produkt wird mit dem Anspruch entwickelt, Komfort und
              Ästhetik in Ihrem Außenbereich auf höchstem Niveau zu
              vereinen.
            </p>
            <div>
              <a href="#" className="btn-primary">
                Kollektion entdecken
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
