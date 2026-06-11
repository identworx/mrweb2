import Link from "next/link";

export default function CustomSizeCta() {
  return (
    <div className="bg-pumpkin p-8 md:p-10 text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-px bg-white/40" />
        <p className="font-accent text-white/70 text-xs tracking-[0.3em] uppercase">
          Maßanfertigung
        </p>
      </div>

      <h3 className="font-heading text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
        Ihr Maß nicht dabei?
      </h3>

      <p className="font-body text-white/80 text-sm md:text-base leading-[1.8] mb-2">
        Wir fertigen jede Form auf Wunsch in Sondermaßen.
      </p>

      <p className="font-body text-white/70 text-sm mb-6">
        sales@mosaroma.de
      </p>

      <Link
        href="/kontakt"
        className="inline-flex items-center gap-3 font-heading text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 bg-white text-pumpkin hover:bg-white/90 transition-colors duration-300"
      >
        Kontakt aufnehmen
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
        </svg>
      </Link>
    </div>
  );
}
