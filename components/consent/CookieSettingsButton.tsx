"use client";

import { useConsent } from "./ConsentProvider";

export default function CookieSettingsButton() {
  const { openSettings } = useConsent();

  return (
    <button
      type="button"
      onClick={openSettings}
      className="font-body text-white/40 hover:text-white/60 transition-colors duration-400 cursor-pointer"
    >
      Cookie-Einstellungen
    </button>
  );
}
