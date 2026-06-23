"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useConsent } from "./ConsentProvider";

const CATEGORIES = [
  {
    key: "necessary" as const,
    label: "Notwendig",
    description:
      "Grundlegende Funktionen wie Seitennavigation, Sicherheit und Sitzungsverwaltung. Diese Cookies sind für den Betrieb der Webseite erforderlich.",
    locked: true,
  },
  {
    key: "statistics" as const,
    label: "Statistik",
    description:
      "Helfen uns zu verstehen, wie Besucher mit der Webseite interagieren, um Inhalte und Nutzererlebnis zu verbessern.",
    locked: false,
  },
  {
    key: "marketing" as const,
    label: "Marketing",
    description:
      "Werden genutzt, um Werbung relevanter zu gestalten und die Wirksamkeit von Kampagnen zu messen.",
    locked: false,
  },
  {
    key: "externalMedia" as const,
    label: "Externe Medien",
    description:
      "Ermöglichen das Einbetten von Inhalten externer Plattformen wie YouTube, Vimeo oder Kartenanbietern.",
    locked: false,
  },
] as const;

type OptionalKey = "statistics" | "marketing" | "externalMedia";

function Toggle({
  checked,
  disabled,
  onChange,
  id,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin ${
        checked ? "bg-pumpkin" : "bg-medium-gray/50"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default function CookieSettingsModal() {
  const {
    preferences,
    settingsOpen,
    acceptAll,
    rejectAll,
    savePreferences,
    closeSettings,
  } = useConsent();

  const [local, setLocal] = useState({
    statistics: false,
    marketing: false,
    externalMedia: false,
  });

  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (settingsOpen) {
      setLocal({
        statistics: preferences?.statistics ?? false,
        marketing: preferences?.marketing ?? false,
        externalMedia: preferences?.externalMedia ?? false,
      });
    }
  }, [settingsOpen, preferences]);

  useEffect(() => {
    if (!settingsOpen) return;

    closeRef.current?.focus();

    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [settingsOpen, closeSettings]);

  if (!settingsOpen) return null;

  const handleSave = () => {
    savePreferences({
      necessary: true,
      statistics: local.statistics,
      marketing: local.marketing,
      externalMedia: local.externalMedia,
      updatedAt: new Date().toISOString(),
      version: 1,
    });
  };

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/50"
        style={{
          animation: "consent-fade-in 0.2s ease-out forwards",
          opacity: 0,
        }}
        onClick={closeSettings}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie-Einstellungen"
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
          style={{
            animation: reducedMotion
              ? "consent-fade-in 0.2s ease-out forwards"
              : "consent-scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            opacity: 0,
          }}
        >
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-black/[0.06] px-6 py-5 flex items-start justify-between gap-4 z-10">
            <div>
              <p className="font-accent text-pumpkin/70 text-[10px] tracking-[0.25em] uppercase mb-1">
                Datenschutz
              </p>
              <h2 className="font-heading text-anthracite text-lg font-bold tracking-tight">
                Cookie-Einstellungen
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={closeSettings}
              className="text-text-gray/60 hover:text-anthracite transition-colors duration-300 p-1 -mr-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin rounded"
              aria-label="Schließen"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {CATEGORIES.map((cat) => {
              const checked = cat.locked
                ? true
                : local[cat.key as OptionalKey];
              const toggleId = `consent-toggle-${cat.key}`;
              return (
                <div key={cat.key} className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={toggleId}
                      className="font-heading text-anthracite text-sm font-semibold tracking-tight cursor-pointer"
                    >
                      {cat.label}
                      {cat.locked && (
                        <span className="ml-2 font-accent text-pumpkin/60 text-[9px] tracking-[0.15em] uppercase">
                          Immer aktiv
                        </span>
                      )}
                    </label>
                    <p className="font-body text-text-gray text-[13px] leading-[1.7] mt-1">
                      {cat.description}
                    </p>
                  </div>
                  <div className="pt-0.5">
                    <Toggle
                      id={toggleId}
                      checked={checked}
                      disabled={cat.locked}
                      onChange={(v) =>
                        setLocal((prev) => ({ ...prev, [cat.key]: v }))
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 pb-3">
            <p className="font-body text-text-gray/60 text-[12px] leading-[1.7]">
              Weitere Informationen finden Sie in unserer{" "}
              <Link
                href="/datenschutz"
                className="text-pumpkin/70 underline underline-offset-2 hover:text-pumpkin transition-colors duration-300"
                onClick={closeSettings}
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>

          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-black/[0.06] px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={rejectAll}
              className="px-4 py-2.5 rounded-lg border border-black/[0.10] font-heading text-text-gray text-[11px] font-semibold uppercase tracking-[0.12em] hover:border-black/[0.20] hover:text-anthracite transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
            >
              Alle ablehnen
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 rounded-lg border border-black/[0.10] font-heading text-anthracite text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-anthracite hover:text-white hover:border-anthracite transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin sm:ml-auto"
            >
              Auswahl speichern
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-4 py-2.5 rounded-lg bg-pumpkin-button font-heading text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-burnt-orange transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
