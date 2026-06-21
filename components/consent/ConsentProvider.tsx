"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ConsentPreferences } from "@/lib/consent/consent";
import {
  loadConsent,
  saveConsent,
  clearConsent,
  acceptAllPreferences,
  rejectAllPreferences,
} from "@/lib/consent/consent";
import CookieConsentBanner from "./CookieConsentBanner";
import CookieSettingsModal from "./CookieSettingsModal";

interface ConsentContextValue {
  preferences: ConsentPreferences | null;
  hasAnswered: boolean;
  settingsOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: ConsentPreferences) => void;
  openSettings: () => void;
  closeSettings: () => void;
  resetConsent: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}

export default function ConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(
    null,
  );
  const [hasAnswered, setHasAnswered] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = loadConsent();
    if (stored) {
      setPreferences(stored);
      setHasAnswered(true);
    }
    setMounted(true);
  }, []);

  const acceptAll = useCallback(() => {
    const prefs = acceptAllPreferences();
    saveConsent(prefs);
    setPreferences(prefs);
    setHasAnswered(true);
    setSettingsOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const prefs = rejectAllPreferences();
    saveConsent(prefs);
    setPreferences(prefs);
    setHasAnswered(true);
    setSettingsOpen(false);
  }, []);

  const save = useCallback((prefs: ConsentPreferences) => {
    saveConsent(prefs);
    setPreferences({ ...prefs, necessary: true });
    setHasAnswered(true);
    setSettingsOpen(false);
  }, []);

  const openSettingsFn = useCallback(() => setSettingsOpen(true), []);
  const closeSettingsFn = useCallback(() => setSettingsOpen(false), []);

  const resetConsentFn = useCallback(() => {
    clearConsent();
    setPreferences(null);
    setHasAnswered(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        preferences,
        hasAnswered,
        settingsOpen,
        acceptAll,
        rejectAll,
        savePreferences: save,
        openSettings: openSettingsFn,
        closeSettings: closeSettingsFn,
        resetConsent: resetConsentFn,
      }}
    >
      {children}
      {mounted && (
        <>
          <CookieConsentBanner />
          <CookieSettingsModal />
        </>
      )}
    </ConsentContext.Provider>
  );
}
