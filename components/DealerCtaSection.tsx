export default function DealerCtaSection() {
  return (
    <section id="haendler" className="relative section-padding bg-cream overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #2D2D2D 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative accent */}
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="w-16 h-px bg-medium-gray/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-pumpkin/50" />
            <div className="w-16 h-px bg-medium-gray/30" />
          </div>

          <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-[2.5rem] font-bold leading-[1.15] tracking-tight mb-6">
            Finde{" "}
            <span className="font-accent text-pumpkin italic font-normal">
              deinen
            </span>{" "}
            MOSAROMA-Händler
            <br className="hidden md:block" />
            {" "}in{" "}
            <span className="font-accent text-pumpkin italic font-normal">
              deiner
            </span>{" "}
            Umgebung
          </h2>

          <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-12 max-w-lg mx-auto">
            Durch Eingabe deiner Postleitzahl findest du die Händler in deiner
            Nähe – und kommst deinem persönlichen MOSAROMA-Produkt einen
            Schritt näher.
          </p>

          <a href="#" className="btn-primary">
            Händler finden
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
