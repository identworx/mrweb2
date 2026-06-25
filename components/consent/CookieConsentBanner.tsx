"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useConsent } from "./ConsentProvider";

const T = {
  de: {
    ariaLabel: "Cookie-Hinweis",
    eyebrow: "Datenschutz & Cookies",
    heading: "Wir verwenden Cookies bewusst.",
    body: "Wir nutzen notwendige Cookies für den Betrieb der Webseite. Optionale Dienste helfen uns, Inhalte zu verbessern und externe Medien bereitzustellen. Sie entscheiden, was aktiv ist.",
    privacyLink: "Datenschutzerklärung",
    privacyHref: "/datenschutz",
    reject: "Ablehnen",
    settings: "Einstellungen",
    acceptAll: "Alle akzeptieren",
  },
  en: {
    ariaLabel: "Cookie notice",
    eyebrow: "Privacy & Cookies",
    heading: "We use cookies with care.",
    body: "We use necessary cookies for the operation of this website. Optional services help us improve content and provide external media. You decide what is active.",
    privacyLink: "Privacy Policy",
    privacyHref: "/en/privacy-policy",
    reject: "Decline",
    settings: "Settings",
    acceptAll: "Accept all",
  },
};

export default function CookieConsentBanner() {
  const { hasAnswered, acceptAll, rejectAll, openSettings } = useConsent();
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "de";
  const t = T[locale];

  if (hasAnswered) return null;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] pointer-events-none">
      <div
        className="pointer-events-auto mx-4 md:mx-auto max-w-[760px] mb-4 md:mb-6 rounded-xl border border-white/[0.08] shadow-2xl p-6 md:p-8"
        style={{
          background:
            "linear-gradient(145deg, rgba(30,30,30,0.97) 0%, rgba(38,38,38,0.97) 100%)",
          backdropFilter: "blur(12px)",
          animation: reducedMotion
            ? "consent-fade-in 0.2s ease-out forwards"
            : "consent-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          opacity: 0,
        }}
        role="region"
        aria-label={t.ariaLabel}
      >
        <p className="font-accent text-pumpkin/70 text-[10px] tracking-[0.25em] uppercase mb-2">
          {t.eyebrow}
        </p>
        <h2 className="font-heading text-white text-lg md:text-xl font-bold tracking-tight leading-snug mb-3">
          {t.heading}
        </h2>
        <p className="font-body text-white/60 text-sm leading-[1.8] mb-6 max-w-[58ch]">
          {t.body}{" "}
          <Link
            href={t.privacyHref}
            className="text-white/70 underline underline-offset-2 hover:text-white transition-colors duration-300"
          >
            {t.privacyLink}
          </Link>
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={rejectAll}
            className="px-5 py-2.5 rounded-lg border border-white/20 font-heading text-white/70 text-[11px] font-semibold uppercase tracking-[0.12em] hover:border-white/40 hover:text-white transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
          >
            {t.reject}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="px-5 py-2.5 rounded-lg border border-white/20 font-heading text-white/70 text-[11px] font-semibold uppercase tracking-[0.12em] hover:border-white/40 hover:text-white transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
          >
            {t.settings}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="px-5 py-2.5 rounded-lg bg-pumpkin-button font-heading text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-burnt-orange transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:ml-auto"
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
