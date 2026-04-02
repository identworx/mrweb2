export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] mt-[70px] md:mt-[80px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 md:pb-24 lg:pb-28">
        <div className="mx-auto max-w-[1400px] w-full px-5 md:px-10">
          <div className="max-w-xl">
            <p className="font-accent text-white/80 text-sm tracking-[0.2em] uppercase mb-3">
              Kollektion 2026
            </p>
            <h1 className="font-heading text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5">
              Premium Outdoor
              <br />
              Living
            </h1>
            <p className="font-body text-white/85 text-lg md:text-xl leading-relaxed mb-8 max-w-md">
              Design trifft Performance – stilvolle Lösungen für
              anspruchsvolle Außenbereiche.
            </p>
            <a href="#kollektion" className="btn-primary">
              Kollektion entdecken
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="opacity-60"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
