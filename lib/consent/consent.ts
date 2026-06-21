export const CONSENT_STORAGE_KEY = "mosaroma_cookie_consent_v1";
export const CONSENT_VERSION = 1;

export type ConsentPreferences = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  externalMedia: boolean;
  updatedAt: string;
  version: 1;
};

export function loadConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed as ConsentPreferences;
  } catch {
    return null;
  }
}

export function saveConsent(prefs: ConsentPreferences): void {
  if (typeof window === "undefined") return;
  const data: ConsentPreferences = {
    ...prefs,
    necessary: true,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
}

export function acceptAllPreferences(): ConsentPreferences {
  return {
    necessary: true,
    statistics: true,
    marketing: true,
    externalMedia: true,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export function rejectAllPreferences(): ConsentPreferences {
  return {
    necessary: true,
    statistics: false,
    marketing: false,
    externalMedia: false,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}
