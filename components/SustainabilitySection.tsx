import { sustainabilityStats } from "@/lib/data";

export default function SustainabilitySection() {
  return (
    <section className="relative section-padding bg-anthracite overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center mb-14 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-px bg-pumpkin/60" />
            <p className="font-accent text-pumpkin/80 text-xs tracking-[0.3em] uppercase">
              Nachhaltigkeit
            </p>
            <div className="w-8 h-px bg-pumpkin/60" />
          </div>
          <h2 className="font-heading text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight mb-5">
            Grün gewebt. Vom Tropfen an.
          </h2>
          <p className="font-body text-white/40 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Unsere Olefin-Stoffe werden spinnfarbgefärbt – ein Verfahren, das
            deutlich weniger Ressourcen verbraucht. Seit 2022 setzen wir in der
            Produktion auf Solarenergie. Die NERIO-Linie besteht aus
            OceanCycle rPP mit 50–70 % recyceltem Polypropylen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {sustainabilityStats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="font-heading text-pumpkin text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-3">
                {stat.value}
              </div>
              <div className="font-heading text-white text-sm font-semibold uppercase tracking-[0.12em] mb-2">
                {stat.label}
              </div>
              <p className="font-body text-white/35 text-sm leading-relaxed max-w-xs mx-auto">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 pt-10 border-t border-white/[0.06] text-center">
          <p className="font-body text-white/25 text-xs leading-relaxed max-w-xl mx-auto">
            PFAS-frei · Olefin-Spinnfärbung · OceanCycle rPP (NERIO) · 71 % PV seit 2022
          </p>
        </div>
      </div>
    </section>
  );
}
