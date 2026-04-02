export default function DealerCtaSection() {
  return (
    <section id="haendler" className="section-padding bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative accent */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-medium-gray/40" />
            <div className="w-2 h-2 rotate-45 border border-pumpkin/40" />
            <div className="w-12 h-px bg-medium-gray/40" />
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

          <p className="font-body text-text-gray text-base md:text-lg leading-[1.8] mb-10 max-w-xl mx-auto">
            Durch Eingabe deiner Postleitzahl findest du die Händler in deiner
            Nähe – und kommst deinem persönlichen MOSAROMA-Produkt einen
            Schritt näher.
          </p>

          <a href="#" className="btn-primary">
            Händler finden
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="ml-1">
              <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
