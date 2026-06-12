import Link from "next/link";

export default function ConsultationCard() {
  return (
    <div className="relative flex flex-col border border-black/[0.06] bg-cream overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 11px, currentColor 11px, currentColor 11.5px), repeating-linear-gradient(90deg, transparent, transparent 11px, currentColor 11.5px, currentColor 12px)",
          color: "#2D2D2D",
        }}
      />

      <div className="relative flex flex-col flex-1 p-6 md:p-7">
        <div className="flex-1">
          <div className="w-10 h-px bg-pumpkin mb-5" />

          <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold tracking-tight leading-tight mb-3">
            Welche Farbwelt passt zu Ihnen?
          </h3>

          <p className="font-body text-text-gray text-sm leading-[1.7] mb-6">
            Wir beraten Sie persönlich und senden passende Muster für Ihr Projekt.
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <Link href="/kontakt" className="btn-primary text-center">
            Muster & Beratung
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 font-heading text-anthracite/60 text-[10px] font-semibold uppercase tracking-[0.12em] hover:text-pumpkin transition-colors duration-300"
          >
            Kontakt aufnehmen
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
