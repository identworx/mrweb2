"use client";

export default function CareCardPrint() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.15em] uppercase text-anthracite/70 hover:text-anthracite transition-colors mt-10 print:hidden"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 6V1h8v5" />
        <path d="M4 12H2V7h12v5h-2" />
        <rect x="4" y="10" width="8" height="5" />
      </svg>
      Pflegekarte drucken
    </button>
  );
}
